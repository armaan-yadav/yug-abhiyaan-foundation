import Image from "next/image";
import sponsor1 from "../../assets/sponsors/sponsor-1.webp";
import sponsor2 from "../../assets/sponsors/sponsor-2.webp";
import sponsor3 from "../../assets/sponsors/sponsor-3.webp";
import sponsor4 from "../../assets/sponsors/sponsor-4.webp";

const sponsors = [sponsor1, sponsor2, sponsor3, sponsor4];

const SponsorTile = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-72 h-72 bg-brand-light rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-light rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-light/10 rounded-full mb-6">
            <div className="w-8 h-8 bg-brand-light rounded-full"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-brand-light">Trusted</span> Partners
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Together with our amazing sponsors, we&apos;re making a difference
            in communities worldwide
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-light to-brand-light/50 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Infinite Scroll Section */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent z-10"></div>

          {/* Scrolling Container */}
          <div className="overflow-hidden py-8">
            <div className="flex animate-scroll space-x-16">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex space-x-16 min-w-full justify-around items-center"
                >
                  {sponsors.map((sponsor, index) => (
                    <div
                      key={`${i}-${index}`}
                      className="flex-shrink-0 bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Image
                        src={sponsor}
                        alt={`Sponsor ${index + 1}`}
                        width={100}
                        height={60}
                        className="object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorTile;
