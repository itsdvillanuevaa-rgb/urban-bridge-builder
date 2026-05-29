import type { ReactNode } from "react";

/**
 * On mobile viewports: fills the screen (h-dvh).
 * On md+ viewports: renders inside a centered phone frame (h-[820px]) so the
 * app always feels mobile-native even when previewed on desktop.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-dvh w-full bg-gradient-to-br from-slate-100 to-slate-200 md:flex md:items-center md:justify-center md:py-8 md:h-dvh">
      <div className="relative h-full w-full md:w-[400px] md:h-[820px] md:rounded-[3rem] md:ring-[10px] md:ring-foreground md:shadow-2xl overflow-hidden bg-background">
        <div className="relative h-full w-full overflow-y-auto overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}
