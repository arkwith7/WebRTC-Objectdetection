import * as React from 'react';
import './style.css';
import ObjectDetector from './ObjectDetector';
import ScreenCapture from './ScreenCapture';
export default function App() {
  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
      <ScreenCapture />
    </div>
  );
}
