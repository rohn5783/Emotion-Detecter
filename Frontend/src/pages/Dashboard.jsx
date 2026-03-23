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
          <Link style={styles.link} to="/suggestions">Suggestions</Link>
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
          <div style={styles.cardTitle}>Quick Actions</div>
          <div style={styles.quickGrid}>
            <Link style={styles.quickCard} to="/mood">
              <div style={styles.quickTitle}>Log a mood</div>
              <div style={styles.quickBody}>
                Save how today feels and get tailored suggestions.
              </div>
            </Link>
            <Link style={styles.quickCard} to="/journal">
              <div style={styles.quickTitle}>Write a journal entry</div>
              <div style={styles.quickBody}>
                Capture the story behind your current mood.
              </div>
            </Link>
            <Link style={styles.quickCard} to="/sleep">
              <div style={styles.quickTitle}>Track sleep</div>
              <div style={styles.quickBody}>
                Log last night and compare recovery with your energy.
              </div>
            </Link>
            <Link style={styles.quickCard} to="/chat">
              <div style={styles.quickTitle}>Open chat</div>
              <div style={styles.quickBody}>
                Join the shared room or message another user directly.
              </div>
            </Link>
          </div>
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
    color: "#f8fafc",
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
    background: "rgba(7,12,24,0.84)",
    border: "1px solid rgba(148,163,184,0.24)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.34)",
  },
  navLinks: { display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" },
  link: {
    color: "#eef2ff",
    textDecoration: "none",
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(79,70,229,0.18)",
    border: "1px solid rgba(129,140,248,0.28)",
    fontWeight: 700,
  },
  hero: {
    maxWidth: 1100,
    margin: "0 auto 18px",
    padding: "18px 18px",
    borderRadius: 20,
    background: "linear-gradient(135deg, rgba(11,18,38,0.88), rgba(14,27,48,0.82))",
    border: "1px solid rgba(148,163,184,0.24)",
    backdropFilter: "blur(18px)",
    display: "flex",
    gap: 14,
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  title: {
    fontSize: 30,
    fontWeight: 900,
    letterSpacing: 0.6,
    color: "#f8fafc",
    textShadow: "0 10px 26px rgba(15,23,42,0.28)",
  },
  subtitle: {
    marginTop: 8,
    color: "#d6e0f5",
    maxWidth: 620,
    lineHeight: 1.7,
    fontSize: 15,
    fontWeight: 500,
  },
  cardRow: { display: "flex", gap: 12, alignItems: "stretch", flexWrap: "wrap" },
  kpiCard: {
    minWidth: 160,
    padding: "12px 14px",
    borderRadius: 16,
    background: "rgba(5,10,22,0.88)",
    border: "1px solid rgba(148,163,184,0.24)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
  },
  kpiLabel: { color: "#cbd5e1", fontWeight: 800, fontSize: 12, letterSpacing: 0.8 },
  kpiValue: { fontSize: 22, fontWeight: 900, marginTop: 6, color: "#f8fafc" },
  select: {
    marginTop: 6,
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(2,6,23,0.92)",
    color: "#f8fafc",
    border: "1px solid rgba(148,163,184,0.32)",
    outline: "none",
    fontWeight: 700,
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
    background: "rgba(7,12,24,0.84)",
    border: "1px solid rgba(148,163,184,0.24)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.34)",
  },
  cardTitle: {
    fontWeight: 900,
    marginBottom: 12,
    letterSpacing: 0.4,
    color: "#f8fafc",
    fontSize: 20,
  },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
  },
  quickCard: {
    textDecoration: "none",
    padding: "14px 14px",
    borderRadius: 16,
    background: "rgba(2,6,23,0.62)",
    border: "1px solid rgba(148,163,184,0.18)",
    color: "#f8fafc",
  },
  quickTitle: { fontWeight: 800, marginBottom: 6, color: "#f8fafc" },
  quickBody: { color: "#d6e0f5", lineHeight: 1.6, fontSize: 14, fontWeight: 500 },
  muted: { color: "#d6e0f5", lineHeight: 1.6 },
  mutedSmall: { color: "#cbd5e1", fontSize: 12, lineHeight: 1.5 },
  barWrap: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    background: "rgba(148,163,184,0.24)",
    overflow: "hidden",
    border: "1px solid rgba(148,163,184,0.18)",
  },
  bar: { height: "100%", borderRadius: 999 },
  logRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "10px 10px",
    borderRadius: 14,
    background: "rgba(2,6,23,0.62)",
    border: "1px solid rgba(148,163,184,0.18)",
  },
};

