"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 z-0 pointer-events-none"
      options={{
        fullScreen: { enable: false },
        fpsLimit: 120,
        particles: {
          color: {
            value: "#3b82f6", // Blue particles
          },
          links: {
            color: "#8b5cf6", // Purple links
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2.5,
            direction: "none",
            outModes: { default: "bounce" },
          },
          number: {
            density: { enable: true },
            value: 120,
          },
          opacity: {
            value: 0.4,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
          fullScreen: {
            enable: false,
          }
        },
        detectRetina: true,
      }}
    />
  );
}