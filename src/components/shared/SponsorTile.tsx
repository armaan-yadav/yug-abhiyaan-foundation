"use client";
import Image from "next/image";
import React from "react";
import sponsor1 from "../../assets/sponsors/sponsor-1.webp";
import sponsor2 from "../../assets/sponsors/sponsor-2.webp";
import sponsor3 from "../../assets/sponsors/sponsor-3.webp";
import sponsor4 from "../../assets/sponsors/sponsor-4.webp";

const SponsorTile = () => {
  return (
    <div className="w-full overflow-hidden py-8">
      <div className="sponsor-scroll flex animate-scroll">
        <div className="flex space-x-8 min-w-full justify-around items-center">
          <div className="flex-shrink-0">
            <Image
              src={sponsor1}
              alt="Sponsor 1"
              width={80}
              height={80}
              className="object-contain cursor-pointer"
            />
          </div>
          <div className="flex-shrink-0">
            <Image
              src={sponsor2}
              alt="Sponsor 2"
              width={80}
              height={80}
              className="object-contain cursor-pointer"
            />
          </div>
          <div className="flex-shrink-0">
            <Image
              src={sponsor3}
              alt="Sponsor 3"
              width={80}
              height={80}
              className="object-contain cursor-pointer"
            />
          </div>
          <div className="flex-shrink-0">
            <Image
              src={sponsor4}
              alt="Sponsor 4"
              width={80}
              height={80}
              className="object-contain cursor-pointer"
            />
          </div>
        </div>

        <div className="flex space-x-8 min-w-full justify-around items-center">
          <div className="flex-shrink-0">
            <Image
              src={sponsor1}
              alt="Sponsor 1"
              width={80}
              height={80}
              className="object-contain cursor-pointer"
            />
          </div>
          <div className="flex-shrink-0">
            <Image
              src={sponsor2}
              alt="Sponsor 2"
              width={80}
              height={80}
              className="object-contain cursor-pointer"
            />
          </div>
          <div className="flex-shrink-0">
            <Image
              src={sponsor3}
              alt="Sponsor 3"
              width={80}
              height={80}
              className="object-contain cursor-pointer"
            />
          </div>
          <div className="flex-shrink-0">
            <Image
              src={sponsor4}
              alt="Sponsor 4"
              width={80}
              height={80}
              className="object-contain cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorTile;
