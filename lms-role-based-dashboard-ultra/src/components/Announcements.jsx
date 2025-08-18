import MagicBento from "./MagicBento";

export default function Announcements({ items }) {
  return (
    <MagicBento title="Announcements" spotlightColor="rgba(252, 211, 77, 0.12)">
      <div className="divide-y dark:divide-white/10">
        {items.map(a => (
          <div key={a.id} className="px-1 py-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">{a.date}</div>
            <div className="font-semibold">{a.title}</div>
            <div className="text-sm">{a.text}</div>
          </div>
        ))}
      </div>
    </MagicBento>
  );
}
