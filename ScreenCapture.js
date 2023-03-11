import React, { useRef, useState } from 'react';

const ScreenCapture = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startStream = async () => {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
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
      {stream ? (
        <div>
          <video ref={videoRef} autoPlay playsInline />
          <button onClick={stopStream}>Stop Screen Sharing</button>
        </div>
      ) : (
        <button onClick={startStream}>Start Screen Sharing</button>
      )}
    </div>
  );
};

export default ScreenCapture;
