import { facebook, instagram, twitter } from "@/constants";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function SocialStrip({
  hoverEffect = true,
  color = "gray-400",
}) {
  const socials = [
    { icon: Facebook, href: facebook },
    { icon: Twitter, href: twitter },
    { icon: Instagram, href: instagram },
  ];

  return (
    <div className="flex space-x-4">
      {socials.map((social, index) => {
        const Icon = social.icon;
        return (
          <a
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:scale-110 cursor-pointer transition"
          >
            <Icon
              className={`w-5 h-5 text-${color} ${
                hoverEffect ? "hover:text-[#F8B864]" : ""
              } transition`}
            />
          </a>
        );
      })}
    </div>
  );
}
