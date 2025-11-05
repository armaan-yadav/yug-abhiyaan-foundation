import { getDocBySlug } from "@/services/firebaseServices";
import type { Metadata } from "next";

const page = ({ params }: { params: { slug: string } }) => {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">{params.slug}</div>
      </section>
    </div>
  );
};

export default page;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;
  try {
    const data = await getDocBySlug("content", slug);
    if (data) {
      return {
        title: data.title || `Blog — ${slug}`,
        description: data.description?.slice(0, 160) || undefined,
        openGraph: {
          title: data.title || `Blog — ${slug}`,
          description: data.description?.slice(0, 160) || undefined,
          images: data.thumbnailUrl ? [data.thumbnailUrl] : undefined,
        },
      };
    }
  } catch (e) {
    /* ignore */
  }
  return { title: `Blog — ${slug}` };
}
