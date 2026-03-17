import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { initCamera, detectFaces } from "../../utils/utils";
import "./face.scss";
import { logoutUser } from "./../../../services/logout.api";
import { logMood } from "../../../services/mood.api";
import { getRecommendations } from "../../../services/recommendations.api";

export default function FaceExpression() {

  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Initializing...");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [moodRec, setMoodRec] = useState(null);

  const handleLogout = async () => {
  await logoutUser();
  localStorage.removeItem("token"); // agar token store hai
  window.location.href = "/login";
};

  const moodFromExpression = (expr) => {
    if (!expr) return "Neutral";
    if (expr.includes("Happy")) return "Happy";
    if (expr.includes("Sad")) return "Sad";
    if (expr.includes("Angry")) return "Angry";
    if (expr.includes("Surprised")) return "Energetic";
    if (expr.includes("Sleepy")) return "Chill";
    if (expr.includes("Thinking")) return "Focused";
    return "Neutral";
  };

  const handleSaveMood = async () => {
    const mood = moodFromExpression(expression);
    await logMood({ mood, source: "face", note: expression });
    const rec = await getRecommendations(mood);
    setMoodRec(rec);
  };
  const startCamera = () => {
    initCamera({
      videoRef,
      landmarkerRef,
      streamRef,
      setExpression,
      setIsCameraOn,
      FilesetResolver,
      FaceLandmarker,
      detect: () =>
        detectFaces({
          videoRef,
          landmarkerRef,
          animationRef,
          setExpression,
        }),
    });
  };

  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setIsCameraOn(false);
    setExpression("Camera Stopped");
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="face-wrapper">
      <div className="face-card">

        <h1>AI Face Expression Detector</h1>

        <div className="video-container">
          <video ref={videoRef} playsInline />
          <div className="expression-badge">{expression}</div>
        </div>

       <div className="controls">
  {!isCameraOn ? (
    <button className="start-btn" onClick={startCamera}>Start Camera</button>
  ) : (
    <button className="stop-btn" onClick={stopCamera}>Stop Camera</button>
  )}

  <button onClick={handleSaveMood}>Save Mood + Get Suggestions</button>

  <button className="logout-btn" onClick={handleLogout}>
    Logout
  </button>
</div>

{!!moodRec && (
  <div style={{ marginTop: 16, textAlign: "left" }}>
    <div style={{ fontWeight: 700, marginBottom: 8 }}>
      Suggestions for {moodRec.mood}
    </div>
    <div style={{ opacity: 0.95 }}>
      <div><strong>Music:</strong> {moodRec.music?.slice(0, 3).join(", ")}</div>
      <div><strong>Movies:</strong> {moodRec.movies?.slice(0, 3).join(", ")}</div>
      <div><strong>Quote:</strong> {moodRec.quotes?.[0]}</div>
      <div><strong>Activity:</strong> {moodRec.activities?.[0]}</div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}