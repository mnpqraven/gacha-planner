"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { Button } from "./ui/Button";
import { Github, LineChart, Moon, Sun, Ticket } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { CommandCenter } from "./CommandCenter";

const menu = [
  {
    path: "/",
    label: "Stellar Jade Tracker",
    icon: <Ticket className="h-4 w-4" />,
  },
  {
    path: "/gacha-graph",
    label: "Gacha Estimation",
    icon: <LineChart className="h-4 w-4" />,
  },
];
const Navbar = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();

  const defaultLinkClass =
    "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary";
  const pathnameClass = (path: string) =>
    cn(defaultLinkClass, pathname !== path ? "text-muted-foreground" : "");

  return (
    <div className="flex items-center h-12 border-b px-4">
      <nav
        className={cn(
          "flex flex-1 items-center space-x-4 lg:space-x-6",
          className
        )}
        {...props}
      >
        {menu.map(({ path, label, icon }) => (
          <Link href={path} className={pathnameClass(path)} key={path}>
            {icon} <span className="hidden sm:inline-block">{label}</span>
          </Link>
        ))}
      </nav>
      <CommandCenter />
      <div className="flex flex-1 items-center space-x-4 lg:space-x-6 justify-end">
        <a
          href="https://github.com/mnpqraven/gacha-planner"
          target="_blank"
          className={cn(defaultLinkClass, "text-muted-foreground")}
        >
          <Github />
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
