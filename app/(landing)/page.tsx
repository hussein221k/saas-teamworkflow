'use client'

import React, { useEffect, useRef } from 'react'
import HeroSection from '@/components/hero-section'
import FeaturesSection from '@/components/features-section'
import InitializationShowcase from '@/components/initialization-showcase'
import gsap from 'gsap'

export default function Page() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: 'power3.out' }
      )
    }
  }, [])

  return (
    <div ref={containerRef} className="bg-zinc-950 min-h-screen">
        <HeroSection/>
        <InitializationShowcase />
        <FeaturesSection />
        <footer className="py-12 border-t border-white/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">
            © 2026 UNIT-01 NEURAL NETWORK. ALL PROTOCOLS RESERVED.
          </p>
        </footer>
    </div>
  )
}

