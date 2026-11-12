
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

import { useForgotPasswordMutation } from "@/api/adminAuthApi";
import { useAppDispatch } from "@/hooks/redux";
import { setPendingMobile } from "@/features/auth/authSlice";

const schema = z.object({
  mobile_number: z
    .string()
    .regex(/^\+?[1-9]\d{6,14}$/, "Enter a valid mobile number"),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [forgot, { isLoading, isSuccess, error }] =
    useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await forgot(values).unwrap();

      dispatch(setPendingMobile(values.mobile_number));

      navigate("/reset-password", {
        state: { otp: res.otp ?? null },
      });
    } catch {
      // API error handled below.
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

        {/* Forgot Password Card */}
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
              Forgot <span className="text-indigo-600">Password?</span>
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              No worries! Enter your registered mobile number to reset your password.
            </p>

            <div className="mx-auto mt-5 h-1 w-12 rounded-full bg-indigo-600" />
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* API Error */}
            {apiError && (
              <Alert variant="error">
                {apiError}
              </Alert>
            )}

            {/* Success Message */}
            {isSuccess && (
              <Alert variant="success">
                If the number exists, a reset code has been sent.
              </Alert>
            )}

            {/* Mobile Number */}
            <Input
              label="Registered mobile number"
              type="tel"
              inputMode="tel"
              placeholder="+919876543210"
              autoComplete="tel"
              {...register("mobile_number")}
              error={errors.mobile_number?.message}
            />

            {/* Information Box
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3">
              <p className="text-xs leading-5 text-indigo-700">
                A verification OTP will be sent to your registered mobile number to securely reset your password.
              </p>
            </div> */}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoading}
            >
              Send reset code
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
