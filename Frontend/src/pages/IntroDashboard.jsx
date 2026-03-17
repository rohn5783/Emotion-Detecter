import { motion } from "framer-motion";
import { useState } from "react";
import { Github, Linkedin, Twitter } from "lucide-react";
import "./Styles/IntroDashboard.scss";

const MoodifyDashboard = () => {
  const [mood, setMood] = useState("Happy");

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
            whileHover={{ scale: 1.1, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMood(m.name)}
            className={`mood-card ${mood === m.name ? "active" : ""}`}
          >
            <span className="emoji">{m.emoji}</span>
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
