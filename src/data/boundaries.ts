import kazakhstanBoundary from "@/assets/boundaries/kazakhstan.geojson";
import kyrgyzstanBoundary from "@/assets/boundaries/kyrgyzstan.geojson";
import tajikistanBoundary from "@/assets/boundaries/tajikistan.geojson";
import turkmenistanBoundary from "@/assets/boundaries/turkmenistan.geojson";
import uzbekistanBoundary from "@/assets/boundaries/uzbekistan.geojson";

// Combine all country boundaries into a single FeatureCollection
export const COUNTRY_BOUNDARIES = {
  type: "FeatureCollection" as const,
  features: [
    ...(kazakhstanBoundary.features || []).map((f: any) => ({
      ...f,
      properties: { ...f.properties, name: "Kazakhstan" }
    })),
    ...(kyrgyzstanBoundary.features || []).map((f: any) => ({
      ...f,
      properties: { ...f.properties, name: "Kyrgyzstan" }
    })),
    ...(tajikistanBoundary.features || []).map((f: any) => ({
      ...f,
      properties: { ...f.properties, name: "Tajikistan" }
    })),
    ...(turkmenistanBoundary.features || []).map((f: any) => ({
      ...f,
      properties: { ...f.properties, name: "Turkmenistan" }
    })),
    ...(uzbekistanBoundary.features || []).map((f: any) => ({
      ...f,
      properties: { ...f.properties, name: "Uzbekistan" }
    })),
  ],
};
