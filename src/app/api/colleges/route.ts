import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';
  const sortBy = searchParams.get('sortBy') || 'rating';

  const colleges = await prisma.college.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: sortBy === 'fees' ? { fees: 'asc' } : { rating: 'desc' },
  });

  return NextResponse.json(colleges);
}