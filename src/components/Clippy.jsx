import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Clippy() {
  const [messages, setMessages] = useState([
    "It looks like you're taking a survey! Would you like help?",
    "Keep going! You're doing great!",
    "Don't forget to read the questions carefully.",
    "Almost done! You're making good progress.",
  ]);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [messages.length]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 max-w-xs sm:max-w-sm z-50"
    >
      {/* Clippy character */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mb-2 sm:mb-4 text-4xl sm:text-6xl"
      >
        📎
      </motion.div>

      {/* Speech bubble */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg p-3 sm:p-4 shadow-lg text-slate-900 relative text-sm sm:text-base">
        <p className="text-xs sm:text-sm font-semibold mb-2">{messages[currentMessage]}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setCurrentMessage((prev) => (prev + 1) % messages.length)}
            className="text-xs px-2 py-1 bg-white/30 hover:bg-white/50 rounded"
          >
            Next
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-xs px-2 py-1 bg-white/30 hover:bg-white/50 rounded"
          >
            Close
          </button>
        </div>

        {/* Speech bubble pointer */}
        <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-orange-400"></div>
      </div>
    </motion.div>
  );
}
