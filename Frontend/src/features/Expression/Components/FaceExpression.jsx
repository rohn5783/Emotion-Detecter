import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { initCamera, detectFaces } from "../../utils/utils";
import "./face.scss";

export default function FaceExpression() {

  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Initializing...");
  const [isCameraOn, setIsCameraOn] = useState(false);

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
        </div>
      </div>
    </div>
  );
}