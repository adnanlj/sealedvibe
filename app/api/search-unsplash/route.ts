import { NextResponse } from "next/server";

// Curated high-resolution aesthetic fallbacks for popular queries
const CURATED_THEMES: Record<string, string[]> = {
  apple: [
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&auto=format&fit=crop&q=80",
  ],
  sunset: [
    "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
  ],
  coffee: [
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
  ],
  love: [
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=800&auto=format&fit=crop&q=80",
  ],
  stars: [
    "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
  ],
  wedding: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80",
  ],
  flowers: [
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80",
  ]
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQuery = searchParams.get("query") || "scenery";
    const query = rawQuery.trim().toLowerCase();
    
    let photos: Array<{ id: string; url: string; downloadUrl: string; photographer: string; photographerUrl: string }> = [];

    // 1. Try Unsplash with browser-like headers
    try {
      const unsplashRes = await fetch(
        `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=16`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "application/json",
            "Referer": "https://unsplash.com/",
          },
          cache: "no-store",
        }
      );

      if (unsplashRes.ok) {
        const data = await unsplashRes.json();
        if (data.results && data.results.length > 0) {
          photos = data.results.map((img: any) => ({
            id: img.id || Math.random().toString(),
            url: img.urls?.small || img.urls?.regular,
            downloadUrl: img.urls?.regular || img.urls?.small,
            photographer: img.user?.name || "Unsplash Creator",
            photographerUrl: img.user?.links?.html || "https://unsplash.com",
          }));
        }
      }
    } catch (uErr) {
      console.warn("Unsplash primary fetch warning:", uErr);
    }

    // 2. If Unsplash returned no results or was blocked (401/403), use Wikimedia Commons Free Photo API
    if (photos.length === 0) {
      try {
        const wikiRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=12&prop=pageimages&piprop=thumbnail&pithumbsize=800&format=json&origin=*`,
          { cache: "no-store" }
        );

        if (wikiRes.ok) {
          const wikiData = await wikiRes.json();
          const pages = wikiData.query?.pages || {};
          const wikiPhotos = Object.values(pages)
            .filter((p: any) => p.thumbnail?.source)
            .map((p: any) => ({
              id: `wiki-${p.pageid}`,
              url: p.thumbnail.source,
              downloadUrl: p.thumbnail.source,
              photographer: p.title || "Wikimedia Contributor",
              photographerUrl: `https://en.wikipedia.org/?curid=${p.pageid}`,
            }));

          if (wikiPhotos.length > 0) {
            photos = wikiPhotos;
          }
        }
      } catch (wErr) {
        console.warn("Wikipedia fallback search error:", wErr);
      }
    }

    // 3. If still empty, check curated catalog or generate high-quality aesthetic photography
    if (photos.length === 0) {
      const matchingKey = Object.keys(CURATED_THEMES).find(k => query.includes(k) || k.includes(query));
      const fallbackList = matchingKey ? CURATED_THEMES[matchingKey] : CURATED_THEMES.love;

      photos = fallbackList.map((url, idx) => ({
        id: `curated-${idx}`,
        url,
        downloadUrl: url,
        photographer: "SealedVibe Curated Collection",
        photographerUrl: "https://unsplash.com",
      }));
    }

    return NextResponse.json({ photos });
  } catch (err: any) {
    console.error("Image Search API Fallback:", err);
    // Never return 500/401 to client - return curated default photos so user experience is always flawless
    const defaultPhotos = CURATED_THEMES.love.map((url, idx) => ({
      id: `default-${idx}`,
      url,
      downloadUrl: url,
      photographer: "SealedVibe Collection",
      photographerUrl: "https://unsplash.com",
    }));

    return NextResponse.json({ photos: defaultPhotos });
  }
}
