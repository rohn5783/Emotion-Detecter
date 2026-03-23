import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getRecommendations } from "../services/recommendations.api";

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

const MOOD_COPY = {
  Happy: "Bright picks for a light, cheerful day.",
  Sad: "Gentle music and comforting stories for a softer landing.",
  Angry: "Release the pressure, then cool the room down.",
  Chill: "Laid-back songs and easy watches for a slower pace.",
  Focused: "Clear, steady picks to keep your mind locked in.",
  Anxious: "Calmer recommendations to help ease the noise.",
  Energetic: "High-momentum songs and movies that keep the spark going.",
  Neutral: "Balanced recommendations for however the day is unfolding.",
};

const FALLBACK_RECOMMENDATIONS = {
  Happy: {
    music: [
      "Happy - Pharrell Williams",
      "Walking on Sunshine - Katrina and the Waves",
      "Good as Hell - Lizzo",
      "Can't Stop the Feeling! - Justin Timberlake",
      "Best Day of My Life - American Authors",
    ],
    movies: [
      "The Secret Life of Walter Mitty",
      "Chef",
      "Paddington 2",
      "Sing Street",
      "La La Land",
    ],
    quotes: ["Joy grows when you give it somewhere to go."],
    activities: ["Share your good mood with a friend or take a victory walk."],
  },
  Sad: {
    music: [
      "Fix You - Coldplay",
      "Someone Like You - Adele",
      "Let Her Go - Passenger",
      "Skinny Love - Bon Iver",
      "The Night We Met - Lord Huron",
    ],
    movies: [
      "Good Will Hunting",
      "Inside Out",
      "The Pursuit of Happyness",
      "A Silent Voice",
      "Little Miss Sunshine",
    ],
    quotes: ["Rest is allowed. Healing is still progress."],
    activities: ["Put on a warm drink, lower the lights, and choose one gentle task."],
  },
  Angry: {
    music: [
      "Believer - Imagine Dragons",
      "Numb - Linkin Park",
      "Stronger - Kelly Clarkson",
      "Whatever It Takes - Imagine Dragons",
      "Titanium - David Guetta ft. Sia",
    ],
    movies: [
      "Creed",
      "Mad Max: Fury Road",
      "The Dark Knight",
      "John Wick",
      "Ford v Ferrari",
    ],
    quotes: ["Power lands better when it is directed, not scattered."],
    activities: ["Move your body for ten minutes, then come back and reassess."],
  },
  Chill: {
    music: [
      "Sunset Lover - Petit Biscuit",
      "Better Together - Jack Johnson",
      "Ocean Eyes - Billie Eilish",
      "Location Unknown - HONNE",
      "Coffee - beabadoobee",
    ],
    movies: [
      "Lost in Translation",
      "Before Sunrise",
      "Midnight in Paris",
      "Palm Springs",
      "The Grand Budapest Hotel",
    ],
    quotes: ["Slow can still be meaningful."],
    activities: ["Open a window, play something soft, and let the pace come down."],
  },
  Focused: {
    music: [
      "Time - Hans Zimmer",
      "Experience - Ludovico Einaudi",
      "Outro - M83",
      "Awake - Tycho",
      "Dream 3 - Max Richter",
    ],
    movies: [
      "The Social Network",
      "Moneyball",
      "Arrival",
      "Whiplash",
      "The Imitation Game",
    ],
    quotes: ["Protect your attention and the work will follow."],
    activities: ["Set a 25-minute timer and let one clear task own the session."],
  },
  Anxious: {
    music: [
      "Weightless - Marconi Union",
      "Holocene - Bon Iver",
      "Bloom - The Paper Kites",
      "Breathe Me - Sia",
      "Anchor - Novo Amor",
    ],
    movies: [
      "Kiki's Delivery Service",
      "The Secret Garden",
      "My Neighbor Totoro",
      "About Time",
      "Soul",
    ],
    quotes: ["You do not have to solve the whole day at once."],
    activities: ["Shrink the next step until it feels safe enough to start."],
  },
  Energetic: {
    music: [
      "Levitating - Dua Lipa",
      "Blinding Lights - The Weeknd",
      "On Top of the World - Imagine Dragons",
      "Shake It Off - Taylor Swift",
      "Run the World (Girls) - Beyonce",
    ],
    movies: [
      "Spider-Man: Into the Spider-Verse",
      "Top Gun: Maverick",
      "Baby Driver",
      "Scott Pilgrim vs. the World",
      "Guardians of the Galaxy",
    ],
    quotes: ["Momentum is easiest to keep when you give it a direction."],
    activities: ["Turn the energy into action before it starts bouncing around."],
  },
  Neutral: {
    music: [
      "Yellow - Coldplay",
      "Riptide - Vance Joy",
      "Someone You Loved - Lewis Capaldi",
      "Electric Feel - MGMT",
      "Vienna - Billy Joel",
    ],
    movies: [
      "The Martian",
      "Her",
      "The Intern",
      "The Truman Show",
      "The Grand Budapest Hotel",
    ],
    quotes: ["Even ordinary days can hold something worth keeping."],
    activities: ["Use the calm to choose what kind of day you want next."],
  },
};

