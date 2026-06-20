import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Parse DATABASE_URL: mysql://user:password@host:port/database
const parseDatabaseUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    return {
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port) : 3306,
      user: parsed.username,
      password: parsed.password,
      database: parsed.pathname.substring(1), // Remove leading slash
    }
  } catch (error) {
    console.error('Failed to parse DATABASE_URL:', error)
    return null
  }
}

const dbConfig = process.env.DATABASE_URL ? parseDatabaseUrl(process.env.DATABASE_URL) : null

if (!dbConfig) {
  throw new Error('DATABASE_URL is not set or invalid')
}

const adapter = new PrismaMariaDb({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
