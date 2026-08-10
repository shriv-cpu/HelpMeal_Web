"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const technologies = [
  "Next.js",
  "TypeScript",
  "React",
  "PostgreSQL",
  "Neon",
  "Drizzle ORM",
  "Clerk",
  "Tailwind CSS",
];

const missionCards = [
  {
    icon: "🍱",
    title: "Have extra food?",
    text: "Post what you have and let people nearby know it's available.",
    type: "dark",
  },
  {
    icon: "📍",
    title: "Need food nearby?",
    text: "Discover available food shared by people in your community.",
    type: "white",
  },
  {
    icon: "🤝",
    title: "Make a connection",
    text: "A simple connection can keep good food from becoming waste.",
    type: "white",
  },
  {
    icon: "🌱",
    title: "Create less waste",
    text: "Every shared meal is a small step toward a more thoughtful community.",
    type: "green",
  },
];

const steps = [
  {
    number: "01",
    icon: "📤",
    title: "Share",
    text: "Have extra food? Add the details, quantity, location, and availability.",
  },
  {
    number: "02",
    icon: "🔎",
    title: "Discover",
    text: "Browse food shared by people around you and find something that works for you.",
  },
  {
    number: "03",
    icon: "🤝",
    title: "Connect",
    text: "Claim the food and help make sure a useful meal reaches someone instead of going to waste.",
  },
];

