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
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border safe-top">
      <div className="relative flex items-center justify-center px-4 h-14">
        {back && (
          <div className="absolute left-2 flex items-center">
            <button
              type="button"
              onClick={() => router.history.back()}
              aria-label="Regresar"
              className="size-10 grid place-items-center rounded-full hover:bg-muted text-foreground"
            >
              <ChevronLeft className="size-6" aria-hidden />
            </button>
          </div>
        )}
        <h1 className="text-lg font-semibold text-center truncate px-12 max-w-full">
          {title}
        </h1>
        {right && (
          <div className="absolute right-2 flex items-center">
            {right}
          </div>
        )}
      </div>
    </header>
  );
}
