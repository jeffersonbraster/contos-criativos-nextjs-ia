import path from "path";
import fs from "fs";
import { Historia, Page } from "@/types/historias";
import cleanTitle from "./clean-title";

const storiesDirectory = path.join(process.cwd(), "public/historias");

export function getAllStories(): Historia[] {
  if (!fs.existsSync(storiesDirectory)) {
    return [];
  }

  const storyFolders = fs.readdirSync(storiesDirectory);

  const stories: Historia[] = storyFolders.map((storyFolder) => {
    const storyPath = path.join(storiesDirectory, storyFolder);
    const files = fs.readdirSync(storyPath);

    const pages: Page[] = []
    const pageMap: { [key: string]: Partial<Page> } = {}

    files.forEach((file) => {
      const filePath = path.join(storyPath, file);
      const type = path.extname(file).substring(1);
      const pageNumber = file.match(/page(\d+)\./)?.[1];

      if (pageNumber) {
        if (!pageMap[pageNumber]) {
          pageMap[pageNumber] = {}
        }

        if(type === 'txt') {
          pageMap[pageNumber].txt = fs.readFileSync(filePath, 'utf-8');        
        }else if(type === 'png') {
          pageMap[pageNumber].png = `/historias/${storyFolder}/${file}`;
        }
      }
    })

    Object.keys(pageMap).forEach((pageNumber) => {
      if(pageMap[pageNumber].txt && pageMap[pageNumber].png) {
        pages.push(pageMap[pageNumber] as Page);
      }
    })

    return {
      story: cleanTitle(storyFolder),
      pages
    }
  })

  const storiesWithPages = stories.filter((story) => story.pages.length > 0);

  return storiesWithPages;
}

export const getStory = (story: string): Historia | undefined => { 
  const stories = getAllStories();
  return stories.find((s) => s.story === story);
}