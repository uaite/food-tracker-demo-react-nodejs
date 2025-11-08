import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: 'USER' | 'ADMIN';
        dailyCalorieLimit: number;
        token: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const [_, token] = authHeader?.split('Bearer ') ?? '';

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const userToken = process.env.USER_TOKEN;
    const adminToken = process.env.ADMIN_TOKEN;

    let user;

    if (token === userToken) {
      user = await prisma.user.findUnique({
        where: { token: userToken },
      });
    } else if (token === adminToken) {
      user = await prisma.user.findUnique({
        where: { token: adminToken },
      });
    } else {
      res.status(403).json({ error: 'Invalid token' });
      return;
    }

    if (!user) {
      res.status(403).json({ error: 'User not found for token' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'USER' | 'ADMIN',
      dailyCalorieLimit: user.dailyCalorieLimit,
      token: user.token,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  next();
};
