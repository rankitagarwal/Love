import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const heroLines = [
  "Riuuuuuuu ❤️",
  "Riaaaaaaa ❤️",
  "Yes, you! Please come here, I have something important to ask you 😄",
];

const questionChips = [
  "Terrible jokes included 😄",
  "Unlimited affection ❤️",
  "Tiny overthinking sessions 🤔",
  "Emotional support, both ways 🤗",
  "Infinite teasing 😜",
  "Beautiful memories forever ✨",
];

const noMessages = [
  "Nice try 😄",
  "Escape is not allowed.",
  "No refunds available.",
  "Lifetime subscription already activated.",
  "You really thought you had a choice? 😜",
  "You are already too invested 😄",
];

const confettiColors = ["#fb7185", "#f9a8d4", "#facc15", "#5eead4", "#a78bfa", "#ffffff"];
const heartGlyphs = ["❤️", "💕", "💖", "💗", "💘"];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function useRomanticMusic() {
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const start = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.gain.gain.value = isMuted ? 0 : 0.08;
      setIsPlaying(true);
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = isMuted ? 0 : 0.08;
    gain.connect(ctx.destination);

    const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 783.99];
    let step = 0;

    const playNote = () => {
      const oscillator = ctx.createOscillator();
      const noteGain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = melody[step % melody.length];
      noteGain.gain.setValueAtTime(0, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.72);
      oscillator.connect(noteGain);
      noteGain.connect(gain);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.74);
      step += 1;
    };

    playNote();
    timerRef.current = window.setInterval(playNote, 780);
    audioRef.current = { ctx, gain };
    setIsPlaying(true);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((current) => {
      const next = !current;
      if (audioRef.current) {
        audioRef.current.gain.gain.value = next ? 0 : 0.08;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      audioRef.current?.ctx?.close();
    };
  }, []);

  return { start, isMuted, toggleMute, isPlaying };
}

function FloatingHearts({ density = 30 }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: density }, (_, index) => ({
        id: index,
        left: randomBetween(0, 100),
        delay: randomBetween(0, 12),
        duration: randomBetween(11, 20),
        size: randomBetween(14, 34),
        drift: `${randomBetween(-90, 90)}px`,
        glyph: heartGlyphs[index % heartGlyphs.length],
      })),
    [density]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute bottom-[-12vh] animate-floatHeart select-none"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            fontSize: `${heart.size}px`,
            "--drift": heart.drift,
          }}
        >
          {heart.glyph}
        </span>
      ))}
    </div>
  );
}

