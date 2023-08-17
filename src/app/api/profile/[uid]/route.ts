import { MihomoResponse } from "@/app/profile/types";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: { uid: number };
}
export async function GET(request: NextRequest, { params }: Params) {
  const { searchParams } = new URL(request.url);
  const uid = params.uid;
  const lang = searchParams.get("lang") ?? "en";
  try {
    const req = await fetch(
      `https://api.mihomo.me/sr_info_parsed/${uid}?lang=${lang}`,
      { next: { revalidate: 15 } }
    );
    const data = await req.json();
    if (data["player"] === undefined || data["characters"] === undefined) {
      return NextResponse.json({ error: data["detail"] }, { status: 400 });
    } else {
      return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function getMihomoInfo(
  uid: string,
  lang: string = "en",
  host?: string
): Promise<MihomoResponse> {
  let url = `/api/profile/${uid}?lang=${lang}`;
  if (!!host) url = host + url;
  const response = await fetch(url);
  if (!response.ok) {
    return response.json().then(({ error }: { error: string }) => {
      return Promise.reject(error);
    });
  }
  return response.json();
}
