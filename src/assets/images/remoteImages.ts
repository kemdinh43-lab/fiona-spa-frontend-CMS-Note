const UNSPLASH_BASE_URL = "https://images.unsplash.com";

interface RemoteImageOptions {
  width?: number;
  quality?: number;
}

export function unsplashImage(id: string, options: RemoteImageOptions = {}) {
  const width = options.width ?? 1200;
  const quality = options.quality ?? 82;

  return `${UNSPLASH_BASE_URL}/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;
}
