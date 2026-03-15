import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Scene() {
  const groupRef = useRef();

  // Gentle floating animation for the 3D elements
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t / 2) * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0f0f1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Placeholder for Main Character */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 3, 1]} />
        <meshStandardMaterial color="#00ffff" wireframe />
      </mesh>
    </group>
  );
}