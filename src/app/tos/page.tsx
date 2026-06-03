import { PublicLayout } from "@/components/layouts/PublicLayout";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Ridgewell ES",
};

export default function TermsOfServicePage() {
  return (
    <PublicLayout title="Terms of Service">
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Ridgewell ES, you accept and agree to be
              bound by the terms and provision of this agreement. If you do not
              agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              2. License Grant
            </h2>
            <p>
              Ridgewell ES grants you a limited, non-exclusive, non-transferable
              license to access and use the system for the purpose of managing
              employee timesheets and leave. This license does not include the
              right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the system</li>
              <li>Rent, lease, or lend the system</li>
              <li>Transfer rights to the system</li>
              <li>Reverse engineer or attempt to extract the source code</li>
              <li>Remove or alter any proprietary notices</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              3. User Responsibilities
            </h2>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your login credentials</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>
                Ensuring all information you provide is accurate and complete
              </li>
              <li>Complying with all applicable laws and regulations</li>
              <li>Not engaging in any unlawful or prohibited activities</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              4. Data Protection
            </h2>
            <p>
              We are committed to protecting your data. All information is
              stored securely and handled in accordance with our Privacy Policy.
              You agree that you have reviewed our Privacy Policy and understand
              our data handling practices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              5. Limitation of Liability
            </h2>
            <p>
              Ridgewell ES is provided "as is" without any warranties. In no
              event shall ViveScript Solutions, the developers, or any related
              parties be liable for any indirect, incidental, special, or
              consequential damages arising from the use or inability to use the
              system.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              6. Acceptable Use Policy
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access or use the system for any illegal purpose</li>
              <li>
                Interfere with the security or functionality of the system
              </li>
              <li>Attempt to gain unauthorized access</li>
              <li>Transmit viruses or harmful code</li>
              <li>Harass, threaten, or defame others</li>
              <li>Violate any intellectual property rights</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              7. Modifications to Service
            </h2>
            <p>
              We reserve the right to modify, suspend, or discontinue the
              service at any time. We will make reasonable efforts to notify
              users of significant changes, but are not obligated to do so.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              8. Intellectual Property
            </h2>
            <p>
              All content, features, and functionality of Ridgewell ES are owned
              by ViveScript Solutions, its licensors, or other providers of such
              material. Your use of the system does not grant you ownership of
              any intellectual property rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              9. Termination
            </h2>
            <p>
              We may terminate your access to the system at any time, with or
              without notice, if you violate these terms or for any other
              reason. Upon termination, your right to use the system ceases
              immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              10. Governing Law
            </h2>
            <p>
              These terms and conditions are governed by and construed in
              accordance with the laws applicable in your jurisdiction, and you
              irrevocably submit to the exclusive jurisdiction of the courts in
              that location.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              11. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact ViveScript Solutions:
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
