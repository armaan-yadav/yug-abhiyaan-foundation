import StatsStrip from "@/components/shared/StatsStrip";
import Slider from "@/components/slider/Slider";
import { Button } from "@/components/ui/button";
import { BookA, Heart, TreeDeciduous } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import treeImage from "../assets/images/backgrounds/1million.webp";
import animalImage from "../assets/images/backgrounds/animal_rescue.webp";
import educationImage from "../assets/images/backgrounds/strongfoundation.webp";
import SponsorTile from "@/components/shared/SponsorTile";
import TopStrip from "@/components/shared/TopStrip";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const GenericSection = ({
  header,
  title,
  subTitle,
  description,
  points,
  ctaText,
  quote,
  stats,
  image,
  imageAlt,
  icon: Icon,
}: {
  header: string;
  title: string;
  subTitle: string;
  description: string;
  points: string[];
  ctaText: string;
  quote: string;
  stats?: { label: string; value: string }[];
  image: StaticImageData | string;
  imageAlt: string;
  icon: React.ComponentType<Record<string, unknown>>;
}) => {
  return (
    <section className="relative pt-20 px-3 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-15">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 flex flex-col items-center">
            {header.split("\n")[0]}
            <span className="block text-brand-light w-fit border-b-2 border-brand-light">
              {header.split("\n")[1]}
            </span>
          </h2>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Image */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl transform ">
              <div className="aspect-[4/3] w-full">
                <Image
                  src={image}
                  alt={imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {title}
              </h3>
              <p className="text-lg font-semibold text-gray-700 leading-relaxed">
                {subTitle}
              </p>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>

            {/* Points */}
            <div className="space-y-4">
              {points.map((text, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-light rounded-full flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-900 transition-colors duration-200">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-brand-light">
              <p className="text-gray-700 italic text-lg">&quot;{quote}&quot;</p>
            </div>

            {/* CTA Button */}
            <div className="flex items-center justify-center">
              <Link href="/contact">
                <Button className="bg-brand-light text-white text-lg px-6 py-6 cursor-pointer hover:bg-brand-light/90">
                  {ctaText}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Row */}
        {stats && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl font-bold text-brand-light">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const EducationSection = () => {
  const sectionData = {
    header: "Building A Strong Foundation\nFor Children",
    title: "Help children with quality education",
    subTitle:
      "People learn basic norms, rules, regulations, and values of society through education.",
    description:
      "Education expands our vision and creates awareness. It helps us develop a disciplined life and provides us with better earning opportunities. It enables us to know the world beyond our own surroundings.",
    points: [
      "Education is the most important tool for the betterment of humanity",
      "It provides the foundation for equity in society",
      "It provides the outcomes needed for individuals, communities, and societies to prosper",
      "Quality education transforms lives and builds stronger communities",
    ],
    ctaText: "Support Education",
    quote: "Education is the most powerful weapon to change the world.",
    stats: [],
    image: educationImage,
    imageAlt: "Children in school uniforms reading together",
    icon: BookA,
  };

  return <GenericSection {...sectionData} />;
};

const TreeSection = () => {
  const sectionData = {
    header: "Mission One Million\nTREES",
    title: "We have planted more than 10,000 trees till now.",
    subTitle:
      "A mature leafy tree produces as much oxygen in a season as 10 people inhale in a year.",
    description:
      "The secret to happiness lies in helping others. Never underestimate the difference YOU can make in the lives of the poor, the abused and the helpless.",
    points: [
      "Trees purify our air and combat climate change",
      "Trees provide housing to millions of species that protect us from disease",
      "Trees protect against floods and water pollution",
      "Trees cool our streets and cities",
    ],
    ctaText: "Plant With Us",
    quote:
      "The best time to plant a tree was 20 years ago. The second best time is now.",
    stats: [
      { value: "10,000+", label: "Trees Planted" },
      { value: "25+", label: "Locations" },
      { value: "85%", label: "Survival Rate" },
      { value: "365", label: "Days Active" },
    ],
    image: treeImage,
    imageAlt: "Tree plantation for environmental conservation",
    icon: TreeDeciduous,
  };

  return <GenericSection {...sectionData} />;
};

const AnimalRescueSection = () => {
  const sectionData = {
    header: "Mission Save Lives\nANIMAL RESCUE",
    title: "We have rescued and rehabilitated over 500 innocent animals.",
    subTitle:
      "Every rescued animal represents a second chance at life, love, and the happiness they deserve.",
    description:
      "Behind every pair of frightened eyes lies a soul waiting for compassion. These voiceless creatures depend on our kindness to survive, heal, and trust again. Your support transforms despair into hope.",
    points: [
      "Emergency medical care for injured and abandoned animals",
      "Safe shelter and nutrition for homeless pets",
      "Rehabilitation programs for traumatized animals",
      "Vaccination and sterilization to prevent overpopulation",
    ],
    ctaText: "Rescue With Us",
    quote:
      "The greatness of a nation can be judged by how it treats its animals.",
    stats: [
      { value: "500+", label: "Animals Rescued" },
      { value: "300+", label: "Successfully Adopted" },
      { value: "24/7", label: "Emergency Care" },
      { value: "100%", label: "Love & Dedication" },
    ],
    image: animalImage,
    imageAlt: "Rescued animals being cared for with love and compassion",
    icon: Heart,
  };

  return <GenericSection {...sectionData} />;
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <TopStrip />
      <Navbar />
      <Slider />
      <AnimalRescueSection />
      <EducationSection />
      <div className="pb-10">
        <TreeSection />
      </div>
      <StatsStrip />
      <SponsorTile />
      <Footer />
    </div>
  );
}
