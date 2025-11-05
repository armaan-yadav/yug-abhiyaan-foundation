import { email, phone } from "@/constants";
import { Mail, Phone } from "lucide-react";
import SocialStrip from "./SocialStrip";

const TopStrip = () => {
  return (
    <div className="w-full bg-brand-light text-white  px-3 sm:px-6 lg:px-16 h-[36px] flex items-center justify-center ">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between ">
        <div
          className="flex items-center justify-between
        max-sm:w-full sm:justify-center  gap-2 max-sm:text-sm "
        >
          <div className="flex items-center justify-center">
            <Mail className="h-4 w-4 mr-2 hidden sm:block" />
            <a href={`mailto:${email}`}>{email}</a>
          </div>
          <div className="flex items-center justify-center">
            <Phone className="h-4 w-4 mr-2 hidden sm:block" />
            <a href={`tel:${phone}`}>{phone}</a>
          </div>
        </div>
        <div className="hidden md:block">
          <SocialStrip hoverEffect={false} color="white" />
        </div>
      </div>
    </div>
  );
};

export default TopStrip;
