"use client";

import { HTMLAttributes, forwardRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cva } from "class-variance-authority";
import { Element } from "@/bindings/AvatarConfig";
import SVG from "react-inlinesvg";

interface Props extends HTMLAttributes<HTMLDivElement> {
  element: Element;
  /**
   * this is getting passed into `style` props of the wrapping div
   */
  size: string;
  ignoreTheme?: boolean;
}

const ElementIcon = forwardRef<HTMLDivElement, Props>(
  ({ element, size, ignoreTheme = false, ...props }, ref) => {
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
    const cl = cva("", {
      variants: {
        element: {
          Fire: "text-fire",
          Physical: "text-physical",
          Quantum: "text-quantum",
          Lightning: "text-lightning",
          Ice: "text-ice",
          Wind: "text-wind",
          Imaginary: "text-imaginary",
        },
      },
    });

    // original width in svg files ???????
    return (
      <div style={{ width: size, height: size }} ref={ref} {...props}>
        <SVG
          src={`/element/${element}.svg`}
          className={cl({ element })}
          style={filter}
          width="100%"
          height="100%"
          viewBox="0 0 14 14"
        />
      </div>
    );
  }
);
ElementIcon.displayName = "ElementIcon";

export { ElementIcon };
