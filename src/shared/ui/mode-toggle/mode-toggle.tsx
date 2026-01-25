"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Theme, useTheme } from "remix-themes";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function ModeToggle() {
  const [, setTheme] = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon">
            <SunIcon className="size-4 scale-100 rotate-0 transition-transform duration-200 dark:scale-0 dark:-rotate-90" />
            <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-transform duration-200 dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme(Theme.LIGHT)}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.DARK)}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(null)}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
