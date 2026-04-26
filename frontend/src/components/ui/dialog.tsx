"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "./utils";

/* ROOT */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/* TRIGGER */
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/* PORTAL */
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/* CLOSE */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/* OVERLAY */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        className
      )}
      {...props}
    />
  );
}

/* CONTENT (🔥 PROPER CENTER + WIDE FIX) */
function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />

      {/* CENTER WRAPPER */}
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          /* FIXED CENTERING USING FLEX (NO TRANSLATE BUG) */
          "fixed inset-0 z-50 flex items-center justify-center p-6",

          className
        )}
        {...props}
      >
        {/* INNER MODAL BOX */}
        <div
          className={cn(
            "bg-background relative",
            "w-[95vw] h-[95vh]",
            "max-w-none",
            "rounded-xl border shadow-2xl",
            "overflow-hidden",
            "flex flex-col"
          )}
        >
          {children}

          {/* CLOSE BUTTON */}
          <DialogClose className="absolute right-4 top-4 rounded-md opacity-70 hover:opacity-100 transition">
            <XIcon className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/* HEADER */
function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-2 border-b px-6 py-4",
        className
      )}
      {...props}
    />
  );
}

/* FOOTER */
function DialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t px-6 py-4",
        className
      )}
      {...props}
    />
  );
}

/* TITLE */
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg font-semibold leading-none",
        className
      )}
      {...props}
    />
  );
}

/* DESCRIPTION */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};