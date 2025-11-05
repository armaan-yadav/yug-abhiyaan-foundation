import React from "react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const DonatePage = () => {
  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: QR Card */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-center text-2xl font-semibold text-gray-900 mb-4">
              Support Our Work
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <Image
                src="/assets/images/upi.png"
                alt="UPI QR code"
                className="w-64 h-64 object-contain"
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              Scan and pay with any BHIM UPI app
            </p>
            <div className="mt-4 text-center">
              <Button className="rounded-full px-4 py-2 text-sm bg-brand-light text-white shadow-sm hover:bg-brand-light/90">
                Donate via UPI
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Impact panel */}
        <div className="flex justify-center md:justify-start">
          <div className="w-full max-w-md bg-brand-light/10 backdrop-blur-sm border border-brand-light/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Impact Matters
            </h2>
            <ul className="space-y-3 text-gray-800">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-brand-light">•</span>
                <span>Empowers women through skill development programs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-brand-light">•</span>
                <span>
                  Provides educational opportunities for underprivileged
                  children
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-brand-light">•</span>
                <span>
                  Supports sustainable community development initiatives
                </span>
              </li>
            </ul>

            <div className="mt-6">
              <div className="inline-block bg-white/80 text-gray-900 rounded-xl px-4 py-2 text-sm font-medium">
                100% of your donation goes directly to our programs.
              </div>
            </div>

            <p className="mt-6 text-sm text-gray-700">
              We appreciate unrestricted donations! Call us for more details:
            </p>
            <div className="mt-3">
              <Button className="inline-flex items-center gap-3 bg-brand-light text-white px-4 py-2 rounded-full text-sm shadow-sm hover:bg-brand-light/90">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M22 16.92V21a1 1 0 0 1-1.11 1 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2 3.11 1 1 0 0 1 3 2h4.09a1 1 0 0 1 1 .75c.12.71.33 1.4.62 2.06a1 1 0 0 1-.24 1l-1.27 1.27a16 16 0 0 0 6 6l1.27-1.27a1 1 0 0 1 1-.24c.66.29 1.35.5 2.06.62a1 1 0 0 1 .75 1V21z"
                  />
                </svg>
                +91 9876543210
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DonatePage;

export const metadata: Metadata = {
  title: "Donate | Yug Abhiyaan Foundation",
  description:
    "Support Yug Abhiyaan Foundation — your donations help fund education, rescue, and community programs.",
  openGraph: {
    title: "Donate — Yug Abhiyaan Foundation",
    description:
      "Make a contribution to support education, animal rescue, and community welfare programs.",
  },
};
