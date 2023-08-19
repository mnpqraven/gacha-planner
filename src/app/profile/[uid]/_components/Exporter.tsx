"use client";

import { Button } from "@/app/components/ui/Button";
import { toBlob, toPng } from "html-to-image";
import { useContext, useEffect, useState } from "react";
import { useCardConfigController } from "../ConfigControllerContext";
import { Clipboard, Download } from "lucide-react";
import { useToast } from "@/app/components/ui/Toast/useToast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";

// firefox-only var
declare const InstallTrigger: any;

export function Exporter() {
  const { enkaRef } = useCardConfigController();
  // we need a firefox check cause firefox can't directly copy image
  const [isFirefox, setIsFirefox] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof InstallTrigger !== "undefined") setIsFirefox(true);
  }, []);

  function onExportClick({ mode }: Options) {
    toast({ description: "Exporting image... " });
    exportImage(enkaRef?.current, { mode })
      .then(() => toast({ description: "Image exported" }))
      .catch(() =>
        toast({
          description: "No character selected, please select a character",
        })
      );
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => onExportClick({ mode: "DOWNLOAD" })}
            variant="outline"
            className="px-2"
          >
            <Download />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Download Image</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              if (!isFirefox) onExportClick({ mode: "CLIPBOARD" });
            }}
            variant="outline"
            className="px-2"
          >
            <Clipboard />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isFirefox ? (
            <span>
              Direct clipboard copying is not supported on Firefox.
              <br />
              Please use the {"'"}Download Image{"'"} button on the left
              instead.
            </span>
          ) : (
            "Copy to clipboard"
          )}
        </TooltipContent>
      </Tooltip>
    </>
  );
}

type Options = {
  mode: "DOWNLOAD" | "CLIPBOARD" | "DISPLAY";
};

export async function exportImage(
  element: HTMLDivElement | null | undefined,
  opt: Options = { mode: "DOWNLOAD" }
): Promise<void> {
  if (!!element) {
    if (opt.mode === "DOWNLOAD") {
      return toPng(element, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "hsr-card.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (opt.mode === "CLIPBOARD") {
      return toBlob(element).then((blob) => {
        if (blob) {
          const data = [new ClipboardItem({ [blob.type]: blob })];
          navigator.clipboard
            .write(data)
            .then(() => console.log("copied"))
            .catch(console.error);
        }
      });
    }
  } else return Promise.reject("Empty image");
}
