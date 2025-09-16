import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

const cardDeckVariants = {
  hidden: {
    opacity: 0,
    y: 20,              // keep small offset
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 60,   // softer spring
      damping: 20,     // smoother stop
    },
  },
};

export default function ScrollReveal({ children, delay = 0 }) {
  const { ref, inView } = useInView({
    threshold: 0.15,          // 👈 lower threshold = smoother trigger
    rootMargin: "-50px 0px",  // 👈 buffer zone to stop flicker near edges
    triggerOnce: false,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 300); // 👈 smoother exit
      return () => clearTimeout(timeout);
    }
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      variants={cardDeckVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{ delay }}
      style={{ willChange: "transform, opacity, filter" }}
      className="relative w-full mb-12 overflow-hidden rounded-2xl"
    >
      {children}
    </motion.div>
  );
}
