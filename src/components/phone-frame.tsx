import type { ReactNode } from "react";

/**
 * On mobile viewports: fills the screen.
 * On md+ viewports (preview/desktop): renders inside a centered phone frame
 * so the app always feels mobile-native.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-slate-100 to-slate-200 md:flex md:items-center md:justify-center md:py-8">
      <div className="relative w-full md:w-[400px] md:h-[820px] md:rounded-[3rem] md:ring-[10px] md:ring-foreground md:shadow-2xl md:overflow-hidden bg-background min-h-dvh md:min-h-0">
        <div className="relative w-full h-full md:h-[820px] overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
