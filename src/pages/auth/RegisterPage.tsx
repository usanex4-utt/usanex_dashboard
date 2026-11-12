
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

import { useRegisterMutation } from "@/api/adminAuthApi";
import { useAppDispatch } from "@/hooks/redux";
import { setPendingMobile } from "@/features/auth/authSlice";

const schema = z
  .object({
    full_name: z.string().min(2, "At least 2 characters").max(150),

    mobile_number: z
      .string()
      .regex(/^\+?[1-9]\d{6,14}$/, "Enter a valid mobile number"),

    password: z
      .string()
      .min(8, "At least 8 characters")
      .max(128, "Too long"),

    confirm_password: z
      .string()
      .min(8, "At least 8 characters"),
  })
  .refine((v) => v.password === v.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [registerAdmin, { isLoading, error }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await registerAdmin(values).unwrap();

      dispatch(setPendingMobile(values.mobile_number));

      navigate("/verify-otp", {
        state: { otp: res.otp ?? null },
      });
    } catch {
      // API error displayed below.
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

        {/* Register Card */}
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
              Create <span className="text-indigo-600">Account</span>
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Register your Usanex admin account
            </p>

            <div className="mx-auto mt-5 h-1 w-12 rounded-full bg-indigo-600" />
          </div>

          {/* Registration Form */}
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

            {/* Full Name */}
            <Input
              label="Full name"
              placeholder="Enter your full name"
              autoComplete="name"
              {...register("full_name")}
              error={errors.full_name?.message}
            />

            {/* Mobile Number */}
            <Input
              label="Mobile number"
              type="tel"
              inputMode="tel"
              placeholder="+919876543210"
              autoComplete="tel"
              {...register("mobile_number")}
              error={errors.mobile_number?.message}
            />

            {/* Password */}
            <Input
              label="Create password"
              type="password"
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              {...register("password")}
              error={errors.password?.message}
            />

            {/* Confirm Password */}
            <Input
              label="Confirm password"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              {...register("confirm_password")}
              error={errors.confirm_password?.message}
            />

            {/* OTP Information
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3">
              <p className="text-xs leading-5 text-indigo-700">
                After creating your account, an OTP will be sent to your registered mobile number for verification.
              </p>
            </div> */}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoading}
            >
              Create account
            </Button>

          </form>

          {/* Login Link */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 transition hover:text-indigo-800 hover:underline"
              >
                Sign in
              </Link>
            </p>
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
