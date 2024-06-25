"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Frame } from "@gptscript-ai/gptscript";
import renderEventMenssage from "@/lib/render-event-menssage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const storiesPath = "public/historias";

const StoryWhiter = () => {
  const router = useRouter()
  const [story, setStory] = useState<string>("");
  const [pages, setPages] = useState<number>();
  const [progress, setProgress] = useState("");
  const [runStarted, setRunStarted] = useState(false);
  const [runFinished, setRunFinished] = useState<boolean | null>(null);
  const [currentTool, setCurrentTool] = useState<string>("");
  const [events, setEvents] = useState<Frame[]>([]);

  async function runScript() {
    setRunStarted(true);
    setRunFinished(false);

    const res = await fetch("/api/run-script", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ story, pages, path: storiesPath }),
    });

    if(res.ok && res.body) {
      console.log("Streaming started");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      handleStream(reader, decoder);
    }else {
      setRunFinished(true);
      setRunStarted(false);
      console.error("Erro ao executar o script", res);
    }
  }

  async function handleStream(reader: ReadableStreamDefaultReader<Uint8Array>, decoder: TextDecoder) {
    while(true) {
      const { done, value } = await reader.read();

      if(done) break;

      const chunk = decoder.decode(value, {stream: true})

      const eventData = chunk
        .split("\n\n")
        .filter((line) => line.startsWith("event: "))
        .map((line) => line.replace(/^event: /, ""))

      eventData.forEach((data) => {
        try {
          const parsedData = JSON.parse(data);

          if(parsedData.type === "callProgress") {
            setProgress(parsedData.output[parsedData.output.length - 1].content);

            setCurrentTool(parsedData.tool?.description || "")
          }else if(parsedData.type === "callStart") {
            setCurrentTool(parsedData.tool?.description || "")
          } else if (parsedData.type === "runFinish") {
            setRunFinished(true);
            setRunStarted(false);
          } else {
            setEvents((prevEvents) => [...prevEvents, parsedData])
          }
        } catch (error) {
          console.error("Error while parsing event data", error);
        }
      })
    }
  }

  useEffect(() => {
    if(runFinished) {
      toast.success("História gerada com sucesso!", {
        action: (
          <Button onClick={() => router.push(`/historias`)} className="bg-purple-500 ml-auto">Ver histórias</Button>
        )
      });
    }
  }, [runFinished, router])

  return (
    <div className="flex flex-col container">
      <section className="flex-1 flex flex-col border border-purple-300 rounded-md p-10 space-y-2">
        <Textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className="flex-1 text-black"
          placeholder="Escreva uma história sobre como um humano se tornou amigo de um robô.."
        />

        <Select onValueChange={(value) => setPages(parseInt(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Quantas páginas sua história deve ter?" />
          </SelectTrigger>

          <SelectContent className="w-full">
            {Array.from({ length: 10 }, (_, i) => (
              <SelectItem key={i} value={String(i + 1)}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          disabled={!story || !pages || runStarted}
          className="w-full"
          size={"lg"}
          onClick={runScript}
        >
          Criar história
        </Button>
      </section>

      <section className="flex-1 pb-5 mt-5">
        <div className="flex flex-col-reverse w-full space-y-2 bg-gray-800 rounded-md text-gray-200 font-mono p-10 h-96 overflow-y-auto">
          <div>
            {runFinished === null && (
              <>
                <p className="animate-pulse mr-5">
                  Estou esperando você gerar uma história acima..
                </p>
                <br />
              </>
            )}

            <span className="mr-5">{">>"}</span>
            {progress}
          </div>

          {currentTool && (
            <div className="py-10">
              <span className="mr-5">{"--- [Ferramenta Atual] ---"}</span>

              {currentTool}
            </div>
          )}

          <div className="space-y-5">
            {events.map((event, i) => (
              <div key={i}>
                <span className="mr-5">{">>"}</span>
                {renderEventMenssage(event)}
              </div>
            ))}
          </div>

          {runStarted && (
            <div>
              <span className="mr-5 animate-in">
                {"--- [AI Contos Criativos foi Iniciado] ---"}
              </span>
              <br />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StoryWhiter;
