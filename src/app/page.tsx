import Image from "next/image";
import Link from "next/link";
import { Users, Lightbulb, Handshake } from "lucide-react";
import { CareersHeader } from "@/components/careers-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0B0D]">
      <CareersHeader variant="home" showSubNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#0A0B0D]">
          {/* Text Content */}
          <div className="w-[89%] max-w-[1200px] mx-auto pt-20 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Column - Headline */}
              <div>
                <h1 className="text-4xl md:text-5xl font-medium text-white leading-tight">
                  At Tradestation, we&apos;re born to trade — and born to build.
                </h1>
              </div>

              {/* Right Column - Description */}
              <div>
                <p className="text-lg font-medium text-white/80 leading-relaxed">
                  You will be challenged to innovate beyond what you think is possible.
                  You will collaborate with traders-turned-technologists who&apos;ve spent
                  decades perfecting their craft and expect nothing less than excellence from you.
                  But for those who thrive on continuous improvement and
                  purposeful innovation, this will be the most rewarding work of your career.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              <div className="hidden lg:block"></div>
              <div>
                <Button
                  asChild
                  className="px-8 py-3 h-auto text-base font-medium text-white bg-[#0089FF] rounded-lg hover:bg-[#005bef]"
                >
                  <Link href="/positions">View open roles</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full">
            <div className="relative w-full h-[400px] lg:h-[500px]">
              <Image
                src="/images/hero-trading.jpg"
                alt="TradeStation - Born to Trade"
                fill
                className="object-cover object-[85%_25%] lg:object-[center_25%]"
                priority
              />
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-[#0A0B0D] py-16">
          <div className="w-[89%] max-w-[1200px] mx-auto">
            <p className="text-xl text-white font-medium mb-6">
              We are traders building for traders.
            </p>
            <p className="text-xl text-white/90 mb-6">
              We believe that{" "}
              <Link
                href="https://www.tradestation.com/platforms-and-tools/"
                className="text-[#0089FF] hover:underline"
              >
                professional-grade trading technology
              </Link>{" "}
              should be accessible to every individual, not just institutions.
            </p>
            <p className="text-xl text-white/90 mb-12">
              We believe in empowering self-directed traders, democratizing market access, providing
              transparent execution, and delivering the tools that level the playing field between Main Street
              and Wall Street. Let&apos;s deliver the ultimate trading experience to millions of traders who refuse to
              settle.
            </p>

            <div className="border-t border-[#8A919E]/[0.125] pt-12 mt-4">
              <h2 className="text-3xl font-normal text-white mb-8">
                Welcome to Tradestation.
              </h2>
            </div>

            {/* Three Value Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-4">
              <div className="bg-[#32353D] rounded-lg p-10">
                <Users className="size-8 text-[#0089FF] mb-6" />
                <h3 className="text-lg text-white font-semibold mb-3">Traders first</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Every decision we make starts with a simple question: does this help traders win? We don&apos;t
                  just build for traders—we are traders, and we obsess over delivering the institutional-grade
                  tools and execution that self-directed investors deserve.
                </p>
              </div>
              <div className="bg-[#32353D] rounded-lg p-10">
                <Lightbulb className="size-8 text-[#0089FF] mb-6" />
                <h3 className="text-lg text-white font-semibold mb-3">Relentless Innovation</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  For over 40 years, we&apos;ve pushed the boundaries of what&apos;s possible in trading
                  technology. We embrace continuous improvement and purposeful innovation
                  because the markets never stop evolving, and neither do we.
                </p>
              </div>
              <div className="bg-[#32353D] rounded-lg p-10">
                <Handshake className="size-8 text-[#0089FF] mb-6" />
                <h3 className="text-lg text-white font-semibold mb-3">Honor Your Commitments</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  In trading and in life, your word is your edge. We act with integrity, deliver on our promises,
                  and collaborate with the shared mission of creating the ultimate trading experience for
                  every client who trusts us with their trades.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#0A0B0D] border-t border-[#8A919E]/[0.125]">
          <div className="w-[89%] max-w-[900px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <h2 className="text-3xl lg:text-4xl font-normal text-white leading-tight">
              Join us in our mission to<br />
              level the playing field<br />
              for every trader.
            </h2>
            <Button
              asChild
              className="px-8 py-3.5 h-auto text-base font-medium text-white bg-[#0089FF] rounded-lg hover:bg-[#005bef] w-fit"
            >
              <Link href="/positions">View open roles</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer variant="home" />
    </div>
  );
}
