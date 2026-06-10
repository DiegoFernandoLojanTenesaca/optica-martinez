import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Glasses() {
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null); // párpado para el guiño (ojo izquierdo)

  const outerR = 0.95;
  const innerR = 0.78;
  const frameDepth = 0.24;
  const lensOffset = 1.04;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { pointer } = state;
    if (group.current) {
      // Giro AUTOMÁTICO continuo (no depende del mouse) + leve seguimiento del cursor
      const idleY = Math.sin(t * 0.5) * 0.32;
      const idleX = Math.sin(t * 0.75) * 0.07;
      const targetY = idleY + pointer.x * 0.15;
      const targetX = idleX - pointer.y * 0.06;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05);
    }
    // Guiño: el ojo izquierdo se cierra brevemente cada ~3.6 s
    if (lid.current) {
      const c = t % 3.6;
      let v = 0;
      if (c < 0.24) v = Math.sin((c / 0.24) * Math.PI); // 0 → 1 → 0
      lid.current.scale.y = v;
    }
  });

  // Aro de acetato con VOLUMEN real (anillo extruido + bisel)
  const ringGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: frameDepth,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.05,
      bevelSegments: 8,
      curveSegments: 110,
    });
    geo.center();
    return geo;
  }, []);

  const lensGeo = useMemo(() => new THREE.SphereGeometry(innerR, 64, 64), []);
  const lidGeo = useMemo(() => new THREE.CircleGeometry(innerR * 0.97, 48), []);

  // Acetato azul de la marca (índigo profundo, brillante)
  const acetate = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#211d72"),
        roughness: 0.16,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        sheen: 0.6,
        sheenColor: new THREE.Color("#4b46e0"),
        envMapIntensity: 1.15,
      }),
    []
  );

  const metal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#d2d5e2"),
        roughness: 0.28,
        metalness: 1,
        envMapIntensity: 1.2,
      }),
    []
  );

  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#eef1ff"),
        transmission: 0.96,
        thickness: 0.6,
        roughness: 0.03,
        ior: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        reflectivity: 0.55,
        transparent: true,
        opacity: 1,
        attenuationColor: new THREE.Color("#cfd6ff"),
        attenuationDistance: 2.5,
        envMapIntensity: 1.3,
      }),
    []
  );

  return (
    // scale global para que las gafas quepan COMPLETAS en el canvas
    <group ref={group} scale={0.78}>
      {/* Aros */}
      <mesh geometry={ringGeo} material={acetate} position={[-lensOffset, 0, 0]} />
      <mesh geometry={ringGeo} material={acetate} position={[lensOffset, 0, 0]} />

      {/* Lentes curvos */}
      <mesh geometry={lensGeo} material={glass} position={[-lensOffset, 0, 0]} scale={[1, 1, 0.16]} />
      <mesh geometry={lensGeo} material={glass} position={[lensOffset, 0, 0]} scale={[1, 1, 0.16]} />

      {/* Párpado del guiño (ojo izquierdo) — se despliega de arriba hacia abajo */}
      <group ref={lid} position={[-lensOffset, innerR * 0.97, 0.1]} scale={[1, 0, 1]}>
        <mesh geometry={lidGeo} material={acetate} position={[0, -innerR * 0.97, 0]} />
      </group>

      {/* Puente curvo */}
      <mesh material={acetate} position={[0, 0.2, 0]}>
        <torusGeometry args={[0.3, 0.075, 24, 64, Math.PI]} />
      </mesh>

      {/* Plaquetas de nariz */}
      {[-1, 1].map((s) => (
        <mesh key={`nose-${s}`} material={acetate} position={[s * 0.26, -0.12, 0.12]}>
          <capsuleGeometry args={[0.035, 0.18, 4, 8]} />
        </mesh>
      ))}

      {/* Bisagras + patillas (con codo) */}
      {[-1, 1].map((s) => {
        const hingeX = s * (lensOffset + outerR - 0.05);
        return (
          <group key={`temple-${s}`} position={[hingeX, 0.12, 0]}>
            <mesh material={metal} position={[0, 0, 0.02]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.14, 16]} />
            </mesh>
            <mesh material={acetate} position={[s * 0.18, 0, -0.72]} rotation={[0, s * 0.09, 0]}>
              <boxGeometry args={[0.09, 0.12, 1.45]} />
            </mesh>
            <mesh material={acetate} position={[s * 0.32, -0.14, -1.42]} rotation={[0.5, s * 0.09, 0]}>
              <boxGeometry args={[0.085, 0.11, 0.42]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function Glasses3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.05, 5.2], fov: 32 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* Luz de estudio: key + fill + rim azul */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <directionalLight position={[-5, 1, 2]} intensity={0.5} />
      <directionalLight position={[0, -2, -6]} intensity={0.8} color="#3A35D6" />
      <Suspense fallback={null}>
        <Float speed={1.1} rotationIntensity={0.05} floatIntensity={0.3}>
          <Glasses />
        </Float>
        <Environment preset="studio" />
        <ContactShadows
          position={[0, -1.55, 0]}
          opacity={0.3}
          scale={9}
          blur={2.8}
          far={3.5}
          color="#14143E"
        />
      </Suspense>
    </Canvas>
  );
}
