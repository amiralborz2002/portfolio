"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type PanInfo,
  type TargetAndTransition,
} from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  /** Photo in /public; the initials show if it is missing or fails to load. */
  avatar: string;
};

/*
 * PLACEHOLDER CONTENT: replace every entry with a real recommendation
 * (and real names) before publishing. Desktop shows nine, three per column.
 */
const TESTIMONIALS: Testimonial[] = [
  {
    id: "a1",
    quote:
      "I had the pleasure of working with Amir at NobarCloud, and he is one of the most patient, approachable, and supportive colleagues I've had the opportunity to work with. As a Product Manager, Amir was always willing to make time for product discussions, even with his busy schedule. Whenever I had questions, he took the time to explain things clearly. What I appreciated most was his honesty—if he wasn't completely sure, he would investigate and follow up. His calm attitude, sense of humor, and genuine care create an environment where collaboration feels effortless.",
    name: "Sina Shah Oveisi",
    role: "Software Engineer",
    avatar: "/images/testimonials/1.jpg",
  },
  {
    id: "a2",
    quote:
      "From the very first meeting, he was so warm and friendly that it didn’t feel like we were meeting for the first time. Amir had a great way of injecting humor and positive energy into the team while never crossing work boundaries. His work is exceptionally clean, precise, and high-quality — the kind you rarely see. He knows his craft very well, constantly seeks feedback, and has a strong self-improving mindset. He’s smart, multi-talented, and simply enjoyable to work with.",
    name: "Mohammad Mohagheghian",
    role: "Frontend Engineer",
    avatar: "/images/testimonials/2.jpg",
  },
  {
    id: "a3",
    quote:
      "I worked with Amir at NobarCloud and found him to be a reliable and skilled Product Designer. He has a great approach to design systems and, importantly, he understands technical constraints well, which made our collaboration between the product and engineering sides very smooth. He is a supportive teammate, pays good attention to detail, and is easy to work with.",
    name: "Amirhossein Jafari",
    role: "DevOps & Cloud Infrastructure Engineer",
    avatar: "/images/testimonials/3.jpg",
  },
  {
    id: "a4",
    quote:
      "Working with Amir has been a pleasure. As a developer, I have had no issues working on Amir's Figma as he works in a clean and organized manner. Amir is patient, polite, and passionate, which makes collaboration stress-free and easy.",
    name: "Alireza Mohseni",
    role: "Front-End Developer",
    avatar: "/images/testimonials/4.jpg",
  },
  {
    id: "a5",
    quote:
      "As a UI/UX Designer, Amir works well outside conventional frameworks and always strives to challenge his past self. That's why you can see such variety and quality improvement throughout his work. He is highly observant, detail-oriented, and keeps himself updated with the latest trends. Working with Amir is effortless and frictionless for me because he truly knows his craft.",
    name: "Human Rahmani",
    role: "Art Director",
    avatar: "/images/testimonials/5.jpg",
  },
  {
    id: "a6",
    quote:
      "One of the most important things I noticed while working on various projects with Amir was his documentation skills. Beyond that, his attention to detail and user-centric approach to design are among his greatest strengths. Apart from these, staying constantly updated in his field has had a massive positive impact on his output.",
    name: "Pouya Mohammadi",
    role: "SEO Expert",
    avatar: "/images/testimonials/6.jpg",
  },
  {
    id: "a7",
    quote:
      "I wanted to leave a note here to say how truly inspired I am by your drive for success and constant forward momentum. The way you patiently ask about everyone's tastes just to recommend a podcast to them is wonderful too. Work-wise, there's no need to say how expert and professional you are. I'm proud to have you on our team.",
    name: "Zohre Karrabi",
    role: "Account Manager",
    avatar: "/images/testimonials/7.jpg",
  },
  {
    id: "a8",
    quote:
      "A very young Designer, but has great passions in his career. I see he always uses his free time to improve his skills. I wish I was his age when starting my work.",
    name: "Hamid Mansouri",
    role: "Unreal Engine Developer",
    avatar: "/images/testimonials/8.jpg",
  },
  {
    id: "a9",
    quote:
      "Despite his young age, Amir is constantly pursuing growth and learning in his areas of interest. Based on his passion for photography, we had many conversations where he asked great questions. I'm glad he never settles for standing still, and I hope he continues on this path of progress wherever he goes.",
    name: "Amirhosein Lashgari",
    role: "Cinematographer | Photographer",
    avatar: "/images/testimonials/9.jpg",
  },
];

