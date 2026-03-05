import InviteCodesList from "./invite-codes-list";

export default function InviteCodesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Invite Codes
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate and manage invite codes for new business signups
        </p>
      </div>
      <InviteCodesList />
    </div>
  );
}
