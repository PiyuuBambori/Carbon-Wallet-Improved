import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// Validation schemas
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

const transactionSchema = z.object({
  amount: z.number().positive(),
  category: z.string(),
  description: z.string(),
  date: z.string().optional()
});

// Authentication middleware
const authenticate = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = userSchema.parse(req.body);
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        carbonScore: {
          create: {
            score: 100,
            totalImpact: 0
          }
        }
      }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Transaction routes
app.post('/api/transactions', authenticate, async (req: any, res) => {
  try {
    const data = transactionSchema.parse(req.body);
    const carbonImpact = calculateCarbonImpact(data.amount, data.category);

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        carbonImpact,
        userId: req.userId
      }
    });

    await updateUserCarbonScore(req.userId);
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/transactions', authenticate, async (req: any, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Carbon score and habits routes
app.get('/api/carbon-score', authenticate, async (req: any, res) => {
  try {
    const score = await prisma.carbonScore.findUnique({
      where: { userId: req.userId }
    });
    res.json(score);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/habits', authenticate, async (req: any, res) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.userId }
    });
    res.json(habits);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Helper functions
function calculateCarbonImpact(amount: number, category: string): number {
  const factors: Record<string, number> = {
    food: 0.2,
    transport: 0.4,
    shopping: 0.3,
    utilities: 0.5,
    entertainment: 0.1
  };
  return amount * (factors[category] || 0.2);
}

async function updateUserCarbonScore(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId }
  });

  const totalImpact = transactions.reduce((sum, t) => sum + t.carbonImpact, 0);
  const score = Math.max(0, Math.min(100, 100 - (totalImpact * 0.1)));

  await prisma.carbonScore.update({
    where: { userId },
    data: { score, totalImpact }
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});