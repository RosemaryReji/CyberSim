import { appRouter } from './src/server/index';
import { prisma } from './src/lib/prisma';

async function main() {
  const caller = appRouter.createCaller({
    session: { user: { id: "test-user-id" }, expires: "9999" },
    prisma: prisma,
  });

  try {
    // 1. Create a dummy user
    await prisma.user.upsert({
      where: { id: "test-user-id" },
      create: { id: "test-user-id", email: "test@test.com", name: "Test" },
      update: {}
    });

    const res = await caller.completeModule({ moduleId: "bruteforce", score: 100 });
    console.log("SUCCESS:", res);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

main();
