import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section id="hero" className="card my-8 relative overflow-hidden shadow-md">
      <div className="p-8 md:p-10 lg:p-12 flex flex-col md:flex-row items-start">
        {/* Text content - takes full width on mobile */}
        <div className="w-full lg:w-3/5 z-10">
          <h1 className="text-black dark:text-white text-5xl md:text-7xl font-bold">
            Platform for
            <span className="block text-[#7A7FEE] dark:text-[#7A7FEE]">
              Skill Development
            </span>
          </h1>
          <p className="my-6 text-sm md:text-lg max-w-sm text-gray-700 dark:text-gray-300">
            We build high-quality, scalable platforms—client portals,
            marketplaces, AI automations, and SaaS—using the best tools for the
            job, no shortcuts.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button>
              <Calendar className="mr-1 h-4 w-4" />
              Schedule Discovery Call
            </Button>
            <Button variant="secondary">
              <ArrowRight className="mr-1 h-4 w-4" />
              Learn more
            </Button>
          </div>
        </div>

        {/* Image - hidden on mobile, visible on md and up */}
        <div className="hidden lg:block lg:w-2/5 lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:flex lg:items-center">
          <Image
            src="/brackets.png"
            alt="Purple Wave"
            width={500}
            height={500}
            className="w-full h-auto md:h-full md:w-auto md:object-cover md:object-left invert-0 dark:invert"
          />
        </div>
      </div>
    </section>
  );
}
