import React, { useState, useEffect, useRef } from 'react';

function DocumentScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    // Get access to the camera
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // Display the camera stream in the video element
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStream(stream);
      })
      .catch((error) => {
        console.error(`Error accessing media devices: ${error}`);
      });

    return () => {
      // Stop the camera stream when the component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  function capturePhoto() {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    // Set the canvas dimensions to match the video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the canvas data as a base64-encoded JPEG image
    const imageData = canvas.toDataURL('image/jpeg', 0.5);
    setImageData(imageData);
  }

  return (
    <div>
      <video ref={videoRef} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button onClick={capturePhoto}>Capture Photo</button>
      {imageData && <img src={imageData} alt="Captured document" />}
    </div>
  );
}

export default DocumentScanner;
