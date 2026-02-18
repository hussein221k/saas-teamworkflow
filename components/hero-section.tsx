import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HeroHeader } from "./header";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
} as const;

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="mask-b-from-35% mask-b-to-90% absolute inset-0 top-56 -z-20 lg:top-32"
            >
              <Image
                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                alt="background"
                className="hidden size-full dark:block "
                width="3276"
                height="4095"
                suppressHydrationWarning
              />
            </AnimatedGroup>

            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
            />

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="dashboard"
                    className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                  >
                    <span className="text-foreground text-sm font-bold tracking-tight uppercase">
                      Introducing Neural Task Subroutines
                    </span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mx-auto mt-8 max-w-4xl text-balance text-5xl font-black md:text-7xl lg:mt-16 xl:text-[5.5rem] tracking-tighter uppercase"
                >
                  Strategic Neural Workflow Management
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground font-medium"
                >
                  Highly customizable tactical clusters for building modern
                  enterprises. Orchestrate your team with the precision and
                  power of UNIT-01 architecture.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                  <div
                    key={1}
                    className="bg-primary/20 rounded-[calc(var(--radius-xl)+0.125rem)] border border-primary/20 p-0.5 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-8 h-12 text-xs font-black uppercase tracking-widest bg-primary hover:bg-primary/90"
                    >
                      <Link href="/admin/dashboard">
                        <span className="text-nowrap">Admin Dashboard</span>
                      </Link>
                    </Button>
                  </div>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <Image
                    className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block object-cover"
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2700"
                    alt="Strategic Dashboard Mockup"
                    width="2700"
                    height="1440"
                    suppressHydrationWarning
                  />
                  <Image
                    className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden object-cover"
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2700"
                    alt="Modern Workflow Interface"
                    width="2700"
                    height="1440"
                    suppressHydrationWarning
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
        <section className="bg-background pb-16 pt-16 md:pb-32">
          <div className="group relative m-auto max-w-5xl px-6">
            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
              <Link
                href="dashboard"
                className="block text-sm font-black uppercase tracking-[0.3em] text-primary duration-150 hover:opacity-75"
              >
                <span>JOIN THE NETWORK</span>
                <ChevronRight className="ml-1 inline-block size-3" />
              </Link>
            </div>
            <div className="group-hover:blur-sm mx-auto mt-12 grid max-w-2xl grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14 grayscale opacity-40">
              <div className="flex items-center justify-center gap-2">
                <Image
                  className="h-6 w-auto dark:invert"
                  src="https://raw.githubusercontent.com/prisma/prisma/main/packages/client/images/prisma-logo.svg"
                  alt="Prisma Logo"
                  width={100}
                  height={24}
                  suppressHydrationWarning
                />
                <span className="text-sm font-black tracking-tighter hidden md:block">
                  PRISMA
                </span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Image
                  className="h-5 w-auto dark:invert"
                  src="https://raw.githubusercontent.com/arcjet/arcjet/main/logo.svg"
                  alt="Arcjet Logo"
                  width={100}
                  height={20}
                  suppressHydrationWarning
                />
                <span className="text-sm font-black tracking-tighter hidden md:block uppercase">
                  Arcjet
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Image
                  className="h-5 w-auto dark:invert"
                  src="/next.svg"
                  alt="Next.js Logo"
                  width={100}
                  height={20}
                  suppressHydrationWarning
                />
                <span className="text-sm font-black tracking-tighter hidden md:block">
                  NEXT.JS
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center font-black text-[10px] text-white shadow-[0_0_10px_rgba(var(--primary),0.3)]">
                  U1
                </div>
                <span className="text-[10px] font-black tracking-[0.2em] hidden md:block text-zinc-400">
                  UNIT-01
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Image
                  className="h-4 w-auto dark:invert"
                  src="https://raw.githubusercontent.com/tailwindlabs/tailwindcss/master/.github/logo-light.svg"
                  alt="Tailwind Logo"
                  width={100}
                  height={16}
                  suppressHydrationWarning
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <Image
                  className="h-6 w-auto dark:invert"
                  src="https://tanstack.com/_next/static/media/logo-color-600w.ad391950.png"
                  alt="TanStack Logo"
                  width={100}
                  height={24}
                  suppressHydrationWarning
                />
                <span className="text-[10px] font-black tracking-tighter hidden md:block">
                  TANSTACK
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Image
                  className="h-5 w-auto dark:invert"
                  src="https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/logo.svg"
                  alt="Radix UI Logo"
                  width={100}
                  height={20}
                  suppressHydrationWarning
                />
                <span className="text-[10px] font-black tracking-tighter hidden md:block">
                  RADIX UI
                </span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center font-black text-[10px] text-white shadow-[0_0_10px_rgba(var(--primary),0.3)]">
                  U1
                </div>
                <span className="text-[10px] font-black tracking-[0.2em] hidden md:block text-zinc-400">
                  UNIT-01
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
