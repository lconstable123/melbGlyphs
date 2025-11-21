import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const animatedKeys = new Set<string>();

export function fadeInOnce(el: HTMLElement, key: string, duration = 500) {
  if (!el || animatedKeys.has(key)) return;
  animatedKeys.add(key);

  el.style.opacity = "0";
  el.style.transition = `opacity ${duration}ms ease-in-out`;

  // Force reflow so the transition applies
  void el.offsetWidth;

  el.style.opacity = "1";
}
