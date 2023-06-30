import { Element, Path } from "@/bindings/DbCharacter";
import Abundance from "@public/path/Abundance.svg";
import Destruction from "@public/path/Destruction.svg";
import Erudition from "@public/path/Erudition.svg";
import Harmony from "@public/path/Harmony.svg";
import Hunt from "@public/path/Hunt.svg";
import Nihility from "@public/path/Nihility.svg";
import Preservation from "@public/path/Preservation.svg";
import { HTMLAttributes, forwardRef } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  path: Path;
  /**
   * this is getting passed into `style` props of the wrapping div
   */
  size: string;
  iconClass?: string;
}
const PathIcon = forwardRef<HTMLDivElement, Props>(
  ({ path, size, iconClass, ...props }, ref) => {
    // original width in svg files ???????
    const sizes = { width: "100%", height: "100%", viewBox: "0 0 14 14" };
    return (
      <div style={{ width: size, height: size }} ref={ref} {...props}>
        {path === "Abundance" && <Abundance className={iconClass} {...sizes} />}
        {path === "Destruction" && (
          <Destruction className={iconClass} {...sizes} />
        )}
        {path === "Erudition" && <Erudition className={iconClass} {...sizes} />}
        {path === "Harmony" && <Harmony className={iconClass} {...sizes} />}
        {path === "Hunt" && <Hunt className={iconClass} {...sizes} />}
        {path === "Nihility" && <Nihility className={iconClass} {...sizes} />}
        {path === "Preservation" && (
          <Preservation className={iconClass} {...sizes} />
        )}
      </div>
    );
  }
);
PathIcon.displayName = "PathIcon";

export { PathIcon };
