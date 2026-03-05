export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-7 w-52 rounded-lg bg-gray-200" />
        <div className="mt-2 h-4 w-72 rounded-md bg-gray-100" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white/60 p-6"
          >
            <div className="mb-3 h-11 w-11 rounded-xl bg-gray-100" />
            <div className="h-10 w-16 rounded-lg bg-gray-200" />
            <div className="mt-2 h-4 w-28 rounded-md bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mt-8 rounded-2xl border border-gray-100 bg-white/60 p-6">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded-md bg-gray-100" />
          <div className="flex gap-2">
            <div className="h-7 w-20 rounded-lg bg-gray-100" />
            <div className="h-7 w-24 rounded-lg bg-gray-100" />
          </div>
        </div>
        <div className="mt-4 h-[280px] rounded-xl bg-gray-50" />
      </div>

      {/* Recent Submissions */}
      <div className="mt-10">
        <div className="h-6 w-40 rounded-md bg-gray-200" />
        <div className="mt-4 space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white/60 px-6 py-4"
            >
              <div className="h-5 w-5 rounded-md bg-gray-100" />
              <div className="h-4 w-28 rounded-md bg-gray-100" />
              <div className="ml-auto h-5 w-16 rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