function ConfettiBurst({ burst }) {
  const pieces = useMemo(() => {
    if (!burst) return [];
    return Array.from({ length: 170 }, (_, index) => ({
      id: `${burst}-${index}`,
      x: randomBetween(-46, 46),
      y: randomBetween(-42, 42),
      rotate: randomBetween(-360, 720),
      fallX: randomBetween(-48, 48),
      fallY: randomBetween(78, 116),
      color: confettiColors[index % confettiColors.length],
      width: randomBetween(6, 12),
      height: randomBetween(8, 18),
      duration: randomBetween(1.8, 3.4),
    }));
  }, [burst]);

  return (
    <AnimatePresence>
      {burst ? (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
          {pieces.map((piece) => (
            <motion.span
              key={piece.id}
              className="absolute left-1/2 top-[36%] rounded-sm"
              style={{ backgroundColor: piece.color, width: piece.width, height: piece.height }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
              animate={{
                x: `${piece.x + piece.fallX}vw`,
                y: `${piece.y + piece.fallY}vh`,
                opacity: 0,
                rotate: piece.rotate,
                scale: [1, 1.15, 0.7],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: piece.duration, ease: "easeOut" }}
            />
          ))}
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function MiniHeartEmitter({ hearts }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.span
            key={heart.id}
            className="absolute select-none text-2xl"
            initial={{ x: heart.x, y: heart.y, opacity: 0, scale: 0.4, rotate: heart.rotate }}
            animate={{
              x: heart.x + heart.drift,
              y: heart.y - randomBetween(95, 180),
              opacity: [0, 1, 0],
              scale: [0.4, 1.35, 0.8],
              rotate: heart.rotate + randomBetween(-40, 40),
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          >
            {heartGlyphs[heart.id % heartGlyphs.length]}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Hero({ onContinue }) {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const delays = [2000, 1700];
    if (lineIndex >= heroLines.length - 1) return undefined;
    const timeout = window.setTimeout(() => setLineIndex((current) => current + 1), delays[lineIndex]);
    return () => window.clearTimeout(timeout);
  }, [lineIndex]);

  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-12">
      <motion.div
        className="absolute inset-x-0 bottom-8 top-auto mx-auto h-40 w-40 rounded-full bg-white/50 blur-3xl sm:h-72 sm:w-72"
        animate={{ scale: [1, 1.18, 1], opacity: [0.42, 0.7, 0.42] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.p
          className="mb-4 rounded-full border border-white/70 bg-white/55 px-5 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-rose-700 shadow-sm"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Roka loading...
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.h1
            key={heroLines[lineIndex]}
            className="premium-text min-h-[132px] text-balance font-display text-4xl font-extrabold leading-tight sm:min-h-[168px] sm:text-6xl lg:text-7xl"
            initial={{ y: 28, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -22, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            {heroLines[lineIndex]}
          </motion.h1>
        </AnimatePresence>

        <motion.div
          className="mt-8 flex flex-col items-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: lineIndex === 2 ? 1 : 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.button
            type="button"
            onClick={onContinue}
            className="group rounded-full bg-[#401529] px-7 py-3.5 text-sm font-bold text-white shadow-velvet outline-none ring-rose-300 transition hover:bg-[#5a1b39] focus-visible:ring-4 sm:text-base"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            I am coming 😄
            <span className="ml-2 inline-block transition group-hover:translate-x-1">→</span>
          </motion.button>

          <motion.div
            className="text-4xl text-rose-500"
            animate={{ y: [0, 12, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ImportantNotice({ onContinue }) {
  return (
    <section className="relative z-10 grid min-h-screen place-items-center px-5 py-20">
      <motion.div
        className="glass-panel w-full max-w-2xl rounded-[2rem] p-6 sm:p-10"
        initial={{ opacity: 0, y: 38, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
      >
        <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl shadow-inner">
          ⚠️
        </div>
        <h2 className="text-center font-display text-3xl font-extrabold text-[#4b1731] sm:text-5xl">
          Important Notice ⚠️
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-center text-base leading-8 text-[#684458] sm:text-lg">
          This website contains one very difficult question. Are you sure you are able to answer it?
        </p>

        <motion.div
          className="mx-auto mt-8 max-w-md rounded-3xl border border-white/80 bg-white/60 px-5 py-5 text-center text-sm font-semibold leading-7 text-[#5a2b41] shadow-sm sm:text-base"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16, duration: 0.45 }}
        >
          Warning: answer carefully. Future emotional consequences may include smiling for no reason.
        </motion.div>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          {["Sounds good ❤️", "Proceed anyway 😄"].map((label) => (
            <motion.button
              key={label}
              type="button"
              onClick={onContinue}
              className="rounded-full bg-white px-6 py-3.5 text-sm font-bold text-rose-700 shadow-lg outline-none ring-rose-300 transition hover:bg-rose-50 focus-visible:ring-4 sm:text-base"
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function BigQuestion({ onYes }) {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0, rotate: 0, scale: 1 });
  const [message, setMessage] = useState("");
  const [noAttempts, setNoAttempts] = useState(0);
  const noRef = useRef(null);
  const controls = useAnimationControls();

  const moveNo = useCallback(() => {
    const next = {
      x: randomBetween(-150, 150),
      y: randomBetween(-115, 115),
      rotate: randomBetween(-18, 18),
      scale: Math.random() > 0.66 ? randomBetween(0.72, 0.92) : 1,
    };
    setNoPosition(next);
    setNoAttempts((count) => count + 1);
    setMessage(noMessages[Math.floor(Math.random() * noMessages.length)]);
    controls.start({
      x: next.x,
      y: next.y,
      rotate: next.rotate,
      scale: next.scale,
      transition: { type: "spring", stiffness: 420, damping: 22 },
    });
  }, [controls]);

  const handleMouseMove = useCallback(
    (event) => {
      const rect = noRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
      if (distance < 170) moveNo();
    },
    [moveNo]
  );

  return (
    <section
      className="relative z-10 grid min-h-screen place-items-center overflow-hidden px-5 py-20"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="glass-panel relative w-full max-w-5xl rounded-[2rem] p-6 text-center sm:p-10"
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="absolute -left-5 -top-7 text-5xl"
          animate={{ y: [0, -14, 0], rotate: [-8, 8, -8] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          💘
        </motion.div>
        <motion.div
          className="absolute -bottom-8 -right-4 text-6xl"
          animate={{ y: [0, 12, 0], rotate: [9, -7, 9] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          💖
        </motion.div>

        <p className="mb-3 font-script text-2xl text-rose-600 sm:text-3xl">The big question</p>
        <h2 className="mx-auto max-w-4xl text-balance font-display text-3xl font-extrabold leading-tight text-[#43172d] sm:text-5xl">
          Would you accept this for the next 50+ years, Riuuuu? ❤️
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-balance text-base font-medium leading-7 text-[#684458] sm:text-lg sm:leading-8">
  Me, my jokes, my overthinking, my laughter, my emotional moments, my endless affection, and one promise that I will support you while you support me too... ❤️
  <br />
  <br />
  One more important condition: by clicking YES, you also agree to watch Taarak Mehta time to time... "Soch looo"..... 😄📺
</p>

        <div className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-2.5">
          {questionChips.map((chip, index) => (
            <motion.span
              key={chip}
              className="rounded-full border border-white/80 bg-white/65 px-4 py-2 text-xs font-bold text-[#6b2141] shadow-sm sm:text-sm"
              initial={{ opacity: 0, y: 14, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.045, duration: 0.35 }}
            >
              {chip}
            </motion.span>
          ))}
        </div>

        <div className="relative mx-auto mt-9 flex min-h-[190px] max-w-xl items-center justify-center gap-5 px-2 sm:min-h-[150px]">
          <motion.button
            type="button"
            onClick={onYes}
            className="animate-pulseGlow rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 px-9 py-4 text-lg font-extrabold text-white shadow-glow outline-none ring-pink-200 transition focus-visible:ring-4"
            whileHover={{ scale: 1.12, y: -4 }}
            whileTap={{ scale: 0.96 }}
          >
            YES ❤️
          </motion.button>

          <motion.button
            ref={noRef}
            type="button"
            onMouseEnter={moveNo}
            onFocus={moveNo}
            onTouchStart={(event) => {
              event.preventDefault();
              moveNo();
            }}
            onClick={(event) => {
              event.preventDefault();
              moveNo();
            }}
            animate={controls}
            className="absolute right-6 top-20 rounded-full border border-rose-200 bg-white/90 px-7 py-3.5 text-base font-extrabold text-rose-700 shadow-lg outline-none ring-rose-200 focus-visible:ring-4 sm:relative sm:right-auto sm:top-auto"
            style={{ transform: `translate(${noPosition.x}px, ${noPosition.y}px)` }}
          >
            NO 😜
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {message ? (
            <motion.p
              key={`${message}-${noAttempts}`}
              className="mx-auto mt-3 inline-flex min-h-11 items-center rounded-full bg-[#401529] px-5 py-2.5 text-sm font-bold text-white shadow-xl"
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function Celebration({ isMuted, isPlaying, onToggleMute }) {
  const [showSecondLine, setShowSecondLine] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowSecondLine(true), 2000);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <section className="relative z-10 min-h-screen px-5 py-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {!showSecondLine ? (
            <motion.h2
              key="aha"
              className="premium-text font-display text-4xl font-extrabold sm:text-6xl"
              initial={{ opacity: 0, scale: 0.82, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.75, ease: "easeOut" }}
            >
              aaahaaaaan ummmhummmmm.... 😄❤️
            </motion.h2>
          ) : (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="premium-text font-display text-4xl font-extrabold sm:text-6xl">
                Thank you for choosing me, Riuuuu ❤️
              </h2>
              <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-[#5b3047] sm:text-xl sm:leading-9">
                aaahannnn aaahaannn, ummhummmm.... You have successfully subscribed to the Rankit Premium
                Lifetime Plan ❤️ & I can't wait to create thousands of beautiful memories with you.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={onToggleMute}
          className="mt-8 rounded-full border border-white/80 bg-white/70 px-5 py-3 text-sm font-bold text-[#521b35] shadow-lg outline-none ring-rose-200 backdrop-blur transition hover:bg-white focus-visible:ring-4"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          {isPlaying ? (isMuted ? "Unmute music 🔈" : "Mute music 🔇") : "Music starting... 🎵"}
        </motion.button>

        <motion.div
          className="relative mt-12 w-full max-w-2xl rounded-[2rem] border border-white/80 bg-white/72 p-4 shadow-velvet backdrop-blur"
          initial={{ opacity: 0, y: 36, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.85, y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" } }}
        >
          <motion.span
            className="absolute -left-4 top-8 text-4xl"
            animate={{ y: [0, -12, 0], rotate: [-8, 8, -8] }}
            transition={{ duration: 3, repeat: Infinity }}
            aria-hidden="true"
          >
            💗
          </motion.span>
          <motion.span
            className="absolute -right-3 bottom-16 text-5xl"
            animate={{ y: [0, 14, 0], rotate: [8, -8, 8] }}
            transition={{ duration: 3.7, repeat: Infinity }}
            aria-hidden="true"
          >
            💞
          </motion.span>
          {/* PLACE CUSTOM IMAGE HERE */}
          <img
            src="./ria-kitkat-celebration.png"
            alt="Cute romantic yellow mascot eating a KitKat chocolate wafer"
            className="aspect-[16/10] w-full rounded-[1.4rem] object-cover shadow-inner"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default function App() {
  const noticeRef = useRef(null);
  const questionRef = useRef(null);
  const celebrationRef = useRef(null);
  const [yesAccepted, setYesAccepted] = useState(false);
  const [confettiBurst, setConfettiBurst] = useState(0);
  const [miniHearts, setMiniHearts] = useState([]);
  const { start, isMuted, toggleMute, isPlaying } = useRomanticMusic();

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleYes = () => {
    setYesAccepted(true);
    setConfettiBurst(Date.now());
    start();
    window.setTimeout(() => setConfettiBurst(0), 3600);
    window.setTimeout(() => scrollTo(celebrationRef), 150);
  };

  const releaseMiniHearts = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const batch = Array.from({ length: 14 }, (_, index) => ({
      id: Date.now() + index,
      x: originX,
      y: originY,
      drift: randomBetween(-80, 80),
      rotate: randomBetween(-25, 25),
    }));
    setMiniHearts((current) => [...current.slice(-56), ...batch]);
  };

  useEffect(() => {
    if (!miniHearts.length) return undefined;
    const timeout = window.setTimeout(() => setMiniHearts((current) => current.slice(-14)), 2200);
    return () => window.clearTimeout(timeout);
  }, [miniHearts]);

  return (
    <main className={`romantic-bg relative min-h-screen overflow-hidden ${yesAccepted ? "celebration-shake" : ""}`}>
      <FloatingHearts density={36} />
      <ConfettiBurst burst={confettiBurst} />
      <MiniHeartEmitter hearts={miniHearts} />

      <Hero onContinue={() => scrollTo(noticeRef)} />

      <div ref={noticeRef}>
        <ImportantNotice onContinue={() => scrollTo(questionRef)} />
      </div>

      <div ref={questionRef}>
        {!yesAccepted ? <BigQuestion onYes={handleYes} /> : null}
      </div>

      <div ref={celebrationRef}>{yesAccepted ? <Celebration isMuted={isMuted} isPlaying={isPlaying} onToggleMute={toggleMute} /> : null}</div>

      <motion.button
        type="button"
        onClick={releaseMiniHearts}
        className="fixed bottom-5 left-5 z-30 grid h-12 w-12 place-items-center rounded-full border border-white/80 bg-white/75 text-2xl shadow-xl outline-none ring-rose-200 backdrop-blur transition hover:bg-white focus-visible:ring-4"
        whileHover={{ scale: 1.08, rotate: 8 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Release mini hearts"
        title="Release mini hearts"
      >
        ❤️
      </motion.button>

      <footer className="relative z-10 px-5 pb-7 text-center text-xs font-semibold text-[#6d4057] sm:text-sm">
        Made with ❤️, coffee ☕ and lots of overthinking by Rankit
      </footer>
    </main>
  );
}
