import React from "react";
import MagicBento from "../ReactBits/MagicBento";
import { motion } from "framer-motion";
import ScrollReveal from "../ReactBits/ScrollReveal";

/* ---------- Announcements Component ---------- */
export default function Announcements({ items }) {
  return (
    <MagicBento 
      title="Announcements" 
      spotlightColor="rgba(252, 211, 77, 0.12)"
    >
      <ScrollReveal>
        <div>
          {items.map(a => (
            <div key={a.id} className="px-1 py-3">
              <motion.div
                key={a.date}
                className="kpi rounded-xl p-3 bg-gray-100 shadow-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {a.date}
                </div>
                <div className="font-semibold">{a.title}</div>
                <div className="text-sm">{a.text}</div>
              </motion.div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </MagicBento>
  );
}
