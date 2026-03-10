import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Terms of Service | Astrevix",
  description: "Astrevix Terms of Service — rules governing use of our platform.",
};

export default function TermsPage() {
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

        <h1 className="mt-8 text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">Effective date: March 10, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
          {/* SMS Messaging Terms — placed first and prominently */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              1. SMS Messaging Terms &amp; Compliance
            </h2>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Program Description</h3>
            <p className="mt-2">
              This messaging program sends transactional SMS notifications to customers who have
              submitted social media content through a business&apos;s Astrevix submission page and
              have explicitly opted in to receive SMS notifications. Opt-in is collected via the
              submission form with a dedicated checkbox for SMS consent. Messages include submission
              confirmations, approval/rejection notifications, and reward code delivery.
            </p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Cancellation</h3>
            <p className="mt-2">
              Text <strong>STOP</strong> to cancel at any time. You will receive a confirmation
              message upon opting out. To rejoin, submit content again through a business landing page
              and opt in to SMS notifications.
            </p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Support</h3>
            <p className="mt-2">
              Reply <strong>HELP</strong> for assistance, or contact us at{" "}
              <a href="mailto:contact@astrevix.com" className="underline hover:text-gray-900">
                contact@astrevix.com
              </a>.
            </p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Carrier Liability</h3>
            <p className="mt-2">
              Carriers are not liable for delayed or undelivered messages.
            </p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Message &amp; Data Rates</h3>
            <p className="mt-2">
              Standard message and data rates may apply. Message frequency varies based on submission
              activity (typically 1&ndash;4 messages per submission).
            </p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Supported Carriers</h3>
            <p className="mt-2">
              Works with all major U.S. wireless carriers including AT&amp;T, T-Mobile, Verizon, and
              most regional carriers.
            </p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Age Restriction</h3>
            <p className="mt-2">
              You must be 18 years or older to participate in the SMS messaging program.
            </p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Privacy</h3>
            <p className="mt-2">
              Your privacy is important to us. Please review our{" "}
              <Link href="/privacy" className="underline hover:text-gray-900">
                Privacy Policy
              </Link>{" "}
              for information on how we collect, use, and protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Acceptance of Terms</h2>
            <p className="mt-2">
              By using the Astrevix platform (&quot;Service&quot;), you agree to be bound by these
              Terms of Service. If you do not agree, do not use the Service. These terms apply to all
              users, including business owners and customers who submit content through business
              landing pages.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Intellectual Property</h2>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Our License to You</h3>
            <p className="mt-2">
              We grant you a limited, non-exclusive, non-transferable, revocable license to access and
              use the Service for its intended purpose. All content, trademarks, logos, and
              intellectual property on the Astrevix platform are owned by Astrevix and may not be
              copied, reproduced, or distributed without our written permission.
            </p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Your License to Us</h3>
            <p className="mt-2">
              By submitting a social media post link through the Service, you grant the participating
              business a non-exclusive, royalty-free license to use, share, or repost your submitted
              content for promotional purposes. You retain all ownership rights to your original
              content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Disclaimers</h2>
            <p className="mt-2">
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties
              of any kind, whether express or implied, including but not limited to implied warranties
              of merchantability, fitness for a particular purpose, and non-infringement. Astrevix does
              not warrant that the Service will be uninterrupted, error-free, or secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Indemnification</h2>
            <p className="mt-2">
              You agree to indemnify, defend, and hold harmless Astrevix, its officers, directors,
              employees, and agents from and against any claims, liabilities, damages, losses, or
              expenses (including reasonable attorney&apos;s fees) arising out of or related to your
              use of the Service, your violation of these Terms, or your violation of any rights of
              another party.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Registration &amp; Accounts</h2>
            <p className="mt-2">
              Business owners must create an account to use the Astrevix platform. You are responsible
              for maintaining the confidentiality of your account credentials and for all activities
              that occur under your account. Customers do not need to create an account to submit
              content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. Termination</h2>
            <p className="mt-2">
              We reserve the right to suspend or terminate your access to the Service at any time,
              with or without cause, and with or without notice. Upon termination, your right to use
              the Service will immediately cease. Provisions that by their nature should survive
              termination shall survive.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. Governing Law</h2>
            <p className="mt-2">
              These Terms shall be governed by and construed in accordance with the laws of the United
              States and the state in which Astrevix operates, without regard to conflict of law
              principles. Any disputes arising under these Terms shall be resolved in the appropriate
              courts of that jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">9. Changes to Terms</h2>
            <p className="mt-2">
              We reserve the right to modify these Terms at any time. Changes will be posted on this
              page with an updated effective date. Continued use of the Service after changes
              constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">10. Contact Us</h2>
            <p className="mt-2">
              Astrevix
              <br />
              Email:{" "}
              <a href="mailto:contact@astrevix.com" className="underline hover:text-gray-900">
                contact@astrevix.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          <Link href="/sms" className="underline hover:text-gray-600">SMS Program</Link>
          <span className="mx-2">&middot;</span>
          <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
