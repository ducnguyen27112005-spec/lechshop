import { PrismaClient } from "@/generated/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
};

declare global {
    var prisma2: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma2 ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma2 = prisma;
