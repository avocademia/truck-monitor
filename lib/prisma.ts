import { PrismaClient } from '@prisma/client'
import { clear } from 'console'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}
clear
export const prisma = globalForPrisma.prisma ?? new PrismaClient()  

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
