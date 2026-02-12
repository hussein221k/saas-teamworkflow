"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollSequenceProps {
  frameCount: number;
  folderPath: string; // e.g. "/frames/"
  extension?: string;
}

export default function ScrollSequence({ frameCount, folderPath, extension = "jpg" }: ScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Load images
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const currentFrame = (index: number) => 
      `${folderPath}${index.toString().padStart(4, '0')}.${extension}`;

    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
            loadedCount++;
            if (loadedCount === frameCount) {
                render();
            }
        };
        loadedImages.push(img);
    }

    const sequenceState = { frame: 0 };

    function render() {
      if (!context || !canvas) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      const img = loadedImages[sequenceState.frame];
      if (img) {
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShiftX = (canvas.width - img.width * ratio) / 2;
        const centerShiftY = (canvas.height - img.height * ratio) / 2;
        context.drawImage(
          img, 
          0, 0, img.width, img.height,
          centerShiftX, centerShiftY, img.width * ratio, img.height * ratio
        );
      }
    }

    gsap.to(sequenceState, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=3000",
        scrub: 0.5,
        pin: true,
      },
      onUpdate: render
    });

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [frameCount, folderPath, extension]);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black z-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-6">
        <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter text-white opacity-20 uppercase">
          Neural Architecture <br /> <span className="text-primary">Zooming Focal Point</span>
        </h2>
        <p className="mt-4 text-zinc-500 font-bold tracking-[0.3em] uppercase text-xs opacity-50">
          Scroll to deconstruct workspace
        </p>
      </div>

      <div className="absolute inset-0 border-20 border-black/50 pointer-events-none" />
    </div>
  );
}
