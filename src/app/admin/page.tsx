import OwnersList from "./owners-list";

export default function AdminOwnersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Business Owners
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage all registered business owners on the platform
        </p>
      </div>
      <OwnersList />
    </div>
  );
}
