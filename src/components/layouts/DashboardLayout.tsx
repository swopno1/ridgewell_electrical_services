"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowUpRight, Bell } from "lucide-react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import Link from "next/link";

export function DashboardLayout({
  children,
  userRole = "EMPLOYEE",
  userName = "Employee User",
  userEmail = "employee@example.com",
}: {
  children: React.ReactNode;
  userRole?: string;
  userName?: string;
  userEmail?: string;
}) {
  const pathname = usePathname();
  const [isNoticeOpen, setIsNoticeOpen] = React.useState(false);

  React.useEffect(() => {
    setIsNoticeOpen(
      window.sessionStorage.getItem("workroster-notice-dismissed") !== "true",
    );
  }, []);

  const acknowledgeNotice = () => {
    window.sessionStorage.setItem("workroster-notice-dismissed", "true");
    setIsNoticeOpen(false);
  };

  // Build breadcrumb items based on path
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { href, label };
  });

  return (
    <SidebarProvider>
      <div className="relative isolate min-h-screen">
        <div
          aria-hidden={isNoticeOpen}
          inert={isNoticeOpen}
          className={`flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 ${isNoticeOpen ? "select-none blur-sm" : ""}`}
        >
          <AppSidebar
            userRole={userRole}
            userName={userName}
            userEmail={userEmail}
          />

          <SidebarInset className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 md:px-6">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <SidebarSeparator className="mx-2 h-4" />
                <Breadcrumb className="hidden sm:block">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="/dashboard"
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      >
                        Home
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {breadcrumbs.map((breadcrumb, index) => {
                      const isLast = index === breadcrumbs.length - 1;
                      return (
                        <React.Fragment key={breadcrumb.href}>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem>
                            {isLast ? (
                              <BreadcrumbPage>
                                {breadcrumb.label}
                              </BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink
                                href={breadcrumb.href}
                                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                              >
                                {breadcrumb.label}
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                        </React.Fragment>
                      );
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="https://www.workroster.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                >
                  WorkRoster
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=net.workroster.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                >
                  Android app
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
                <span className="text-xs text-slate-500 hidden md:block">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-600" />
                </Button>
              </div>
            </header>

            <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
          </SidebarInset>
        </div>

        {isNoticeOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-white/65 p-4 backdrop-blur-[2px] dark:bg-black/65 sm:p-8">
            <section
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="access-notice-title"
              aria-describedby="access-notice-description"
              className="my-auto w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-10"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                <AlertTriangle aria-hidden="true" className="h-6 w-6" />
              </div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Service notice
              </p>
              <h1
                id="access-notice-title"
                className="text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl"
              >
                Access suspended
              </h1>
              <div
                id="access-notice-description"
                className="mt-5 space-y-4 text-base leading-7 text-slate-700 dark:text-slate-300"
              >
                <p>
                  Due to an outstanding payment for this code, its use is no
                  longer authorized. If you have resold or deployed the code for
                  others, please{" "}
                  <Link
                    href="https://www.workroster.net/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-700 underline underline-offset-2 dark:text-blue-300"
                  >
                    contact us
                  </Link>{" "}
                  to migrate your existing data to WorkRoster, our SaaS
                  application, for $1 per member per month.
                </p>
                <p>
                  This subscription may not recover the full unpaid balance, but
                  it may help offset some of the loss.
                </p>
                <p>
                  The WorkRoster Android app is also available on Google Play.
                  You can continue using this app after acknowledging this
                  notice.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.workroster.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 dark:focus-visible:outline-white"
                >
                  Visit WorkRoster
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=net.workroster.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Google Play app
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
              <Button
                type="button"
                className="mt-6 w-full sm:w-auto"
                onClick={acknowledgeNotice}
              >
                I understand
              </Button>
            </section>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}
