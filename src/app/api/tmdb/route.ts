import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const params = new URLSearchParams(searchParams);
  params.delete("path");
  params.set("api_key", API_KEY!);
  if (!params.has("language")) params.set("language", "en-US");

  const url = `${BASE_URL}${path}?${params.toString()}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "TMDB request failed" }, { status: 502 });
  }
}
