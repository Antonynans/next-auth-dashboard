'use server';

import { createSession, deleteSession } from '@/lib/auth';
import { createUser, verifyUser } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  try {
    const user = await createUser(email, password, name);
    await createSession(user.id, user.email);
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Registration failed' };
  }

  redirect('/dashboard');
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const user = await verifyUser(email, password);
    await createSession(user.id, user.email);
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Login failed' };
  }

  redirect('/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}