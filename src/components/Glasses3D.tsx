import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Glasses() {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const { pointer } = state;
    target.current.x = pointer.y * 0.4;
    target.current.y = pointer.x * 0.8;
    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        target.current.x,
        0.06
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        target.current.y,
        0.06
      );
    }
  });

  // Frame material: brushed metallic teal
  const frameMat = (
    <meshPhysicalMaterial
      color="#0E7C86"
      metalness={0.95}
      roughness={0.22}
      clearcoat={1}
      clearcoatRoughness={0.1}
    />
  );

  // Glass lenses: realistic transmission
  const glassMat = (
    <meshPhysicalMaterial
      color="#bfe6ea"
      transmission={0.95}
      thickness={0.3}
      roughness={0.05}
      ior={1.5}
      clearcoat={1}
      clearcoatRoughness={0.05}
      transparent
      opacity={0.5}
      reflectivity={0.6}
      attenuationColor="#9ad6dc"
      attenuationDistance={1}
    />
  );

  const ringRadius = 0.85;
  const ringTube = 0.06;
  const lensOffset = 1.0;

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Left lens ring */}
      <mesh position={[-lensOffset, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ringRadius, ringTube, 32, 96]} />
        {frameMat}
      </mesh>
      {/* Right lens ring */}
      <mesh position={[lensOffset, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ringRadius, ringTube, 32, 96]} />
        {frameMat}
      </mesh>

      {/* Left lens glass */}
      <mesh position={[-lensOffset, 0, 0]}>
        <cylinderGeometry args={[ringRadius - 0.02, ringRadius - 0.02, 0.08, 64]} />
        {glassMat}
      </mesh>
      {/* Right lens glass */}
      <mesh position={[lensOffset, 0, 0]}>
        <cylinderGeometry args={[ringRadius - 0.02, ringRadius - 0.02, 0.08, 64]} />
        {glassMat}
      </mesh>

      {/* Bridge */}
      <mesh position={[0, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[ringTube, ringTube, 0.4, 16]} />
        {frameMat}
      </mesh>

      {/* Nose pads */}
      <mesh position={[-0.18, -0.18, 0.05]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshPhysicalMaterial color="#dddddd" roughness={0.4} />
      </mesh>
      <mesh position={[0.18, -0.18, 0.05]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshPhysicalMaterial color="#dddddd" roughness={0.4} />
      </mesh>

      {/* Temples (patillas) */}
      <mesh position={[-lensOffset - ringRadius - 0.5, 0, -0.15]} rotation={[0, -0.18, 0]}>
        <boxGeometry args={[1.1, 0.06, 0.06]} />
        {frameMat}
      </mesh>
      <mesh position={[lensOffset + ringRadius + 0.5, 0, -0.15]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[1.1, 0.06, 0.06]} />
        {frameMat}
      </mesh>

      {/* Temple tips */}
      <mesh position={[-lensOffset - ringRadius - 1.05, -0.05, -0.32]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhysicalMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      <mesh position={[lensOffset + ringRadius + 1.05, -0.05, -0.32]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhysicalMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function Glasses3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 38 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, -2, -5]} intensity={0.4} />
      <Suspense fallback={null}>
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
          <Glasses />
        </Float>
        <Environment preset="city" />
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.35}
          scale={8}
          blur={2.6}
          far={3}
          color="#0E7C86"
        />
      </Suspense>
    </Canvas>
  );
}
