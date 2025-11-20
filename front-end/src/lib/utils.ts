import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fadeInOnce = (
  el: HTMLElement | null,
  id: string,
  set: Set<string>
) => {
  if (!el || set.has(id)) return;
  requestAnimationFrame(() =>
    setTimeout(() => el.classList.add("fade-in"), 50)
  );
  set.add(id);
};
