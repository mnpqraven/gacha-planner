"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { Button } from "./ui/Button";
import {
  Github,
  LineChart,
  Moon,
  Sun,
  Ticket,
  UserSquare,
  GalleryHorizontalEnd,
  BookCopy,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { CommandCenter } from "./CommandCenter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/Tooltip";

const menu = [
  {
    path: "/",
    label: "Stellar Jade Tracker",
    icon: <Ticket className="h-4 w-4" />,
    keybind: "q",
  },
  {
    path: "/gacha-graph",
    label: "Gacha Estimation",
    icon: <LineChart className="h-4 w-4" />,
    keybind: "w",
  },
  {
    path: "/character-db",
    label: "Character DB",
    icon: <UserSquare className="h-4 w-4" />,
    keybind: "e",
  },
  {
    path: "/lightcone-db",
    label: "Light Cone DB",
    icon: <GalleryHorizontalEnd className="h-4 w-4" />,
    keybind: "r",
  },
  {
    path: "/profile",
    label: "Character Card",
    icon: <BookCopy className="h-4 w-4" />,
    keybind: "c",
  },
];
const Navbar = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();

  const defaultLinkClass =
    "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary";
  const pathnameClass = (path: string) =>
    cn(defaultLinkClass, pathname !== path ? "text-muted-foreground" : "");

  return (
    <div className="sticky top-0 z-50 flex h-12 items-center border-b bg-background px-4">
      <nav
        className={cn(
          "mr-auto flex flex-1 items-center space-x-4 lg:space-x-6",
          className
        )}
        {...props}
      >
        <TooltipProvider delayDuration={0}>
          {menu.map(({ path, label, icon }) => (
            <Link href={path} key={path}>
              <Tooltip>
                <TooltipTrigger className={pathnameClass(path)}>
                  {icon} <span className="hidden xl:inline-block">{label}</span>
                </TooltipTrigger>
                <TooltipContent className="xl:hidden">{label}</TooltipContent>
              </Tooltip>
            </Link>
          ))}
        </TooltipProvider>
      </nav>

      <div className="flex items-center justify-end space-x-4 lg:space-x-6">
        <CommandCenter routes={menu} />

        <a
          href="https://github.com/mnpqraven/gacha-planner"
          target="_blank"
          className={cn(defaultLinkClass, "ml-auto text-muted-foreground")}
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
