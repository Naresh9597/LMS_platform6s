import React from "react";
import { motion } from "framer-motion";
import MagicBento from "../ReactBits/MagicBento";
import ScrollReveal from "../ReactBits/ScrollReveal";
import { adminMetrics } from "../data/mock.js";

/* Table helpers */
const Th = ({ children }) => <th className="text-left px-4 py-2 font-semibold">{children}</th>;
const Td = ({ children }) => <td className="px-4 py-2">{children}</td>;

export default function Leaderboard({ data }) {
  return (
    <MagicBento title="Leaderboard" spotlightColor="rgba(99, 102, 241, 0.12)">
      <ScrollReveal>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Rank</Th>
              <Th>Student</Th>
              <Th>Points</Th>
            </tr>
          </thead>
          <tbody>
            {data.map((student, index) => (
              <motion.tr
                key={index}
                className="hover:bg-gray-100/70"
                whileHover={{ scale: 1.01 }}
              >
                <Td>{index + 1}</Td>
                <Td>{student.name}</Td>
                <Td>{student.score}</Td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </ScrollReveal>
    </MagicBento>
  );
}
