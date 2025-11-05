import HelpTemplate from "@/components/_templates/HelpTemplate";
import animal from "../../../../assets/images/backgrounds/animal_rescue.webp";

const page = () => {
  const sampleData = {
    image: animal,
    points: [
      "Adopt a rescue animal.",
      "Volunteer at local shelters.",
      "Donate pet supplies and food.",
      "Support spay/neuter programs.",
      "Foster animals in need.",
      "Report animal abuse.",
      "Support wildlife conservation.",
      "Choose cruelty-free products.",
    ],
    quotes: [
      "The greatness of a nation and its moral progress can be judged by the way its animals are treated. — Mahatma Gandhi",
      "Animals are such agreeable friends—they ask no questions; they pass no criticisms. — George Eliot",
      "Until one has loved an animal, a part of one's soul remains unawakened. — Anatole France",
    ],
    content: [
      {
        title:
          "Millions of animals enter shelters every year, with many facing euthanasia due to overcrowding. By adopting instead of shopping, volunteering your time, or fostering animals temporarily, you directly save lives and create space for more rescues.",
        description: "",
      },
      {
        title:
          "Wildlife habitats are disappearing at an alarming rate due to deforestation, urban development, and climate change. Supporting conservation organizations, choosing sustainable products, and reducing your environmental footprint helps protect endangered species and their ecosystems.",
        description: "",
      },
      {
        title:
          "Animal cruelty exists in many forms - from puppy mills to factory farming to illegal wildlife trade. Stay informed about animal welfare issues, support legislation that protects animals, and make conscious choices as a consumer to reduce demand for products that cause animal suffering.",
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
