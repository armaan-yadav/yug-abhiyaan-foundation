import Image, { StaticImageData } from "next/image";
import React from "react";

interface HelpTemplateProps {
  image: StaticImageData;
  points: string[];
  quotes: string[];
  content: { title: string; description: string }[];
}

const HelpTemplate: React.FC<HelpTemplateProps> = ({
  image,
  points,
  quotes,
  content,
}) => {
  return (
    <div className="max-w-7xl mx-auto bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column - Image and Main Content */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <Image
              src={image}
              alt="Charity image"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover"
            />
          </div>

          {/* Main Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Every contribution makes an even more significant difference as it
              participates in a chain of events.
            </h1>
          </div>

          {/* Content Sections */}
          <div className="space-y-4">
            {content.map((item, index) => (
              <div key={index} className="space-y-2">
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold">{item.title}</span>
                  {item.title && item.description && ": "}
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Action Points and Quotes */}
        <div className="space-y-8">
          {/* Action Points */}
          <div className="space-y-4">
            {points.map((point, index) => (
              <div key={index} className="text-gray-700 font-medium">
                {point}
              </div>
            ))}
          </div>

          {/* Quotes Section */}
          <div className="space-y-6">
            {quotes.map((quote, index) => (
              <div key={index} className="border-l-4 border-brand-light pl-4">
                <blockquote className="text-gray-700 italic leading-relaxed">
                  &quot;{quote}&quot;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpTemplate;
