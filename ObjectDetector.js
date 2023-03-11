import React, { useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const ObjectDetector = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [model, setModel] = useState(null);

  const startStream = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    setStream(mediaStream);
    videoRef.current.srcObject = mediaStream;
    setModel(await cocoSsd.load());
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    setCapturedImage(canvas.toDataURL());
  };

  const detectObject = async () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const predictions = await model.detect(imageData);

    // Filter the predictions to only include "person" class
    const personPredictions = predictions.filter(
      (prediction) => prediction.class === 'person'
    );

    if (personPredictions.length > 0) {
      // Find the person prediction with highest confidence score
      const highestConfidencePrediction = personPredictions.reduce(
        (max, prediction) => (prediction.score > max.score ? prediction : max)
      );

      // Calculate the bounding box of the person prediction
      const bbox = [
        highestConfidencePrediction.bbox[0] * canvas.width,
        highestConfidencePrediction.bbox[1] * canvas.height,
        highestConfidencePrediction.bbox[2] * canvas.width,
        highestConfidencePrediction.bbox[3] * canvas.height,
      ];

      // Crop the image based on the bounding box
      const croppedImage = document.createElement('canvas');
      croppedImage.width = bbox[2];
      croppedImage.height = bbox[3];
      croppedImage
        .getContext('2d')
        .drawImage(
          video,
          bbox[0],
          bbox[1],
          bbox[2],
          bbox[3],
          0,
          0,
          bbox[2],
          bbox[3]
        );

      // Set the captured image
      setCapturedImage(croppedImage.toDataURL());
    }
  };

  return (
    <div>
      {stream ? (
        <div>
          <video ref={videoRef} autoPlay playsInline />
          <button onClick={captureImage}>Capture Image</button>
          <button onClick={detectObject}>Detect Object</button>
          {capturedImage && <img src={capturedImage} alt="Captured Document" />}
        </div>
      ) : (
        <button onClick={startStream}>Start Camera</button>
      )}
    </div>
  );
};

export default ObjectDetector;
