"use client";

import { useTranslation } from "react-i18next";

import { MoonIcon, SunIcon } from "lucide-react";
import { Theme, useTheme } from "remix-themes";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

/** Dropdown button that switches between light, dark, and system color themes. */
export function ModeToggle() {
  const { t } = useTranslation("components");
  const [, setTheme] = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon">
            <SunIcon
              className="size-4 scale-100 rotate-0 transition-transform
                duration-200 dark:scale-0 dark:-rotate-90"
            />
            <MoonIcon
              className="absolute size-4 scale-0 rotate-90 transition-transform
                duration-200 dark:scale-100 dark:rotate-0"
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      />
      {/* istanbul ignore start @preserve -- Theme setters require remix-themes session context */}
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme(Theme.LIGHT)}>
          {t("modeToggle.light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.DARK)}>
          {t("modeToggle.dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(null)}>
          {t("modeToggle.system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
      {/* istanbul ignore end @preserve */}
    </DropdownMenu>
  );
}
