import React from "react";
import ChatPanel from "./ChatPanel.jsx";

export default function ChatDock() {
  const [open, setOpen] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const [position, setPosition] = React.useState({ x: 20, y: 80 });
  const dockRef = React.useRef(null);

  const dragging = React.useRef(false);
  const moved = React.useRef(false);
  const offset = React.useRef({ x: 0, y: 0 });

  const startDrag = (e) => {
    e.preventDefault();
    dragging.current = true;
    moved.current = false;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const duringDrag = (e) => {
    if (!dragging.current) return;
    moved.current = true;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;

    // ✅ Snap to nearest edge
    const screenWidth = window.innerWidth;
    const buttonWidth = dockRef.current?.offsetWidth || 60; // default 60px
    const middle = screenWidth / 2;

    setPosition((prev) => ({
      x: prev.x + buttonWidth / 2 < middle ? 20 : screenWidth - buttonWidth - 20,
      y: Math.min(
        Math.max(prev.y, 20), // keep inside top bound
        window.innerHeight - (dockRef.current?.offsetHeight || 60) - 20 // bottom bound
      ),
    }));
  };

  const handleClick = () => {
    if (!moved.current) {
      setOpen((prev) => !prev);
    }
  };

  React.useEffect(() => {
    window.addEventListener("mousemove", duringDrag);
    window.addEventListener("mouseup", endDrag);
    return () => {
      window.removeEventListener("mousemove", duringDrag);
      window.removeEventListener("mouseup", endDrag);
    };
  }, []);

  return (
    <div>
      {/* Floating Dock Button */}
      <div
        ref={dockRef}
        onMouseDown={startDrag}
        onClick={handleClick}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          zIndex: 9999,
          cursor: "grab",
          userSelect: "none",
          transition: dragging.current ? "none" : "left 0.3s ease, top 0.3s ease", // smooth snap
        }}
        className="bg-blue-600 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg select-none"
      >
        🤖
      </div>

      {/* Chat Panel */}
      <ChatPanel open={open} onClose={() => setOpen(false)} seed={prompt} />
    </div>
  );
}
