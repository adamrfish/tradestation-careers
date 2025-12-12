"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SubMenuItem {
  label: string;
  href: string;
  external?: boolean;
}

interface MenuItem {
  label: string;
  href: string;
  submenu?: SubMenuItem[];
}

const mainMenuItems: MenuItem[] = [
  {
    label: "Trading Products",
    href: "https://www.tradestation.com/trading-products/",
    submenu: [
      { label: "Overview", href: "https://www.tradestation.com/trading-products/" },
      { label: "Stocks", href: "https://www.tradestation.com/trading-products/stocks/" },
      { label: "Options", href: "https://www.tradestation.com/trading-products/options/" },
      { label: "Futures", href: "https://www.tradestation.com/trading-products/futures/" },
      { label: "ETFs", href: "https://www.tradestation.com/trading-products/etfs/" },
    ],
  },
  {
    label: "Platforms & Tools",
    href: "https://www.tradestation.com/platforms-and-tools/",
    submenu: [
      { label: "Desktop", href: "https://www.tradestation.com/platforms-and-tools/desktop/" },
      { label: "Web Trading", href: "https://www.tradestation.com/platforms-and-tools/web-trading/" },
      { label: "Mobile Apps", href: "https://www.tradestation.com/platforms-and-tools/mobile-apps/" },
      { label: "API", href: "https://www.tradestation.com/platforms-and-tools/trading-api/" },
    ],
  },
  {
    label: "Accounts",
    href: "https://www.tradestation.com/accounts/",
    submenu: [
      { label: "Individual & Joint", href: "https://www.tradestation.com/accounts/individual-and-joint/" },
      { label: "Retirement", href: "https://www.tradestation.com/accounts/retirement/" },
      { label: "Entity", href: "https://www.tradestation.com/accounts/entity/" },
    ],
  },
  {
    label: "Pricing",
    href: "https://www.tradestation.com/pricing/",
    submenu: [
      { label: "Commissions", href: "https://www.tradestation.com/pricing/" },
      { label: "Margin Rates", href: "https://www.tradestation.com/pricing/margin-rates/" },
    ],
  },
  {
    label: "Learn",
    href: "https://www.tradestation.com/learn/",
    submenu: [
      { label: "New to Trading", href: "https://www.tradestation.com/learn/market-basics/" },
      { label: "Using TradeStation", href: "https://www.tradestation.com/learn/using-tradestation/" },
      { label: "FAQs", href: "https://www.tradestation.com/faqs" },
    ],
  },
  {
    label: "Insights",
    href: "https://www.tradestation.com/insights/",
    submenu: [
      { label: "Market Insights", href: "https://www.tradestation.com/insights/" },
      { label: "Insights AI", href: "https://www.tradestation.com/insights-ai/" },
    ],
  },
];

const careersSubNav = [
  { label: "Overview", href: "https://www.tradestation.com/careers/overview/", external: true },
  { label: "Our company", href: "https://www.tradestation.com/why-tradestation/", external: true },
  { label: "ESG & Sustainability", href: "https://www.tradestation.com/esg/overview", external: true },
  { label: "Explore Jobs", href: "/positions" },
];

