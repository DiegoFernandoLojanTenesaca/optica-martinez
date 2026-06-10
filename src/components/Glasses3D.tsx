import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Glasses() {
  const group = useRef<THREE.Group>(null);

  // Frontal y recto: seguimiento del mouse MUY sutil (con damping)
  useFrame((state) => {
    const { pointer } = state;
    if (!group.current) return;
    const targetY = pointer.x * 0.18;
    const targetX = -pointer.y * 0.1;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.07);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.07);
  });

  const outerR = 0.95;
  const innerR = 0.78;
  const frameDepth = 0.24;
  const lensOffset = 1.04;

  // Aro de acetato con VOLUMEN real: anillo extruido + bisel
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

  // Lente curvo (esfera muy aplanada → lente biconvexo con grosor)
  const lensGeo = useMemo(() => new THREE.SphereGeometry(innerR * 1.0, 64, 64), []);

  // Materiales (memo para reutilizar)
  const acetate = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#0b0c0e"),
        roughness: 0.16,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        sheen: 0.5,
        sheenColor: new THREE.Color("#143038"),
        envMapIntensity: 1.1,
      }),
    []
  );

  const metal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#cfd3da"),
        roughness: 0.28,
        metalness: 1,
        envMapIntensity: 1.2,
      }),
    []
  );

  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#e6f4f6"),
        transmission: 0.96,
        thickness: 0.6,
        roughness: 0.03,
        ior: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        reflectivity: 0.55,
        transparent: true,
        opacity: 1,
        attenuationColor: new THREE.Color("#bfe6ea"),
        attenuationDistance: 2.5,
        envMapIntensity: 1.3,
      }),
    []
  );

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* ===== Frente: aros de acetato con grosor ===== */}
      <mesh geometry={ringGeo} material={acetate} position={[-lensOffset, 0, 0]} />
      <mesh geometry={ringGeo} material={acetate} position={[lensOffset, 0, 0]} />

      {/* ===== Lentes curvos ===== */}
      <mesh geometry={lensGeo} material={glass} position={[-lensOffset, 0, 0]} scale={[1, 1, 0.16]} />
      <mesh geometry={lensGeo} material={glass} position={[lensOffset, 0, 0]} scale={[1, 1, 0.16]} />

      {/* ===== Puente curvo ===== */}
      <mesh material={acetate} position={[0, 0.2, 0]}>
        <torusGeometry args={[0.3, 0.075, 24, 64, Math.PI]} />
      </mesh>

      {/* ===== Plaquetas de nariz ===== */}
      {[-1, 1].map((s) => (
        <mesh key={`nose-${s}`} material={acetate} position={[s * 0.26, -0.12, 0.12]}>
          <capsuleGeometry args={[0.035, 0.18, 4, 8]} />
        </mesh>
      ))}

      {/* ===== Bisagras + patillas (con codo) ===== */}
      {[-1, 1].map((s) => {
        const hingeX = s * (lensOffset + outerR - 0.05);
        return (
          <group key={`temple-${s}`} position={[hingeX, 0.12, 0]}>
            {/* bisagra metálica */}
            <mesh material={metal} position={[0, 0, 0.02]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.14, 16]} />
            </mesh>
            {/* patilla: tramo recto hacia atrás */}
            <mesh
              material={acetate}
              position={[s * 0.18, 0, -0.72]}
              rotation={[0, s * 0.09, 0]}
            >
              <boxGeometry args={[0.09, 0.12, 1.45]} />
            </mesh>
            {/* terminal: codo que baja detrás de la oreja */}
            <mesh
              material={acetate}
              position={[s * 0.32, -0.14, -1.42]}
              rotation={[0.5, s * 0.09, 0]}
            >
              <boxGeometry args={[0.085, 0.11, 0.42]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Fallback() {
  return (
    <div className="grid h-full w-full place-items-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
      Cargando…
    </div>
  );
}

export default function Glasses3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.05, 4.2], fov: 34 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      style={{ background: "transparent" }}
    >
      {/* Luz de estudio: key + fill + rim teal */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} castShadow />
      <directionalLight position={[-5, 1, 2]} intensity={0.5} />
      <directionalLight position={[0, -2, -6]} intensity={0.7} color="#0E7C86" />
      <Suspense fallback={null}>
        <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.35}>
          <Glasses />
        </Float>
        <Environment preset="studio" />
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.32}
          scale={9}
          blur={2.8}
          far={3.5}
          color="#0A2E33"
        />
      </Suspense>
    </Canvas>
  );
}
