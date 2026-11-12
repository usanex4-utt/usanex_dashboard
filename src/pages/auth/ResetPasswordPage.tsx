
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { OtpInput } from "@/components/ui/OtpInput";

import { useResetPasswordMutation } from "@/api/adminAuthApi";
import { useAppSelector } from "@/hooks/redux";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const mobile = useAppSelector(
    (s) => s.auth.pendingMobile
  );

  const initialOtp =
    (location.state as { otp?: string | null } | null)?.otp ?? null;

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [reset, { isLoading, error, isSuccess }] =
    useResetPasswordMutation();

  useEffect(() => {
    if (!mobile) {
      navigate("/forgot-password", { replace: true });
    }
  }, [mobile, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobile || otp.length !== 6 || password.length < 8) return;
    if (password !== confirm) return;

    try {
      await reset({
        mobile_number: mobile,
        otp,
        new_password: password,
      }).unwrap();

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);

    } catch {
      // API error displayed below.
    }
  };

  const apiError =
    error && "data" in error
      ? (error.data as { detail?: string })?.detail
      : undefined;

  const mismatch =
    password.length > 0 &&
    confirm.length > 0 &&
    password !== confirm;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-white to-indigo-50 px-4 py-10">

      {/* Background Decoration */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* Reset Password Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-7 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] backdrop-blur-sm sm:p-9">

          {/* Logo & Heading */}
          <div className="mb-7 text-center">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-indigo-100 bg-white p-2 shadow-lg shadow-indigo-100/70">
              <img
                src="/logo.jpeg"
                alt="Usanex Logo"
                className="h-full w-full rounded-xl object-contain"
              />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Reset <span className="text-indigo-600">Password</span>
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create a new secure password for your admin account.
            </p>

            <div className="mx-auto mt-5 h-1 w-12 rounded-full bg-indigo-600" />
          </div>

          {/* Form */}
          <form
            className="space-y-5"
            onSubmit={onSubmit}
          >

            {/* Mobile Information */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium text-slate-500">
                Registered mobile number
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {mobile}
              </p>
            </div>

            {/* Development OTP */}
            {initialOtp && (
              <Alert variant="info">
                <div className="space-y-1">
                  <p>
                    Your reset code is{" "}
                    <span className="font-mono text-lg font-bold tracking-widest">
                      {initialOtp}
                    </span>
                  </p>

                  <p className="text-xs opacity-80">
                    Dev mode — in production this would be sent via SMS.
                  </p>
                </div>
              </Alert>
            )}

            {/* API Error */}
            {apiError && (
              <Alert variant="error">
                {apiError}
              </Alert>
            )}

            {/* Success Message */}
            {isSuccess && (
              <Alert variant="success">
                Password reset successfully! Redirecting to login...
              </Alert>
            )}

            {/* OTP Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Verification code
              </label>

              <OtpInput
                value={otp}
                onChange={setOtp}
                length={6}
              />

              <p className="mt-2 text-xs text-slate-400">
                Enter the 6-digit code sent to your mobile.
              </p>
            </div>

            {/* New Password */}
            <Input
              label="New password"
              type="password"
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Confirm Password */}
            <Input
              label="Confirm password"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={mismatch ? "Passwords do not match" : undefined}
            />

            {/* Password Information
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3">
              <p className="text-xs leading-5 text-indigo-700">
                Choose a strong password with at least 8 characters to protect your admin account.
              </p>
            </div> */}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoading}
              disabled={
                otp.length !== 6 ||
                password.length < 8 ||
                !confirm ||
                !!mismatch ||
                isSuccess
              }
            >
              Reset password
            </Button>

          </form>

          {/* Back to Login */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800 hover:underline"
            >
              <span>←</span>
              Back to sign in
            </Link>
          </div>

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs font-medium tracking-wide text-slate-400">
          © 2026 Usanex. All rights reserved.
        </p>

      </div>
    </div>
  );
}
