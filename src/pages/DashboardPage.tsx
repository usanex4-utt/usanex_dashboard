import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Users,
  UserCheck,
  UserPlus,
  AlertTriangle,
  FileText,
  Video,
  Zap,
  RefreshCw,
  Server,
  Database,
  HardDrive,
  Activity,
  CheckCircle2,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import {
  useGetOverviewQuery,
  useGetUsersGraphQuery,
  useGetContentQuery,
  useGetHealthQuery,
  useGetActivityQuery,
} from "@/api/dashboardApi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------- Helper components ---------- */

const SkeletonCard = () => (
  <div className="h-28 animate-pulse rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70">
    <div className="mb-4 h-3 w-1/2 rounded bg-slate-200" />
    <div className="h-8 w-1/3 rounded bg-slate-200" />
  </div>
);

type Accent = "blue" | "emerald" | "indigo" | "red" | "amber";

const accents: Record<Accent, { bg: string; text: string; ring: string; from: string; to: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-100", from: "from-blue-500", to: "to-indigo-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100", from: "from-emerald-500", to: "to-teal-600" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", ring: "ring-indigo-100", from: "from-indigo-500", to: "to-purple-600" },
  red: { bg: "bg-red-50", text: "text-red-600", ring: "ring-red-100", from: "from-red-500", to: "to-rose-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-100", from: "from-amber-500", to: "to-orange-600" },
};

function StatCard({
  title,
  value,
  icon: Icon,
  accent,
}: {
  title: string;
  value: number | string;
  icon: LucideIcon;
  accent: Accent;
}) {
  const a = accents[accent];
  return (
    <Card interactive className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
        </div>
        <div
          className={[
            "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12",
            a.bg,
            a.text,
            "ring-1",
            a.ring,
            "transition-transform duration-200 group-hover:scale-105",
          ].join(" ")}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
    </Card>
  );
}

/* ---------- Main page ---------- */

export function DashboardPage() {
  const { data: overview, isLoading: load1, refetch: refetchOverview, isFetching: f1 } = useGetOverviewQuery();
  const { data: usersGraph, isLoading: load2, refetch: refetchGraph, isFetching: f2 } = useGetUsersGraphQuery();
  const { data: content, isLoading: load3, refetch: refetchContent, isFetching: f3 } = useGetContentQuery();
  const { data: health, isLoading: load4, refetch: refetchHealth, isFetching: f4 } = useGetHealthQuery();
  const { data: activity, isLoading: load5, refetch: refetchActivity, isFetching: f5 } = useGetActivityQuery();

  const isInitialLoading = load1 || load2 || load3 || load4 || load5;
  const isRefreshing = f1 || f2 || f3 || f4 || f5;

  const handleRefreshAll = () => {
    refetchOverview();
    refetchGraph();
    refetchContent();
    refetchHealth();
    refetchActivity();
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Real-time data from your live database
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={handleRefreshAll}
          disabled={isRefreshing}
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isInitialLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={overview?.total_users ?? 0}
              icon={Users}
              accent="blue"
            />
            <StatCard
              title="Active Users"
              value={overview?.active_users ?? 0}
              icon={UserCheck}
              accent="emerald"
            />
            <StatCard
              title="New Registrations"
              value={overview?.new_registrations ?? 0}
              icon={UserPlus}
              accent="indigo"
            />
            <StatCard
              title="Pending Reports"
              value={overview?.pending_reports ?? 0}
              icon={AlertTriangle}
              accent="red"
            />
          </>
        )}
      </div>

      {/* Chart + Content activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* User growth */}
        <Card className="p-5 sm:p-6 lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">
              User Growth
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              New registrations over the last 7 days
            </p>
          </div>

          <div className="h-64 w-full sm:h-72 lg:h-80">
            {isInitialLoading ? (
              <div className="flex h-full w-full animate-pulse items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-400">
                Loading graph...
              </div>
            ) : !usersGraph || usersGraph.length === 0 ? (
              <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                <Users className="mb-2 h-10 w-10 opacity-50" />
                <p className="text-sm">No registrations in the last 7 days.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={usersGraph}
                  margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    dy={10}
                    tickFormatter={(str) => {
                      const d = new Date(str);
                      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    allowDecimals={false}
                    domain={[0, "dataMax + 1"]}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 8px 24px -8px rgba(15, 23, 42, 0.15)",
                      fontSize: "13px",
                    }}
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value) => [`${value} users`, "New registrations"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    activeDot={{ r: 6, strokeWidth: 2, fill: "#fff", stroke: "#3b82f6" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Content activity */}
        <Card className="p-5 sm:p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">
              Content Activity
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Total published content
            </p>
          </div>

          {isInitialLoading ? (
            <div className="space-y-4">
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: "Total Posts", value: content?.total_posts, icon: FileText, accent: "blue" as Accent },
                { label: "Total Reels", value: content?.total_reels, icon: Video, accent: "red" as Accent },
                { label: "Nex Moments", value: content?.total_nex_moments, icon: Zap, accent: "indigo" as Accent },
              ].map(({ label, value, icon: Icon, accent }) => {
                const a = accents[accent];
                return (
                  <div
                    key={label}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition-colors hover:bg-slate-50"
                  >
                    <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${a.bg} ${a.text} ring-1 ${a.ring}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {label}
                      </p>
                      <p className="mt-0.5 text-xl font-bold tabular-nums text-slate-900">
                        {value ?? 0}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Server status + Recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Server status */}
        <Card className="p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                Live Server Status
              </h3>
              <p className="text-xs text-slate-500">System health at a glance</p>
            </div>
          </div>

          {isInitialLoading ? (
            <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
          ) : (
            <div className="space-y-1">
              {[
                {
                  label: "Backend API",
                  icon: Activity,
                  value: health?.status,
                  ok: health?.status === "Online",
                },
                {
                  label: "Database (PostgreSQL)",
                  icon: Database,
                  value: health?.database,
                  ok: health?.database === "Online",
                },
                {
                  label: "Redis (Upstash)",
                  icon: Server,
                  value: health?.redis,
                  ok: health?.redis === "Connected",
                },
                {
                  label: "Supabase Storage",
                  icon: HardDrive,
                  value: health?.supabase,
                  ok: health?.supabase === "Connected",
                },
              ].map(({ label, icon: Icon, value, ok }, i, arr) => (
                <div
                  key={label}
                  className={[
                    "flex items-center justify-between py-3",
                    i !== arr.length - 1 && "border-b border-slate-100",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <span className="truncate text-sm font-medium text-slate-700">
                      {label}
                    </span>
                  </div>
                  <span
                    className={[
                      "flex flex-shrink-0 items-center gap-1.5 text-sm font-semibold",
                      ok ? "text-emerald-600" : "text-red-600",
                    ].join(" ")}
                  >
                    {ok ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    {value ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent activity */}
        <Card className="p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                Recent Activity
              </h3>
              <p className="text-xs text-slate-500">Latest platform events</p>
            </div>
          </div>

          {isInitialLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-11 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : activity && activity.length > 0 ? (
            <div className="space-y-1">
              {activity.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-slate-100"
                >
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50">
                    <span className="text-[11px] font-bold text-indigo-600">
                      {i + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {item.message}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <Zap className="mb-2 h-8 w-8 opacity-50" />
              <p className="text-sm">No recent activity yet.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}