import { Element } from "@/bindings/DbCharacter";
import Fire from "@public/element/Fire.svg";
import Physical from "@public/element/Physical.svg";
import Ice from "@public/element/Ice.svg";
import Quantum from "@public/element/Quantum.svg";
import Imaginary from "@public/element/Imaginary.svg";
import Wind from "@public/element/Wind.svg";
import Lightning from "@public/element/Lightning.svg";
import { HTMLAttributes, forwardRef } from "react";
import "./icon.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  element: Element;
  /**
   * this is getting passed into `style` props of the wrapping div
   */
  size: string;
}
const ElementIcon = forwardRef<HTMLDivElement, Props>(
  ({ element, size, ...props }, ref) => {
    // original width in svg files ???????
    const sizes = { width: "100%", height: "100%", viewBox: "0 0 14 14" };
    return (
      <div style={{ width: size, height: size }} ref={ref} {...props}>
        {element === "Fire" && <Fire className="text-fire" {...sizes} />}
        {element === "Physical" && (
          <Physical className="text-physical" {...sizes} />
        )}
        {element === "Quantum" && (
          <Quantum className="text-quantum" {...sizes} />
        )}
        {element === "Lightning" && (
          <Lightning className="text-lightning" {...sizes} />
        )}
        {element === "Ice" && <Ice className="text-ice" {...sizes} />}
        {element === "Wind" && <Wind className="text-wind" {...sizes} />}
        {element === "Imaginary" && (
          <Imaginary className="text-imaginary" {...sizes} />
        )}
      </div>
    );
  }
);
ElementIcon.displayName = "ElementIcon";

export { ElementIcon };
