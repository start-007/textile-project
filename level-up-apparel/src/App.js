import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Navbar from './components/Navbar';
import HeroUI from './components/HeroUI';
import Scene from './components/Scene';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* 3D Background Canvas */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#00ffff" />
          <directionalLight position={[-10, 10, -5]} intensity={1} color="#ff00ff" />
          
          {/* Your 3D models will go inside this Scene component */}
          <Scene />
          
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          <Environment preset="city" />
        </Canvas>
      </div>

      {/* 2D User Interface Overlay */}
      <div className="ui-layer">
        <Navbar />
        <div className="main-content">
          <HeroUI />
        </div>
      </div>
    </div>
  );
}

export default App;