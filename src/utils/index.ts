import { ESCAPE_CAPITALIZE_WORDS } from "@/store";
import dayjs from "dayjs";

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

export const humanizeDate = (date: Date): string => {
  const daysOfWeek = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];

  const monthOfYear = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  const now = dayjs();
  const timeObj = dayjs(date);
  const diffDays = timeObj.diff(now, "days");

  if (diffDays === 0) {
    return "demain";
  }
  if (diffDays < 6) {
    return daysOfWeek[timeObj.get("day")];
  } else {
    return `${daysOfWeek[timeObj.get("day")]} ${timeObj.get("date")} ${
      monthOfYear[timeObj.get("month")]
    }`;
  }
};

const padStringZero = (value: number, padding: number) => {
  return String(value).padStart(padding, "0");
};

export const formatDateFromHoursAndMinutes = (
  hours: number,
  minutes: number
): string => {
  return `${hours}h${padStringZero(minutes, 2)}`;
};

export const formatDate = (date: Date): string => {
  return dayjs(date).format("YYYY-MM-DD");
};

export const formatTime = (time: Date): string => {
  const timeObj = dayjs(time);
  return `${timeObj.format("H")}h${timeObj.format("mm")}`;
};
