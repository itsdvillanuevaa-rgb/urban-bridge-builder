import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function TopBar({
  title,
  back = false,
  right,
}: {
  title: string;
  back?: boolean;
  right?: ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl safe-top">
      <div className="flex items-center justify-between gap-3 px-4 h-14">
        <div className="flex items-center gap-2 min-w-0">
          {back && (
            <button
              type="button"
              onClick={() => router.history.back()}
              aria-label="Regresar"
              className="-ml-2 size-10 grid place-items-center rounded-full hover:bg-muted text-foreground"
            >
              <ChevronLeft className="size-6" aria-hidden />
            </button>
          )}
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>
        {right}
      </div>
    </header>
  );
}
