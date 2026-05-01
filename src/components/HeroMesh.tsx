"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function DistortMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.2, 6);
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#001d3d"),
        emissive: new THREE.Color("#00f5ff"),
        emissiveIntensity: 0.08,
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      }),
    []
  );

  const positionArray = useMemo(() => {
    const arr = (geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    return new Float32Array(arr);
  }, [geometry]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;

    for (let i = 0; i < arr.length; i += 3) {
      const ox = positionArray[i];
      const oy = positionArray[i + 1];
      const oz = positionArray[i + 2];
      const noise = Math.sin(ox * 2 + t * 0.7) * Math.cos(oy * 2 + t * 0.5) * 0.18;
      arr[i] = ox + noise;
      arr[i + 1] = oy + noise * 0.8;
      arr[i + 2] = oz + noise * 0.6;
    }
    pos.needsUpdate = true;

    meshRef.current.rotation.x += (mouse.y * 0.3 - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y += (mouse.x * 0.5 - meshRef.current.rotation.y) * 0.05;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} />
  );
}

function Particles() {
  const points = useRef<THREE.Points>(null);
  const count = 400;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (points.current) {
      points.current.rotation.y = clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          args={[positions, 3]}
          attach="attributes-position"
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00f5ff"
        size={0.04}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroMesh() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[4, 4, 4]} intensity={1.5} color="#00f5ff" />
        <pointLight position={[-4, -4, -4]} intensity={0.5} color="#001d3d" />
        <DistortMesh />
        <Particles />
      </Canvas>
    </div>
  );
}
