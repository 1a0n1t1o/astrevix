import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Astrevix",
  description: "Astrevix Privacy Policy — how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FEFCFA]">
      <div className="mx-auto max-w-2xl px-5 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          &larr; Back to Astrevix
        </Link>

        <h1 className="mt-8 text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: March 4, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Introduction</h2>
            <p className="mt-2">
              Astrevix (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates a platform that helps local businesses
              incentivize customers to create and share content in exchange for rewards. This Privacy Policy explains
              how we collect, use, disclose, and protect your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Information We Collect</h2>
            <p className="mt-2">We collect the following types of information:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>First name</strong> &mdash; Used to personalize your reward messages and for the business
                to identify your submission.
              </li>
              <li>
                <strong>Phone number</strong> &mdash; Used to send SMS messages about your submission status
                (confirmation, approval, or rejection) and to deliver your reward.
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
            <p className="mt-3">
              We do <strong>not</strong> require you to create an account. Submissions are anonymous aside from the
              information listed above.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. How We Use Your Information</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>To process and track your content submissions</li>
              <li>To send you SMS messages about your submission status and reward delivery</li>
              <li>To enforce submission limits (one reward per person per business, based on phone number)</li>
              <li>To enable businesses to review submissions and issue rewards</li>
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
              <li>An approval message with your reward details when your submission is approved</li>
              <li>A rejection notice if your submission is not approved</li>
            </ul>
            <p className="mt-3">
              <strong>Message frequency:</strong> Typically 1&ndash;3 messages per submission.
            </p>
            <p className="mt-2">
              <strong>Message and data rates may apply.</strong> Check with your carrier for details.
            </p>
            <p className="mt-2">
              <strong>Opt-out:</strong> Reply <strong>STOP</strong> to any message to stop receiving SMS messages.
              Reply <strong>HELP</strong> for assistance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Third-Party Services</h2>
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
                <strong>Vercel</strong> &mdash; For hosting our website. Standard web server logs may be collected.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Data Retention</h2>
            <p className="mt-2">
              We retain your submission data (name, phone number, post link) for as long as the business account
              is active. SMS logs are retained for operational and compliance purposes. If you wish to have your
              data deleted, please contact us at the email below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. Data Security</h2>
            <p className="mt-2">
              We implement industry-standard security measures to protect your data, including encrypted
              connections (HTTPS), secure database access controls, and row-level security policies. However,
              no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. Your Rights</h2>
            <p className="mt-2">You have the right to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Opt out of SMS messages at any time by replying STOP</li>
              <li>Request access to the personal data we hold about you</li>
              <li>Request deletion of your personal data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">9. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an
              updated revision date. Continued use of our services after changes constitutes acceptance of the
              revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">10. Contact Us</h2>
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
