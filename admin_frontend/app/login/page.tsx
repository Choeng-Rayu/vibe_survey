'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
// Custom resolver using Zod (no external resolver package)
import { useAuthContext } from '@/contexts/AuthContext';

// Base schema
const baseSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  mfaCode: z.string().optional(),
});

// Conditionally require MFA based on env flag (client-side env variables are available via process.env at build time)
const loginSchema =
  process.env.NEXT_PUBLIC_ENABLE_MFA === 'true'
    ? baseSchema.refine((data) => data.mfaCode && data.mfaCode.length > 0, {
        message: 'MFA code required',
        path: ['mfaCode'],
      })
    : baseSchema.omit({ mfaCode: true });

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthContext();
  const enableMFA = process.env.NEXT_PUBLIC_ENABLE_MFA === 'true';

  // Custom Zod resolver for React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: async (values) => {
      try {
        const parsed = loginSchema.parse(values);
        return { values: parsed, errors: {} };
      } catch (e) {
        if (e instanceof z.ZodError) {
          const fieldErrors: Record<string, any> = {};
          (e as any).issues.forEach((err: any) => {
            const key = err.path[0] as string;
            fieldErrors[key] = { type: err.code, message: err.message };
          });
          return { values: {}, errors: fieldErrors };
        }
        return { values: {}, errors: {} };
      }
    },
  });

  const onSubmit = async (data: LoginForm) => {
    // AuthService login only accepts email and password; MFA handling would be separate.
    const success = await login(data.email, data.password);
    if (success) {
      router.push('/');
    } else {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-card bg-surface p-8 shadow-base"
      >
        <h2 className="mb-6 text-center text-2xl font-semibold">Sign In</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full rounded-md border border-border px-3 py-2 focus:border-primary focus:outline-none"
          />
          {errors.email?.message && (
            <p className="mt-1 text-sm text-error">{errors.email?.message?.toString()}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full rounded-md border border-border px-3 py-2 focus:border-primary focus:outline-none"
          />
          {errors.password?.message && (
            <p className="mt-1 text-sm text-error">{errors.password?.message?.toString()}</p>
          )}
        </div>

        {enableMFA && (
          <div className="mb-4">
            <label htmlFor="mfaCode" className="block text-sm font-medium mb-1">
              MFA Code
            </label>
            <input
              id="mfaCode"
              type="text"
              {...(register as any)('mfaCode')}
              className="w-full rounded-md border border-border px-3 py-2 focus:border-primary focus:outline-none"
            />
{errors.mfaCode?.message && (
                <p className="mt-1 text-sm text-error">{errors.mfaCode?.message?.toString()}</p>
              )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-pill bg-primary px-4 py-2 text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {isLoading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
