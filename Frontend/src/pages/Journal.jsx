import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createEntry, deleteEntry, listEntries } from "../services/journal.api";

const MOODS = [
  "Happy",
  "Sad",
  "Angry",
  "Chill",
  "Focused",
  "Anxious",
  "Energetic",
  "Neutral",
];

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    text: "",
    mood: "Neutral",
  });

  useEffect(() => {
    let mounted = true;

    async function loadEntries() {
      setLoading(true);
      try {
        const data = await listEntries();
        if (mounted) setEntries(data.entries || []);
      } catch (err) {
        if (mounted) {
          setError(err?.response?.data?.message || "Unable to load journal entries.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadEntries();

    return () => {
      mounted = false;
    };
  }, []);

  const totalWords = useMemo(
    () =>
      entries.reduce((count, entry) => {
        const words = String(entry.text || "")
          .trim()
          .split(/\s+/)
          .filter(Boolean).length;
        return count + words;
      }, 0),
    [entries]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.text.trim()) {
      setError("Write a few words before saving.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const data = await createEntry({
        title: form.title.trim(),
        text: form.text.trim(),
        mood: form.mood,
      });
      setEntries((current) => [data.entry, ...current]);
      setForm((current) => ({ ...current, title: "", text: "" }));
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to save journal entry.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteEntry(id);
      setEntries((current) => current.filter((entry) => entry._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to delete journal entry.");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <div style={{ fontWeight: 900, letterSpacing: 0.6 }}>Moodify</div>
        <div style={styles.navLinks}>
          <Link style={styles.link} to="/dashboard">
            Dashboard
          </Link>
          <Link style={styles.link} to="/mood">
            Mood
          </Link>
          <Link style={styles.link} to="/sleep">
            Sleep
          </Link>
          <Link style={styles.link} to="/chat">
            Chat
          </Link>
        </div>
      </div>

      <div style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>Journal</div>
          <h1 style={styles.title}>Write through your day</h1>
          <p style={styles.subtitle}>
            Capture what happened, how it felt, and the mood that matched it.
            Over time these notes become one of the clearest signals in Moodify.
          </p>
        </div>
        <div style={styles.heroStats}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Entries</div>
            <div style={styles.statValue}>{entries.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Words saved</div>
            <div style={styles.statValue}>{totalWords}</div>
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        <form style={styles.card} onSubmit={handleSubmit}>
          <div style={styles.cardTitle}>New entry</div>

          <label style={styles.label}>
            Title
            <input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="A quick headline for today"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Mood
            <select
              value={form.mood}
              onChange={(event) =>
                setForm((current) => ({ ...current, mood: event.target.value }))
              }
              style={styles.input}
            >
              {MOODS.map((mood) => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Reflection
            <textarea
              value={form.text}
              onChange={(event) =>
                setForm((current) => ({ ...current, text: event.target.value }))
              }
              placeholder="What happened today? What stood out? What do you want to remember?"
              style={styles.textarea}
            />
          </label>

          {!!error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.primaryButton} disabled={saving}>
            {saving ? "Saving..." : "Save entry"}
          </button>
        </form>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Recent entries</div>
          {loading ? (
            <div style={styles.muted}>Loading entries...</div>
          ) : entries.length ? (
            <div style={styles.entryList}>
              {entries.map((entry) => (
                <div key={entry._id} style={styles.entryCard}>
                  <div style={styles.entryHeader}>
                    <div>
                      <div style={styles.entryTitle}>
                        {entry.title || "Untitled entry"}
                      </div>
                      <div style={styles.entryMeta}>
                        {new Date(entry.createdAt).toLocaleString()} · {entry.mood}
                      </div>
                    </div>
                    <button
                      type="button"
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(entry._id)}
                    >
                      Delete
                    </button>
                  </div>
                  <div style={styles.entryText}>{entry.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.muted}>
              No journal entries yet. Your first note will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "26px 18px 60px",
    background:
      "radial-gradient(circle at 12% 14%, rgba(251,191,36,0.18), transparent 28%), radial-gradient(circle at 80% 18%, rgba(16,185,129,0.16), transparent 30%), radial-gradient(circle at 50% 92%, rgba(59,130,246,0.12), transparent 24%), #08131f",
    color: "#e2e8f0",
  },
  nav: {
    maxWidth: 1120,
    margin: "0 auto 18px",
    padding: "12px 14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    borderRadius: 18,
    background: "rgba(8,15,30,0.7)",
    border: "1px solid rgba(148,163,184,0.16)",
    backdropFilter: "blur(18px)",
  },
  navLinks: { display: "flex", gap: 10, flexWrap: "wrap" },
  link: {
    color: "#dbeafe",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(37,99,235,0.1)",
    border: "1px solid rgba(96,165,250,0.22)",
  },
  hero: {
    maxWidth: 1120,
    margin: "0 auto 18px",
    padding: 24,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 0.9fr)",
    gap: 16,
    borderRadius: 28,
    background:
      "linear-gradient(135deg, rgba(251,191,36,0.11), rgba(16,185,129,0.11))",
    border: "1px solid rgba(148,163,184,0.14)",
  },
  eyebrow: {
    color: "#fcd34d",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    margin: "10px 0 8px",
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 900,
  },
  subtitle: { margin: 0, color: "#bfd2f3", lineHeight: 1.7, maxWidth: 650 },
  heroStats: { display: "grid", gap: 12 },
  statCard: {
    padding: 18,
    borderRadius: 20,
    background: "rgba(8,15,30,0.68)",
    border: "1px solid rgba(148,163,184,0.14)",
  },
  statLabel: {
    color: "#fde68a",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statValue: { marginTop: 8, fontSize: 28, fontWeight: 900 },
  grid: {
    maxWidth: 1120,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 24,
    background: "rgba(8,15,30,0.72)",
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.22)",
  },
  cardTitle: { marginBottom: 14, fontSize: 22, fontWeight: 900 },
  label: {
    display: "grid",
    gap: 8,
    marginBottom: 14,
    color: "#cbd5e1",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(2,6,23,0.56)",
    color: "#e2e8f0",
    outline: "none",
  },
  textarea: {
    width: "100%",
    minHeight: 180,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(2,6,23,0.56)",
    color: "#e2e8f0",
    outline: "none",
    resize: "vertical",
  },
  primaryButton: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 16,
    border: "none",
    cursor: "pointer",
    fontWeight: 900,
    color: "#08131f",
    background: "linear-gradient(135deg, #facc15, #34d399)",
  },
  error: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 14,
    color: "#fecaca",
    background: "rgba(127,29,29,0.36)",
    border: "1px solid rgba(248,113,113,0.3)",
  },
  muted: { color: "#94a3b8" },
  entryList: { display: "grid", gap: 12 },
  entryCard: {
    padding: 16,
    borderRadius: 18,
    background: "rgba(2,6,23,0.45)",
    border: "1px solid rgba(148,163,184,0.12)",
  },
  entryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  entryTitle: { fontWeight: 800, fontSize: 18 },
  entryMeta: { marginTop: 4, fontSize: 13, color: "#94a3b8" },
  entryText: {
    marginTop: 12,
    color: "#dbeafe",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  },
  deleteBtn: {
    border: "1px solid rgba(248,113,113,0.3)",
    background: "rgba(127,29,29,0.3)",
    color: "#fecaca",
    padding: "8px 12px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 700,
  },
};
