import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import * as cocossd from '@tensorflow-models/coco-ssd';

const ObjectDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [model, setModel] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const model = await cocossd.load();
      setModel(model);
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (model && videoRef.current) {
      const detect = async () => {
        const predictions = await model.detect(videoRef.current);
        if (predictions && predictions.length > 0) {
          const documentPrediction = predictions.find(
            (prediction) => prediction.class === 'book'
          );
          if (documentPrediction) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const [x, y, w, h] = documentPrediction.bbox;
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.lineWidth = '4';
            ctx.strokeStyle = 'red';
            ctx.stroke();
            if (w >= 400 && h >= 400) {
              const canvas2 = document.createElement('canvas');
              canvas2.width = w;
              canvas2.height = h;
              canvas2
                .getContext('2d')
                .drawImage(videoRef.current, x, y, w, h, 0, 0, w, h);
              setCapturedImage(canvas2.toDataURL('image/png'));
            }
          }
        }
        requestAnimationFrame(detect);
      };
      detect();
    }
  }, [model, videoRef, canvasRef]);

  const startStream = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    setStream(mediaStream);
    videoRef.current.srcObject = mediaStream;
  };

  const stopStream = () => {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    setStream(null);
    videoRef.current.srcObject = null;
  };

  return (
    <div>
      {capturedImage ? (
        <div>
          <img src={capturedImage} alt="Captured Document" />
          <button onClick={() => setCapturedImage(null)}>Retake Image</button>
        </div>
      ) : (
        <div>
          <video ref={videoRef} autoPlay playsInline />
          <canvas ref={canvasRef} />
          {stream ? (
            <button onClick={stopStream}>Stop Camera</button>
          ) : (
            <button onClick={startStream}>Start Camera</button>
          )}
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