export function AboutTestimonials() {
  return (
    <>
      <ParallaxColumns />
      <MobileDeck />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop: three columns, only the centre one drifts                   */
/* ------------------------------------------------------------------ */

// Columns are slices of the data: 0-2 left, 3-5 centre, 6-8 right.
const LEFT = TESTIMONIALS.slice(0, 3);
const CENTER = TESTIMONIALS.slice(3, 6);
const RIGHT = TESTIMONIALS.slice(6, 9);

// The centre column drifts from DRIFT px below its resting spot to DRIFT px
// above it over the whole scroll: slow enough to read while it moves.
const DRIFT = 48;

function ParallaxColumns() {
  const reduceMotion = !!useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);

  // 0 as the grid's top enters at the bottom of the viewport, 1 as its bottom
  // reaches the bottom. That end point is always reachable, even this close
  // to the foot of the page, so the full drift always plays out.
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start end", "end end"] });
  // A light spring keeps wheel steps from making the column judder.
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const centerY = useTransform(progress, [0, 1], [DRIFT, -DRIFT]);

  return (
    <div ref={gridRef} className="hidden items-start gap-6 md:grid md:grid-cols-3">
      <Column items={LEFT} />

      {/*
        The centre column alone is masked, so the static side columns stay
        crisp. The wrapper reaches 96px past the grid at both ends: the column
        drifts into that margin and fades as it nears the edge instead of
        being clipped.
      */}
      <div
        className="-my-24 self-stretch overflow-hidden py-24"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, #000 96px, #000 calc(100% - 96px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 96px, #000 calc(100% - 96px), transparent)",
        }}
      >
        <Column items={CENTER} y={reduceMotion ? undefined : centerY} />
      </div>

      <Column items={RIGHT} />
    </div>
  );
}

