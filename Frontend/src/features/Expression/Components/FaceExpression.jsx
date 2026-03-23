import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useNavigate } from "react-router-dom";
import { initCamera, detectFaces } from "../../utils/utils";
import "./face.scss";
import { logoutUser } from "./../../../services/logout.api";
import { logMood } from "../../../services/mood.api";

export default function FaceExpression() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);
  const redirectTimeoutRef = useRef(null);
  const hasRedirectedRef = useRef(false);

  const [expression, setExpression] = useState("Initializing...");
  const [isCameraOn, setIsCameraOn] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
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

  const startCamera = () => {
    hasRedirectedRef.current = false;
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
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsCameraOn(false);
    setExpression("Camera Stopped");
  };

  useEffect(() => {
    if (!isCameraOn || hasRedirectedRef.current) return;

    const mood = moodFromExpression(expression);

    if (mood === "Neutral") {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
      return;
    }

    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }

    redirectTimeoutRef.current = setTimeout(async () => {
      if (hasRedirectedRef.current) return;

      hasRedirectedRef.current = true;
      stopCamera();

      try {
        await logMood({ mood, source: "face", note: expression });
      } catch (error) {
        console.error("Failed to save detected mood", error);
      }

      navigate(`/suggestions?mood=${encodeURIComponent(mood)}`);
    }, 1200);

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
    };
  }, [expression, isCameraOn, navigate]);

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

        <p style={{ marginTop: 16, opacity: 0.92 }}>
          Start the camera and hold a clear expression for a moment. Moodify
          will open your songs page automatically.
        </p>

        <div className="controls">
          {!isCameraOn ? (
            <button className="start-btn" onClick={startCamera}>
              Start Camera
            </button>
          ) : (
            <button className="stop-btn" onClick={stopCamera}>
              Stop Camera
            </button>
          )}

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
