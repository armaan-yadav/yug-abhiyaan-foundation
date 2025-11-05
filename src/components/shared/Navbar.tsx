"use client";
import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/logos/logo_wo_text.png";
import { Button } from "../ui/button";

interface NavItem {
  name: string;
  href: string;
  subItems?: SubNavItem[];
}

interface SubNavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Our Work", href: "/our-work" },
  { name: "Contact", href: "/contact" },
  {
    name: "Help",
    href: "#help",
    subItems: [
      { name: "Animals", href: "/help/animals" },
      { name: "Elders", href: "/help/elders" },
      { name: "Environment", href: "/help/environment" },
      { name: "Poor People", href: "/help/poorpeople" },
      { name: "Students", href: "/help/students" },
    ],
  },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileHelpOpen, setIsMobileHelpOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveDropdown(null);
    setIsMobileHelpOpen(false);
  };

  const handleMouseEnter = (itemName: string) => {
    setActiveDropdown(itemName);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileHelp = () => {
    setIsMobileHelpOpen(!isMobileHelpOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="shadow-lg sticky top-0 z-50 bg-white">
      <div className="px-3 sm:px-6 lg:px-8 h-[66px] md:h-[76px] flex items-center bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex">
              <Link href="/">
                <Image
                  src={logo}
                  alt="Logo"
                  className="w-13 h-13 lg:w-15  lg:h-15"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <div
                    key={item.name}
                    className="relative"
                    ref={item.subItems ? dropdownRef : null}
                    onMouseEnter={() =>
                      item.subItems && handleMouseEnter(item.name)
                    }
                    onMouseLeave={() => item.subItems && handleMouseLeave()}
                  >
                    {item.subItems ? (
                      <button className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-[#222222] hover:text-[#F8B864] flex items-center gap-1">
                        {item.name}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-[#222222] hover:text-[#F8B864]"
                      >
                        {item.name}
                      </Link>
                    )}

                    {/* Desktop Dropdown Menu */}
                    {item.subItems && activeDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                        <div className="py-2">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-[#222222] hover:text-[#F8B864] hover:bg-gray-50 transition-colors duration-200"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <Button className="rounded-sm bg-brand-light">
                  <Link
                    href="/donate"
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer"
                  >
                    Donate Now
                  </Link>
                </Button>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden bg-white">
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
        className={`md:hidden absolute top-[66px] left-0 w-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-96 opacity-100 visible"
            : "max-h-0 opacity-0 invisible overflow-hidden"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-1 bg-white">
          {navItems.map((item) => (
            <div key={item.name} className="h-fit ">
              {item.subItems ? (
                <div>
                  <button
                    onClick={toggleMobileHelp}
                    className="flex items-center justify-between w-full px-3  rounded-md text-base font-medium text-[#222222] hover:text-[#F8B864] hover:bg-gray-50 transition-colors duration-200"
                  >
                    {item.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isMobileHelpOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Mobile Sub-menu */}
                  <div
                    className={`ml-4 mt-2 space-y-1 transition-all duration-300 overflow-hidden ${
                      isMobileHelpOpen
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-3 rounded-md text-sm font-medium text-gray-600 hover:text-[#F8B864] hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsMobileHelpOpen(false);
                        }}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="block px-3  rounded-md text-base font-medium text-[#222222] hover:text-[#F8B864] hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )}
            </div>
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
