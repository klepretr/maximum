import { ESCAPE_CAPITALIZE_WORDS } from "@/store";

export const titleCaseGare = (value: string): string => {
  return value
    .split(" ")
    .map((word: string, index: number) => {
      const wordLower = word.toLowerCase();
      const finded = ESCAPE_CAPITALIZE_WORDS.find((escape) => {
        return escape.value.toLowerCase() === wordLower;
      });
      return index === 0 && !finded?.force
        ? `${wordLower[0].toUpperCase()}${wordLower.substring(1)}`
        : finded?.value ||
            `${wordLower[0].toUpperCase()}${wordLower.substring(1)}`;
    })
    .join(" ");
};
