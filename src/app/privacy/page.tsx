import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Privacy Policy | Astrevix",
  description: "Astrevix Privacy Policy — how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
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

        <h1 className="mt-8 text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: March 7, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Introduction</h2>
            <p className="mt-2">
              Astrevix (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates a platform that helps local businesses
              incentivize customers to create and share content in exchange for rewards. This Privacy Policy explains
              how we collect, use, disclose, and protect your information when you use our website and services.
            </p>
            <p className="mt-2">
              For questions about this policy, contact us at:{" "}
              <a href="mailto:contact@astrevix.com" className="underline hover:text-gray-900">
                contact@astrevix.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Information We Collect</h2>
            <p className="mt-2">We collect the following types of information:</p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">From Customers (content submitters):</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Customer name</strong> &mdash; Used to personalize reward messages and identify submissions.
              </li>
              <li>
                <strong>Phone number</strong> &mdash; Used solely to send SMS notifications about submission status
                (confirmation, approval with reward details, rejection). Phone numbers are used exclusively for
                transactional communication related to the customer&apos;s submission.
              </li>
              <li>
                <strong>Social media post links</strong> &mdash; The URLs you submit (e.g., Instagram, TikTok)
                are stored so the business can review your content.
              </li>
              <li>
                <strong>Platform detection data</strong> &mdash; We automatically detect which social media platform
                your link belongs to for display purposes.
              </li>
            </ul>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">From Business Owners:</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Name and email address</strong> &mdash; Used for account authentication and communication.
              </li>
              <li>
                <strong>Business information</strong> &mdash; Business name, description, logo, brand colors, and
                reward details used to create branded landing pages.
              </li>
              <li>
                <strong>Payment information</strong> &mdash; Processed securely by Stripe; we do not store credit
                card numbers.
              </li>
            </ul>

            <p className="mt-3">
              Customer submissions are anonymous aside from the information listed above. No account creation
              is required for customers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. How We Use Your Information</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>To process and track content submissions</li>
              <li>To send SMS messages about submission status and reward delivery</li>
              <li>To enforce submission limits (one reward per person per business, based on phone number)</li>
              <li>To enable businesses to review submissions and issue rewards</li>
              <li>To generate and deliver coupon codes for approved submissions</li>
              <li>To improve our services and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. SMS Messaging</h2>
            <p className="mt-2">
              By providing your phone number and checking the consent box, you agree to receive SMS messages from
              Astrevix on behalf of the business. These messages may include:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>A confirmation message when you submit your content</li>
              <li>An approval message with your reward details and coupon code when your submission is approved</li>
              <li>A rejection notice if your submission is not approved</li>
            </ul>
            <p className="mt-3">
              <strong>Message frequency:</strong> You may receive up to 3 SMS messages per submission
              (confirmation, status update, and reward delivery).
            </p>
            <p className="mt-2">
              <strong>Message and data rates may apply.</strong>
            </p>
            <p className="mt-2">
              <strong>Opt-out:</strong> Reply <strong>STOP</strong> to any message to opt out of all future SMS
              communications from this number. You will receive a confirmation message upon opting out.
            </p>
            <p className="mt-2">
              <strong>Help:</strong> Reply <strong>HELP</strong> for support or contact us at{" "}
              <a href="mailto:contact@astrevix.com" className="underline hover:text-gray-900">
                contact@astrevix.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Information Sharing</h2>
            <p className="mt-2">
              <strong>
                We do not share, sell, or rent your phone number or personal information to third parties for
                marketing purposes.
              </strong>
            </p>
            <p className="mt-2">
              We only share your information with the specific business you submitted content to (so they can
              review your submission and issue your reward) and with the third-party service providers listed
              below, solely to operate the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Third-Party Services</h2>
            <p className="mt-2">We use the following third-party services to operate our platform:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Twilio</strong> &mdash; For sending SMS messages. Your phone number and message content are
                shared with Twilio to deliver text messages. See{" "}
                <a
                  href="https://www.twilio.com/en-us/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-900"
                >
                  Twilio&apos;s Privacy Policy
                </a>.
              </li>
              <li>
                <strong>Supabase</strong> &mdash; For secure data storage and authentication. Your submission data
                is stored in Supabase&apos;s cloud infrastructure.
              </li>
              <li>
                <strong>Stripe</strong> &mdash; For payment processing. Business owner payment information is
                handled by Stripe. See{" "}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-900"
                >
                  Stripe&apos;s Privacy Policy
                </a>.
              </li>
              <li>
                <strong>Vercel</strong> &mdash; For hosting our website. Standard web server logs may be collected.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. Data Retention</h2>
            <p className="mt-2">
              We retain customer submission data (name, phone number, post link, coupon codes) for as long as the
              associated business account is active or for up to 2 years after account deletion, whichever is shorter.
              SMS logs are retained for up to 1 year for operational and compliance purposes. If you wish to have
              your data deleted sooner, please contact us at{" "}
              <a href="mailto:contact@astrevix.com" className="underline hover:text-gray-900">
                contact@astrevix.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. Data Security</h2>
            <p className="mt-2">
              We implement industry-standard security measures to protect your data, including encrypted
              connections (HTTPS), secure database access controls, and row-level security policies. However,
              no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">9. Your Rights</h2>
            <p className="mt-2">You have the right to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Opt out of SMS messages at any time by replying STOP to any message</li>
              <li>Request access to the personal data we hold about you</li>
              <li>Request deletion of your personal data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:contact@astrevix.com" className="underline hover:text-gray-900">
                contact@astrevix.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">10. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an
              updated revision date. Continued use of our services after changes constitutes acceptance of the
              revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">11. Contact Us</h2>
            <p className="mt-2">
              If you have questions about this Privacy Policy or wish to exercise your rights, contact us at:{" "}
              <a href="mailto:contact@astrevix.com" className="underline hover:text-gray-900">
                contact@astrevix.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          <Link href="/terms" className="underline hover:text-gray-600">Terms &amp; Conditions</Link>
          {" | "}
          <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
