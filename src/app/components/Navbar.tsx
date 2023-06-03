"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { Button } from "./ui/Button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const Navbar = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div className="flex items-center h-16 border-b px-4 justify-between">
      <nav
        className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        {...props}
      >
        <Link
          href="/"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Home
        </Link>
        <a
          href="https://github.com/mnpqraven/gacha-planner"
          target="_blank"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          GitHub
        </a>
      </nav>
      <ThemeToggle />
    </div>
  );
};
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }
  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme}>
      <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
export default Navbar;
