"use client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import logo from "../../assets/logos/logo_wo_text.png";
import { Button } from "../ui/button";
import Link from "next/link";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Our Work", href: "#work" },
  { name: "Contact", href: "#contact" },
  { name: "Help", href: "#help" },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8 h-[76px] flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex">
              <Link href="/">
                <Image src={logo} alt="Logo" width={60} height={60} />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-[#222222] hover:text-[#F8B864]"
                  >
                    {item.name}
                  </Link>
                ))}
                <Button className="rounded-sm bg-[#222222]">
                  <Link
                    href=""
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer"
                  >
                    Donate Now
                  </Link>
                </Button>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-[#222222] hover:text-[#F8B864] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#F8B864] transition-colors duration-200"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden absolute top-[76px] left-0 w-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-96 opacity-100 visible"
            : "max-h-0 opacity-0 invisible overflow-hidden"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-3 border-t border-gray-200">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-3 py-3 rounded-md text-base font-medium text-[#222222] hover:text-[#F8B864] hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-200">
            <Button className="w-full rounded-sm bg-[#222222] hover:bg-[#333333]">
              <Link
                href=""
                className="block w-full px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Donate Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
