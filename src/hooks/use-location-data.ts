"use client";

import { fetchLocationData, LocationData } from "@/lib/api/location.api";
import { useQuery } from "@tanstack/react-query";

export function useLocationData() {
  return useQuery<LocationData>({
    queryKey: ["location-data"],
    queryFn: fetchLocationData,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
