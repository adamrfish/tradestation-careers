import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerColumns: FooterColumn[] = [
  {
    title: "Why TradeStation",
    links: [
      { label: "Overview", href: "https://www.tradestation.com/why-tradestation/", external: true },
      { label: "Awards & Recognition", href: "https://www.tradestation.com/why-tradestation/awards/", external: true },
      { label: "Press & News", href: "https://www.tradestation.com/press-and-news/", external: true },
      { label: "Careers", href: "https://www.tradestation.com/careers/overview", external: true },
      { label: "ESG & Sustainability", href: "https://www.tradestation.com/esg/overview", external: true },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Overview", href: "https://www.tradestation.com/learn/", external: true },
      { label: "New to trading", href: "https://www.tradestation.com/learn/market-basics/", external: true },
      { label: "Using TradeStation", href: "https://www.tradestation.com/learn/using-tradestation/", external: true },
      { label: "Getting started", href: "https://www.tradestation.com/learn/getting-started/", external: true },
      { label: "Options Education", href: "https://www.tradestation.com/learn/options-education-center/", external: true },
      { label: "Masterclass", href: "https://www.tradestation.com/learn/master-class/", external: true },
      { label: "Events", href: "https://www.tradestation.com/learn/events-list/", external: true },
      { label: "FAQs", href: "https://www.tradestation.com/faqs/", external: true },
      { label: "Retirement Planning", href: "https://www.tradestation.com/learn/retirement-planning/", external: true },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Live chat", href: "#" },
      { label: "Funding instructions", href: "https://www.tradestation.com/accounts/funding-instructions/", external: true },
      { label: "Contact us", href: "https://www.tradestation.com/contact-us/", external: true },
      { label: "Support forum", href: "https://clientcenter.tradestation.com/support/contact/default.aspx", external: true },
      { label: "Call back", href: "#" },
    ],
  },
  {
    title: "Important documents",
    links: [
      { label: "Security center", href: "https://www.tradestation.com/security-center", external: true },
      { label: "Privacy Notice", href: "https://www.tradestation.com/important-information/privacy-notice/", external: true },
      { label: "Accessibility statement", href: "https://www.tradestation.com/important-information/accessibility-statement/", external: true },
      { label: "Agreements & Disclosures", href: "https://www.tradestation.com/important-information/", external: true },
      { label: "Site map", href: "https://www.tradestation.com/sitemap", external: true },
    ],
  },
];

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/TradeStation/", icon: FacebookIcon },
  { name: "X", href: "https://twitter.com/tradestation", icon: XIcon },
  { name: "Instagram", href: "https://www.instagram.com/tradestation/", icon: InstagramIcon },
  { name: "YouTube", href: "https://www.youtube.com/tradestation", icon: YouTubeIcon },
];

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function FooterLinkItem({ link, isDark = false }: { link: FooterLink; isDark?: boolean }) {
  const linkProps = link.external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <li className="leading-normal">
      <Link
        href={link.href}
        className={`text-sm font-medium transition-colors duration-300 ${
          isDark ? "text-white/80 hover:text-[#0089FF]" : "text-[#040d2e] hover:text-[#0089FF]"
        }`}
        {...linkProps}
      >
        {link.label}
      </Link>
    </li>
  );
}

interface FooterProps {
  variant?: "home" | "default";
}

