"use client";

import { Path } from "@/bindings/AvatarConfig";
import { useTheme } from "next-themes";
import { HTMLAttributes, forwardRef, useEffect, useState } from "react";
import SVG from "react-inlinesvg";

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
  (
    { path, size, iconClass: className, ignoreTheme = false, ...props },
    ref
  ) => {
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

    return (
      <div style={{ width: size, height: size }} ref={ref} {...props}>
        <SVG
          src={`/path/${path}.svg`}
          className={className}
          style={filter}
          width="100%"
          height="100%"
          viewBox="0 0 14 14"
        />
      </div>
    );
  }
);
PathIcon.displayName = "PathIcon";

export { PathIcon };
