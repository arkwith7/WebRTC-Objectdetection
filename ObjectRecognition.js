import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import * as cocossd from '@tensorflow-models/coco-ssd';

const ObjectRecognition = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [model, setModel] = useState(null);

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
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        predictions.forEach((prediction) => {
          const [x, y, w, h] = prediction.bbox;
          ctx.beginPath();
          ctx.rect(x, y, w, h);
          ctx.lineWidth = '4';
          ctx.strokeStyle = 'red';
          ctx.stroke();
          ctx.font = '18px Arial';
          ctx.fillStyle = 'red';
          ctx.fillText(prediction.class, x, y - 5);
        });
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
      <video ref={videoRef} autoPlay playsInline />
      <canvas ref={canvasRef} />
      {stream ? (
        <button onClick={stopStream}>Stop Camera</button>
      ) : (
        <button onClick={startStream}>Start Camera</button>
      )}
    </div>
  );
};

export default ObjectRecognition;