function DesktopMenuItem({ item, isDark = true }: { item: MenuItem; isDark?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors outline-none whitespace-nowrap ${
          isDark ? "text-white hover:text-white/80" : "text-[#040D2E] hover:text-[#0089FF]"
        }`}>
          {item.label}
          {item.submenu && <ChevronDown className="h-4 w-4" />}
        </button>
      </DropdownMenuTrigger>
      {item.submenu && (
        <DropdownMenuContent align="start" className="min-w-[200px]">
          {item.submenu.map((subItem) => (
            <DropdownMenuItem key={subItem.label} asChild>
              <Link
                href={subItem.href}
                target={subItem.external ? "_blank" : undefined}
                rel={subItem.external ? "noopener noreferrer" : undefined}
                className="cursor-pointer"
              >
                {subItem.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}

function MobileMenuItem({ item, onClose, isDark = true }: { item: MenuItem; onClose: () => void; isDark?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border-b ${isDark ? "border-[#8A919E]/[0.125]" : "border-[#E6E7EA]"}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium ${isDark ? "text-white" : "text-[#040D2E]"}`}
      >
        {item.label}
        {item.submenu && (
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        )}
      </button>
      {item.submenu && isOpen && (
        <div className={`pb-2 ${isDark ? "bg-[#08090B]" : "bg-[#f9fafc]"}`}>
          {item.submenu.map((subItem) => (
            <Link
              key={subItem.label}
              href={subItem.href}
              target={subItem.external ? "_blank" : undefined}
              rel={subItem.external ? "noopener noreferrer" : undefined}
              onClick={onClose}
              className={`block px-6 py-2 text-sm transition-colors ${isDark ? "text-white/70 hover:text-white" : "text-[#666] hover:text-[#040D2E]"}`}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

interface CareersHeaderProps {
  variant?: "home" | "default";
  showSubNav?: boolean;
}

export function CareersHeader({ variant = "default", showSubNav = false }: CareersHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Hiring Banner */}
      <div className={`text-center py-2 border-b ${variant === "home" ? "bg-[#0A0B0D] border-[#8A919E]/[0.125]" : "bg-[#000730] border-[#8A919E]/[0.125]"}`}>
        <p className="text-sm font-medium text-white">
          TradeStation is hiring!
        </p>
      </div>

      {/* Main Navigation */}
      <div className={variant === "home" ? "bg-[#0A0B0D]" : "bg-white border-b border-[#E6E7EA]"}>
        <div className="w-[89%] max-w-[1200px] mx-auto">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="https://www.tradestation.com/" className="flex-shrink-0">
              <Image
                src="/images/logo-1.svg"
                alt="TradeStation"
                width={140}
                height={20}
                className={`h-5 w-auto ${variant === "home" ? "brightness-0 invert" : ""}`}
                style={variant !== "home" ? { filter: "brightness(0) saturate(100%) invert(33%) sepia(98%) saturate(1497%) hue-rotate(190deg) brightness(101%) contrast(101%)" } : undefined}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center">
              {mainMenuItems.map((item) => (
                <DesktopMenuItem key={item.label} item={item} isDark={variant === "home"} />
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex lg:items-center lg:gap-3 shrink-0">
              <Button
                asChild
                className={`px-5 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
                  variant === "home"
                    ? "text-[#0A0B0D] bg-[#EEF0F3] hover:bg-[#E0E2E5]"
                    : "text-[#040D2E] bg-[#EEF0F3] hover:bg-[#E0E2E5]"
                }`}
              >
                <Link href="https://my.tradestation.com/">Sign in</Link>
              </Button>
              <Button
                asChild
                className="px-5 py-2 text-sm font-medium text-white bg-[#0089FF] rounded-lg hover:bg-[#005bef] whitespace-nowrap"
              >
                <Link href="https://www.tradestation.com/open-account/">Open account</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={`lg:hidden ${variant === "home" ? "text-white hover:bg-white/10" : "text-[#040D2E] hover:bg-gray-100"}`}>
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className={`w-full sm:max-w-md p-0 ${variant === "home" ? "bg-[#0A0B0D] border-l-[#8A919E]/[0.125]" : "bg-white border-l-[#E6E7EA]"}`}>
                <SheetHeader className={`border-b p-4 ${variant === "home" ? "border-[#8A919E]/[0.125]" : "border-[#E6E7EA]"}`}>
                  <div className="flex items-center justify-between">
                    <SheetTitle className={variant === "home" ? "text-white" : "text-[#040D2E]"}>Menu</SheetTitle>
                    <SheetClose className={`rounded-sm opacity-70 transition-opacity hover:opacity-100 ${variant === "home" ? "text-white" : "text-[#040D2E]"}`}>
                      <X className="size-5" />
                      <span className="sr-only">Close</span>
                    </SheetClose>
                  </div>
                </SheetHeader>
                <div className="overflow-y-auto">
                  {mainMenuItems.map((item) => (
                    <MobileMenuItem
                      key={item.label}
                      item={item}
                      onClose={() => setMobileMenuOpen(false)}
                      isDark={variant === "home"}
                    />
                  ))}
                  <div className={`border-t p-4 space-y-3 ${variant === "home" ? "border-[#8A919E]/[0.125]" : "border-[#E6E7EA]"}`}>
                    <Button
                      asChild
                      className="w-full px-5 py-2.5 text-sm font-medium text-[#0A0B0D] bg-[#EEF0F3] rounded-lg hover:bg-[#E0E2E5]"
                    >
                      <Link href="https://my.tradestation.com/">Sign in</Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full px-5 py-2.5 text-sm font-medium text-white bg-[#0089FF] rounded-lg hover:bg-[#005bef]"
                    >
                      <Link href="https://www.tradestation.com/open-account/">Open account</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Careers Sub Navigation - Only on homepage */}
      {showSubNav && (
        <div className="bg-[#0A0B0D] border-y border-[#8A919E]/[0.125] overflow-x-auto">
          <div className="w-[89%] max-w-[1200px] mx-auto">
            <div className="flex h-14 items-center gap-8 whitespace-nowrap">
              <span className="text-white text-lg font-medium shrink-0">Careers</span>
              <nav className="flex items-center gap-6">
                {careersSubNav.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="text-sm font-medium text-white hover:text-white/80 transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
