const RECS = {
  Happy: {
    music: ["Feel Good Inc - Gorillaz", "Happy - Pharrell Williams", "Uptown Funk - Bruno Mars"],
    movies: ["The Secret Life of Walter Mitty", "The Intern", "Paddington 2"],
    quotes: [
      "Happiness is not by chance, but by choice.",
      "Do more of what makes you feel alive.",
      "Collect moments, not things.",
    ],
    activities: ["Dance break (5 min)", "Call a friend", "Gratitude journaling (3 items)"],
  },
  Sad: {
    music: ["Fix You - Coldplay", "Someone Like You - Adele", "The Night We Met - Lord Huron"],
    movies: ["Inside Out", "Good Will Hunting", "The Pursuit of Happyness"],
    quotes: [
      "This too shall pass.",
      "You’ve survived 100% of your worst days.",
      "Be gentle with yourself.",
    ],
    activities: ["10-min walk", "Warm shower", "Write 5 lines about how you feel"],
  },
  Angry: {
    music: ["Lose Yourself - Eminem", "Stronger - Kanye West", "DNA. - Kendrick Lamar"],
    movies: ["John Wick", "Mad Max: Fury Road", "The Dark Knight"],
    quotes: ["Breathe. Pause. Respond.", "Anger is energy—channel it.", "Calm mind, strong heart."],
    activities: ["Box breathing (4-4-4-4)", "Push-ups (1 set)", "Cold water splash"],
  },
  Chill: {
    music: ["Sunset Lover - Petit Biscuit", "Lo-fi Beats", "Bloom - ODESZA"],
    movies: ["Chef", "Before Sunrise", "About Time"],
    quotes: ["Slow is smooth. Smooth is fast.", "Rest is productive.", "Inhale peace, exhale stress."],
    activities: ["Meditation (5 min)", "Light stretching", "Make tea + read 10 pages"],
  },
  Focused: {
    music: ["Deep Focus Playlist", "Interstellar OST", "Lo-fi Study"],
    movies: ["The Social Network", "Moneyball", "The Imitation Game"],
    quotes: ["Small progress is still progress.", "One task at a time.", "Discipline beats motivation."],
    activities: ["Pomodoro 25/5", "Desk cleanup (3 min)", "Set top 3 priorities"],
  },
  Anxious: {
    music: ["Weightless - Marconi Union", "Calm Piano", "Ambient Waves"],
    movies: ["Kiki’s Delivery Service", "Amélie", "Soul"],
    quotes: ["You are safe right now.", "Let go of what you can’t control.", "Breathe, you’re okay."],
    activities: ["4-7-8 breathing", "Grounding 5-4-3-2-1", "Write worries then 1 next step"],
  },
  Energetic: {
    music: ["Titanium - David Guetta", "Can’t Hold Us - Macklemore", "On Top of the World - Imagine Dragons"],
    movies: ["Spider-Man: Into the Spider-Verse", "Baby Driver", "Guardians of the Galaxy"],
    quotes: ["Use your energy wisely.", "Momentum is everything.", "Do it now."],
    activities: ["Quick workout (10 min)", "Clean one area", "Start the hardest task first"],
  },
  Neutral: {
    music: ["Daily Mix", "Acoustic Chill", "Indie Essentials"],
    movies: ["The Martian", "Hidden Figures", "The Grand Budapest Hotel"],
    quotes: ["Show up. Do the work.", "Keep going.", "Consistency creates results."],
    activities: ["Plan your day", "Short walk", "Hydrate + stretch"],
  },
};

export async function getRecommendations(req, res) {
  const mood = (req.query.mood || "Neutral").toString();
  const data = RECS[mood] || RECS.Neutral;
  res.status(200).json({ message: "Recommendations", mood, ...data });
}

