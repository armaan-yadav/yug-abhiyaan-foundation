import HelpTemplate from "@/components/_templates/HelpTemplate";
import poor from "../../../../assets/images/help/poorpeopledetails.jpg";

const page = () => {
  const povertyData = {
    image: poor,
    points: [
      "Provide nutritious meals for underprivileged families.",
      "Support access to quality education for children.",
      "Organize free health check-ups and medical aid.",
      "Offer skill development and vocational training.",
      "Distribute clothes, blankets, and basic necessities.",
      "Create employment opportunities through community projects.",
      "Raise awareness about government welfare schemes.",
      "Advocate for policies that uplift marginalized communities.",
    ],
    quotes: [
      "Overcoming poverty is not a gesture of charity, it is an act of justice. — Nelson Mandela",
      "Poverty is the worst form of violence. — Mahatma Gandhi",
      `If you can't feed a hundred people, then feed just one. — Mother Teresa`,
    ],
    content: [
      {
        title:
          "Millions of people live without access to proper food, shelter, and healthcare. Hunger and malnutrition remain major challenges that weaken communities and hinder development. Collective action can bring hope and dignity to the lives of the poor.",
        description: "",
      },
      {
        title:
          "Education is the strongest tool to break the cycle of poverty. By supporting schools, scholarships, and mentorship programs, underprivileged children can secure brighter futures and uplift their families from generational poverty.",
        description: "",
      },
      {
        title:
          "Unemployment and lack of skills often trap people in extreme poverty. Vocational training, micro-financing, and entrepreneurship support can empower individuals to become self-reliant and contribute positively to society.",
        description: "",
      },
    ],
  };

  return (
    <div>
      <HelpTemplate {...povertyData} />
    </div>
  );
};

export default page;
