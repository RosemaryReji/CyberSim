import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server';
import { createContext } from '@/server/trpc';
import { NextRequest } from 'next/server';

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(),
  });

export { handler as GET, handler as POST };
