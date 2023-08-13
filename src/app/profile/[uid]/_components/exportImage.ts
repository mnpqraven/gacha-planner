import { toPng } from "html-to-image";

type Options = {
  mode: "DOWNLOAD" | "CLIPBOARD" | "DISPLAY";
};
export async function exportImage(
  element: HTMLDivElement | null,
  opt: Options = { mode: "DOWNLOAD" }
) {
  if (element) {
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
