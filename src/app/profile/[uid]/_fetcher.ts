import { MihomoResponse } from "../types";

export async function getMihomoInfo(
  uid: string,
  lang: string = "en"
): Promise<MihomoResponse> {
  const req = await fetch(
    `https://api.mihomo.me/sr_info_parsed/${uid}?lang=${lang}`
  );
  if (req.ok) {
    return req.json();
  }
  return Promise.reject("Fetching from Mihomo API failed");
}