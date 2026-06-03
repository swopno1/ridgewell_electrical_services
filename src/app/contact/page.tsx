import { PublicLayout } from "@/components/layouts/PublicLayout";
import { ExternalLink, Mail, Globe } from "lucide-react";

export const metadata = {
  title: "Contact & Credits",
  description: "Contact information and credits for Ridgewell ES",
};

export default function ContactPage() {
  return (
    <PublicLayout title="Contact & Credits">
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Contact & Credits
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Get in touch and learn about the technology behind Ridgewell ES
          </p>
        </div>

        {/* Application Section */}
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
            About Ridgewell ES
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Ridgewell ES is a modern, comprehensive Employee Timesheet & Leave
            Management System designed to streamline HR operations and provide
            transparent tracking of employee time and leave.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-slate-900 dark:text-white">
                Version:
              </span>
              <p className="text-slate-600 dark:text-slate-400">v0.1.0</p>
            </div>
            <div>
              <span className="font-medium text-slate-900 dark:text-white">
                Platform:
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                Web Application (PWA Ready)
              </p>
            </div>
            <div>
              <span className="font-medium text-slate-900 dark:text-white">
                Built With:
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                Next.js, TypeScript, Tailwind CSS
              </p>
            </div>
            <div>
              <span className="font-medium text-slate-900 dark:text-white">
                Database:
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                PostgreSQL with Prisma ORM
              </p>
            </div>
          </div>
        </div>

        {/* Developer Company Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
            Contact us
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                ViveScript Solutions
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                ViveScript Solutions is a leading software development and
                digital transformation company specializing in custom web
                applications, enterprise solutions, and digital innovation.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.vivescriptsolutions.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium">
                    <Globe className="h-4 w-4" />
                    Visit Website
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </a>

                <a
                  href="https://www.vivescriptsolutions.com/en/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    Send Email
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </a>

                <a
                  href="https://www.vivescriptsolutions.com/en/services"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium">
                    Our Services
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
            Technology Stack
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                Frontend
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Next.js 14+ (React Framework)</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Shadcn UI Components</li>
                <li>• Lucide Icons</li>
                <li>• Date-FNS (Date utilities)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                Backend & Infrastructure
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Next.js API Routes</li>
                <li>• PostgreSQL Database</li>
                <li>• Prisma ORM</li>
                <li>• NextAuth.js</li>
                <li>• Zod (Validation)</li>
                <li>• Email Notifications</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
            Key Features
          </h2>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
              <span>Employee Time Entry & Timesheet Management</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
              <span>Leave Request Management</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
              <span>Interactive Calendar View</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
              <span>Project & Client Management</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
              <span>Advanced Reporting & Analytics</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
              <span>Role-Based Access Control</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
              <span>Email Notifications</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
              <span>Progressive Web App (PWA)</span>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Get in Touch
          </h2>

          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Have questions or need support? Contact ViveScript Solutions:
          </p>

          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <p>
              <strong className="text-slate-900 dark:text-white">
                Website:
              </strong>{" "}
              <a
                href="https://www.vivescriptsolutions.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                https://www.vivescriptsolutions.com/
              </a>
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">
                Contact Form:
              </strong>{" "}
              <a
                href="https://www.vivescriptsolutions.com/en/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                https://www.vivescriptsolutions.com/en/contact
              </a>
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">
                Services:
              </strong>{" "}
              <a
                href="https://www.vivescriptsolutions.com/en/services"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                https://www.vivescriptsolutions.com/en/services
              </a>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
