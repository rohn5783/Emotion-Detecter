import { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import "../Components/face.scss";

export default function FaceUI() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Initializing...");
  const [isCameraOn, setIsCameraOn] = useState(false);

  const init = async () => {
    setExpression("Loading Model...");

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    landmarkerRef.current = await FaceLandmarker.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      }
    );

    streamRef.current = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    videoRef.current.srcObject = streamRef.current;
    await videoRef.current.play();

    setIsCameraOn(true);
    setExpression("Detecting...");
    detect();
  };

  const detect = () => {
    if (!landmarkerRef.current || !videoRef.current) return;

    const results = landmarkerRef.current.detectForVideo(
      videoRef.current,
      performance.now()
    );

    if (results.faceBlendshapes?.length > 0) {
      const blendshapes = results.faceBlendshapes[0].categories;

      const getScore = (name) =>
        blendshapes.find((b) => b.categoryName === name)?.score || 0;

      const smileLeft = getScore("mouthSmileLeft");
      const smileRight = getScore("mouthSmileRight");
      const jawOpen = getScore("jawOpen");
      const browUp = getScore("browInnerUp");
      const frownLeft = getScore("mouthFrownLeft");
      const frownRight = getScore("mouthFrownRight");

      let currentExpression = "Neutral 😐";

      if (smileLeft > 0.5 && smileRight > 0.5) {
        currentExpression = "Happy 😄";
      } else if (jawOpen > 0.3 && browUp > 0.3) {
        currentExpression = "Surprised 😲";
      } else if (frownLeft > 0.2 && frownRight > 0.2) {
        currentExpression = "Sad 😢";
      }

      setExpression(currentExpression);
    }

    animationRef.current = requestAnimationFrame(detect);
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
    return () => {
      stopCamera();
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }
    };
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
            <button className="start-btn" onClick={init}>
              Start Camera
            </button>
          ) : (
            <button className="stop-btn" onClick={stopCamera}>
              Stop Camera
            </button>
          )}
        </div>
      </div>
    </div>
  );
}