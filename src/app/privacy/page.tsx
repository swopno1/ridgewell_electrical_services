import { PublicLayout } from "@/components/layouts/PublicLayout";

export const metadata = {
  title: "Privacy Policy | Ridgewell ES by ViveScript Solutions",
  description: "Privacy Policy for Ridgewell ES. Learn how ViveScript Solutions protects your personal data and maintains GDPR compliance.",
};

export default function PrivacyPage() {
  return (
    <PublicLayout title="Privacy Policy">
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="space-y-6 text-slate-700 dark:text-slate-300">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              1. Introduction
            </h2>
            <p>
              ViveScript Solutions ("we", "our", or "us") operates the Ridgewell
              ES application. This page informs you of our policies regarding
              the collection, use, and disclosure of personal data when you use
              our service and the choices you have associated with that data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              2. Information Collection and Use
            </h2>
            <p>
              We collect several different types of information for various
              purposes to provide and improve our service to you.
            </p>
            <div className="space-y-3 pl-4 border-l-2 border-blue-600 dark:border-blue-400">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Personal Data:
                </h3>
                <p>
                  While using our service, we may ask you to provide us with
                  certain personally identifiable information that can be used
                  to contact or identify you ("Personal Data"). This may
                  include, but is not limited to:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Name and email address</li>
                  <li>Employee ID and role information</li>
                  <li>Time entries and timesheet data</li>
                  <li>Leave request information</li>
                  <li>IP address and browser information</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              3. Use of Data
            </h2>
            <p>Ridgewell ES uses the collected data for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features</li>
              <li>To provide customer support</li>
              <li>
                To gather analysis or valuable information to improve our
                service
              </li>
              <li>To monitor the usage of our service</li>
              <li>To manage employee timesheets and leave requests</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              4. Security of Data
            </h2>
            <p>
              The security of your data is important to us, but remember that no
              method of transmission over the Internet or method of electronic
              storage is 100% secure. While we strive to use commercially
              acceptable means to protect your Personal Data, we cannot
              guarantee its absolute security.
            </p>
            <p>We employ industry-standard security measures including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Database encryption for data at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Regular backups and disaster recovery</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              5. Service Providers
            </h2>
            <p>
              We may employ third-party companies and individuals to facilitate
              our service ("Service Providers"), to provide the service on our
              behalf, to perform service-related services or to assist us in
              analyzing how our service is used.
            </p>
            <p>
              These third parties have access to your Personal Data only to
              perform these tasks on our behalf and are obligated not to
              disclose or use it for any other purpose.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              6. Links to Other Sites
            </h2>
            <p>
              Our service may contain links to other sites that are not operated
              by us. If you click on a third-party link, you will be directed to
              that third party's site. We strongly advise you to review the
              Privacy Policy of every site you visit.
            </p>
            <p>
              We have no control over and assume no responsibility for the
              content, privacy policies or practices of any third-party sites or
              services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              7. Children's Privacy
            </h2>
            <p>
              Our service does not address anyone under the age of 18
              ("Children"). We do not knowingly collect personally identifiable
              information from children under 18. If you are a parent or
              guardian and you are aware that your child has provided us with
              Personal Data, please contact us immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              8. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date at the top of this Privacy
              Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              9. Your Rights
            </h2>
            <p>
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The right to access your personal data</li>
              <li>The right to correct inaccurate data</li>
              <li>The right to request deletion of your data</li>
              <li>The right to restrict processing</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              10. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg mt-3">
              <p className="text-sm">
                <strong>ViveScript Solutions</strong>
                <br />
                Website:{" "}
                <a
                  href="https://www.vivescriptsolutions.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  https://www.vivescriptsolutions.com/
                </a>
                <br />
                Contact:{" "}
                <a
                  href="https://www.vivescriptsolutions.com/en/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  https://www.vivescriptsolutions.com/en/contact
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
