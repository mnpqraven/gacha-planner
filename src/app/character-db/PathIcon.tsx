"use client";

import { Path } from "@/bindings/DbCharacter";
import Abundance from "@public/path/Abundance.svg";
import Destruction from "@public/path/Destruction.svg";
import Erudition from "@public/path/Erudition.svg";
import Harmony from "@public/path/Harmony.svg";
import Hunt from "@public/path/Hunt.svg";
import Nihility from "@public/path/Nihility.svg";
import Preservation from "@public/path/Preservation.svg";
import { useTheme } from "next-themes";
import { HTMLAttributes, forwardRef, useEffect, useState } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  path: Path;
  /**
   * this is getting passed into `style` props of the wrapping div
   */
  size: string;
  iconClass?: string;
  ignoreTheme?: boolean;
}

const PathIcon = forwardRef<HTMLDivElement, Props>(
  ({ path, size, iconClass, ignoreTheme = false, ...props }, ref) => {
    const { theme } = useTheme();
    const filterDark = { filter: "drop-shadow(1px 1px 1px rgb(0 0 0 / 1))" };
    const filterLight = {
      filter: "drop-shadow(1px 1px 1px rgb(134 140 136 / 1))",
    };
    const [filter, setFilter] = useState(filterLight);
    useEffect(() => {
      if (!ignoreTheme) {
        if (theme === "light") setFilter(filterDark);
        else setFilter(filterLight);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme]);

    // original width in svg files ???????
    const sizes = { width: "100%", height: "100%", viewBox: "0 0 14 14" };
    return (
      <div style={{ width: size, height: size }} ref={ref} {...props}>
        {path === "Abundance" && (
          <Abundance className={iconClass} style={filter} {...sizes} />
        )}
        {path === "Destruction" && (
          <Destruction className={iconClass} style={filter} {...sizes} />
        )}
        {path === "Erudition" && (
          <Erudition className={iconClass} style={filter} {...sizes} />
        )}
        {path === "Harmony" && (
          <Harmony className={iconClass} style={filter} {...sizes} />
        )}
        {path === "Hunt" && (
          <Hunt className={iconClass} style={filter} {...sizes} />
        )}
        {path === "Nihility" && (
          <Nihility className={iconClass} style={filter} {...sizes} />
        )}
        {path === "Preservation" && (
          <Preservation className={iconClass} style={filter} {...sizes} />
        )}
      </div>
    );
  }
);
PathIcon.displayName = "PathIcon";

export { PathIcon };
