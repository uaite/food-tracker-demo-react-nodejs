import { Router, Request, Response } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { z } from 'zod';
import { prisma } from '../index';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';
import {
  adminCreateFoodEntrySchema,
  updateFoodEntrySchema,
  adminQuerySchema,
} from '../schemas';

const router: Router = Router();

// GET /api/admin/weekly-comparison - Get weekly comparison report
router.get(
  '/reports/weekly-comparison',
  authenticateToken,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const last7Days = subDays(now, 7);
      const previous7Days = subDays(now, 14);

      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);

      const [thisWeekCount, previousWeekCount, todayCount] = await Promise.all([
        prisma.foodEntry.count({
          where: {
            createdAt: {
              gte: last7Days,
              lte: now,
            },
          },
        }),
        prisma.foodEntry.count({
          where: {
            createdAt: {
              gte: previous7Days,
              lt: last7Days,
            },
          },
        }),
        prisma.foodEntry.count({
          where: {
            createdAt: {
              gte: startOfToday,
              lte: endOfToday,
            },
          },
        }),
      ]);

      const difference = thisWeekCount - previousWeekCount;
      const percentageChange =
        previousWeekCount > 0
          ? Math.round((difference / previousWeekCount) * 100)
          : 0;

      res.json({
        today: {
          count: todayCount,
        },
        thisWeek: {
          count: thisWeekCount,
          period: {
            from: last7Days.toISOString(),
            to: now.toISOString(),
          },
        },
        previousWeek: {
          count: previousWeekCount,
          period: {
            from: previous7Days.toISOString(),
            to: last7Days.toISOString(),
          },
        },
      });
    } catch (error) {
      console.error('Weekly comparison report error:', error);
      res
        .status(500)
        .json({ error: 'Failed to generate weekly comparison report' });
    }
  }
);

// GET /api/admin/reports/average-calories - Get average calories per user report
router.get(
  '/reports/average-calories',
  authenticateToken,
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const now = new Date();
      const last7Days = subDays(now, 7);

      const userAggregations = await prisma.foodEntry.groupBy({
        by: ['userId'],
        where: {
          entryDateTime: {
            gte: last7Days,
            lte: now,
          },
        },
        _sum: {
          calories: true,
        },
        _count: {
          _all: true,
        },
        _avg: {
          calories: true,
        },
        orderBy: {
          userId: 'asc',
        },
      });

      const userIds = userAggregations.map((agg) => agg.userId);
      const users = await prisma.user.findMany({
        where: {
          id: { in: userIds },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      const userMap = new Map(users.map((user) => [user.id, user]));

      const userBreakdown = userAggregations.map((agg) => ({
        user: userMap.get(agg.userId),
        totalCalories: agg._sum.calories || 0,
        entryCount: agg._count._all,
      }));

      const overallAggregation = await prisma.foodEntry.aggregate({
        where: {
          entryDateTime: {
            gte: last7Days,
            lte: now,
          },
        },
        _sum: {
          calories: true,
        },
        _avg: {
          calories: true,
        },
      });

      const totalUsers = userAggregations.length;
      const totalCalories = overallAggregation._sum.calories || 0;
      const overallAveragePerUser =
        totalUsers > 0 ? Math.round(totalCalories / totalUsers) : 0;

      res.json({
        period: {
          from: last7Days.toISOString(),
          to: now.toISOString(),
        },
        overallAverage: {
          averageCaloriesPerUser: overallAveragePerUser,
          totalUsers,
          totalCalories,
        },
        userBreakdown,
      });
    } catch (error) {
      console.error('Average calories report error:', error);
      res
        .status(500)
        .json({ error: 'Failed to generate average calories report' });
    }
  }
);

export default router;
