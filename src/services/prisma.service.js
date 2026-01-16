import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/client.js';

let prisma;

export function initializePrisma() {
  const maria = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  });

  prisma = new PrismaClient({ adapter: maria });
  return prisma;
}

export function getPrisma() {
  if (!prisma) {
    throw new Error('Prisma has not been initialized. Call initializePrisma() first.');
  }
  return prisma;
}

export default prisma;