const productSteps = [
  "Post Food",
  "Browse Food",
  "View Details",
  "Claim Food",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8faf8] text-[#151b17]">
      {/* =========================================================
          NAVBAR
      ========================================================= */}

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <motion.div
              whileHover={{
                rotate: -8,
                scale: 1.08,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#198754] text-xl text-white shadow-lg shadow-[#198754]/20"
            >
              ♥
            </motion.div>

            <div className="leading-none">
              <h1 className="text-xl font-bold tracking-tight">
                HelpMeal
              </h1>

              <p className="mt-1.5 text-[10px] font-semibold tracking-[0.15em] text-gray-500">
                FOOD • SHARE • HELP
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-gray-600 transition hover:text-[#198754] sm:block"
            >
              Log in
            </Link>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/signup"
                className="block rounded-xl bg-[#198754] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#198754]/10 transition hover:bg-[#157347]"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative mx-auto max-w-7xl px-5 pt-8 sm:px-8 sm:pt-12">
        {/* Background glow 1 */}
        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-[#d8ecdd] blur-2xl"
        />

        {/* Background glow 2 */}
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute -left-32 top-48 h-64 w-64 rounded-full bg-[#e4f2e7] blur-2xl"
        />

        <div className="relative overflow-hidden rounded-[32px] bg-[#eaf5ec]">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#d4ead9]" />

          <div className="absolute -bottom-32 right-32 h-72 w-72 rounded-full bg-[#dff0e2]" />

          <div className="grid min-h-[610px] items-center lg:grid-cols-[1.1fr_0.9fr]">
            {/* Hero text */}

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="relative z-10 px-7 py-14 sm:px-12 lg:px-16 lg:py-20"
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-[#c7e3cd] bg-white/70 px-4 py-2 text-xs font-bold tracking-wide text-[#198754]"
              >
                <motion.span
                  animate={{
                    scale: [1, 1.4, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="h-2 w-2 rounded-full bg-[#198754]"
                />

                FOOD SHARING FOR YOUR COMMUNITY
              </motion.div>

              <motion.h2
                variants={fadeUp}
                className="mt-7 max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
              >
                Good food
                <br />

                <motion.span
                  animate={{
                    backgroundPosition: [
                      "0% 50%",
                      "100% 50%",
                      "0% 50%",
                    ],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="bg-gradient-to-r from-[#198754] via-[#2ca565] to-[#198754] bg-[length:200%_auto] bg-clip-text text-transparent"
                >
                  deserves another table.
                </motion.span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mt-7 max-w-xl text-base leading-7 text-gray-600 sm:text-lg"
              >
                HelpMeal connects people with extra food
                to people who can use it. Share what you
                have, discover what is nearby, and help
                reduce unnecessary food waste.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-9 flex flex-col gap-3 sm:flex-row"
              >
                <motion.div
                  whileHover={{
                    scale: 1.04,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                >
                  <Link
                    href="/signup"
                    className="block rounded-xl bg-[#198754] px-7 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-[#198754]/20 transition hover:bg-[#157347]"
                  >
                    Start Sharing Food →
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{
                    scale: 1.04,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                >
                  <Link
                    href="/login"
                    className="block rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-center text-sm font-semibold text-gray-700 transition hover:border-[#198754] hover:text-[#198754]"
                  >
                    Find Food
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-gray-500"
              >
                <span className="flex items-center gap-2">
                  <span className="text-[#198754]">✓</span>
                  Simple to share
                </span>

                <span className="flex items-center gap-2">
                  <span className="text-[#198754]">✓</span>
                  Community driven
                </span>

                <span className="flex items-center gap-2">
                  <span className="text-[#198754]">✓</span>
                  Built for real impact
                </span>
              </motion.div>
            </motion.div>

            {/* Hero visual */}

            <div className="relative hidden h-full lg:block">
              <motion.div
                animate={{
                  y: [0, -18, 0],
                  rotate: [0, 6, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute right-12 top-16 text-6xl opacity-30"
              >
                🥗
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute right-40 bottom-24 text-5xl opacity-30"
              >
                🍎
              </motion.div>

              {/* Main card */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 100,
                  rotate: 8,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  rotate: 2,
                }}
                transition={{
                  duration: 1,
                  delay: 0.3,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -8,
                  rotate: 0,
                  scale: 1.02,
                }}
                className="absolute right-16 top-1/2 w-[340px] -translate-y-1/2 overflow-hidden rounded-[28px] border border-white bg-white shadow-2xl shadow-[#198754]/10"
              >
                <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-[#dcefe1] to-[#f5f8f5] text-8xl">
                  <motion.span
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                  >
                    🍲
                  </motion.span>

                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#198754] shadow-sm">
                    AVAILABLE
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#198754]">
                        Freshly shared
                      </p>

                      <h3 className="mt-1 text-lg font-bold">
                        Homemade Dinner
                      </h3>
                    </div>

                    <span className="rounded-full bg-[#eaf5ec] px-2.5 py-1 text-xs font-semibold text-[#198754]">
                      Today
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-500">
                    <p>📦 Serves 4 people</p>
                    <p>📍 Nearby</p>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4 text-sm font-semibold text-[#198754]">
                    View Food →
                  </div>
                </div>
              </motion.div>

              {/* Floating card */}

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.7,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 1,
                }}
                whileHover={{
                  scale: 1.05,
                }}
                className="absolute bottom-16 left-10 w-52 -rotate-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf5ec]"
                  >
                    🤝
                  </motion.div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Community
                    </p>

                    <p className="text-sm font-bold">
                      Food shared
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MISSION
      ========================================================= */}

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.2,
        }}
        variants={stagger}
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <motion.p
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-[0.18em] text-[#198754]"
            >
              The idea
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="mt-4 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
            >
              Sometimes the problem isn't a lack of food.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-base leading-7 text-gray-600"
            >
              Food can be left over after a family
              gathering, restaurant service, office event,
              hostel meal, or simply at home.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-xl text-base leading-7 text-gray-600"
            >
              At the same time, someone nearby may be
              looking for exactly that. HelpMeal is built
              around making that connection simpler.
            </motion.p>
          </div>

          <motion.div
            variants={stagger}
            className="grid gap-4 sm:grid-cols-2"
          >
            {missionCards.map((card) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                transition={{
                  duration: 0.25,
                }}
                className={`rounded-3xl p-7 shadow-sm ${
                  card.type === "dark"
                    ? "bg-[#151b17] text-white"
                    : card.type === "green"
                      ? "bg-[#eaf5ec]"
                      : "border border-gray-200 bg-white"
                }`}
              >
                <motion.div
                  whileHover={{
                    scale: 1.2,
                    rotate: 8,
                  }}
                  className="text-4xl"
                >
                  {card.icon}
                </motion.div>

                <h3 className="mt-6 text-xl font-bold">
                  {card.title}
                </h3>

                <p
                  className={`mt-3 text-sm leading-6 ${
                    card.type === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {card.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}

      <section className="border-y border-gray-200 bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={stagger}
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24"
        >
          <div className="text-center">
            <motion.p
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-[0.18em] text-[#198754]"
            >
              How it works
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
            >
              Three simple steps.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500"
            >
              HelpMeal keeps food sharing simple so people
              can focus on helping each other.
            </motion.p>
          </div>

          <div className="relative mt-14 grid gap-8 md:grid-cols-3">
            <div className="absolute left-[17%] right-[17%] top-16 hidden h-px bg-gray-200 md:block" />

            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={fadeUp}
                whileHover={{
                  y: -10,
                }}
                className="relative rounded-3xl bg-[#f8faf8] p-8"
              >
                <motion.div
                  whileHover={{
                    scale: 1.1,
                  }}
                  className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-[#198754] text-sm font-bold text-white shadow-lg shadow-[#198754]/20"
                >
                  {step.number}
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: Number(step.number) * 0.3,
                  }}
                  className="mt-7 text-4xl"
                >
                  {step.icon}
                </motion.div>

                <h3 className="mt-6 text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* =========================================================
          TECH SECTION
      ========================================================= */}

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.2,
        }}
        variants={fadeUp}
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24"
      >
        <div className="overflow-hidden rounded-[32px] bg-[#151b17]">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-14">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8bd0a2]">
                Built with purpose
              </p>

              <h2 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
                From an idea to a working product.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-gray-400">
                HelpMeal is being built as a full-stack
                application focused on solving a real-world
                problem with a practical user experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                    whileInView={{
                      opacity: 1,
                      scale: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.06,
                    }}
                    whileHover={{
                      scale: 1.08,
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center border-t border-white/10 bg-white/[0.03] p-8 lg:border-l lg:border-t-0">
              <motion.div
                whileHover={{
                  scale: 1.03,
                }}
                className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.05] p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-400">
                    Product flow
                  </span>

                  <motion.span
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="rounded-full bg-[#198754]/20 px-3 py-1 text-xs font-semibold text-[#8bd0a2]"
                  >
                    BUILDING
                  </motion.span>
                </div>

                <div className="mt-7 space-y-4">
                  {productSteps.map((step, index) => (
                    <div key={step}>
                      <motion.div
                        whileHover={{
                          x: 6,
                        }}
                        className="flex items-center gap-4"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#198754] text-sm font-bold text-white">
                          0{index + 1}
                        </span>

                        <span className="text-sm font-semibold text-white">
                          {step}
                        </span>
                      </motion.div>

                      {index < productSteps.length - 1 && (
                        <div className="ml-5 h-5 border-l border-white/10" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.7,
          }}
          className="relative overflow-hidden rounded-[32px] bg-[#eaf5ec] px-7 py-16 text-center sm:px-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d4ead9]"
          />

          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
            className="absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-[#dff0e2]"
          />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#198754]">
              Start today
            </p>

            <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
              Good food shouldn't become waste.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
              Share what you have. Find what you need.
              Help someone in your community.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                <Link
                  href="/signup"
                  className="block rounded-xl bg-[#198754] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#198754]/20 transition hover:bg-[#157347]"
                >
                  Create Your Account →
                </Link>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                <Link
                  href="/login"
                  className="block rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-[#198754] hover:text-[#198754]"
                >
                  Log In
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="font-bold">
              HelpMeal
            </p>

            <p className="mt-1 text-xs text-gray-500">
              FOOD • SHARE • HELP
            </p>
          </div>

          <p className="text-xs text-gray-400">
            Built to help good food find another table.
          </p>
        </div>
      </footer>
    </main>
  );
}