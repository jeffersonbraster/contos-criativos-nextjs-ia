export default function cleanTitle(title: string): string {
  return title.replace(/[-/\\[\]]/g, " ").replace(/\s+/g, " ").trim();
}