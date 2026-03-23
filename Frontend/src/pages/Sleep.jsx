import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listSleep, saveSleep } from "../services/sleep.api";

const QUALITY_OPTIONS = ["Poor", "Okay", "Good", "Great"];

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function averageHours(logs) {
  if (!logs.length) return 0;
  return logs.reduce((sum, log) => sum + Number(log.hours || 0), 0) / logs.length;
}

export default function Sleep() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    date: todayString(),
    hours: "8",
    quality: "Good",
    notes: "",
  });

  useEffect(() => {
    let mounted = true;

    async function loadSleep() {
      setLoading(true);
      try {
        const data = await listSleep();
        if (!mounted) return;
        setLogs(data.logs || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Unable to load sleep logs.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSleep();

    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const avg = averageHours(logs);
    const latest = logs[0];
    const qualityCounts = logs.reduce((acc, log) => {
      acc[log.quality] = (acc[log.quality] || 0) + 1;
      return acc;
    }, {});

    const bestQuality =
      Object.entries(qualityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Good";

    return {
      average: avg.toFixed(1),
      latest: latest?.hours ?? "--",
      bestQuality,
    };
  }, [logs]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        date: form.date,
        hours: Number(form.hours),
        quality: form.quality,
        notes: form.notes.trim(),
      };

      const data = await saveSleep(payload);
      const nextLog = data.sleep;

      setLogs((current) => {
        const rest = current.filter(
          (log) => log._id !== nextLog._id && log.date !== nextLog.date
        );
        return [nextLog, ...rest].sort((a, b) =>
          String(b.date).localeCompare(String(a.date))
        );
      });

      setForm((current) => ({ ...current, notes: "" }));
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to save sleep log.");
    } finally {
      setSaving(false);
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
          <Link style={styles.link} to="/journal">
            Journal
          </Link>
          <Link style={styles.link} to="/chat">
            Chat
          </Link>
        </div>
      </div>

      <div style={styles.hero}>
        <div>
          <div style={styles.heroEyebrow}>Sleep</div>
          <h1 style={styles.title}>Track your rest and recovery</h1>
          <p style={styles.subtitle}>
            Better mood patterns start with better sleep. Log each night, spot
            trends, and keep small notes about what helped.
          </p>
        </div>
        <div style={styles.heroStats}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Average</div>
            <div style={styles.statValue}>{metrics.average}h</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Latest</div>
            <div style={styles.statValue}>{metrics.latest}h</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Best quality</div>
            <div style={styles.statValue}>{metrics.bestQuality}</div>
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        <form style={styles.card} onSubmit={handleSubmit}>
          <div style={styles.cardTitle}>Log sleep</div>
          <label style={styles.label}>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(event) =>
                setForm((current) => ({ ...current, date: event.target.value }))
              }
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Hours slept
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={form.hours}
              onChange={(event) =>
                setForm((current) => ({ ...current, hours: event.target.value }))
              }
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Sleep quality
            <select
              value={form.quality}
              onChange={(event) =>
                setForm((current) => ({ ...current, quality: event.target.value }))
              }
              style={styles.input}
            >
              {QUALITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Notes
            <textarea
              value={form.notes}
              onChange={(event) =>
                setForm((current) => ({ ...current, notes: event.target.value }))
              }
              placeholder="Late coffee, deep sleep, workout before bed..."
              style={styles.textarea}
            />
          </label>

          {!!error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.primaryButton} disabled={saving}>
            {saving ? "Saving..." : "Save sleep log"}
          </button>
        </form>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Recent nights</div>
          {loading ? (
            <div style={styles.muted}>Loading sleep history...</div>
          ) : logs.length ? (
            <div style={styles.logList}>
              {logs.map((log) => (
                <div key={log._id || log.date} style={styles.logRow}>
                  <div>
                    <div style={styles.logTitle}>{log.date}</div>
                    <div style={styles.mutedSmall}>
                      {log.notes || "No notes added."}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={styles.logValue}>{log.hours}h</div>
                    <div style={styles.qualityBadge}>{log.quality}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.muted}>
              No sleep data yet. Add your first night on the left.
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
      "radial-gradient(circle at 15% 15%, rgba(56,189,248,0.22), transparent 30%), radial-gradient(circle at 82% 20%, rgba(129,140,248,0.22), transparent 30%), radial-gradient(circle at 50% 95%, rgba(20,184,166,0.14), transparent 24%), #06111e",
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
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.5fr) minmax(280px, 1fr)",
    gap: 16,
    padding: 24,
    borderRadius: 28,
    background:
      "linear-gradient(135deg, rgba(14,165,233,0.14), rgba(99,102,241,0.14))",
    border: "1px solid rgba(148,163,184,0.14)",
  },
  heroEyebrow: {
    color: "#7dd3fc",
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
  subtitle: { margin: 0, color: "#bfd2f3", lineHeight: 1.7, maxWidth: 660 },
  heroStats: { display: "grid", gap: 12 },
  statCard: {
    padding: 18,
    borderRadius: 20,
    background: "rgba(8,15,30,0.68)",
    border: "1px solid rgba(148,163,184,0.14)",
  },
  statLabel: {
    color: "#93c5fd",
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
    minHeight: 120,
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
    color: "#06111e",
    background: "linear-gradient(135deg, #7dd3fc, #818cf8)",
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
  mutedSmall: { color: "#94a3b8", fontSize: 13, lineHeight: 1.5 },
  logList: { display: "grid", gap: 12 },
  logRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    padding: 14,
    borderRadius: 18,
    background: "rgba(2,6,23,0.45)",
    border: "1px solid rgba(148,163,184,0.12)",
  },
  logTitle: { fontWeight: 800, marginBottom: 6 },
  logValue: { fontWeight: 900, fontSize: 22 },
  qualityBadge: {
    marginTop: 6,
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(125,211,252,0.12)",
    border: "1px solid rgba(125,211,252,0.22)",
    color: "#bfdbfe",
    fontSize: 12,
    fontWeight: 800,
  },
};
