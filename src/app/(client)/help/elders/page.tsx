import HelpTemplate from "@/components/_templates/HelpTemplate";
import elder from "../../../../assets/images/help/elder.jpg";

const page = () => {
  const sampleData = {
    image: elder,
    points: [
      "Visit elderly neighbors regularly.",
      "Volunteer at nursing homes.",
      "Help with grocery shopping.",
      "Offer technology assistance.",
      "Support meal delivery programs.",
      "Advocate for elder rights.",
      "Organize intergenerational activities.",
      "Donate to senior care organizations.",
    ],
    quotes: [
      "The care of the elderly is not just a duty, it's a privilege to learn from their wisdom. — Unknown",
      "A society grows great when old men plant trees whose shade they know they shall never sit in. — Greek Proverb",
      "The older I get, the more I realize the value of privacy, of cultivating your circle and only letting certain people in. — Jennifer Lawrence",
    ],
    content: [
      {
        title:
          "Social isolation among seniors has reached epidemic levels, with many experiencing loneliness that impacts their physical and mental health. Regular visits, phone calls, and community engagement can dramatically improve their quality of life and provide the human connection they desperately need.",
        description: "",
      },
      {
        title:
          "Many elderly people struggle with basic daily tasks like grocery shopping, medical appointments, and household maintenance. Offering practical assistance or connecting them with community resources helps them maintain independence and dignity while ensuring their essential needs are met.",
        description: "",
      },
      {
        title:
          "Elder abuse affects millions of seniors annually, often going unreported due to shame, fear, or inability to seek help. Learn the warning signs, report suspected abuse, and support organizations that protect vulnerable elderly individuals from financial, physical, and emotional exploitation.",
        description: "",
      },
    ],
  };
  return (
    <div>
      <HelpTemplate {...sampleData} />
    </div>
  );
};

export default page;
