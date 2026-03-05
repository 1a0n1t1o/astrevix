export default function CustomizeLoading() {
  return (
    <div className="animate-pulse lg:-mr-4">
      {/* Header */}
      <div className="mb-8">
        <div className="h-7 w-32 rounded-lg bg-gray-200" />
        <div className="mt-2 h-4 w-64 rounded-md bg-gray-100" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Edit column */}
        <div className="space-y-6 lg:col-span-3">
          {/* Logo section */}
          <div className="rounded-2xl border border-gray-100 bg-white/60 p-6">
            <div className="h-5 w-28 rounded-md bg-gray-200" />
            <div className="mt-4 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-100" />
              <div className="h-9 w-28 rounded-lg bg-gray-100" />
            </div>
          </div>

          {/* Business info */}
          <div className="rounded-2xl border border-gray-100 bg-white/60 p-6">
            <div className="h-5 w-28 rounded-md bg-gray-200" />
            <div className="mt-4 space-y-4">
              <div className="h-10 w-full rounded-xl bg-gray-100" />
              <div className="h-10 w-full rounded-xl bg-gray-100" />
            </div>
          </div>

          {/* Color scheme */}
          <div className="rounded-2xl border border-gray-100 bg-white/60 p-6">
            <div className="h-5 w-28 rounded-md bg-gray-200" />
            <div className="mt-4 flex gap-3">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="h-9 w-9 rounded-full bg-gray-100" />
              ))}
            </div>
          </div>

          {/* Reward */}
          <div className="rounded-2xl border border-gray-100 bg-white/60 p-6">
            <div className="h-5 w-16 rounded-md bg-gray-200" />
            <div className="mt-4 space-y-4">
              <div className="h-10 w-full rounded-xl bg-gray-100" />
              <div className="h-10 w-full rounded-xl bg-gray-100" />
            </div>
          </div>
        </div>

        {/* Preview column */}
        <div className="hidden lg:col-span-2 lg:block">
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white/60 p-4">
            <div className="h-4 w-20 rounded-md bg-gray-100" />
            <div className="mt-3 h-[600px] rounded-[36px] bg-gray-50" />
          </div>
        </div>
      </div>
    </div>
  );
}
