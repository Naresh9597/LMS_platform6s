import { motion } from "framer-motion";
import SpotlightCard from "../ReactBits/SpotlightCard.jsx";
import { Badge } from "../components/ui/badge";

export default function MagicBento({ title, badge, children, spotlightColor, className = "" }) {
  return (
    <SpotlightCard
      className={`relative rounded-2xl overflow-hidden border border-white/10 shadow-lg 
      bg-white/70 dark:bg-zinc-900/60 backdrop-blur h-full flex flex-col ${className}`}
      spotlightColor={spotlightColor}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="p-4 flex flex-col flex-1"
      >
        <div className="flex items-center justify-between mb-2">
          {title && <h3 className="font-semibold">{title}</h3>}
          {badge && <Badge variant="secondary">{badge}</Badge>}
        </div>
        <div className="flex-1">{children}</div>
      </motion.div>
    </SpotlightCard>
  );
}
