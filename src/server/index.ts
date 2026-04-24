import { router, publicProcedure, protectedProcedure } from './trpc';
import { z } from 'zod';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return 'ok';
  }),
  completeModule: protectedProcedure
    .input(z.object({
      moduleId: z.string(),
      score: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("UNAUTHORIZED");
      }
      const userId = ctx.session.user.id;

      // Ensure the module exists in the DB first (minimal seed)
      await ctx.prisma.module.upsert({
        where: { id: input.moduleId },
        update: {},
        create: {
          id: input.moduleId,
          title: input.moduleId.charAt(0).toUpperCase() + input.moduleId.slice(1),
          description: `Simulation Module: ${input.moduleId}`
        }
      });

      // Upsert progress for the user
      const progress = await ctx.prisma.progress.upsert({
        where: {
          userId_moduleId: {
            userId: userId,
            moduleId: input.moduleId,
          }
        },
        update: {
          completed: true,
          score: input.score,
        },
        create: {
          userId: userId,
          moduleId: input.moduleId,
          completed: true,
          score: input.score,
        }
      });



      // Lazy-load badges into DB
      const BADGES = [
        { name: "First Hack", description: "Completed your first module." },
        { name: "Eagle Eye", description: "Scored 100 on the Phishing Module." },
        { name: "Code Sanitizer", description: "Successfully patched an XSS vulnerability." },
        { name: "Social Engineer", description: "Survived a Social Engineering attack." },
      ];

      for (const b of BADGES) {
        await ctx.prisma.badge.upsert({
          where: { name: b.name },
          update: {},
          create: { name: b.name, description: b.description }
        });
      }

      // Re-fetch all progress to determine unlocked badges
      const allProgress = await ctx.prisma.progress.findMany({
        where: { userId, completed: true }
      });

      const badgesToUnlock: string[] = [];
      
      // The user just finished this module, let's see if they hit exactly 1 total module
      if (allProgress.length === 1) badgesToUnlock.push("First Hack");
      if (input.moduleId === "phishing" && input.score === 100) badgesToUnlock.push("Eagle Eye");
      if (input.moduleId === "xss") badgesToUnlock.push("Code Sanitizer");
      if (input.moduleId === "social-engineering") badgesToUnlock.push("Social Engineer");

      for (const badgeName of badgesToUnlock) {
        await ctx.prisma.user.update({
          where: { id: userId },
          data: {
            badges: {
              connect: { name: badgeName }
            }
          }
        });
      }

      return progress;
    }),

  getUserStats: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) throw new Error("UNAUTHORIZED");
    const userId = ctx.session.user.id;
    
    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      include: {
        progress: true,
        badges: true,
      }
    });

    if (!user) throw new Error("User not found");

    const totalXp = user.progress.reduce((sum, p) => sum + (p.score ?? 100), 0);
    const level = Math.floor(totalXp / 100) + 1;
    const progressToNextLevel = totalXp % 100;

    return {
      totalXp,
      level,
      progressToNextLevel,
      completedModulesCount: user.progress.filter(p => p.completed).length,
      completedModules: user.progress.filter(p => p.completed).map(p => p.moduleId),
      badges: user.badges,
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth,
    };
  }),
});

export type AppRouter = typeof appRouter;
