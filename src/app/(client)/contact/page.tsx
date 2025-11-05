import { Mail, MapPin, Phone } from "lucide-react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact | Yug Abhiyaan Foundation",
  description:
    "Get in touch with us to learn more about our initiatives and how you can help.",
};

const ContactPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <section className="relative bg-brand-light  py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-white">
            {/* Breadcrumb */}
            <nav className="flex mb-8 text-sm">
              <span className="opacity-90">HOME</span>
              <span className="mx-2 opacity-60">/</span>
              <span className="font-semibold">CONTACT</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Contact With Us
              </h1>
              <p className="text-xl lg:text-2xl opacity-90 leading-relaxed">
                Help today because tomorrow you may be the one who needs more
                helping!
              </p>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 
  bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70% transparent_110%)]"
        ></div>
      </section>

      {/* Map Section */}
      <section className="relative -mt-17 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative h-96 lg:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.217781343009!2d73.17491677502095!3d22.30760194263121!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc9cd4d76bbeb%3A0x63599329c279e88c!2sYug%20Abhiyaan%20Times!5e0!3m2!1sen!2sin!4v1756029190701!5m2!1sen!2sin"
                width="100%"
                height="100%"
                className="w-full h-full"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information and Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  GET IN TOUCH
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  The secret to happiness lies in helping others. Never
                  underestimate the difference.
                </p>
              </div>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Address
                    </h3>
                    <p className="text-gray-600">
                      13 Sampatrao Colony, Jetalpur, Vadodara, Gujarat 390005
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+91 98242 53338</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">
                      info@yugabhiyaanfoundation.org
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
