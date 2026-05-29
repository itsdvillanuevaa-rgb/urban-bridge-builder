import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function TopBar({
  title,
  back = false,
  right,
  centerTitle = false,
}: {
  title: string;
  back?: boolean;
  right?: ReactNode;
  centerTitle?: boolean;
}) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl safe-top">
      <div className="flex items-center justify-between gap-3 px-4 h-14">
        {back ? (
          <>
            <button
              type="button"
              onClick={() => router.history.back()}
              aria-label="Regresar"
              className="size-10 grid place-items-center rounded-full bg-card ring-1 ring-border hover:bg-muted transition-colors"
            >
              <ArrowLeft className="size-5" aria-hidden />
            </button>
            <h1 className={["text-lg font-semibold truncate", centerTitle ? "absolute left-1/2 -translate-x-1/2" : ""].join(" ")}>{title}</h1>
            <div className="w-10">{right}</div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-lg font-semibold truncate">{title}</h1>
            </div>
            {right}
          </>
        )}
      </div>
    </header>
  );
}
