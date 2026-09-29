"use client";

import React from "react";
import { format, isAfter, parseISO, startOfDay } from "date-fns";
import { AlertTriangle, ArrowUpRight, Mail } from "lucide-react";
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
  const { enabled, amountDue, dueDate, paymentTermsDays } =
    appConfig.paymentNotice;
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
  const supportEmail = appConfig.email.supportEmail;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) acknowledge();
      }}
    >
      <AlertDialogContent className="data-[size=default]:sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <AlertTriangle aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-lg font-semibold text-slate-950 dark:text-white">
            {isOverdue ? "Payment overdue" : "Payment reminder"}
          </AlertDialogTitle>
          <AlertDialogDescription
            render={<div />}
            className="space-y-3 text-left text-sm leading-6 text-slate-700 dark:text-slate-300"
          >
            <p>
              An outstanding balance of{" "}
              <strong className="text-slate-950 dark:text-white">
                {amountDue}
              </strong>{" "}
              remains for the development of {appConfig.app.name}.
            </p>
            <p>
              {isOverdue ? (
                <>
                  Payment was due by{" "}
                  <strong className="text-slate-950 dark:text-white">
                    {dueLabel}
                  </strong>
                  . Please arrange payment as soon as possible.
                </>
              ) : (
                <>
                  Please arrange payment within {paymentTermsDays} days, by{" "}
                  <strong className="text-slate-950 dark:text-white">
                    {dueLabel}
                  </strong>
                  .
                </>
              )}{" "}
              Until the balance is settled, please do not resell,
              redistribute, or deploy the software for other parties.
            </p>
            <p>
              If you have already paid or have questions about this invoice,
              contact us at{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="font-medium text-blue-700 dark:text-blue-300"
              >
                {supportEmail}
              </a>
              .
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <a
            href={appConfig.developer.contact}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Mail aria-hidden="true" className="h-4 w-4" />
            Contact billing
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