function mergeRecommendations(mood, data) {
  const fallback = FALLBACK_RECOMMENDATIONS[mood] || FALLBACK_RECOMMENDATIONS.Neutral;

  return {
    mood,
    music: data?.music?.length ? data.music : fallback.music,
    movies: data?.movies?.length ? data.movies : fallback.movies,
    quotes: data?.quotes?.length ? data.quotes : fallback.quotes,
    activities: data?.activities?.length ? data.activities : fallback.activities,
  };
}

function youtubeSearchUrl(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export default function MoodSuggestions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const moodFromUrl = searchParams.get("mood");
  const selectedMood = MOODS.includes(moodFromUrl) ? moodFromUrl : "Neutral";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState(
    mergeRecommendations(selectedMood)
  );

  useEffect(() => {
    if (!MOODS.includes(moodFromUrl)) {
      setSearchParams({ mood: "Neutral" }, { replace: true });
    }
  }, [moodFromUrl, setSearchParams]);

  useEffect(() => {
    let mounted = true;

    async function loadRecommendations() {
      setLoading(true);
      setError("");

      try {
        const data = await getRecommendations(selectedMood);
        if (!mounted) return;
        setRecommendations(mergeRecommendations(selectedMood, data));
      } catch {
        if (!mounted) return;
        setRecommendations(mergeRecommendations(selectedMood));
        setError("Showing built-in suggestions right now.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadRecommendations();

    return () => {
      mounted = false;
    };
  }, [selectedMood]);

  const summary = MOOD_COPY[selectedMood] || MOOD_COPY.Neutral;

  const openYouTubeSearch = (query) => {
    window.open(youtubeSearchUrl(query), "_blank", "noopener,noreferrer");
  };

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <div style={{ fontWeight: 800, letterSpacing: 0.6 }}>Moodify</div>
        <div style={styles.navLinks}>
          <Link style={styles.link} to="/dashboard">
            Dashboard
          </Link>
          <Link style={styles.link} to="/mood">
            Mood
          </Link>
          <Link style={styles.link} to="/expression">
            Face
          </Link>
        </div>
      </div>

      <div style={styles.hero}>
        <div style={styles.heroText}>
          <div style={styles.eyebrow}>Mood Media Explorer</div>
          <h1 style={styles.title}>{selectedMood} songs and movie suggestions</h1>
          <p style={styles.subtitle}>
            {summary} Use the YouTube buttons to instantly search music that
            fits how you feel.
          </p>
        </div>

        <div style={styles.heroActions}>
          <button
            type="button"
            style={styles.primaryBtn}
            onClick={() =>
              openYouTubeSearch(`${selectedMood} mood songs playlist`)
            }
          >
            Open {selectedMood} playlist on YouTube
          </button>
          <button
            type="button"
            style={styles.secondaryBtn}
            onClick={() => openYouTubeSearch(`${selectedMood} mood songs`)}
          >
            Search songs on YouTube
          </button>
        </div>
      </div>

      <div style={styles.moodGrid}>
        {MOODS.map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => setSearchParams({ mood })}
            style={{
              ...styles.moodBtn,
              ...(selectedMood === mood ? styles.moodBtnActive : null),
            }}
          >
            {mood}
          </button>
        ))}
      </div>

      {!!error && <div style={styles.notice}>{error}</div>}

      <div style={styles.infoGrid}>
        <div style={styles.infoCard}>
          <div style={styles.infoLabel}>Current mood</div>
          <div style={styles.infoValue}>{selectedMood}</div>
        </div>
        <div style={styles.infoCard}>
          <div style={styles.infoLabel}>Quote</div>
          <div style={styles.infoText}>{recommendations.quotes?.[0]}</div>
        </div>
        <div style={styles.infoCard}>
          <div style={styles.infoLabel}>Activity</div>
          <div style={styles.infoText}>{recommendations.activities?.[0]}</div>
        </div>
      </div>

      <div style={styles.sectionWrap}>
        <div style={styles.sectionHeader}>
          <div>
            <div style={styles.sectionTitle}>Songs for {selectedMood}</div>
            <div style={styles.sectionHint}>
              {loading
                ? "Refreshing recommendations..."
                : "Play any suggestion with one click."}
            </div>
          </div>
        </div>

        <div style={styles.cardGrid}>
          {recommendations.music.map((song) => (
            <div key={song} style={styles.mediaCard}>
              <div>
                <div style={styles.mediaType}>Song</div>
                <div style={styles.mediaTitle}>{song}</div>
              </div>
              <button
                type="button"
                style={styles.mediaBtn}
                onClick={() =>
                  openYouTubeSearch(`${song} ${selectedMood} mood song`)
                }
              >
                Play on YouTube
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.sectionWrap}>
        <div style={styles.sectionHeader}>
          <div>
            <div style={styles.sectionTitle}>Movies for {selectedMood}</div>
            <div style={styles.sectionHint}>
              Suggested titles to match the same vibe.
            </div>
          </div>
        </div>

        <div style={styles.cardGrid}>
          {recommendations.movies.map((movie) => (
            <div key={movie} style={styles.mediaCard}>
              <div>
                <div style={styles.mediaType}>Movie</div>
                <div style={styles.mediaTitle}>{movie}</div>
              </div>
              <button
                type="button"
                style={styles.mediaBtn}
                onClick={() => openYouTubeSearch(`${movie} official trailer`)}
              >
                Watch trailer
              </button>
            </div>
          ))}
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
      "radial-gradient(circle at 10% 15%, rgba(59,130,246,0.26), transparent 28%), radial-gradient(circle at 85% 20%, rgba(249,115,22,0.22), transparent 34%), radial-gradient(circle at 55% 90%, rgba(16,185,129,0.18), transparent 28%), #07111f",
    color: "#e2e8f0",
  },
  nav: {
    maxWidth: 1180,
    margin: "0 auto 18px",
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    borderRadius: 18,
    background: "rgba(8,15,30,0.72)",
    border: "1px solid rgba(148,163,184,0.14)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
  },
  navLinks: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  link: {
    color: "#dbeafe",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(37,99,235,0.12)",
    border: "1px solid rgba(96,165,250,0.2)",
  },
  hero: {
    maxWidth: 1180,
    margin: "0 auto 18px",
    padding: "26px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 0.9fr)",
    gap: 18,
    alignItems: "center",
    borderRadius: 28,
    background:
      "linear-gradient(135deg, rgba(14,165,233,0.16), rgba(249,115,22,0.16))",
    border: "1px solid rgba(148,163,184,0.16)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 24px 48px rgba(0,0,0,0.24)",
  },
  heroText: { minWidth: 0 },
  eyebrow: {
    display: "inline-flex",
    padding: "6px 12px",
    borderRadius: 999,
    background: "rgba(8,15,30,0.62)",
    border: "1px solid rgba(148,163,184,0.14)",
    color: "#93c5fd",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    margin: "14px 0 10px",
    fontSize: "clamp(2rem, 4vw, 3.3rem)",
    lineHeight: 1.05,
    fontWeight: 900,
  },
  subtitle: {
    margin: 0,
    maxWidth: 680,
    color: "#bfd2f3",
    fontSize: 16,
    lineHeight: 1.6,
  },
  heroActions: {
    display: "grid",
    gap: 12,
    alignSelf: "stretch",
    alignContent: "center",
  },
  primaryBtn: {
    padding: "14px 18px",
    borderRadius: 18,
    border: "none",
    cursor: "pointer",
    fontWeight: 900,
    color: "#07111f",
    background: "linear-gradient(135deg, #38bdf8, #f59e0b)",
    boxShadow: "0 18px 34px rgba(56,189,248,0.28)",
  },
  secondaryBtn: {
    padding: "14px 18px",
    borderRadius: 18,
    cursor: "pointer",
    fontWeight: 800,
    color: "#e2e8f0",
    background: "rgba(8,15,30,0.62)",
    border: "1px solid rgba(148,163,184,0.18)",
  },
  moodGrid: {
    maxWidth: 1180,
    margin: "0 auto 18px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 10,
  },
  moodBtn: {
    padding: "14px 10px",
    borderRadius: 18,
    border: "1px solid rgba(148,163,184,0.15)",
    background: "rgba(8,15,30,0.6)",
    color: "#e2e8f0",
    fontWeight: 800,
    cursor: "pointer",
    transition: "transform 160ms ease, box-shadow 160ms ease, border 160ms ease",
  },
  moodBtnActive: {
    transform: "translateY(-2px)",
    border: "1px solid rgba(125,211,252,0.48)",
    background:
      "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(249,115,22,0.16))",
    boxShadow: "0 16px 28px rgba(14,165,233,0.18)",
  },
  notice: {
    maxWidth: 1180,
    margin: "0 auto 18px",
    padding: "12px 14px",
    borderRadius: 16,
    background: "rgba(14,165,233,0.12)",
    border: "1px solid rgba(125,211,252,0.2)",
    color: "#dbeafe",
  },
  infoGrid: {
    maxWidth: 1180,
    margin: "0 auto 18px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 14,
  },
  infoCard: {
    padding: "18px",
    borderRadius: 22,
    background: "rgba(8,15,30,0.68)",
    border: "1px solid rgba(148,163,184,0.14)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 18px 36px rgba(0,0,0,0.22)",
  },
  infoLabel: {
    marginBottom: 8,
    color: "#93c5fd",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 28,
    fontWeight: 900,
    lineHeight: 1.1,
  },
  infoText: {
    color: "#d6e4f7",
    lineHeight: 1.6,
  },
  sectionWrap: {
    maxWidth: 1180,
    margin: "0 auto 18px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 900,
  },
  sectionHint: {
    marginTop: 4,
    color: "#9fb3d1",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 14,
  },
  mediaCard: {
    minHeight: 180,
    padding: "18px",
    borderRadius: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 14,
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(8,15,30,0.85))",
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.24)",
  },
  mediaType: {
    color: "#7dd3fc",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  mediaTitle: {
    marginTop: 10,
    fontSize: 21,
    fontWeight: 800,
    lineHeight: 1.3,
  },
  mediaBtn: {
    padding: "12px 14px",
    borderRadius: 16,
    border: "1px solid rgba(125,211,252,0.24)",
    background: "rgba(14,165,233,0.12)",
    color: "#e0f2fe",
    fontWeight: 800,
    cursor: "pointer",
  },
};
