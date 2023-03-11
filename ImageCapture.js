import React, { useRef, useState } from 'react';

const ImageCapture = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const startStream = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    setStream(mediaStream);
    videoRef.current.srcObject = mediaStream;
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    setCapturedImage(canvas.toDataURL());
    setShowPreview(true);
  };

  const saveImage = () => {
    const link = document.createElement('a');
    link.download = 'captured-image.png';
    link.href = capturedImage;
    link.click();
  };

  const retakeImage = () => {
    setCapturedImage(null);
    setShowPreview(false);
  };

  return (
    <div>
      {showPreview ? (
        <div>
          <img src={capturedImage} alt="Captured Image" />
          <button onClick={saveImage}>Save Image</button>
          <button onClick={retakeImage}>Retake Image</button>
        </div>
      ) : stream ? (
        <div>
          <video ref={videoRef} autoPlay playsInline />
          <button onClick={captureImage}>Capture Image</button>
        </div>
      ) : (
        <button onClick={startStream}>Start Camera</button>
      )}
    </div>
  );
};

export default ImageCapture;
