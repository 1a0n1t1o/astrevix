export default function SmsLoading() {
  return (
    <div className="animate-pulse lg:-mr-4">
      {/* Header */}
      <div className="mb-8">
        <div className="h-7 w-40 rounded-lg bg-gray-200" />
        <div className="mt-2 h-4 w-72 rounded-md bg-gray-100" />
      </div>

      {/* Template cards */}
      <div className="space-y-6">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white/60 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-100" />
              <div>
                <div className="h-5 w-36 rounded-md bg-gray-200" />
                <div className="mt-1.5 h-3 w-56 rounded-md bg-gray-100" />
              </div>
            </div>
            <div className="mt-4 h-32 rounded-xl bg-gray-50" />
            <div className="mt-3 flex items-center gap-3">
              <div className="h-3 w-48 rounded-md bg-gray-100" />
            </div>
            <div className="mt-4 h-10 w-32 rounded-xl bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
