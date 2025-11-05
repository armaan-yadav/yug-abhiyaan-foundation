import { Metadata } from "next";
import Image from "next/image";
import animals from "../../../assets/images/about/animals.jpg";
import environment from "../../../assets/images/about/environment.jpg";
import oldage from "../../../assets/images/about/oldage.jpg";
import poorpeople from "../../../assets/images/about/poorpeople.jpg";
import students from "../../../assets/images/about/students.jpg";

export const metadata: Metadata = {
  title: "About | Yug Abhiyaan Foundation",
  description:
    "Learn more about our mission, vision, and the impact we create.",
};

const content = [
  {
    title: "How We Help Animals & Birds",
    description:
      "We put mud bowls of water at convenient places for stray animals, especially during summers. We spread grains like rice, bajra, channa, etc. We speak up for the animals. We find loving homes for abandoned and abused animals.",
    image: animals,
  },
  {
    title: "Working On Environmental Issues",
    description:
      "We plant trees. We educate people to use less one time use plastic. We educate people to use less Electronic Devices. We educate people on environmental issues. We arrange seminars on environmental experts. We organize environmental awareness workshops.",
    image: environment,
  },
  {
    title: "What We do for the elderly people, here find out.",
    description:
      'We support "the cause and care of disadvantaged older individuals in order to improve their quality of life."',
    image: oldage,
  },
  {
    title: "Help Poor People",
    description:
      "One of the quickest and most obvious ways to help the world's poor is to donate to charity. We raise awareness. Be a Consumer with a Cause (We buy products from poor people and help them.) volunteer for a political campaign, volunteer for a nonprofit organization, volunteer for a movement to fight poverty.",
    image: poorpeople,
  },
  {
    title: "Helping Students",
    description:
      "Education is both the means and the end to a better life; it is the means because it allows an individual to earn a living, and it is the end because it increases one's awareness of a variety of issues ranging from healthcare to appropriate social behaviour to understanding one's rights, allowing one to evolve as a better citizen.",
    image: students,
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Hero Section */}
      <section className="relative bg-brand-light  py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-white">
            {/* Breadcrumb */}
            <nav className="flex mb-8 text-sm">
              <span className="opacity-90">HOME</span>
              <span className="mx-2 opacity-60">/</span>
              <span className="font-semibold">ABOUT</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                About Us
              </h1>
              <p className="text-xl lg:text-2xl opacity-90 leading-relaxed">
                We Try to help the needy once by providing them with the best.
                We are a non-profit organization that is working for the welfare
                of the people and animals.
              </p>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 
  bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70% transparent_110%)]"
        ></div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto -mt-17 px-4 sm:px-6 lg:px-8">
        {content.map((item, index) => (
          <section key={index} className="mb-20 last:mb-0">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                index % 2 === 0 ? "" : "lg:grid-flow-col-dense"
              }`}
            >
              {/* Image Section */}
              <div
                className={`relative ${
                  index % 2 === 0 ? "lg:order-1" : "lg:order-2 lg:col-start-2"
                }`}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                  <div className="aspect-[4/3] w-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Content Section */}
              <div
                className={`space-y-6 ${
                  index % 2 === 0 ? "lg:order-2" : "lg:order-1 lg:col-start-1"
                }`}
              >
                <div className="space-y-4">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {item.title}
                  </h2>
                  <div className="w-16 h-1 bg-brand-light"></div>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Optional CTA or additional elements */}
                {/* <div className="pt-4">
                  <div className="inline-flex items-center text-brand-light font-semibold hover:text-brand-dark transition-colors cursor-pointer group">
                    <span>Learn More</span>
                    <svg
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div> */}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
