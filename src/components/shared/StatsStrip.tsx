"use client";
import { Dog, Handshake, LucideIcon, TreeDeciduous, User } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Stat {
  label: string;
  number: string;
  icon: LucideIcon;
}

const stats: Stat[] = [
  { label: "Volunteers around India", number: "100", icon: Handshake },
  { label: "Animals Rescued", number: "200", icon: Dog },
  { label: "People Impacted", number: "1300", icon: User },
  { label: "Trees Planted", number: "1000", icon: TreeDeciduous },
];

interface AnimatedNumberProps {
  target: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ target }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const targetNum = parseInt(target);
    const duration = 1000;
    const increment = targetNum / (duration / 16);

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNum) {
        setCount(targetNum);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
};

const StatsStrip: React.FC = () => {
  return (
    <div className="relative w-full bg-gradient-to-br bg-brand-light py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat: Stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center text-white">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  <AnimatedNumber target={stat.number} />+
                </div>
                <div className="opacity-90">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="absolute inset-0 
  bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70% transparent_110%)]"
      ></div>
    </div>
  );
};

export default StatsStrip;
