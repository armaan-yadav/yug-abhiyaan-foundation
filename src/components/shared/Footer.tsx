import { Globe, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/logos/logo_wo_text.png";
import SocialStrip from "./SocialStrip";

const Footer = () => {
  return (
    <footer className="bg-brand-bg text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Section - Brand */}
          <div className="space-y-8">
            {/* Logo and Brand */}
            <Link href={"/"} className="flex items-center space-x-4 group">
              <div className="hover:scale-110 transition-all cursor-pointer">
                <Image
                  src={logo}
                  alt="Logo"
                  height={100}
                  width={100}
                  objectFit="contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#999] to-[#F8B864] bg-clip-text text-transparent">
                  YUG ABHIYAAN
                </h2>
                <h3 className="text-xl font-semibold text-gray-300">
                  FOUNDATION
                </h3>
                <p className="text-[#999] font-medium mt-2">
                  Better Life for Souls
                </p>
              </div>
            </Link>

            {/* Social Media */}
            <SocialStrip />
          </div>

          {/* Right Section - Contact Info */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-[#999] mb-8">
              Reach Out to us
            </h3>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center space-x-4 group cursor-pointer">
                <Mail className="w-5 h-5 text-[#F8B864]" />
                <div className="flex-1">
                  <p className="text-[#999] group-hover:text-gray-300 transition-colors duration-300">
                    info@yugabhiyaanfoundation.org
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4 group cursor-pointer">
                <Phone className="w-5 h-5 text-[#F8B864]" />
                <div className="flex-1">
                  <p className="text-[#999] group-hover:text-gray-300 transition-colors duration-300">
                    +(91) 98242 53338
                  </p>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-center space-x-4 group cursor-pointer">
                <Globe className="w-5 h-5 text-[#F8B864]" />
                <div className="flex-1">
                  <p className="text-[#999] group-hover:text-gray-300 transition-colors duration-300">
                    www.yugabhiyaanfoundation.org
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center space-x-4 group">
                <MapPin className="w-5 h-5 text-[#F8B864]" />
                <div className="flex-1">
                  <p className="text-[#999] group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                    13, Sampatrao Colony, Jetalpur, Vadodara, Gujarat 390005
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 Yug Abhiyaan Foundation
            </div>

            {/* Credits */}
            <div className="text-gray-500 text-sm">
              Developed by{" "}
              <Link
                href="https://www.armaanyadav.site"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F8B864] hover:text-white transition-colors duration-300 font-medium"
              >
                Armaan Yadav
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
