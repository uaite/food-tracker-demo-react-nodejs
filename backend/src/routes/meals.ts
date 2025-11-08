import { Router, Request, Response } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { prisma } from '../index';
import { z } from 'zod';
import { updateMealSchema } from '../schemas';

const router: Router = Router();

// GET /api/meals - Get all meals
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const meals = await prisma.meal.findMany({
      orderBy: { name: 'asc' },
    });

    res.json({ meals });
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({ error: 'Failed to get meals' });
  }
});

// PUT /api/meals/:id
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateMealSchema.parse(req.body);

    const existingMeal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!existingMeal) {
      res.status(404).json({ error: 'Meal not found' });
      return;
    }

    if (data.name && data.name !== existingMeal.name) {
      const duplicateMeal = await prisma.meal.findFirst({
        where: {
          name: data.name,
          id: { not: id },
        },
      });

      if (duplicateMeal) {
        res.status(400).json({ error: 'A meal with this name already exists' });
        return;
      }
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.maxEntries) updateData.maxEntries = data.maxEntries;

    const meal = await prisma.meal.update({
      where: { id },
      data: updateData,
    });

    res.json({ meal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: 'Invalid input data', details: error.errors });
      return;
    }
    console.error('Update meal error:', error);
    res.status(500).json({ error: 'Failed to update meal' });
  }
});

export default router;
