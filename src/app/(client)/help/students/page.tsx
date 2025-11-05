import HelpTemplate from "@/components/_templates/HelpTemplate";
import student from "../../../../assets/images/help/studentsdetails.jpg";

const page = () => {
  const studentsData = {
    image: student,
    points: [
      "Provide free education to underprivileged children.",
      "Distribute books, uniforms, and learning materials.",
      "Offer scholarships for higher studies.",
      "Set up after-school tuition and mentorship programs.",
      "Provide digital literacy and computer training.",
      "Organize career guidance and counseling workshops.",
      "Support nutrition programs in schools.",
      "Promote awareness about the importance of education.",
    ],
    quotes: [
      "Education is the most powerful weapon which you can use to change the world. — Nelson Mandela",
      "Every child has a right to education, a right to dream, and a right to a better future. — Malala Yousafzai",
      "The future belongs to those who prepare for it today. — Malcolm X",
    ],
    content: [
      {
        title:
          "Millions of children from poor backgrounds are deprived of education due to poverty, lack of resources, or social inequalities. By providing free schooling and learning support, we can help them break the cycle of poverty.",
        description: "",
      },
      {
        title:
          "Access to books, uniforms, and technology remains a challenge for many underprivileged students. Providing learning resources ensures that every child has the opportunity to study without barriers.",
        description: "",
      },
      {
        title:
          "Education goes beyond classrooms. Mentorship programs, skill development, and career guidance equip children with the confidence and tools needed to build successful futures.",
        description: "",
      },
    ],
  };

  return (
    <div>
      <HelpTemplate {...studentsData} />
    </div>
  );
};

export default page;
