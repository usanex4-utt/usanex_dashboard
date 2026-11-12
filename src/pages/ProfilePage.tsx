import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { useChangePasswordMutation } from "@/api/adminAuthApi";
import { useAppSelector } from "@/hooks/redux";

export function ProfilePage() {
  const admin = useAppSelector((s) => s.auth.admin);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [changePassword, { isLoading, isSuccess, error }] =
    useChangePasswordMutation();

  const mismatch = next && confirm && next !== confirm;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || next.length < 8 || mismatch) return;
    try {
      await changePassword({
        current_password: current,
        new_password: next,
      }).unwrap();
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch {
      /* shown */
    }
  };

  const apiError =
    error && "data" in error
      ? (error.data as { detail?: string })?.detail
      : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="text-base font-semibold text-slate-900">
          Profile information
        </h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Full name</dt>
            <dd className="font-medium text-slate-800">
              {admin?.full_name}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Mobile number</dt>
            <dd className="font-medium text-slate-800">
              {admin?.mobile_number}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Role</dt>
            <dd className="font-medium text-slate-800">
              {admin?.is_super_admin ? "Super Admin" : "Admin"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Status</dt>
            <dd className="font-medium text-slate-800">
              {admin?.is_active ? "Active" : "Inactive"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card className="p-6">
        <h3 className="text-base font-semibold text-slate-900">
          Change password
        </h3>
        <form className="mt-4 space-y-4" onSubmit={onSubmit}>
          {apiError && <Alert variant="error">{apiError}</Alert>}
          {isSuccess && (
            <Alert variant="success">
              Password changed. Other sessions revoked.
            </Alert>
          )}

          <Input
            label="Current password"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
          <Input
            label="New password"
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            hint="Minimum 8 characters"
          />
          <Input
            label="Confirm new password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={mismatch ? "Passwords do not match" : undefined}
          />

          <Button
            type="submit"
            loading={isLoading}
            disabled={!current || next.length < 8 || !!mismatch}
          >
            Update password
          </Button>
        </form>
      </Card>
    </div>
  );
}