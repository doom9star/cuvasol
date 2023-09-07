import { useEffect } from "react";

export function useTitle(title: string) {
  useEffect(() => {
    document.title = `Cuvasol | ${title}`;
  }, [title]);
}
