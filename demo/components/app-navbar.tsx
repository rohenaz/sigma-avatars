"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { SigmaLogo } from "./sigma-logo";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/playground", label: "Playground" },
  { href: "/examples", label: "Examples" },
  { href: "/api-service", label: "API" },
];

export function AppNavbar() {
  const pathname = usePathname();

  // Adjust once and reuse this value as sticky offsets elsewhere
  const headerHeight = "3.5rem"; // h-14

  // Get current page info for breadcrumbs
  const getCurrentPageInfo = () => {
    switch (pathname) {
      case "/playground":
        return { title: "Playground", showBreadcrumbs: false };
      case "/examples":
        return { title: "Examples", showBreadcrumbs: false };
      case "/api-service":
        return { title: "API", showBreadcrumbs: false };
      default:
        return { title: null, showBreadcrumbs: false };
    }
  };

  const pageInfo = getCurrentPageInfo();

  return (
    <header
      style={{ ["--app-header-h" as any]: headerHeight }}
      className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      {/* Left side: Logo and nav links */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center">
          <SigmaLogo />
        </Link>
        <Separator orientation="vertical" className="h-6" />
        <nav className="hidden md:flex items-center space-x-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Separator */}
      <Separator orientation="vertical" className="mx-2 hidden lg:block h-6" />

      {/* Breadcrumbs */}
      {pageInfo.showBreadcrumbs && (
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="truncate">
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">Sigma Avatars</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageInfo.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Right side: Theme toggle, GitHub, Sidebar trigger */}
      <div className="ml-auto flex items-center gap-2">
        <Link
          href="https://github.com/rohenaz/sigma-avatars"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span className="sr-only">GitHub</span>
        </Link>
        <ModeToggle />
        <SidebarTrigger className="-mr-1 rotate-180" />
      </div>
    </header>
  );
}
