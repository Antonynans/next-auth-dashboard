import bcrypt from "bcryptjs";

// Mock user database (replace with real database)
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  emailVerified: boolean;
  verificationToken?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  provider?: "credentials" | "google" | "github";
}

// Use a global to persist data across hot reloads in development
declare global {
  var users: User[];
}

if (!global.users) {
  global.users = [];
}

const users = global.users;

export async function createUser(
  email: string,
  password: string,
  name: string,
  provider: "credentials" | "google" | "github" = "credentials",
) {
  // Check if user exists
  if (users.find((u) => u.email === email)) {
    throw new Error("User already exists");
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : "";
  const verificationToken = Math.random().toString(36).substring(2, 34);

  const user: User = {
    id: Math.random().toString(36).substring(2, 11),
    email,
    password: hashedPassword,
    name,
    emailVerified: provider !== "credentials", // Auto-verify OAuth users
    verificationToken:
      provider === "credentials" ? verificationToken : undefined,
    provider,
  };

  users.push(user);
  console.log(
    `✓ Created user: ${email}, token: ${user.verificationToken?.substring(0, 10)}..., total users: ${users.length}`,
  );
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    emailVerified: user.emailVerified,
    verificationToken: user.verificationToken,
  };
}

export async function verifyUser(email: string, password: string) {
  const user = users.find((u) => u.email === email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.emailVerified) {
    throw new Error("Please verify your email first");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return { id: user.id, email: user.email, name: user.name };
}

export async function getUserById(id: string) {
  const user = users.find((u) => u.id === id);
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    emailVerified: user.emailVerified,
  };
}

export async function getUserByEmail(email: string) {
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    emailVerified: user.emailVerified,
    verificationToken: user.verificationToken,
  };
}

export async function verifyEmailToken(token: string) {
  console.log("Looking for token:", token?.substring(0, 10) + "...");
  console.log(
    "Available users:",
    users.map((u) => ({
      email: u.email,
      hasToken: !!u.verificationToken,
      tokenPreview: u.verificationToken?.substring(0, 10),
    })),
  );

  const user = users.find((u) => u.verificationToken === token);
  if (!user) {
    console.error("Token not found in database");
    throw new Error("Invalid verification token");
  }

  console.log("Token found for user:", user.email);
  user.emailVerified = true;
  user.verificationToken = undefined;

  return { id: user.id, email: user.email, name: user.name };
}

export async function createPasswordResetToken(email: string) {
  const user = users.find((u) => u.email === email);
  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = Math.random().toString(36).substr(2, 32);
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

  user.resetToken = resetToken;
  user.resetTokenExpiry = resetTokenExpiry;

  return { resetToken, email: user.email, name: user.name };
}

export async function resetPassword(token: string, newPassword: string) {
  const user = users.find((u) => u.resetToken === token);
  if (!user) {
    throw new Error("Invalid reset token");
  }

  if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    throw new Error("Reset token has expired");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  return { id: user.id, email: user.email, name: user.name };
}
