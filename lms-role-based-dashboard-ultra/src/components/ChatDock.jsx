import React from "react";
import ChatPanel from "./ChatPanel.jsx";

export default function ChatDock() {
  const [open, setOpen] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const [position, setPosition] = React.useState({ x: 20, y: 80 }); // default bottom-right
  const dockRef = React.useRef(null);
  const dragging = React.useRef(false);
  const offset = React.useRef({ x: 0, y: 0 });

  const startDrag = (e) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const duringDrag = (e) => {
    if (!dragging.current) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const endDrag = () => {
    dragging.current = false;
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
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          zIndex: 9999,
          cursor: "grab",
        }}
        className="bg-blue-600 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg"
        onClick={() => setOpen(true)}
      >
        🤖
      </div>

      {/* Chat Panel */}
      <ChatPanel
        open={open}
        onClose={() => setOpen(false)}
        seed={prompt}
      />
    </div>
  );
}
