export default function SubmissionsLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-7 w-36 rounded-lg bg-gray-200" />
        <div className="mt-2 h-4 w-64 rounded-md bg-gray-100" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-24 rounded-xl bg-gray-100" />
        ))}
      </div>

      {/* Search bar */}
      <div className="mt-4 h-11 w-full rounded-xl bg-gray-100" />

      {/* Submission cards */}
      <div className="mt-6 space-y-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white/60 px-5 py-4"
          >
            <div className="h-8 w-8 rounded-lg bg-gray-100" />
            <div className="flex-1">
              <div className="h-4 w-28 rounded-md bg-gray-200" />
              <div className="mt-1.5 h-3 w-20 rounded-md bg-gray-100" />
            </div>
            <div className="h-5 w-16 rounded-full bg-gray-100" />
            <div className="h-4 w-4 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
