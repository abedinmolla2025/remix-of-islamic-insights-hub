import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BeadProps {
  position: [number, number, number];
  color: string;
}

const Bead = ({ position, color }: BeadProps) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.4, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

interface TasbihMalaProps {
  count: number;
  totalBeads: number;
}

const TasbihMala = ({ count, totalBeads }: TasbihMalaProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const beads = useMemo(() => {
    const items: { position: [number, number, number]; color: string }[] = [];
    const radius = 3.5;
    
    for (let i = 0; i < totalBeads; i++) {
      const angle = (i / totalBeads) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const isCounted = i < (count % totalBeads) || count >= totalBeads;
      const isActive = i === (count % totalBeads) && count > 0;
      
      items.push({
        position: [x, 0, z],
        color: isActive ? "#fbbf24" : isCounted ? "#34d399" : "#0d9488"
      });
    }
    
    return items;
  }, [totalBeads, count]);

  return (
    <group ref={groupRef}>
      {beads.map((bead, i) => (
        <Bead key={i} position={bead.position} color={bead.color} />
      ))}
      {/* Center pendant */}
      <mesh position={[0, -1, 0]}>
        <coneGeometry args={[0.3, 0.8, 6]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
};

interface TasbihBeads3DProps {
  count: number;
  totalBeads?: number;
}

const TasbihBeads3D = ({ count, totalBeads = 33 }: TasbihBeads3DProps) => {
  return (
    <div 
      className="absolute inset-0" 
      style={{ zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 4, 8], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <TasbihMala count={count} totalBeads={totalBeads} />
      </Canvas>
    </div>
  );
};

export default TasbihBeads3D;