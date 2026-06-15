"use client";

import { useEffect } from "react";
import { useAdvertStore } from "@/app/store/AdvertStore";
import { AdPopupController } from "@/app/components/ads/AdCard";

export default function AdvertsInit() {
  const { ads, loaded, fetchAds } = useAdvertStore();

  useEffect(() => {
    if (!loaded) fetchAds();
  }, [loaded, fetchAds]);

  return <AdPopupController ads={ads} />;
}
