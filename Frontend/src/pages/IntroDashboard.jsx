import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";
import "./Styles/IntroDashboard.scss";

const moodCardVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.08,
    rotate: 3,
    transition: { type: "spring", stiffness: 260, damping: 16 },
  },
};

function getEmojiHoverAnimation(moodName) {
  switch (moodName) {
    case "Happy":
      return {
        x: [0, -3, 3, -3, 3, 0],
        y: [0, -8, 0, -8, 0, 0],
        rotate: [0, -12, 12, -12, 12, 0],
        scale: [1, 1.16, 1.08, 1.16, 1.08, 1],
        transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
      };
    case "Sad":
      return {
        x: [0, -1, 1, -1, 1, 0],
        y: [0, 4, 8, 6, 8, 6],
        rotate: [0, -5, -9, -6, -9, -6],
        scale: [1, 0.98, 0.94, 0.97, 0.94, 0.97],
        transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
      };
    case "Angry":
      return {
        x: [0, -8, 8, -7, 7, 0],
        y: [0, -1, 0, -1, 0, 0],
        rotate: [0, -8, 8, -8, 8, 0],
        scale: [1, 1.05, 1.08, 1.05, 1.08, 1],
        transition: { duration: 0.45, repeat: Infinity, ease: "easeInOut" },
      };
    case "Chill":
      return {
        x: [0, -2, 2, -2, 2, 0],
        y: [0, -5, -10, -6, -10, -6],
        rotate: [0, -6, -10, -6, -10, -6],
        scale: [1, 1.03, 1.07, 1.03, 1.07, 1.03],
        transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
      };
    case "Focused":
      return {
        x: [0, 1, -1, 1, -1, 0],
        y: [0, -2, 0, -2, 0, -2],
        rotate: [0, 0, 0, 0, 0, 0],
        scale: [1, 1.12, 1.04, 1.12, 1.04, 1],
        transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" },
      };
    default:
      return {
        y: [0, -8, 0],
        rotate: [0, 10, 0],
        scale: [1, 1.1, 1],
        transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
      };
  }
}

const emojiVariants = {
  rest: { y: 0, rotate: 0, scale: 1 },
  hover: (moodName) => getEmojiHoverAnimation(moodName),
};

const MoodifyDashboard = () => {
  const [mood, setMood] = useState("Happy");
  const navigate = useNavigate();

  const moods = [
    { name: "Happy", emoji: "😄" },
    { name: "Sad", emoji: "😢" },
    { name: "Angry", emoji: "😡" },
    { name: "Chill", emoji: "😎" },
    { name: "Focused", emoji: "🎯" }
  ];

  return (
    <div className="dashboard">

      {/* 🌌 Animated Background Blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>

      {/* 🚀 Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero"
      >
        <h1 className="title">Moodify ✨</h1>
        <p className="subtitle">
          Your AI-powered emotional companion. Track moods, discover content,
          and connect with people who feel like you.
        </p>
      </motion.div>

      {/* 🎭 Mood Cards Grid */}
      <div className="mood-grid">
        {moods.map((m) => (
          <motion.div
            key={m.name}
            initial="rest"
            animate="rest"
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            variants={moodCardVariants}
            onClick={() => setMood(m.name)}
            className={`mood-card ${mood === m.name ? "active" : ""}`}
          >
            <motion.span
              className="emoji"
              variants={emojiVariants}
              custom={m.name}
            >
              {m.emoji}
            </motion.span>
            <p>{m.name}</p>
          </motion.div>
        ))}
      </div>

      {/* 🧊 Main Interactive Card */}
      <motion.div
        key={mood}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="main-card"
      >
        <h2>{mood} Mode 🚀</h2>
        <p>
          {mood === "Happy" && "Boost your happiness with curated playlists 🎵"}
          {mood === "Sad" && "Relax and heal with calming content 🌧️"}
          {mood === "Angry" && "Cool down with guided meditation 🧘"}
          {mood === "Chill" && "Enjoy and explore chill vibes 🎬"}
          {mood === "Focused" && "Deep work mode activated 💻"}
        </p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="cta-btn"
          type="button"
          onClick={() => navigate("/login")}
        >
          Explore Now →
        </motion.button>
      </motion.div>

      {/* 🔗 Floating Social Dock */}
      <div className="social-dock">
        <a href="https://github.com/rohn5783" target="_blank">
          <Github />
        </a>

        <a href="https://www.linkedin.com/in/rohit-pandey-bb9468355" target="_blank">
          <Linkedin />
        </a>

        <a href="https://twitter.com/yourusername" target="_blank">
          <Twitter />
        </a>
      </div>

      {/* 🧾 Footer */}
      <p className="footer">Built with ❤️ by Rohit | Moodify 2026</p>
    </div>
  );
};

export default MoodifyDashboard;
