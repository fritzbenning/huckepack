import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isElectron = () => {
  return !!(window.electron || navigator.userAgent.toLowerCase().includes("electron"));
};
