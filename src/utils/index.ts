import { ESCAPE_CAPITALIZE_WORDS } from "@/store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

require("dayjs/locale/fr");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale("fr");

export const titleCaseGare = (value: string): string => {
  return value
    .split(" ")
    .map((word: string, index: number) => {
      if (!word) {
        return "";
      }

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

export const humanizeDatetime = (date: Date): string => {
  return dayjs(date).format("HH:mm");
};

export const humanizeDate = (date: Date): string => {
  const now = dayjs();
  const timeObj = dayjs(date);

  if (now.isSame(timeObj, "date")) {
    return "aujourd'hui";
  }

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

export const humanizeDateDiff = (date: dayjs.Dayjs | null): string | null => {
  if (!date) {
    return null;
  }
  return dayjs(date).fromNow();
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
