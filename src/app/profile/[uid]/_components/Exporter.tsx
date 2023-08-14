"use client";

import { Button } from "@/app/components/ui/Button";
import { toPng } from "html-to-image";
import { useContext } from "react";
import { CardConfigContext } from "../ConfigControllerContext";

export function Exporter() {
  const { enkaRef } = useContext(CardConfigContext);
  return (
    <Button onClick={() => exportImage(enkaRef?.current, { mode: "DOWNLOAD" })}>
      Export Image
    </Button>
  );
}

type Options = {
  mode: "DOWNLOAD" | "CLIPBOARD" | "DISPLAY";
};

export async function exportImage(
  element: HTMLDivElement | null | undefined,
  opt: Options = { mode: "DOWNLOAD" }
) {
  if (!!element) {
    toPng(element, { cacheBust: true })
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
}
