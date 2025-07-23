import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Test connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Prisma connected to database successfully!');
  } catch (error) {
    console.error('Prisma failed to connect:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.env.NODE_ENV !== 'production') {
  testConnection();
}

export default prisma;
