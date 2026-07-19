'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Custom keyboard hook for WASD & Arrow keys
function usePlayerControls() {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovement((m) => ({ ...m, forward: true }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMovement((m) => ({ ...m, backward: true }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMovement((m) => ({ ...m, left: true }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMovement((m) => ({ ...m, right: true }));
          break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovement((m) => ({ ...m, forward: false }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMovement((m) => ({ ...m, backward: false }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMovement((m) => ({ ...m, left: false }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMovement((m) => ({ ...m, right: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
}

interface PlayerProps {
  onInteract: (target: string | null) => void;
}

const Player: React.FC<PlayerProps> = ({ onInteract }) => {
  const playerRef = useRef<THREE.Mesh>(null);
  const shieldyRef = useRef<THREE.Mesh>(null);
  const movement = usePlayerControls();
  const speed = 6;

  // Static interactive targets
  const interactiveObjects = [
    { id: 'Vy', position: new THREE.Vector3(5, 0, -5) },
    { id: 'Minh', position: new THREE.Vector3(-5, 0, 5) },
    { id: 'Locker', position: new THREE.Vector3(-8, 0, -8) },
  ];

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    // Movement calculation
    const velocity = new THREE.Vector3(0, 0, 0);
    if (movement.forward) velocity.z -= 1;
    if (movement.backward) velocity.z += 1;
    if (movement.left) velocity.x -= 1;
    if (movement.right) velocity.x += 1;

    if (velocity.length() > 0) velocity.normalize().multiplyScalar(speed * delta);
    playerRef.current.position.add(velocity);

    // Clamping player inside the classroom bounds (roughly 20x20)
    playerRef.current.position.x = Math.max(-9.5, Math.min(9.5, playerRef.current.position.x));
    playerRef.current.position.z = Math.max(-9.5, Math.min(9.5, playerRef.current.position.z));

    // Third-person Camera follow
    const cameraOffset = new THREE.Vector3(0, 5, 8);
    const targetCameraPos = playerRef.current.position.clone().add(cameraOffset);
    state.camera.position.lerp(targetCameraPos, 0.1);
    state.camera.lookAt(playerRef.current.position);

    // Shieldy mascot logic (floating, bobbing, following)
    if (shieldyRef.current) {
      const time = state.clock.getElapsedTime();
      const bobbing = Math.sin(time * 4) * 0.2;
      const shieldyTarget = playerRef.current.position.clone().add(new THREE.Vector3(1.2, 1.5 + bobbing, -1));
      shieldyRef.current.position.lerp(shieldyTarget, 0.1);
      shieldyRef.current.rotation.y += delta;
      shieldyRef.current.rotation.z = Math.sin(time * 2) * 0.1;
    }

    // Distance check for interaction
    let closestTarget: string | null = null;
    const interactionThreshold = 2.0;

    for (const obj of interactiveObjects) {
      // Calculate 2D horizontal distance (ignore Y axis)
      const dist = Math.hypot(
        playerRef.current.position.x - obj.position.x,
        playerRef.current.position.z - obj.position.z
      );
      if (dist < interactionThreshold) {
        closestTarget = obj.id;
        break; // Only one interaction at a time
      }
    }

    // Trigger callback
    onInteract(closestTarget);
  });

  return (
    <>
      {/* Nam (Player) */}
      <mesh ref={playerRef} position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.3} />
      </mesh>
      
      {/* Shieldy (Mascot) */}
      <mesh ref={shieldyRef} position={[1, 2, -1]} castShadow>
        <octahedronGeometry args={[0.4]} />
        <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.8} />
      </mesh>
    </>
  );
};

const ClassroomEnvironment = () => {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#fde68a" roughness={0.8} />
      </mesh>
      
      {/* Back Wall */}
      <mesh position={[0, 2.5, -10]} receiveShadow>
        <boxGeometry args={[20, 5, 0.5]} />
        <meshStandardMaterial color="#fffbeb" />
      </mesh>
      {/* Blackboard */}
      <mesh position={[0, 2.5, -9.7]} receiveShadow>
        <boxGeometry args={[8, 3, 0.1]} />
        <meshStandardMaterial color="#064e3b" />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 5, 0.5]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 5, 0.5]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>

      {/* Student Desks */}
      {[[-4, -2], [4, -2], [-4, 3], [4, 3], [0, -2], [0, 3]].map((pos, i) => (
        <mesh key={`desk-${i}`} position={[pos[0], 0.75, pos[1]]} castShadow receiveShadow>
          <boxGeometry args={[2, 1.5, 1]} />
          <meshStandardMaterial color="#d97706" />
        </mesh>
      ))}

      {/* Teacher Desk */}
      <mesh position={[6, 0.75, -7]} castShadow receiveShadow>
        <boxGeometry args={[3, 1.5, 1.5]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>

      {/* Vy (Teacher/Mentor area) */}
      <group position={[5, 1, -5]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.4, 1, 4, 8]} />
          <meshStandardMaterial color="#ec4899" />
        </mesh>
        {/* Simple indicator/hair to distinguish */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#fbcfe8" />
        </mesh>
      </group>

      {/* Minh (Student area) */}
      <group position={[-5, 1, 5]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.4, 1, 4, 8]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#a7f3d0" />
        </mesh>
      </group>

      {/* Locker */}
      <mesh position={[-8, 2, -8]} castShadow receiveShadow>
        <boxGeometry args={[2, 4, 1]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} />
      </mesh>
    </group>
  );
};

export interface Classroom3DProps {
  onInteract: (target: string | null) => void;
}

export default function Classroom3D({ onInteract }: Classroom3DProps) {
  return (
    <div className="w-full h-full min-h-[600px] relative bg-sky-100 rounded-lg overflow-hidden border-2 border-sky-300">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        {/* Bright anime-style lighting */}
        <ambientLight intensity={1.2} />
        <directionalLight 
          position={[10, 15, 10]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          color="#ffffff"
        />
        <pointLight position={[-10, 5, -10]} intensity={0.6} color="#93c5fd" />
        <pointLight position={[10, 5, 10]} intensity={0.6} color="#fdf4ff" />
        
        <ClassroomEnvironment />
        <Player onInteract={onInteract} />
      </Canvas>
    </div>
  );
}
