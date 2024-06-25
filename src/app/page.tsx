import StoryWhiter from "@/components/story-whiter";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-purple-500 flex flex-col space-y-5 justify-center items-center order-1 lg:-order-1 pb-10">
          <Image src={'/logo.png'} alt="Imagem de um chapeu mágico" height={250} width={250} />

          <Button asChild className="px-20 bg-purple-700 hover:bg-purple-600 p-10 text-xl">
            <Link href={'/historias'}>Explore nosso banco de histórias</Link>
          </Button>
        </div>

        <StoryWhiter />
      </section>
    </main>
  );
}
