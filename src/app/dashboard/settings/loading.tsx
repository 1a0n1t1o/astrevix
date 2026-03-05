export default function SettingsLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-7 w-24 rounded-lg bg-gray-200" />
        <div className="mt-2 h-4 w-72 rounded-md bg-gray-100" />
      </div>

      <div className="flex gap-8">
        {/* Sidebar tabs (desktop) */}
        <div className="hidden w-48 shrink-0 space-y-1 lg:block">
          {[0, 1].map((i) => (
            <div key={i} className="h-10 w-full rounded-xl bg-gray-100" />
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 space-y-6">
          {/* Avatar + name */}
          <div className="rounded-2xl border border-gray-100 bg-white/60 p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-100" />
              <div>
                <div className="h-5 w-32 rounded-md bg-gray-200" />
                <div className="mt-2 h-3 w-48 rounded-md bg-gray-100" />
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="rounded-2xl border border-gray-100 bg-white/60 p-6">
            <div className="space-y-4">
              <div>
                <div className="h-4 w-20 rounded-md bg-gray-100" />
                <div className="mt-2 h-10 w-full rounded-xl bg-gray-50" />
              </div>
              <div>
                <div className="h-4 w-20 rounded-md bg-gray-100" />
                <div className="mt-2 h-10 w-full rounded-xl bg-gray-50" />
              </div>
              <div>
                <div className="h-4 w-20 rounded-md bg-gray-100" />
                <div className="mt-2 h-10 w-full rounded-xl bg-gray-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
