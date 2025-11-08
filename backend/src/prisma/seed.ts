import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create predefined users
  const users = [
    {
      email: 'john@example.com',
      name: 'John Doe',
      role: 'USER' as const,
      dailyCalorieLimit: 2100,
      token: process.env.USER_TOKEN || 'user-token-123',
    },
    {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN' as const,
      dailyCalorieLimit: 2500,
      token: process.env.ADMIN_TOKEN || 'admin-token-456',
    },
  ];

  console.log('👥 Creating users...');
  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: userData,
      create: userData,
    });
    console.log(`✅ Created/updated user: ${userData.name} (${userData.role})`);
  }

  // Create predefined meals
  const meals = [
    { name: 'Breakfast', maxEntries: 3 },
    { name: 'Lunch', maxEntries: 5 },
    { name: 'Dinner', maxEntries: 2 },
    { name: 'Snack', maxEntries: 2 },
  ];

  console.log('🍽️  Creating meals...');
  for (const mealData of meals) {
    await prisma.meal.upsert({
      where: { name: mealData.name },
      update: mealData,
      create: mealData,
    });
    console.log(
      `✅ Created/updated meal: ${mealData.name} (max ${mealData.maxEntries} entries)`
    );
  }

  // Get created users and meals for sample data
  const johnUser = await prisma.user.findUnique({
    where: { email: 'john@example.com' },
  });
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });
  const breakfastMeal = await prisma.meal.findUnique({
    where: { name: 'Breakfast' },
  });
  const lunchMeal = await prisma.meal.findUnique({ where: { name: 'Lunch' } });
  const dinnerMeal = await prisma.meal.findUnique({
    where: { name: 'Dinner' },
  });
  const snackMeal = await prisma.meal.findUnique({ where: { name: 'Snack' } });

  if (
    johnUser &&
    adminUser &&
    breakfastMeal &&
    lunchMeal &&
    dinnerMeal &&
    snackMeal
  ) {
    // Create sample food entries for the last 10 days
    console.log('🍎 Creating sample food entries...');

    const sampleEntries = [];
    const now = new Date();

    for (let i = 0; i < 10; i++) {
      const entryDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);

      // John's entries
      sampleEntries.push(
        // Breakfast
        {
          userId: johnUser.id,
          mealId: breakfastMeal.id,
          foodName: 'Oatmeal with berries',
          calories: 320,
          entryDateTime: new Date(
            entryDate.getFullYear(),
            entryDate.getMonth(),
            entryDate.getDate(),
            8,
            0
          ),
        },
        {
          userId: johnUser.id,
          mealId: breakfastMeal.id,
          foodName: 'Orange juice',
          calories: 110,
          entryDateTime: new Date(
            entryDate.getFullYear(),
            entryDate.getMonth(),
            entryDate.getDate(),
            8,
            15
          ),
        },
        // Lunch
        {
          userId: johnUser.id,
          mealId: lunchMeal.id,
          foodName: 'Grilled chicken salad',
          calories: 450,
          entryDateTime: new Date(
            entryDate.getFullYear(),
            entryDate.getMonth(),
            entryDate.getDate(),
            12,
            30
          ),
        },
        {
          userId: johnUser.id,
          mealId: lunchMeal.id,
          foodName: 'Apple',
          calories: 80,
          entryDateTime: new Date(
            entryDate.getFullYear(),
            entryDate.getMonth(),
            entryDate.getDate(),
            13,
            0
          ),
        },
        // Dinner
        {
          userId: johnUser.id,
          mealId: dinnerMeal.id,
          foodName: 'Salmon with vegetables',
          calories: 580,
          entryDateTime: new Date(
            entryDate.getFullYear(),
            entryDate.getMonth(),
            entryDate.getDate(),
            19,
            0
          ),
        },
        // Snack
        {
          userId: johnUser.id,
          mealId: snackMeal.id,
          foodName: 'Greek yogurt',
          calories: 150,
          entryDateTime: new Date(
            entryDate.getFullYear(),
            entryDate.getMonth(),
            entryDate.getDate(),
            15,
            30
          ),
        }
      );

      if (i % 2 === 0) {
        sampleEntries.push(
          {
            userId: adminUser.id,
            mealId: breakfastMeal.id,
            foodName: 'Avocado toast',
            calories: 280,
            entryDateTime: new Date(
              entryDate.getFullYear(),
              entryDate.getMonth(),
              entryDate.getDate(),
              9,
              0
            ),
          },
          {
            userId: adminUser.id,
            mealId: lunchMeal.id,
            foodName: 'Quinoa bowl',
            calories: 520,
            entryDateTime: new Date(
              entryDate.getFullYear(),
              entryDate.getMonth(),
              entryDate.getDate(),
              13,
              0
            ),
          }
        );
      }
    }

    // Insert sample entries
    for (const entry of sampleEntries) {
      try {
        await prisma.foodEntry.create({ data: entry });
      } catch (error) {
        // Ignore duplicates or other errors for demo purposes
        console.log(
          `⚠️  Skipped entry: ${entry.foodName} (might already exist)`
        );
      }
    }

    console.log(`✅ Created ${sampleEntries.length} sample food entries`);
  }

  console.log('🎉 Database seed completed!');
  console.log('\n📋 Summary:');
  console.log('Users created:');
  console.log('- john@example.com (USER) - Token: user-token-123');
  console.log('- admin@example.com (ADMIN) - Token: admin-token-456');
  console.log('\nMeals created:');
  console.log('- Breakfast (max 3 entries)');
  console.log('- Lunch (max 5 entries)');
  console.log('- Dinner (max 2 entries)');
  console.log('- Snack (max 2 entries)');
  console.log('\n🚀 Ready to test the API!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
