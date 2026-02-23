import * as React from "react";
import { useTranslation } from "react-i18next";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

/** Page navigation control with previous/next buttons and numbered page links. */
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  const { t } = useTranslation("components");

  return (
    <nav
      role="navigation"
      aria-label={t("pagination.label")}
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

/** Ordered list container holding pagination items. */
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

/** List item wrapper for a single pagination element. */
function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Partial<Pick<React.ComponentProps<typeof Button>, "size">> &
  React.ComponentProps<"a">;

/** Anchor-based page number link with active state styling. */
function PaginationLink({
  className,
  isActive,
  size = "icon",
  children,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={cn(className)}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? "page" : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          {...props}
        >
          {children}
        </a>
      }
    />
  );
}

/** Link to the previous page, rendered with a left chevron icon. */
function PaginationPrevious({
  className,
  text,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  const { t } = useTranslation("components");
  const label = text ?? t("pagination.previous");

  return (
    <PaginationLink
      aria-label={t("pagination.goToPreviousPage")}
      size="default"
      className={cn("pl-2!", className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">{label}</span>
    </PaginationLink>
  );
}

/** Link to the next page, rendered with a right chevron icon. */
function PaginationNext({
  className,
  text,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  const { t } = useTranslation("components");
  const label = text ?? t("pagination.next");

  return (
    <PaginationLink
      aria-label={t("pagination.goToNextPage")}
      size="default"
      className={cn("pr-2!", className)}
      {...props}
    >
      <span className="hidden sm:block">{label}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  );
}

/** Ellipsis indicator representing omitted page numbers. */
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { t } = useTranslation("components");

  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        `flex size-9 items-center justify-center
        [&_svg:not([class*='size-'])]:size-4`,
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">{t("pagination.morePages")}</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
