"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { Button } from "./ui/Button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

const menu = [
  { path: "/", label: "Home" },
  { path: "/gacha-graph", label: "Gacha Estimation" },
];
const Navbar = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();

  const pathnameClass = (path: string) =>
    cn(
      "text-sm font-medium transition-colors hover:text-primary",
      pathname !== path ? "text-muted-foreground" : ""
    );

  return (
    <div className="flex items-center h-16 border-b px-4 justify-between">
      <nav
        className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        {...props}
      >
        {menu.map(({ path, label }) => (
          <Link href={path} className={pathnameClass(path)} key={path}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center space-x-4 lg:space-x-6">
        <a
          href="https://github.com/mnpqraven/gacha-planner"
          target="_blank"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          GitHub
        </a>
        <ThemeToggle />
      </div>
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
