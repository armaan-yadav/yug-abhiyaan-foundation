import HelpTemplate from "@/components/_templates/HelpTemplate";
import env from "../../../../assets/images/help/environmentalissues.jpg";

const page = () => {
  const environmentData = {
    image: env,
    points: [
      "Organize tree plantation drives.",
      "Promote waste segregation and recycling.",
      "Encourage reduction of plastic usage.",
      "Support clean water initiatives.",
      "Raise awareness about climate change.",
      "Protect endangered species and habitats.",
      "Advocate for renewable energy adoption.",
      "Conduct eco-friendly community workshops.",
    ],
    quotes: [
      "The Earth is what we all have in common. — Wendell Berry",
      "We don’t inherit the earth from our ancestors, we borrow it from our children. — Native American Proverb",
      "What we are doing to the forests of the world is but a mirror reflection of what we are doing to ourselves and one another. — Mahatma Gandhi",
    ],
    content: [
      {
        title:
          "Deforestation and urbanization are rapidly reducing green cover, contributing to climate change and loss of biodiversity. Tree plantation initiatives, awareness drives, and community involvement can help restore balance and improve air quality.",
        description: "",
      },
      {
        title:
          "Plastic waste is one of the biggest threats to oceans and wildlife. Promoting waste segregation, recycling, and alternatives to single-use plastics helps protect marine life and ensures cleaner communities.",
        description: "",
      },
      {
        title:
          "Water scarcity and pollution impact millions worldwide. Supporting clean water projects, conserving water in households, and advocating for sustainable water management ensures a healthier environment for all.",
        description: "",
      },
    ],
  };

  return (
    <div>
      <HelpTemplate {...environmentData} />
    </div>
  );
};

export default page;
