import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { initCamera, detectFaces } from "../../utils/utils";
import "./face.scss";
import { logoutUser } from "./../../../services/logout.api";

export default function FaceExpression() {

  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Initializing...");
  const [isCameraOn, setIsCameraOn] = useState(false);

  const handleLogout = async () => {
  await logoutUser();
  localStorage.removeItem("token"); // agar token store hai
  window.location.href = "/login";
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
    <button onClick={startCamera}>Start Camera</button>
  ) : (
    <button onClick={stopCamera}>Stop Camera</button>
  )}

  <button className="logout-btn" onClick={handleLogout}>
    Logout
  </button>
</div>

      </div>
    </div>
  );
}