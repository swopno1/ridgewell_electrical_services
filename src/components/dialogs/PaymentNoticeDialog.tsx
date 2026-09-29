"use client";

import React from "react";
import { format, isAfter, parseISO, startOfDay } from "date-fns";
import { AlertTriangle, ArrowUpRight, Check, MessageSquare } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { appConfig } from "@/lib/config";

const STORAGE_KEY = "workroster-payment-notice-dismissed";

export function PaymentNoticeDialog() {
  const {
    enabled,
    amountDue,
    dueDate,
    paymentTermsDays,
    workrosterPrice,
    androidAppUrl,
  } = appConfig.paymentNotice;
  const [open, setOpen] = React.useState(false);

  // Show at most once per day per browser.
  const today = format(new Date(), "yyyy-MM-dd");

  React.useEffect(() => {
    if (!enabled) return;
    try {
      setOpen(window.localStorage.getItem(STORAGE_KEY) !== today);
    } catch {
      setOpen(true);
    }
  }, [enabled, today]);

  const acknowledge = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, today);
    } catch {
      // Storage unavailable (private mode) — notice will simply show again.
    }
    setOpen(false);
  };

  if (!enabled) return null;

  const due = parseISO(dueDate);
  const isOverdue = isAfter(startOfDay(new Date()), due);
  const dueLabel = format(due, "d MMMM yyyy");

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) acknowledge();
      }}
    >
      <AlertDialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto data-[size=default]:sm:max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <AlertTriangle aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-lg font-semibold text-slate-950 dark:text-white">
            Please choose how to continue
          </AlertDialogTitle>
          <AlertDialogDescription
            render={<div />}
            className="space-y-3 text-left text-sm leading-6 text-slate-700 dark:text-slate-300"
          >
            <p>
              This deployment runs a pre-release build of {appConfig.app.name}{" "}
              provided for testing, and a balance of{" "}
              <strong className="text-slate-950 dark:text-white">{amountDue}</strong> remains
              for the development work completed so far. There are two ways to
              resolve this.{" "}
              {isOverdue ? (
                <>
                  The requested date of{" "}
                  <strong className="text-slate-950 dark:text-white">{dueLabel}</strong> has
                  passed, so please let us know your choice as soon as possible.
                </>
              ) : (
                <>
                  Please let us know your choice within {paymentTermsDays}{" "}
                  days, by <strong className="text-slate-950 dark:text-white">{dueLabel}</strong>.
                </>
              )}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border-2 border-blue-600 bg-blue-50/60 p-4 dark:border-blue-400 dark:bg-blue-950/30">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                  Recommended
                </p>
                <p className="mt-1 font-semibold text-slate-950 dark:text-white">
                  Move to WorkRoster
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {workrosterPrice} — replaces the outstanding balance
                </p>
                <ul className="mt-3 space-y-1.5">
                  {[
                    "All new and updated features",
                    "Android app on Google Play",
                    "Managed hosting and updates",
                    "Help migrating your existing data",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check
                        aria-hidden="true"
                        className="mt-1 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={androidAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300"
                >
                  View the Android app
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  One-off payment
                </p>
                <p className="mt-1 font-semibold text-slate-950 dark:text-white">
                  Keep the current build
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {amountDue} to settle the balance
                </p>
                <ul className="mt-3 space-y-1.5">
                  {[
                    "Continue using this build as it is",
                    "No new WorkRoster features or updates",
                    "No access to the WorkRoster apps",
                    "Not to be resold or deployed for other parties",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-slate-400"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p>
              Use our contact form to choose an option or ask any questions —
              we are happy to agree an arrangement that works for you.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <a
            href={appConfig.developer.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Explore WorkRoster
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
          <a
            href={appConfig.developer.contact}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <MessageSquare aria-hidden="true" className="h-4 w-4" />
            Contact us
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
          <AlertDialogAction onClick={acknowledge} autoFocus>
            I understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
