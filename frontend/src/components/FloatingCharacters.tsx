import { motion } from "framer-motion";
import Algo from "../assets/character/Algo.png";
import Homa from "../assets/character/Homa.png";
import Move from "../assets/character/Move.png";
import Orion from "../assets/character/Orion.png";

const characters = [
  {
    src: Algo,
    alt: "Algo",
    style: { top: "14%", left: "7%", width: 120, height: 120 },
    animate: { y: [0, -18, 0], rotate: [-4, 2, -4] },
    duration: 5,
    delay: 0,
  },
  {
    src: Homa,
    alt: "Homa",
    style: { top: "10%", right: "6%", width: 115, height: 115 },
    animate: { y: [0, -14, 0], rotate: [3, -3, 3] },
    duration: 5.5,
    delay: 0.8,
  },
  {
    src: Move,
    alt: "Move",
    style: { bottom: "10%", left: "9%", width: 100, height: 100 },
    animate: { y: [0, -16, 0], rotate: [-2, 4, -2] },
    duration: 4.5,
    delay: 1.2,
  },
  {
    src: Orion,
    alt: "Orion",
    style: { bottom: "8%", right: "7%", width: 110, height: 110 },
    animate: { y: [0, -20, 0], rotate: [2, -4, 2] },
    duration: 6,
    delay: 0.4,
  },
];

export default function FloatingCharacters() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {characters.map(({ src, alt, style, animate, duration, delay }) => (
        <motion.img
          key={alt}
          src={src}
          alt={alt}
          style={{ position: "absolute", ...style }}
          animate={animate}
          transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
