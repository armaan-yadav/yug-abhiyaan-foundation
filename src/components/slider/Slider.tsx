"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useState } from "react";
import slider1 from "../../assets/images/slider/slider-1.webp";
import slider2 from "../../assets/images/slider/slider-2.webp";
import slider3 from "../../assets/images/slider/slider-3.webp";
import slider4 from "../../assets/images/slider/slider-4.webp";

const sliderContent = [
  {
    title: "The world is their home too",
    description: "Embracing Coexistence in Our Global Habitat",
    image: slider4,
  },
  {
    title: "Mission One Million TREES",
    description: "Build an Oxygen Factory by Planting Trees",
    image: slider1,
  },
  {
    title: "A home for those old people who have no one to look after them",
    description: "They are the most vulnerable, Protect our elders",
    image: slider3,
  },
  {
    title: "Building A Strong Foundation For Children",
    description:
      "We want to provide quality education which is free and accessible for all the children",
    image: slider2,
  },
];

export default function Slider() {
  // const [isActive, setIsActive] = useState(true);

  return (
    <div className="w-full relative">
      <Carousel
        plugins={[Autoplay({ delay: 2000, active: true })]}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-0">
          {sliderContent.map((slide, index) => (
            <CarouselItem
              key={index}
              // onMouseEnter={() => setIsActive(false)}
              // onMouseLeave={() => setIsActive(true)}
              className="pl-0 relative"
            >
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] xl:h-[650px] overflow-hidden">
                <Image
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500"
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 100vw, 100vw"
                />

                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/20"></div>

                {/* Centered content overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 text-white">
                  <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl">
                      {slide.title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl opacity-95 leading-relaxed max-w-3xl mx-auto drop-shadow-lg font-medium text-brand-light">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Responsive Navigation Buttons */}
        <CarouselPrevious className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border-none shadow-lg w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
        <CarouselNext className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border-none shadow-lg w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
      </Carousel>
    </div>
  );
}
