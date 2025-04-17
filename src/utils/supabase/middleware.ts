import { NextResponse, type NextRequest } from 'next/server';

export const updateSession = async (request: NextRequest) => {
  try {
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    return response;
  } catch (error: any) {
    console.error('Error updating session:', error.message);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
