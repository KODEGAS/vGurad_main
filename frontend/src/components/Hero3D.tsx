import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

// Floating Plant Component
function FloatingPlant({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        {/* Stem */}
        <cylinderGeometry args={[0.02, 0.02, 0.8]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>
      
      {/* Leaves */}
      <mesh position={[position[0], position[1] + 0.3, position[2]]}>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      <mesh position={[position[0] + 0.1, position[1] + 0.5, position[2]]}>
        <sphereGeometry args={[0.12, 8, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      <mesh position={[position[0] - 0.1, position[1] + 0.4, position[2]]}>
        <sphereGeometry args={[0.1, 8, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </Float>
  );
}

// Floating Particles Component
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#4ade80" size={0.02} transparent opacity={0.6} />
    </points>
  );
}

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
      
      {/* Floating Plants */}
      <FloatingPlant position={[-2, -1, 0]} color="#22c55e" />
      <FloatingPlant position={[0, -1.2, -1]} color="#16a34a" />
      <FloatingPlant position={[1.5, -0.8, 0.5]} color="#15803d" />
      <FloatingPlant position={[-1, 0, 1]} color="#166534" />
      
      {/* Protection Helix */}
      <ProtectionHelix />
      
      {/* Floating Particles */}
      <FloatingParticles />
      
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