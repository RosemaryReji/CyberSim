import { initTRPC, TRPCError } from '@trpc/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const createContext = async () => {
  const session = await auth();
  return {
    prisma,
    session,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts;
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({
    ctx: {
      session: ctx.session,
    },
  });
});
