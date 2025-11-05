import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import SponsorTile from "@/components/shared/SponsorTile";
import TopStrip from "@/components/shared/TopStrip";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <TopStrip />
      <Navbar />
      {children}
      <SponsorTile />
      <Footer />
    </div>
  );
};

export default layout;
