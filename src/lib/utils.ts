import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  format,
  formatDistanceToNowStrict,
  parseISO,
  differenceInDays
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);


export const formatTimeAgo = (timestamp: string) => {
  const date = parseISO(timestamp);
  const now = new Date();

  const daysDifference = differenceInDays(now, date);

  if (daysDifference < 1) {
    return formatDistanceToNowStrict(date, { addSuffix: true }); 
  }

  if (daysDifference === 1) return "Yesterday";
  if (daysDifference < 7) return `${daysDifference} days ago`;

  return format(date, "MMMM d, yyyy");
};


export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};

