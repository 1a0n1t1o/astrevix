import AdminAnalytics from "./admin-analytics";

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Platform Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of platform-wide metrics and growth
        </p>
      </div>
      <AdminAnalytics />
    </div>
  );
}
