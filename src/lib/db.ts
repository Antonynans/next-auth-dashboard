import bcrypt from 'bcryptjs';

// Mock user database (replace with real database)
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

const users: User[] = [];

export async function createUser(email: string, password: string, name: string) {
  // Check if user exists
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    password: hashedPassword,
    name,
  };

  users.push(user);
  return { id: user.id, email: user.email, name: user.name };
}

export async function verifyUser(email: string, password: string) {
  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  return { id: user.id, email: user.email, name: user.name };
}

export async function getUserById(id: string) {
  const user = users.find(u => u.id === id);
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name };
}

