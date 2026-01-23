"use client";

import { verifyEmail, resendVerificationEmail } from "@/app/actions/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    !token ? "error" : "loading",
  );
  const [message, setMessage] = useState(
    !token ? "Invalid or missing verification link" : "",
  );
  const [resendEmail, setResendEmail] = useState("");

  useEffect(() => {
    async function handleVerification() {
      if (!token) return;

      const result = await verifyEmail(token);
      if (result.success) {
        setStatus("success");
        setMessage("Email verified successfully! Redirecting to dashboard...");
        setTimeout(() => router.push("/dashboard"), 3000);
      } else {
        setStatus("error");
        setMessage(result.error || "Verification failed");
      }
    }

    if (token) {
      handleVerification();
    }
  }, [token]);

  async function handleResend() {
    if (!resendEmail) return;

    const result = await resendVerificationEmail(resendEmail);
    if (result.success) {
      setMessage(result.message || "Verification email sent!");
    } else {
      setMessage(result.error || "Failed to resend email");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Email Verification
        </h1>

        {status === "loading" && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-green-600 font-medium">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {message}
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Didn&apos;t receive the email? Enter your email to resend:
              </p>
              <input
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your@email.com"
              />
              <button
                onClick={handleResend}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Resend Verification Email
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              <Link
                href="/login"
                className="text-purple-600 hover:underline font-medium"
              >
                Back to Login
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
