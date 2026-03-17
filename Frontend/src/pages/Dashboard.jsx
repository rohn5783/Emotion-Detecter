import { useEffect, useMemo, useState } from "react";
import { getMoodAnalytics, getMoodLogs } from "../services/mood.api";
import { Link } from "react-router-dom";

const colorForMood = (m) => {
  const map = {
    Happy: "#22c55e",
    Sad: "#60a5fa",
    Angry: "#fb7185",
    Chill: "#34d399",
    Focused: "#a78bfa",
    Anxious: "#fbbf24",
    Energetic: "#f97316",
    Neutral: "#94a3b8",
  };
  return map[m] || "#94a3b8";
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [range, setRange] = useState("30d");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [a, l] = await Promise.all([
          getMoodAnalytics(),
          getMoodLogs({ range }),
        ]);
        if (!mounted) return;
        setAnalytics(a);
        setLogs(l.logs || []);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [range]);

  const chart = useMemo(() => {
    const items = analytics?.byMood || [];
    const max = Math.max(1, ...items.map((x) => x.count || 0));
    return items.map((x) => ({
      mood: x._id,
      count: x.count,
      pct: (x.count / max) * 100,
    }));
  }, [analytics]);

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <div style={{ fontWeight: 800, letterSpacing: 0.6 }}>Moodify</div>
        <div style={styles.navLinks}>
          <Link style={styles.link} to="/dashboard">Dashboard</Link>
          <Link style={styles.link} to="/mood">Mood</Link>
          <Link style={styles.link} to="/journal">Journal</Link>
          <Link style={styles.link} to="/sleep">Sleep</Link>
          <Link style={styles.link} to="/chat">Chat</Link>
          <Link style={styles.link} to="/expression">Face</Link>
        </div>
      </div>

      <div style={styles.hero}>
        <div>
          <div style={styles.title}>Your Mood Dashboard</div>
          <div style={styles.subtitle}>
            Track patterns, keep streaks, and get mood-based suggestions.
          </div>
        </div>

        <div style={styles.cardRow}>
          <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>Streak</div>
            <div style={styles.kpiValue}>{analytics?.streak ?? 0} days</div>
          </div>
          <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>Range</div>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              style={styles.select}
            >
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
              <option value="90d">90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Mood Breakdown (last 30 days)</div>
          {loading ? (
            <div style={styles.muted}>Loading…</div>
          ) : chart.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {chart.map((b) => (
                <div key={b.mood} style={{ display: "grid", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: 700 }}>{b.mood}</div>
                    <div style={styles.muted}>{b.count}</div>
                  </div>
                  <div style={styles.barWrap}>
                    <div
                      style={{
                        ...styles.bar,
                        width: `${Math.max(6, b.pct)}%`,
                        background: colorForMood(b.mood),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.muted}>
              No data yet. Log a mood from <Link to="/mood">Mood</Link> or{" "}
              <Link to="/expression">Face</Link>.
            </div>
          )}
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Recent Mood Logs</div>
          {loading ? (
            <div style={styles.muted}>Loading…</div>
          ) : logs.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {logs.slice(0, 10).map((l) => (
                <div key={l._id} style={styles.logRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        background: colorForMood(l.mood),
                        boxShadow: `0 0 0 4px ${colorForMood(l.mood)}22`,
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700 }}>{l.mood}</div>
                      <div style={styles.mutedSmall}>
                        {new Date(l.createdAt).toLocaleString()} • {l.source}
                      </div>
                    </div>
                  </div>
                  <div style={styles.mutedSmall} title={l.note || ""}>
                    {(l.note || "").slice(0, 24)}
                    {(l.note || "").length > 24 ? "…" : ""}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.muted}>No logs yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 15% 15%, rgba(99,102,241,0.45), transparent 40%), radial-gradient(circle at 85% 25%, rgba(34,197,94,0.35), transparent 40%), radial-gradient(circle at 50% 90%, rgba(236,72,153,0.25), transparent 40%), #0b1020",
    color: "#e5e7eb",
    padding: "26px 18px 60px",
  },
  nav: {
    maxWidth: 1100,
    margin: "0 auto 18px",
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    background: "rgba(15,23,42,0.65)",
    border: "1px solid rgba(148,163,184,0.18)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
  },
  navLinks: { display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" },
  link: {
    color: "#c7d2fe",
    textDecoration: "none",
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(79,70,229,0.10)",
    border: "1px solid rgba(79,70,229,0.20)",
  },
  hero: {
    maxWidth: 1100,
    margin: "0 auto 18px",
    padding: "18px 18px",
    borderRadius: 20,
    background: "linear-gradient(135deg, rgba(79,70,229,0.22), rgba(34,197,94,0.12))",
    border: "1px solid rgba(148,163,184,0.18)",
    backdropFilter: "blur(18px)",
    display: "flex",
    gap: 14,
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  title: { fontSize: 28, fontWeight: 900, letterSpacing: 0.6 },
  subtitle: { marginTop: 6, color: "#a7b3d1", maxWidth: 620 },
  cardRow: { display: "flex", gap: 12, alignItems: "stretch", flexWrap: "wrap" },
  kpiCard: {
    minWidth: 160,
    padding: "12px 14px",
    borderRadius: 16,
    background: "rgba(15,23,42,0.65)",
    border: "1px solid rgba(148,163,184,0.18)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.2)",
  },
  kpiLabel: { color: "#a7b3d1", fontWeight: 700, fontSize: 12, letterSpacing: 0.8 },
  kpiValue: { fontSize: 20, fontWeight: 900, marginTop: 4 },
  select: {
    marginTop: 6,
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(2,6,23,0.6)",
    color: "#e5e7eb",
    border: "1px solid rgba(148,163,184,0.25)",
    outline: "none",
  },
  grid: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 14,
  },
  card: {
    padding: "16px 16px",
    borderRadius: 20,
    background: "rgba(15,23,42,0.65)",
    border: "1px solid rgba(148,163,184,0.18)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
  },
  cardTitle: { fontWeight: 900, marginBottom: 12, letterSpacing: 0.4 },
  muted: { color: "#a7b3d1" },
  mutedSmall: { color: "#94a3b8", fontSize: 12 },
  barWrap: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    background: "rgba(148,163,184,0.16)",
    overflow: "hidden",
    border: "1px solid rgba(148,163,184,0.12)",
  },
  bar: { height: "100%", borderRadius: 999 },
  logRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "10px 10px",
    borderRadius: 14,
    background: "rgba(2,6,23,0.35)",
    border: "1px solid rgba(148,163,184,0.12)",
  },
};