export function Footer({ variant = "default" }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const isDark = variant === "home";

  return (
    <footer>
      {/* Main Footer Links */}
      <div className={`pt-20 pb-5 ${isDark ? "bg-[#0A0B0D] border-t border-[#8A919E]/[0.125]" : "bg-[#f9fafc] border-t border-[#E6E7EA]"}`}>
        <div className="w-[89%] max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className={`font-semibold text-base mb-6 leading-tight ${isDark ? "text-white" : "text-[#040d2e]"}`}>
                  {column.title}
                </h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <FooterLinkItem key={link.label} link={link} isDark={isDark} />
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <Separator className={`my-8 ${isDark ? "bg-[#8A919E]/[0.125]" : "bg-[#E6E7EA]"}`} />

          {/* FINRA and Social Links */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link
              href="https://brokercheck.finra.org/firm/summary/39473"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium hover:text-[#0089FF] transition-colors ${isDark ? "text-white/80" : "text-[#040d2e]"}`}
            >
              FINRA&apos;s BrokerCheck
            </Link>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:text-[#0089FF] transition-colors ${isDark ? "text-white/80" : "text-[#040d2e]"}`}
                  title={`Follow on ${social.name}`}
                >
                  <span className="sr-only">Follow on {social.name}</span>
                  <social.icon className="size-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimers Section */}
      <div className={`px-4 pt-10 pb-20 ${isDark ? "bg-[#08090B]" : "bg-[#f0f1f5]"}`}>
        <div className="w-[89%] max-w-[1200px] mx-auto space-y-4">
          <p className={`text-sm leading-5 ${isDark ? "text-white/70" : "text-[#040d2e]"}`}>
            Past performance, whether actual or indicated by historical tests of strategies, is no guarantee of future performance or success. There is a possibility that you may sustain a loss equal to or greater than your entire investment regardless of which asset class you trade (equities, options, or futures); therefore, you should not invest or risk money that you cannot afford to lose. Online trading is not suitable for all investors. View the document titled{" "}
            <Link
              href="https://www.theocc.com/Company-Information/Documents-and-Archives/Options-Disclosure-Document"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0089FF] hover:underline"
            >
              Characteristics and Risks of Standardized Options.
            </Link>{" "}
            Before trading any asset class, customers must read the relevant risk disclosure statements on our{" "}
            <Link
              href="https://www.tradestation.com/important-information/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0089FF] hover:underline"
            >
              Agreements and Disclosures
            </Link>{" "}
            page. System access and trade placement and execution may be delayed or fail due to market volatility and volume, quote delays, system and software errors, Internet traffic, outages and other factors.
          </p>

          <p className={`text-sm leading-5 ${isDark ? "text-white/70" : "text-[#040d2e]"}`}>
            Securities and futures trading is offered to customers by TradeStation Securities, Inc. (&quot;TradeStation Securities&quot;), a broker-dealer registered with the U.S. Securities and Exchange Commission (SEC) and a futures commission merchant registered with the U.S. Commodity Futures Trading Commission (CFTC). TradeStation Securities is a member of the Financial Industry Regulatory Authority (
            <Link
              href="https://brokercheck.finra.org/firm/summary/39473"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0089FF] hover:underline"
            >
              FINRA
            </Link>
            ), the National Futures Association (
            <Link
              href="https://www.nfa.futures.org/BasicNet/basic-profile.aspx?nfaid=mC3zPjV7mYo%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0089FF] hover:underline"
            >
              NFA
            </Link>
            ), and various exchanges including Cboe, IEX, NYSE, Nasdaq, ICE Futures U.S., and CME Group exchanges.
          </p>

          <p className={`text-sm leading-5 ${isDark ? "text-white/70" : "text-[#040d2e]"}`}>
            TradeStation Securities is a{" "}
            <Link
              href="https://www.sipc.org/list-of-members/?query=tradestation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0089FF] hover:underline"
            >
              member of SIPC
            </Link>
            , which protects securities customers of its members up to $500,000 (including $250,000 for claims for cash). TradeStation Securities&apos; SIPC coverage is available only for securities and for cash held in connection with the purchase or sale of securities, in equities and equities options accounts. Explanatory brochure available upon request or at{" "}
            <Link
              href="https://www.sipc.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0089FF] hover:underline"
            >
              www.sipc.org.
            </Link>
          </p>

          <p className={`text-sm leading-5 ${isDark ? "text-white/70" : "text-[#040d2e]"}`}>
            TradeStation Securities, Inc. and TradeStation Technologies, Inc. are each wholly owned subsidiaries of TradeStation Group, Inc., both operating, and providing products and services, under the TradeStation brand and trademark. When applying for, or purchasing, accounts, subscriptions, products and services, it is important that you know which company you will be dealing with. Please{" "}
            <Link
              href="https://cdn.tradestation.com/uploads/TradeStation-Group-Inc-Companies.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0089FF] hover:underline"
            >
              click here
            </Link>{" "}
            for further important information explaining what this means.
          </p>

          <p className={`text-sm leading-5 ${isDark ? "text-white/70" : "text-[#040d2e]"}`}>
            TradeStation, 8050 SW 10th Street, Plantation, FL 33342, USA.
          </p>

          <p className={`text-sm leading-5 ${isDark ? "text-white/70" : "text-[#040d2e]"}`}>
            © {currentYear} TradeStation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
