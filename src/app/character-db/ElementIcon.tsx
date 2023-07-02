"use client";

import { Element } from "@/bindings/DbCharacter";
import Fire from "@public/element/Fire.svg";
import Physical from "@public/element/Physical.svg";
import Ice from "@public/element/Ice.svg";
import Quantum from "@public/element/Quantum.svg";
import Imaginary from "@public/element/Imaginary.svg";
import Wind from "@public/element/Wind.svg";
import Lightning from "@public/element/Lightning.svg";
import { HTMLAttributes, forwardRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface Props extends HTMLAttributes<HTMLDivElement> {
  element: Element;
  /**
   * this is getting passed into `style` props of the wrapping div
   */
  size: string;
}

const ElementIcon = forwardRef<HTMLDivElement, Props>(
  ({ element, size, ...props }, ref) => {
    const { theme } = useTheme();
    const filterDark = { filter: "drop-shadow(1px 1px 1px rgb(0 0 0 / 1))" };
    const filterLight = {
      filter: "drop-shadow(1px 1px 1px rgb(134 140 136 / 1))",
    };
    const [filter, setFilter] = useState(filterLight);
    useEffect(() => {
      if (theme === "light") setFilter(filterDark);
      else setFilter(filterLight);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme]);

    // original width in svg files ???????
    const sizes = { width: "100%", height: "100%", viewBox: "0 0 14 14" };
    return (
      <div style={{ width: size, height: size }} ref={ref} {...props}>
        {element === "Fire" && (
          <Fire className="text-fire" style={filter} {...sizes} />
        )}
        {element === "Physical" && (
          <Physical className="text-physical" style={filter} {...sizes} />
        )}
        {element === "Quantum" && (
          <Quantum className="text-quantum" style={filter} {...sizes} />
        )}
        {element === "Lightning" && (
          <Lightning className="text-lightning" style={filter} {...sizes} />
        )}
        {element === "Ice" && (
          <Ice className="text-ice" style={filter} {...sizes} />
        )}
        {element === "Wind" && (
          <Wind className="text-wind" style={filter} {...sizes} />
        )}
        {element === "Imaginary" && (
          <Imaginary className="text-imaginary" style={filter} {...sizes} />
        )}
      </div>
    );
  }
);
ElementIcon.displayName = "ElementIcon";

export { ElementIcon };
