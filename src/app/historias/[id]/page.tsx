import Story from "@/components/story";
import { getAllStories, getStory } from "@/lib/get-all-stories";
import { notFound } from "next/navigation";

interface HistoriaPageProps {
  params: {
    id: string;
  };
}

const HistoriaPage = ({ params: { id } }: HistoriaPageProps) => {
  const decodeId = decodeURIComponent(id);

  const story = getStory(decodeId);

  if (!story) {
    return notFound();
  }

  return <Story story={story} />
};

export default HistoriaPage;

export async function generateStaticParams() {
  const stories = getAllStories();

  const paths = stories.map((story) => ({
    id: story.story,
  }));

  return paths
}
