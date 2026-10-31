"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import styles from "./FooterWorkshopScene.module.css";

const CAMPUS_LOCATION: [number, number] = [28.6206698, 77.0924931];

export default function CampusMap() {
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mapElement.current;
    if (!container) return;

    let map: LeafletMap | undefined;
    let disposed = false;
    void import("leaflet")
      .then(({ default: L }) => {
        if (disposed) return;

        map = L.map(container, { scrollWheelZoom: false }).setView(
          CAMPUS_LOCATION,
          16,
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
          maxZoom: 19,
        }).addTo(map);

        const marker = L.marker(CAMPUS_LOCATION, {
          alt: "Maharaja Surajmal Institute of Technology",
          icon: L.divIcon({
            className: styles.mapMarker,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
          title: "Maharaja Surajmal Institute of Technology",
        }).addTo(map);

        marker.bindPopup(
          "<strong>Maharaja Surajmal Institute of Technology</strong><br />C-4 Janakpuri, New Delhi - 110058",
        );
        map.invalidateSize();
      })
      .catch((error: unknown) => {
        console.error("Unable to load the MSIT campus map:", error);
      });

    return () => {
      disposed = true;
      map?.remove();
    };
  }, []);

  return (
    <div
      className={styles.mapFrame}
      role="region"
      aria-label="Interactive map of Maharaja Surajmal Institute of Technology"
    >
      <div ref={mapElement} className={styles.mapCanvas} />
    </div>
  );
}
