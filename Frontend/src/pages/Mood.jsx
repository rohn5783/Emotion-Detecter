import { useEffect, useState } from "react";
import { getRecommendations } from "../services/recommendations.api";
import { logMood } from "../services/mood.api";
import { Link } from "react-router-dom";

const MOODS = ["Happy", "Sad", "Angry", "Chill", "Focused", "Anxious", "Energetic", "Neutral"];

export default function Mood() {
  const [selected, setSelected] = useState("Neutral");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [rec, setRec] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const r = await getRecommendations(selected);
        if (mounted) setRec(r);
      } catch {
        // ignore
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [selected]);

  const submit = async () => {
    setErr("");
    setLoading(true);
    try {
      await logMood({ mood: selected, source: "manual", note });
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to save mood");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.top}>
        <div style={{ fontWeight: 900, fontSize: 20 }}>Pick your mood</div>
        <div style={styles.links}>
          <Link style={styles.link} to="/dashboard">Dashboard</Link>
          <Link style={styles.link} to={`/suggestions?mood=${encodeURIComponent(selected)}`}>Suggestions</Link>
          <Link style={styles.link} to="/expression">Face</Link>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.grid}>
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => setSelected(m)}
              style={{
                ...styles.moodBtn,
                ...(selected === m ? styles.moodBtnActive : null),
              }}
            >
              {m}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a quick note (optional)…"
            style={styles.textarea}
          />
          {!!err && <div style={styles.err}>{err}</div>}
          <button onClick={submit} disabled={loading} style={styles.saveBtn}>
            {loading ? "Saving…" : "Save mood"}
          </button>
          <Link
            style={styles.exploreBtn}
            to={`/suggestions?mood=${encodeURIComponent(selected)}`}
          >
            Explore songs and movies
          </Link>
        </div>
      </div>

      {!!rec && (
        <div style={styles.card}>
          <div style={styles.title}>Suggestions for {rec.mood}</div>
          <div style={styles.cols}>
            <div style={styles.col}>
              <div style={styles.h}>Music</div>
              <ul style={styles.ul}>{(rec.music || []).slice(0, 5).map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div style={styles.col}>
              <div style={styles.h}>Movies</div>
              <ul style={styles.ul}>{(rec.movies || []).slice(0, 5).map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div style={styles.col}>
              <div style={styles.h}>Quote</div>
              <div style={{ color: "#cbd5e1" }}>{rec.quotes?.[0]}</div>
            </div>
            <div style={styles.col}>
              <div style={styles.h}>Activity</div>
              <div style={{ color: "#cbd5e1" }}>{rec.activities?.[0]}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 20,
    background:
      "radial-gradient(circle at 25% 15%, rgba(168,85,247,0.35), transparent 40%), radial-gradient(circle at 75% 25%, rgba(34,197,94,0.25), transparent 40%), #0b1020",
    color: "#e5e7eb",
  },
  top: {
    maxWidth: 980,
    margin: "0 auto 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  links: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" },
  link: {
    color: "#c7d2fe",
    textDecoration: "none",
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(79,70,229,0.10)",
    border: "1px solid rgba(79,70,229,0.20)",
  },
  card: {
    maxWidth: 980,
    margin: "0 auto 14px",
    padding: 16,
    borderRadius: 20,
    background: "rgba(15,23,42,0.65)",
    border: "1px solid rgba(148,163,184,0.18)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 },
  moodBtn: {
    padding: "12px 12px",
    borderRadius: 16,
    cursor: "pointer",
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(2,6,23,0.35)",
    color: "#e5e7eb",
    fontWeight: 800,
    letterSpacing: 0.4,
    transition: "transform 160ms ease, box-shadow 160ms ease, background 160ms ease",
  },
  moodBtnActive: {
    background: "linear-gradient(135deg, rgba(79,70,229,0.35), rgba(34,197,94,0.15))",
    boxShadow: "0 18px 40px rgba(79,70,229,0.15)",
    transform: "translateY(-2px)",
  },
  textarea: {
    width: "100%",
    minHeight: 90,
    padding: 12,
    borderRadius: 14,
    resize: "vertical",
    color: "#e5e7eb",
    background: "rgba(2,6,23,0.55)",
    border: "1px solid rgba(148,163,184,0.20)",
    outline: "none",
  },
  saveBtn: {
    marginTop: 10,
    width: "100%",
    padding: 12,
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontWeight: 900,
    letterSpacing: 0.6,
    color: "#0b1020",
    background: "linear-gradient(135deg, #22c55e, #a855f7)",
    boxShadow: "0 16px 34px rgba(34,197,94,0.25)",
  },
  exploreBtn: {
    marginTop: 10,
    display: "block",
    width: "100%",
    padding: 12,
    textAlign: "center",
    textDecoration: "none",
    borderRadius: 999,
    fontWeight: 900,
    letterSpacing: 0.6,
    color: "#e5e7eb",
    background: "rgba(79,70,229,0.18)",
    border: "1px solid rgba(167,139,250,0.24)",
  },
  title: { fontWeight: 900, marginBottom: 12, letterSpacing: 0.4 },
  cols: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 },
  col: {
    padding: 12,
    borderRadius: 16,
    background: "rgba(2,6,23,0.35)",
    border: "1px solid rgba(148,163,184,0.12)",
  },
  h: { fontWeight: 900, marginBottom: 8, color: "#c7d2fe" },
  ul: { margin: 0, paddingLeft: 18, color: "#cbd5e1" },
  err: {
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    background: "rgba(244, 63, 94, 0.16)",
    border: "1px solid rgba(244, 63, 94, 0.35)",
    color: "#fecdd3",
  },
};

