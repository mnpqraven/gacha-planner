import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";
import { List } from "@/lib/generics";

export async function GET() {
  const patch_banners = await get<PatchBanner[]>("patch_banners");
  if (patch_banners)
    return NextResponse.json<List<PatchBanner>>({ list: patch_banners });
  return new NextResponse("getting edge config data failed", {
    status: 400,
    headers: { "content-type": "application/json" },
  });
}

export interface PatchBanner {
  phase: 1 | 2;
  version: `${number}.${number}.${1 | 2}`;
  chara: [number, number, number, number];
  lc: [number, number, number, number];
}
