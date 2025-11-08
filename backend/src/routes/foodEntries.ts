import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';
import { prisma } from '../index';
import { startOfDay, endOfDay } from 'date-fns';
import {
  createFoodEntrySchema,
  updateFoodEntrySchema,
  querySchema,
  updateFoodEntryParamsSchema,
  deleteFoodEntryParamsSchema,
} from '../schemas';
import { Prisma } from '@prisma/client';

const router: Router = Router();

// GET /api/food-entries - Get paginated list of food entries
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const {
      from,
      to,
      page = '1',
      limit = '50',
      allUsers,
    } = querySchema.parse(req.query);

    // Check if user is trying to access all users data without admin privileges
    if (allUsers && req.user.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ error: 'Admin access required to view all users data' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where: Prisma.FoodEntryWhereInput = {};

    // If not admin requesting all users, filter by current user
    if (!allUsers) {
      where.userId = req.user.id;
    }

    if (from || to) {
      where.entryDateTime = {};
      if (from) where.entryDateTime.gte = new Date(from);
      if (to) where.entryDateTime.lte = new Date(to);
    }

    const includeUser = allUsers && req.user.role === 'ADMIN';

    const [entries, total] = await Promise.all([
      prisma.foodEntry.findMany({
        where,
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              maxEntries: true,
            },
          },
          ...(includeUser && {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                dailyCalorieLimit: true,
              },
            },
          }),
        },
        orderBy: { entryDateTime: 'desc' },
        skip,
        take,
      }),
      prisma.foodEntry.count({ where }),
    ]);

    res.json({
      entries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get food entries error:', error);
    res.status(500).json({ error: 'Failed to get food entries' });
  }
});

// POST /api/food-entries
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const data = createFoodEntrySchema.parse(req.body);

    const meal = await prisma.meal.findUnique({
      where: { id: data.mealId },
    });

    if (!meal) {
      return res.status(400).json({ error: 'Invalid meal selected' });
    }

    const entryDate = new Date(data.entryDateTime);
    const dayStart = startOfDay(entryDate);
    const dayEnd = endOfDay(entryDate);

    const existingEntriesCount = await prisma.foodEntry.count({
      where: {
        userId: req.user.id,
        mealId: data.mealId,
        entryDateTime: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });

    if (existingEntriesCount >= meal.maxEntries) {
      return res.status(400).json({
        error: `Maximum ${meal.maxEntries} entries allowed for ${meal.name} per day`,
      });
    }

    const entry = await prisma.foodEntry.create({
      data: {
        ...data,
        userId: req.user.id,
        entryDateTime: new Date(data.entryDateTime),
      },
      include: {
        meal: {
          select: {
            id: true,
            name: true,
            maxEntries: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            dailyCalorieLimit: true,
          },
        },
      },
    });

    res.status(201).json({ entry });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid input data', details: error.errors });
    }
    console.error('Create food entry error:', error);
    res.status(500).json({ error: 'Failed to create food entry' });
  }
});

// PUT /api/food-entries/:id
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = updateFoodEntryParamsSchema.parse(req.params);
    const data = updateFoodEntrySchema.parse(req.body);

    // Build the where clause based on user role
    const whereClause: Prisma.FoodEntryWhereInput = { id };
    if (req.user.role !== 'ADMIN') {
      whereClause.userId = req.user.id;
    }

    const existingEntry = await prisma.foodEntry.findFirst({
      where: whereClause,
    });

    if (!existingEntry) {
      return res.status(404).json({ error: 'Food entry not found' });
    }

    if (data.mealId) {
      const meal = await prisma.meal.findUnique({
        where: { id: data.mealId },
      });

      if (!meal) {
        return res.status(400).json({ error: 'Invalid meal selected' });
      }
    }

    const updateData: any = {};
    if (data.foodName) updateData.foodName = data.foodName;
    if (data.calories) updateData.calories = data.calories;
    if (data.mealId) updateData.mealId = data.mealId;
    if (data.entryDateTime)
      updateData.entryDateTime = new Date(data.entryDateTime);

    const entry = await prisma.foodEntry.update({
      where: { id },
      data: updateData,
      include: {
        meal: {
          select: {
            id: true,
            name: true,
            maxEntries: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            dailyCalorieLimit: true,
          },
        },
      },
    });

    res.json({ entry });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid input data', details: error.errors });
    }
    console.error('Update food entry error:', error);
    res.status(500).json({ error: 'Failed to update food entry' });
  }
});

// DELETE /api/food-entries/:id
router.delete(
  '/:id',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { id } = deleteFoodEntryParamsSchema.parse(req.params);

      const whereClause: any = { id };
      if (req.user.role !== 'ADMIN') {
        whereClause.userId = req.user.id;
      }

      const existingEntry = await prisma.foodEntry.findFirst({
        where: whereClause,
      });

      if (!existingEntry) {
        return res.status(404).json({ error: 'Food entry not found' });
      }

      await prisma.foodEntry.delete({
        where: { id },
      });

      res.json({ message: 'Food entry deleted successfully' });
    } catch (error) {
      console.error('Delete food entry error:', error);
      res.status(500).json({ error: 'Failed to delete food entry' });
    }
  }
);

// GET /api/food-entries/daily-totals
router.get(
  '/daily-totals',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { from, to } = querySchema.parse(req.query);

      if (!from && !to) {
        const today = new Date();
        const dayStart = startOfDay(today);
        const dayEnd = endOfDay(today);

        const entries = await prisma.foodEntry.findMany({
          where: {
            userId: req.user.id,
            entryDateTime: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
          select: {
            calories: true,
          },
        });

        const currentTotalCalories = entries.reduce(
          (total, entry) => total + entry.calories,
          0
        );

        return res.json({
          dailyCalorieLimit: req.user.dailyCalorieLimit,
          currentTotalCalories,
          date: today.toISOString().split('T')[0],
        });
      }

      if (!from || !to) {
        return res.status(400).json({
          error:
            'Both from and to dates are required when specifying date range',
        });
      }

      const entries = await prisma.foodEntry.findMany({
        where: {
          userId: req.user.id,
          entryDateTime: {
            gte: new Date(from),
            lte: new Date(to),
          },
        },
        select: {
          calories: true,
          entryDateTime: true,
        },
      });

      const dailyTotals: Record<string, number> = {};
      entries.forEach((entry) => {
        const [date] = entry.entryDateTime.toISOString().split('T');
        dailyTotals[date] = (dailyTotals[date] || 0) + entry.calories;
      });

      res.json({
        dailyTotals,
        dailyCalorieLimit: req.user.dailyCalorieLimit,
      });
    } catch (error) {
      console.error('Get daily totals error:', error);
      res.status(500).json({ error: 'Failed to get daily totals' });
    }
  }
);

export default router;
