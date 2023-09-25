import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getParamsFromURL(url:string) {
  const queryString = url.split('?')[1];
  const paramsArray = queryString.split('&');
  const paramsObject:any = {}

  paramsArray.forEach(param => {
    const [key, value] = param.split('=');
    paramsObject[key] = decodeURIComponent(value);
  });

  return paramsObject;
}
