import pkg from '@prisma/client'
const { PrismaClient } = pkg

let prisma: InstanceType<typeof PrismaClient>

if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
  } else {
    if (!(global as any).prisma) {
      (global as any).prisma = new PrismaClient()
    }
    prisma = (global as any).prisma
  }
}

export { prisma } 