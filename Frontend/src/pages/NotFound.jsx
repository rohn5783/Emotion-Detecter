import { motion } from "framer-motion";
import { Compass, Home, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import "./Styles/NotFound.scss";

const particles = [
  { top: "12%", left: "8%", size: 14, delay: 0 },
  { top: "22%", left: "82%", size: 10, delay: 0.4 },
  { top: "68%", left: "12%", size: 18, delay: 0.8 },
  { top: "78%", left: "76%", size: 12, delay: 1.2 },
  { top: "36%", left: "56%", size: 8, delay: 1.6 },
  { top: "14%", left: "62%", size: 16, delay: 2 },
];

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-noise" />

      {particles.map((particle, index) => (
        <motion.span
          key={index}
          className="not-found-particle"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.25, 0.95, 0.25] }}
          transition={{
            duration: 4 + index * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}

      <div className="not-found-shell">
        <motion.div
          className="not-found-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="not-found-badge">
            <Sparkles size={16} />
            Lost Signal
          </div>

          <motion.div
            className="not-found-code"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            404
          </motion.div>

          <h1>That page drifted out of Moodify&apos;s orbit.</h1>
          <p>
            The route you opened does not exist anymore, was moved, or never
            landed here in the first place. Let&apos;s get you back to a page
            that does.
          </p>

          <div className="not-found-actions">
            <Link className="not-found-btn primary" to="/">
              <Home size={18} />
              Back Home
            </Link>
            <Link className="not-found-btn secondary" to="/dashboard">
              <Compass size={18} />
              Open Dashboard
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="not-found-visual"
          initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />

          <motion.div
            className="planet-core"
            animate={{ y: [0, -14, 0], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>404</span>
          </motion.div>

          <motion.div
            className="satellite satellite-one"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="satellite satellite-two"
            animate={{ rotate: -360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          />

          <div className="signal-card card-one">
            <span className="label">Status</span>
            <span className="value">Route Missing</span>
          </div>
          <div className="signal-card card-two">
            <span className="label">Recovery</span>
            <span className="value">Return Home</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
