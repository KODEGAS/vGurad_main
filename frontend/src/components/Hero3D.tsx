import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

// DNA Helix representing crop protection
function ProtectionHelix() {
  const helixRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (helixRef.current) {
      helixRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const helixPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 4;
      const x = Math.cos(angle) * 0.5;
      const z = Math.sin(angle) * 0.5;
      const y = (i / 50) * 3 - 1.5;
      points.push([x, y, z]);
      points.push([-x, y, -z]);
    }
    return points;
  }, []);

  return (
    <group ref={helixRef} position={[3, 0, -2]}>
      {helixPoints.map((point, index) => (
        <mesh key={index} position={point as [number, number, number]}>
          <sphereGeometry args={[0.03, 8, 6]} />
          <meshStandardMaterial color={index % 2 === 0 ? "#10b981" : "#059669"} />
        </mesh>
      ))}
    </group>
  );
}

// Main 3D Scene
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4ade80" />
    
      {/* Protection Helix */}
      <ProtectionHelix />
      

      {/* Ground plane with subtle transparency */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1f2937" transparent opacity={0.1} />
      </mesh>
      
      {/* Interactive controls */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

export const Hero3D: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        className="opacity-30"
      >
        <Scene />
      </Canvas>
    </div>
  );
};