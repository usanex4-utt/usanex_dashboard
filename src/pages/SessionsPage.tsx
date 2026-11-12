import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useSessionsQuery, useLogoutMutation } from "@/api/adminAuthApi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/features/auth/authSlice";

export function SessionsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data, isLoading, error } = useSessionsQuery();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogoutAll = async () => {
    try {
      await logoutApi({ revoke_all: true }).unwrap();
    } catch {
      /* ignore */
    } finally {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Active sessions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Devices currently logged into your admin account.
          </p>
        </div>
        <Button
          variant="danger"
          onClick={handleLogoutAll}
          loading={isLoggingOut}
        >
          Revoke all
        </Button>
      </div>

      {error && (
        <Alert variant="error">Failed to load sessions.</Alert>
      )}

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Last used</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">IP</th>
              <th className="px-4 py-3">Device</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && data?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  No active sessions.
                </td>
              </tr>
            )}
            {data?.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 text-slate-800">
                  {new Date(s.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {s.last_used_at
                    ? new Date(s.last_used_at).toLocaleString()
                    : "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {new Date(s.expires_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {s.ip_address ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <span className="block max-w-xs truncate">
                    {s.user_agent ?? "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}