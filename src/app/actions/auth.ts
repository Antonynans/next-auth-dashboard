"use server";

import { createSession, deleteSession } from "@/lib/auth";
import {
  createUser,
  verifyUser,
  verifyEmailToken,
  createPasswordResetToken,
  resetPassword,
  getUserByEmail,
} from "@/lib/db";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  try {
    console.log(`[REGISTER] Starting registration for: ${email}`);
    const user = await createUser(email, password, name);

    // Send verification email
    if (user.verificationToken) {
      console.log(
        `[REGISTER] Sending verification email with token: ${user.verificationToken.substring(0, 10)}...`,
      );
      await sendVerificationEmail(email, user.verificationToken, name);
      console.log(`[REGISTER] Verification email sent to: ${email}`);
    }

    return {
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Registration failed";
    console.error(`[REGISTER] Error: ${errorMessage}`);
    return { error: errorMessage };
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await verifyUser(email, password);
    await createSession(user.id, user.email);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Login failed";
    return { error: errorMessage };
  }

  redirect("/dashboard");
}

export async function verifyEmail(token: string) {
  try {
    console.log("Attempting to verify token:", token?.substring(0, 10) + "...");
    const user = await verifyEmailToken(token);
    console.log("Token verified for user:", user.email);
    await createSession(user.id, user.email);
    console.log("Session created for user:", user.email);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Verification failed";
    console.error("Verification error:", errorMessage);
    return { error: errorMessage };
  }
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;

  try {
    const resetData = await createPasswordResetToken(email);
    await sendPasswordResetEmail(email, resetData.resetToken, resetData.name);

    return {
      success: true,
      message: "Password reset link sent to your email.",
    };
  } catch (error: unknown) {
    // Don't reveal if email exists or not (security best practice)
    return {
      success: true,
      message:
        "If your email is registered, you will receive a password reset link.",
    };
  }
}

export async function resetPasswordWithToken(
  token: string,
  formData: FormData,
) {
  const password = formData.get("password") as string;

  try {
    await resetPassword(token, password);
    return {
      success: true,
      message:
        "Password reset successful! You can now login with your new password.",
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Password reset failed";
    return { error: errorMessage };
  }
}

export async function resendVerificationEmail(email: string) {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return { error: "User not found" };
    }

    if (user.emailVerified) {
      return { error: "Email already verified" };
    }

    if (user.verificationToken) {
      await sendVerificationEmail(email, user.verificationToken, user.name);
      return {
        success: true,
        message: "Verification email resent successfully!",
      };
    }

    return { error: "Verification token not found" };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to resend verification email";
    return { error: errorMessage };
  }
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
