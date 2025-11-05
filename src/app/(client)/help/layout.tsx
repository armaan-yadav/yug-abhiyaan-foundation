"use client";
import {
  Circle,
  GraduationCap,
  HandHeart,
  Heart,
  Leaf,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const helpCategories = [
  {
    name: "Animals",
    href: "/help/animals",
    icon: Heart,
    description: "Animal welfare programs",
    color: "from-orange-400 to-orange-600",
  },
  {
    name: "Elders",
    href: "/help/elders",
    icon: Users,
    description: "Senior care initiatives and community support",
    color: "from-orange-400 to-orange-600",
  },
  {
    name: "Environment",
    href: "/help/environment",
    icon: Leaf,
    description: "Sustainable development and climate action",
    color: "from-orange-400 to-orange-600",
  },
  {
    name: "Poor People",
    href: "/help/poorpeople",
    icon: HandHeart,
    description: "Economic empowerment and social development",
    color: "from-orange-400 to-orange-600",
  },
  {
    name: "Students",
    href: "/help/students",
    icon: GraduationCap,
    description: "Academic excellence and learning opportunities",
    color: "from-orange-400 to-orange-600",
  },
];

const HelpLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const currentCategory = helpCategories.find((cat) =>
    pathname.includes(cat.href.split("/").pop() || "")
  );

  const isMainHelpPage = pathname === "/help";

  const getBreadcrumbText = () => {
    if (isMainHelpPage) return "HELP";
    return currentCategory
      ? `HELP • ${currentCategory.name.toUpperCase()}`
      : "HELP";
  };

  const getHeroTitle = () => {
    if (isMainHelpPage) return "How Can We Help?";
    return currentCategory ? `Help ${currentCategory.name}` : "Help & Support";
  };

  const getHeroDescription = () => {
    if (isMainHelpPage) {
      return "Choose a category below to discover how you can make a meaningful difference in the lives of those who need it most.";
    }
    return (
      currentCategory?.description ||
      "Making a difference together through compassionate action and community support."
    );
  };

  return (
    <div>
      <section className="relative bg-brand-light py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-white">
            {/* Breadcrumb */}
            <nav className="flex items-center mb-8 text-sm font-medium">
              <Link
                href="/"
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                HOME
              </Link>
              <Circle className="w-1 h-1 mx-3 fill-white/50" />
              <span className="text-white">{getBreadcrumbText()}</span>
            </nav>

            <div className="max-w-4xl">
              <h1 className="text-5xl lg:text-7xl font-light mb-8 leading-tight tracking-tight">
                {getHeroTitle()}
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-light max-w-3xl">
                {getHeroDescription()}
              </p>
            </div>
          </div>
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 
  bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70% transparent_110%)]"
        ></div>
      </section>

      <section className=" py-10 px-4 sm:px-6 lg:px-8  relative z-10 ">
        <div className="max-w-7xl mx-auto">
          <div className=" -sm overflow-hidden">{children}</div>
        </div>
      </section>
    </div>
  );
};

export default HelpLayout;
