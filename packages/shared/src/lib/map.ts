import { getBrandConfig } from "@brand/config";
import L from "leaflet";

const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

// Since late August 2026 CARTO answers a keyless raster request with HTTP 200 and a tile that has
// "API KEY REQUIRED" burned into it (measured 2026-09-20: same bytes with or without a Referer), so
// a missing NEXT_PUBLIC_CARTO_BASEMAPS_KEY is a watermarked map, never an error anyone gets paged
// for. The key is public by construction (it rides in every tile URL the browser requests); what
// protects it is the website restriction on it in CARTO's dashboard.
//
// Free tier: 5M tile requests a month; terms at https://carto.com/basemaps/apikey. CARTO calls this
// raster endpoint "being retired" (no date, https://docs.carto.com/faqs/carto-basemaps); its
// replacement is MapLibre GL vector styles, which is a rewrite of both map components.
function cartoKeyQuery() {
  const key = process.env.NEXT_PUBLIC_CARTO_BASEMAPS_KEY;
  return key ? `?key=${encodeURIComponent(key)}` : "";
}

export function addBrandTileLayer(map: L.Map) {
  const { colorScheme } = getBrandConfig();
  const style = colorScheme === "dark" ? "dark_all" : "light_all";

  L.tileLayer(
    `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png${cartoKeyQuery()}`,
    { attribution: MAP_ATTRIBUTION },
  ).addTo(map);
}
