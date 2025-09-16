import { motion } from "framer-motion";

export default function KPITrack({ items }) {
  return (
    <div className="relative w-full overflow-hidden py-2">
      <motion.div
        className="flex gap-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
      >
        {[...items, ...items].map((kpi, i) => (
          <KPI key={i} {...kpi} />
        ))}
      </motion.div>
    </div>
  );
}

function KPI({ title, value, helper, color }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className="relative min-w-[220px] shrink-0 rounded-xl p-4 shadow-md border border-black/5"
      style={{ background: `${color}30` }}
    >
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
      <div className="text-3xl font-extrabold mt-1">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helper}</div>
    </motion.div>
  );
}