function Column({ items, y }: { items: Testimonial[]; y?: MotionValue<number> }) {
  return (
    <motion.div style={{ y }} className={cn("flex flex-col gap-6", y && "will-change-transform")}>
      {items.map((t) => (
        <TestimonialCard key={t.id} testimonial={t} />
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile: swipeable stacked deck (no scroll-jacking)                   */
/* ------------------------------------------------------------------ */

const VISIBLE = 4; // cards drawn in the stack; the rest wait invisibly behind
const SWIPE_THRESHOLD = 80; // px of horizontal drag that counts as "next"

// Visual state by position in the deck (0 = front). Alternating tilt makes
// the stack read as a loose physical deck, so it looks swipeable.
function stackPose(position: number): TargetAndTransition {
  const poses = [
    { scale: 1, opacity: 1, y: 0, rotate: 0, zIndex: 50 },
    { scale: 0.95, opacity: 0.7, y: 16, rotate: -2.5, zIndex: 40 },
    { scale: 0.9, opacity: 0.45, y: 32, rotate: 2.5, zIndex: 30 },
    { scale: 0.85, opacity: 0.2, y: 48, rotate: -1.5, zIndex: 20 },
  ];
  return { x: 0, ...poses[Math.min(position, poses.length - 1)] };
}

function MobileDeck() {
  const reduceMotion = !!useReducedMotion();
  // The deck, front to back; cycling rotates this array.
  const [order, setOrder] = useState(() => TESTIMONIALS.map((t) => t.id));
  const [direction, setDirection] = useState<1 | -1>(1);

  const byId = new Map(TESTIMONIALS.map((t) => [t.id, t]));
  const activeIndex = TESTIMONIALS.findIndex((t) => t.id === order[0]);
  const total = TESTIMONIALS.length;

  const next = () => {
    setDirection(1);
    setOrder(([first, ...rest]) => [...rest, first]);
  };

  const prev = () => {
    setDirection(-1);
    setOrder((deck) => [deck[deck.length - 1], ...deck.slice(0, -1)]);
  };

  const goTo = (index: number) => {
    const id = TESTIMONIALS[index].id;
    if (id === order[0]) return;
    setDirection(index > activeIndex ? 1 : -1);
    setOrder((deck) => {
      const at = deck.indexOf(id);
      return [...deck.slice(at), ...deck.slice(0, at)];
    });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    }
  };

  // A drag must never also count as a tap on the card.
  const dragged = useRef(false);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -500) next();
    else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 500) prev();
  };

  const variants = {
    enter: (dir: 1 | -1): TargetAndTransition =>
      reduceMotion
        ? { opacity: 0 }
        : dir > 0
          ? { opacity: 0, scale: 0.8, y: 64, x: 0, rotate: 4, zIndex: 10 }
          : { opacity: 0, scale: 1, y: 0, x: 220, rotate: 8, zIndex: 60 },
    exit: (dir: 1 | -1): TargetAndTransition =>
      reduceMotion
        ? { opacity: 0, transition: { duration: 0.2 } }
        : dir > 0
          ? { opacity: 0, x: -240, y: -8, rotate: -10, zIndex: 60, transition: { duration: 0.4, ease } }
          : { opacity: 0, scale: 0.8, y: 64, zIndex: 10, transition: { duration: 0.35, ease } },
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onKeyDown={onKeyDown}
      // overflow-anchor: none stops the browser's scroll anchoring from picking a
      // card that is mid-transition and nudging the page to compensate.
      className="flex flex-col [overflow-anchor:none] md:hidden"
    >
      {/* Fixed height: cards are absolutely positioned, so the deck's footprint
          never changes while they enter, exit and restack. */}
      <div className="relative h-[450px] shrink-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-10 bottom-0 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(249_115_22/0.10),transparent)] blur-2xl"
        />
        <AnimatePresence initial={false} custom={direction}>
          {order.slice(0, VISIBLE).map((id, position) => {
            const t = byId.get(id)!;
            const front = position === 0;
            return (
              <motion.div
                key={id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate={stackPose(position)}
                exit="exit"
                transition={{ duration: reduceMotion ? 0.2 : 0.5, ease }}
                drag={front && !reduceMotion ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onPointerDown={(e) => {
                  dragged.current = false;
                  // Mouse/touch presses must not focus the card: mobile browsers
                  // scroll a newly focused element into view, which made the page
                  // jump mid-transition. Keyboard focus (Tab) is unaffected.
                  e.preventDefault();
                }}
                onDragStart={() => (dragged.current = true)}
                onDragEnd={front ? onDragEnd : undefined}
                onTap={
                  front
                    ? (e) => {
                        e.preventDefault();
                        if (!dragged.current) next();
                      }
                    : undefined
                }
                onKeyDown={
                  front
                    ? (e) => {
                        // Enter arrives via onTap; Space is the other button key.
                        if (e.key === " ") {
                          e.preventDefault();
                          next();
                        }
                      }
                    : undefined
                }
                role={front ? "button" : undefined}
                tabIndex={front ? 0 : -1}
                aria-hidden={!front}
                aria-label={front ? "Show next testimonial" : undefined}
                className={cn(
                  // Solid base so stacked glass cards never show through each other;
                  // touch-pan-y keeps vertical page scrolling free while x is dragged.
                  "absolute inset-x-0 top-0 origin-bottom touch-pan-y rounded-3xl bg-background",
                  front ? "cursor-grab active:cursor-grabbing" : "pointer-events-none",
                )}
              >
                <TestimonialCard testimonial={t} className="h-[380px] select-none" clamp />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-4">
        <ControlButton label="Previous testimonial" onClick={prev}>
          <ChevronLeft className="size-5" strokeWidth={1.75} />
        </ControlButton>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  goTo(i);
                }}
                aria-label={`Show testimonial ${i + 1} of ${total}`}
                aria-current={i === activeIndex ? "true" : undefined}
                className="group flex h-6 items-center px-0.5"
              >
                <span
                  className={cn(
                    "block h-1 rounded-full transition-all duration-500 ease-apple",
                    i === activeIndex ? "w-5 bg-accent" : "w-1.5 bg-white/15",
                  )}
                />
              </button>
            ))}
          </div>
          <p aria-live="polite" className="font-mono text-xs text-subtle tabular-nums">
            <span className="text-zinc-300">{String(activeIndex + 1).padStart(2, "0")}</span>
            {" / "}
            {String(total).padStart(2, "0")}
            <span className="sr-only">
              : {byId.get(order[0])!.name}, {byId.get(order[0])!.role}
            </span>
          </p>
        </div>

        <ControlButton label="Next testimonial" onClick={next}>
          <ChevronRight className="size-5" strokeWidth={1.75} />
        </ControlButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared card                                                          */
/* ------------------------------------------------------------------ */

function TestimonialCard({
  testimonial: { quote, name, role, avatar },
  className,
  clamp = false,
}: {
  testimonial: Testimonial;
  className?: string;
  /** Fixed-height deck cards cap the quote so long copy never overflows. */
  clamp?: boolean;
}) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <figure
      className={cn(
        "group flex flex-col rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md",
        "shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)] transition-colors duration-500 ease-apple hover:border-white/20",
        className,
      )}
    >
      <Quote
        aria-hidden
        className="size-7 text-white/10 transition-colors duration-300 group-hover:text-accent/40"
        strokeWidth={1.5}
        fill="currentColor"
      />
      <blockquote
        className={cn("mt-5 mb-8 text-base leading-relaxed text-zinc-300 lg:text-lg", clamp && "line-clamp-7")}
      >
        <p>&ldquo;{quote}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 border-t border-white/5 pt-5">
        <span
          aria-hidden
          className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400/70 to-rose-500/40 text-xs font-semibold text-white/80 ring-1 ring-white/10"
        >
          {initials}
          {!avatarFailed && (
            <Image
              src={avatar}
              alt=""
              width={40}
              height={40}
              draggable={false}
              onError={() => setAvatarFailed(true)}
              className="absolute inset-0 size-full object-cover"
            />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="truncate text-sm text-zinc-500">{role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      aria-label={label}
      whileTap={{ scale: 0.92 }}
      className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 backdrop-blur-md transition-colors duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      {children}
    </motion.button>
  );
}
