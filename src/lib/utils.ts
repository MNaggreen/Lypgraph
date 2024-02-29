import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* функция которая конвертируем ссылку */
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

// эта функция из chat gpt она берет дату размещения поста и показывает как довно посто размещен
export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;
  

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} день назад`;

      /* case Math.floor(diffInDays) < 5:
        return `${Math.floor(diffInDays)} дня назад`;  */

    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `Около ${Math.floor(diffInDays)} дней назад`;
       
    case Math.floor(diffInHours) >= 1:
      return `Около ${Math.floor(diffInHours)} часов назад`;
    case Math.floor(diffInMinutes) >= 1:
      return `Около ${Math.floor(diffInMinutes)} минут назад`;
    default:
      return "Сейчас";
  }
};

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};