import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));  //converts the arguments of any type(boolean,expression) into single string of valid classNmaes
}
