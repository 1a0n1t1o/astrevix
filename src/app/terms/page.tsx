import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Terms & Conditions | Astrevix",
  description: "Astrevix Terms & Conditions — rules governing use of our platform.",
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

        <h1 className="mt-8 text-3xl font-bold text-gray-900">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: March 7, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Program Name</h2>
            <p className="mt-2">
              <strong>Astrevix Submission Notifications</strong>
            </p>
            <p className="mt-2">
              Astrevix enables local businesses to collect customer-generated social media content in exchange for
              rewards. Customers scan a QR code or NFC tag, view the business&apos;s branded landing page, post
              content on platforms like TikTok or Instagram, submit their post link, and receive email updates about
              their submission status and reward delivery.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Acceptance of Terms</h2>
            <p className="mt-2">
              By using the Astrevix platform (&quot;Service&quot;), you agree to be bound by these Terms &amp;
              Conditions. If you do not agree, do not use the Service. These terms apply to all users, including
              business owners and customers who submit content through business landing pages.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Customer Submissions</h2>
            <p className="mt-2">By submitting content through a business landing page, you agree that:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Your submitted content is original and publicly posted on the specified social media platform.</li>
              <li>Your content complies with the social media platform&apos;s community guidelines and all applicable laws.</li>
              <li>You provide accurate information including your first name, email address, and a valid post link.</li>
              <li>Only one reward per person per business is allowed unless otherwise stated by the business.</li>
              <li>Duplicate or fraudulent submissions may be rejected without notice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Rewards</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Reward eligibility is at the sole discretion of the business.</li>
              <li>Submitting content does not guarantee a reward.</li>
              <li>Rewards are non-transferable, have no cash value, and may be subject to expiration or additional terms set by the business.</li>
              <li>Reward details and delivery are managed by the individual business, not by Astrevix.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Email Communications</h2>
            <p className="mt-2">
              By providing your email address and consenting to receive email notifications, you agree to the following:
            </p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">What emails you will receive:</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>A submission confirmation email when you submit your content</li>
              <li>An approval notification with your reward details and coupon code when your submission is approved</li>
              <li>Optionally, a status update email if your submission is not approved</li>
            </ul>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Email frequency:</h3>
            <p className="mt-2">
              You may receive up to 3 emails per submission (confirmation, status update, and reward delivery).
            </p>

            <p className="mt-4">
              To unsubscribe from future emails, contact us at{" "}
              <a href="mailto:contact@astrevix.com" className="underline hover:text-gray-900">
                contact@astrevix.com
              </a>.
            </p>

            <p className="mt-2">
              Emails are sent via Resend, a third-party email delivery provider.
            </p>

            <p className="mt-2">
              Consent to receive email is not a condition of making a purchase from any business on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Content Rights</h2>
            <p className="mt-2">
              By submitting your post link, you grant the business a non-exclusive, royalty-free license to use,
              share, or repost your submitted content for promotional purposes. You retain all ownership rights
              to your original content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. Data Collection &amp; Privacy</h2>
            <p className="mt-2">
              We collect your first name, email address, and social media post links to operate the Service.
              Your information is handled in accordance with our{" "}
              <Link href="/privacy" className="underline hover:text-gray-900">
                Privacy Policy
              </Link>
              . We do not share, sell, or rent your personal information to third parties for marketing purposes.
              We use third-party services including Resend (email delivery), Supabase (data storage), Stripe
              (payment processing), and Vercel (hosting).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. Prohibited Conduct</h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Submit fake, misleading, or plagiarized content</li>
              <li>Use someone else&apos;s identity or email address</li>
              <li>Attempt to circumvent submission limits or exploit the reward system</li>
              <li>Use the Service for any unlawful purpose</li>
              <li>Interfere with or disrupt the Service&apos;s infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">9. Limitation of Liability</h2>
            <p className="mt-2">
              Astrevix is not liable for any issues arising from participation, including but not limited to lost
              rewards, content removal by social media platforms, failed email delivery, or actions taken by
              individual businesses. The Service is provided &quot;as is&quot; without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">10. Business Owner Responsibilities</h2>
            <p className="mt-2">Business owners using Astrevix agree to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Honor rewards for approved submissions in a timely manner</li>
              <li>Use customer data only for the purposes described on the platform</li>
              <li>Comply with all applicable laws and regulations, including those governing promotions and email marketing</li>
              <li>Not use the platform for deceptive or fraudulent purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">11. Modifications</h2>
            <p className="mt-2">
              We reserve the right to modify these Terms at any time. Changes will be posted on this page with
              an updated date. Continued use of the Service after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">12. Contact</h2>
            <p className="mt-2">
              Questions about these Terms? Contact us at:{" "}
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
