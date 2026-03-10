import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "SMS Program | Astrevix",
  description: "Astrevix SMS Program — how we use text messaging to notify you about submissions and rewards.",
};

export default function SmsPage() {
  return (
    <div className="min-h-screen bg-[#FEFCFA]">
      <div className="mx-auto max-w-2xl px-5 py-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900"
          >
            &larr; Back to Astrevix
          </Link>
          <Link href="/">
            <Image
              src="/logo-text.png"
              alt="Astrevix"
              width={100}
              height={20}
              className="opacity-60 hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>

        <h1 className="mt-8 text-3xl font-bold text-gray-900">SMS Program</h1>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
          <p>
            Astrevix may send SMS messages to customers who provide their mobile number and consent
            during the content submission process. Message frequency may vary. Message &amp; data
            rates may apply.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="font-semibold text-gray-900">Opt out</p>
              <p className="mt-1 text-gray-500">Reply <strong>STOP</strong> at any time.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="font-semibold text-gray-900">Help</p>
              <p className="mt-1 text-gray-500">Reply <strong>HELP</strong> for assistance.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="font-semibold text-gray-900">Support</p>
              <p className="mt-1 text-gray-500">
                <a href="mailto:contact@astrevix.com" className="underline hover:text-gray-900">
                  contact@astrevix.com
                </a>
              </p>
            </div>
          </div>

          <p>
            For additional details, please review our{" "}
            <Link href="/privacy" className="underline hover:text-gray-900">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="underline hover:text-gray-900">
              Terms of Service
            </Link>.
          </p>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          <p>Astrevix</p>
          <p className="mt-1">
            <a href="mailto:contact@astrevix.com" className="underline hover:text-gray-600">
              contact@astrevix.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
