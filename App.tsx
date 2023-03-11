import * as React from 'react';
import './style.css';
import ObjectDetection from './ObjectDetection';
import ScreenCapture from './ScreenCapture';
import DocumentScanner from './DocumentScanner';
import ObjectRecognition from './ObjectRecognition';

export default function App() {
  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
      <ObjectRecognition />
    </div>
  );
}
