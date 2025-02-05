import { createServerClient } from '@supabase/ssr';
import { env } from 'next-runtime-env';
import { cookies } from 'next/headers';

export const createClient = async () => {
  const cookieStore = await cookies();
  const SUPABASE_URL =
    process.env.NODE_ENV === 'production'
      ? env('NEXT_PUBLIC_SUPABASE_URL')
      : process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY =
    process.env.NODE_ENV === 'production'
      ? env('NEXT_PUBLIC_SUPABASE_ANON_KEY')
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
};
