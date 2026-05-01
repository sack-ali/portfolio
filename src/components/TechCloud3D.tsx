"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Sphere } from "@react-three/drei";
import * as THREE from "three";
import type { TechItem } from "./TechDNA";

function TechNode({
  item,
  onHover,
  isHovered,
}: {
  item: TechItem;
  onHover: (name: string | null) => void;
  isHovered: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = item.y + Math.sin(t * 0.6 + item.x) * 0.12;
    ref.current.scale.setScalar(isHovered ? 1.25 : 1);
  });

  return (
    <group ref={ref} position={[item.x, item.y, item.z]}>
      <mesh
        onPointerEnter={() => onHover(item.name)}
        onPointerLeave={() => onHover(null)}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={item.color}
          emissive={item.color}
          emissiveIntensity={isHovered ? 0.8 : 0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Text
        position={[0, -0.28, 0]}
        fontSize={0.14}
        color={isHovered ? item.color : "rgba(224,244,255,0.7)"}
        anchorX="center"
        anchorY="top"
      >
        {item.name}
      </Text>
    </group>
  );
}

function CloudGroup({
  items,
  onHover,
  hoveredTech,
}: {
  items: TechItem[];
  onHover: (n: string | null) => void;
  hoveredTech: string | null;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {items.map((item) => (
        <TechNode
          key={item.name}
          item={item}
          onHover={onHover}
          isHovered={hoveredTech === item.name}
        />
      ))}
    </group>
  );
}

export default function TechCloud3D({
  items,
  onHover,
  hoveredTech,
}: {
  items: TechItem[];
  onHover: (n: string | null) => void;
  hoveredTech: string | null;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00f5ff" />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color="#7b2fff" />
      <CloudGroup items={items} onHover={onHover} hoveredTech={hoveredTech} />
    </Canvas>
  );
}
