// faceUtils.js

export function detectExpression(blendshapes) {
  const getScore = (name) =>
    blendshapes.find((b) => b.categoryName === name)?.score || 0;

  const smileLeft = getScore("mouthSmileLeft");
  const smileRight = getScore("mouthSmileRight");
  const jawOpen = getScore("jawOpen");
  const browUp = getScore("browInnerUp");
  const frownLeft = getScore("mouthFrownLeft");
  const frownRight = getScore("mouthFrownRight");
  const browDownLeft = getScore("browDownLeft");
  const browDownRight = getScore("browDownRight");
  const eyeBlinkLeft = getScore("eyeBlinkLeft");
  const eyeBlinkRight = getScore("eyeBlinkRight");
  const mouthPucker = getScore("mouthPucker");

  if (smileLeft > 0.6 && smileRight > 0.6) return "Happy 😄";
  if (frownLeft > 0.4 && frownRight > 0.4) return "Sad 😢";
  if (jawOpen > 0.5 && browUp > 0.5) return "Surprised 😲";
  if (browDownLeft > 0.4 && browDownRight > 0.4) return "Angry 😠";
  if (browUp > 0.6 && mouthPucker > 0.4) return "Thinking 🤔";
  if (eyeBlinkLeft > 0.6 && eyeBlinkRight > 0.6) return "Sleepy 😴";

  return "Neutral 😐";
}


// ---------------- INIT ----------------

export const initCamera = async ({
  videoRef,
  landmarkerRef,
  streamRef,
  setExpression,
  setIsCameraOn,
  FilesetResolver,
  FaceLandmarker,
  detect
}) => {
  try {
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

    detect(); // start loop
  } catch (err) {
    console.error(err);
    setExpression("Camera Error ❌");
  }
};


// ---------------- DETECT LOOP ----------------

export const detectFaces = ({
  videoRef,
  landmarkerRef,
  animationRef,
  setExpression,
}) => {
  const detect = () => {
    if (!landmarkerRef.current || !videoRef.current) return;

    if (videoRef.current.readyState === 4) {
      const results = landmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now()
      );

      if (results.faceBlendshapes?.length > 0) {
        const blendshapes = results.faceBlendshapes[0].categories;
        const currentExpression = detectExpression(blendshapes);
        setExpression(currentExpression);
      }
    }

    animationRef.current = requestAnimationFrame(detect);
  };

  detect();
};