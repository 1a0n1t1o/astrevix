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
        <p className="mt-2 text-sm text-gray-500">Effective date: March 10, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
          {/* Bold notice */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="font-bold text-gray-900">
              IMPORTANT NOTICE REGARDING TEXT MESSAGING DATA: Astrevix does NOT share customer opt-in
              information, including phone numbers and consent records, with any affiliates or third
              parties for marketing, promotional, or any other purposes unrelated to providing our
              direct services. All text messaging originator opt-in data is kept strictly confidential.
            </p>
          </div>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Information We Collect</h2>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Personal Information:</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Social media post links</li>
              <li>Opt-in records and timestamps for SMS consent</li>
            </ul>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Non-Personal Information:</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device information</li>
              <li>Website usage patterns</li>
              <li>Cookies</li>
            </ul>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Customer Communication:</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Records of submissions</li>
              <li>Reward history</li>
              <li>Support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. How We Use Your Information</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Providing and improving our services</li>
              <li>Processing submissions and delivering reward codes</li>
              <li>Sending transactional SMS notifications about submission status</li>
              <li>Enhancing website functionality and user experience</li>
              <li>Ensuring security and fraud prevention</li>
              <li>Maintaining records of communication preferences and consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. SMS Messaging &amp; Compliance</h2>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Opt-In &amp; Consent</h3>
            <p className="mt-2">
              SMS messages are only sent to users who have explicitly opted in via the submission form
              checkbox. We maintain timestamped records of all opt-in actions. We comply with the
              Telephone Consumer Protection Act (TCPA) and all applicable federal and state laws
              governing text messaging.
            </p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Opt-Out</h3>
            <p className="mt-2">
              You may opt out of SMS messages at any time by replying <strong>STOP</strong> to any
              message. Upon opting out, you will receive a single confirmation message acknowledging
              your request. No further messages will be sent unless you re-opt in through a new
              submission. All opt-out requests are processed immediately.
            </p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Message Frequency &amp; Content</h3>
            <p className="mt-2">
              Message frequency varies based on your submission activity, typically 1&ndash;3 messages
              per submission. All messages are transactional only and may include:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Submission confirmation</li>
              <li>Approval notification with reward code</li>
              <li>Rejection notification</li>
            </ul>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Help &amp; Support</h3>
            <p className="mt-2">
              Reply <strong>HELP</strong> to any message for assistance, or contact us at{" "}
              <a href="mailto:contact@astrevix.com" className="underline hover:text-gray-900">
                contact@astrevix.com
              </a>.
            </p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Carrier Information</h3>
            <p className="mt-2">
              Standard message and data rates may apply. Carriers are not liable for delayed or
              undelivered messages.
            </p>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
              <p className="font-bold text-gray-900">
                SMS Data Protection Statement: No mobile information will be shared with third
                parties/affiliates for marketing/promotional purposes. Information sharing to
                subcontractors in support services, such as customer service, is permitted. All other
                use case categories exclude text messaging originator opt-in data and consent; this
                information will not be shared with any third parties.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Information Sharing &amp; Disclosure</h2>
            <p className="mt-2">
              <strong>
                We do not sell, rent, or trade your personal information to any third party.
              </strong>
            </p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Service Providers</h3>
            <p className="mt-2">
              We share information with third-party vendors who assist in operating our services,
              including SMS delivery via Twilio. All service providers are contractually obligated to
              maintain the confidentiality of your information and may only use it to perform services
              on our behalf.
            </p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Legal Compliance</h3>
            <p className="mt-2">
              We may disclose your information if required by law, regulation, legal process, or
              governmental request, or to protect the rights, property, or safety of Astrevix, our
              users, or the public.
            </p>

            <h3 className="mt-4 text-sm font-semibold text-gray-800">Business Transfers</h3>
            <p className="mt-2">
              In the event of a merger, acquisition, or sale of all or a portion of our assets, your
              information may be transferred as part of that transaction. Your data will remain
              protected under the terms of this Privacy Policy.
            </p>

            <p className="mt-4 font-semibold text-gray-900">
              All above categories exclude text messaging originator opt-in data and consent; this
              information will not be shared with any third parties, excluding aggregators and
              providers of the text message services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Data Security</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Secure access controls and authentication</li>
              <li>Regular security assessments</li>
              <li>
                Breach notification protocols in accordance with applicable laws
              </li>
            </ul>
            <p className="mt-3">
              While we implement industry-standard security measures, no method of transmission over
              the internet or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Cookies &amp; Tracking</h2>
            <p className="mt-2">
              We use cookies and similar tracking technologies to enhance your experience on our
              website. Cookies help us understand usage patterns and improve website functionality.
              You can control cookie preferences through your browser settings. Disabling cookies may
              affect certain features of the website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. Your Rights &amp; Choices</h2>
            <p className="mt-2">You have the right to:</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Access, update, or delete your personal information</li>
              <li>Opt out of SMS messages at any time by replying STOP</li>
              <li>Request information about how your data is processed</li>
              <li>Withdraw consent for data processing at any time</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:contact@astrevix.com" className="underline hover:text-gray-900">
                contact@astrevix.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. Third-Party Links</h2>
            <p className="mt-2">
              Our website may contain links to third-party websites or services. We are not
              responsible for the privacy practices or content of those third-party sites. We
              encourage you to review the privacy policies of any third-party websites you visit.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">9. Changes to This Privacy Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. Changes will be posted on this page
              with a new effective date. Continued use of our services after changes constitutes
              acceptance of the revised policy.
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
          <Link href="/terms" className="underline hover:text-gray-600">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
