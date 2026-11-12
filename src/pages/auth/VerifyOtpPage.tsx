
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { OtpInput } from "@/components/ui/OtpInput";

import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/api/adminAuthApi";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setCredentials } from "@/features/auth/authSlice";

export function VerifyOtpPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const mobile = useAppSelector(
    (s) => s.auth.pendingMobile
  );

  const initialOtp =
    (location.state as { otp?: string | null } | null)?.otp ?? null;

  const [otp, setOtp] = useState("");
  const [shownOtp, setShownOtp] = useState<string | null>(initialOtp);
  const [resendInfo, setResendInfo] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  const [verify, { isLoading, error }] = useVerifyOtpMutation();

  const [resend, { isLoading: isResending }] =
    useResendOtpMutation();

  useEffect(() => {
    if (!mobile) {
      navigate("/register", { replace: true });
    }
  }, [mobile, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobile || otp.length !== 6) return;

    try {
      const res = await verify({
        mobile_number: mobile,
        otp,
      }).unwrap();

      dispatch(
        setCredentials({
          token: res.token,
          expiresAt: res.expires_at,
          admin: res.admin,
        })
      );

      navigate("/dashboard", { replace: true });

    } catch {
      // API error displayed below.
    }
  };

  const onResend = async () => {
    if (!mobile) return;

    setResendInfo(null);
    setResendError(null);

    try {
      const res = await resend({
        mobile_number: mobile,
      }).unwrap();

      setResendInfo(res.detail);
      setShownOtp(res.otp ?? null);
      setOtp("");

    } catch (err) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err.data as { detail?: string })?.detail
          : undefined;

      setResendError(message ?? "Unable to resend OTP. Please try again.");
    }
  };

  const apiError =
    error && "data" in error
      ? (error.data as { detail?: string })?.detail
      : undefined;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-white to-indigo-50 px-4 py-10">

      {/* Background Decoration */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* Verification Card */}
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
              Verify <span className="text-indigo-600">Mobile</span>
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter the 6-digit verification code sent to your mobile number.
            </p>

            <div className="mx-auto mt-5 h-1 w-12 rounded-full bg-indigo-600" />
          </div>

          {/* Registered Mobile */}
          <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium text-slate-500">
              Verification number
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {mobile}
            </p>
          </div>

          {/* OTP Form */}
          <form
            className="space-y-5"
            onSubmit={onSubmit}
          >

            {/* Development OTP */}
            {shownOtp && (
              <Alert variant="info">
                <div className="space-y-1">
                  <p>
                    Your OTP is{" "}
                    <span className="font-mono text-lg font-bold tracking-widest">
                      {shownOtp}
                    </span>
                  </p>

                  {/* <p className="text-xs opacity-80">
                    Dev mode — in production this would be sent via SMS.
                  </p> */}
                </div>
              </Alert>
            )}

            {/* Resend Success */}
            {resendInfo && (
              <Alert variant="success">
                {resendInfo}
              </Alert>
            )}

            {/* Resend Error */}
            {resendError && (
              <Alert variant="error">
                {resendError}
              </Alert>
            )}

            {/* Verification Error */}
            {apiError && (
              <Alert variant="error">
                {apiError}
              </Alert>
            )}

            {/* OTP Input */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Enter verification code
              </label>

              <OtpInput
                value={otp}
                onChange={setOtp}
                length={6}
              />

              <p className="mt-2 text-xs text-slate-400">
                Please enter all 6 digits to continue.
              </p>
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoading}
              disabled={otp.length !== 6}
            >
              Verify OTP
            </Button>

            {/* Resend OTP */}
            <div className="border-t border-slate-100 pt-5 text-center">
              <p className="text-sm text-slate-500">
                Didn't receive the code?
              </p>

              <button
                type="button"
                onClick={onResend}
                disabled={isResending}
                className="mt-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend verification code"}
              </button>
            </div>

          </form>

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs font-medium tracking-wide text-slate-400">
          © 2026 Usanex. All rights reserved.
        </p>

      </div>
    </div>
  );
}
