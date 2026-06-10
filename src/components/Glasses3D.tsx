import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Glasses() {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Seguimiento del mouse en TODA la página
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      const idleY = Math.sin(t * 0.4) * 0.08;
      const targetY = idleY + mouse.current.x * 0.4;
      const targetX = -mouse.current.y * 0.2;
      // damp = suavizado fluido e independiente de los FPS
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        targetY,
        7,
        delta,
      );
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        targetX,
        7,
        delta,
      );
    }
  });

  const outerR = 0.92;
  const innerR = 0.83; // marco fino (aro = 0.09)
  const frameDepth = 0.14;
  const lensOffset = 1.04;

  const ringGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: frameDepth,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.025,
      bevelSegments: 6,
      curveSegments: 120,
    });
    geo.center();
    return geo;
  }, []);

  const lensGeo = useMemo(() => new THREE.SphereGeometry(innerR, 64, 64), []);
  // Arco del lente, más grueso y marcado (como las líneas del logo)
  const glintGeo = useMemo(
    () => new THREE.TorusGeometry(innerR * 0.52, 0.05, 14, 56, 1.5),
    [],
  );

  const black = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#0a0a0c"),
        roughness: 0.18,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.0,
      }),
    [],
  );
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#eaf0f6"),
        transmission: 0.97,
        thickness: 0.5,
        roughness: 0.04,
        ior: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        reflectivity: 0.5,
        transparent: true,
        opacity: 1,
        attenuationDistance: 3,
        envMapIntensity: 1.2,
      }),
    [],
  );
  // detalle del lente en NEGRO (como el reflejo dibujado del logo)
  const glint = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color("#0a0a0c") }),
    [],
  );

  return (
    <group ref={group} scale={0.72}>
      {/* Ojos: aro + lente + reflejo */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * lensOffset, 0, 0]}>
          <mesh geometry={ringGeo} material={black} />
          <mesh geometry={lensGeo} material={glass} scale={[1, 1, 0.09]} />
          <mesh
            geometry={glintGeo}
            material={glint}
            position={[-0.12, 0.18, 0.13]}
            rotation={[0, 0, 1.95]}
          />
        </group>
      ))}

      {/* Puente — conecta ambos aros (solapa los bordes internos) */}
      <mesh material={black} position={[0, 0.04, 0]}>
        <torusGeometry args={[0.2, 0.06, 20, 60, Math.PI]} />
      </mesh>
      {/* refuerzo recto del puente para que se vea unido */}
      <mesh material={black} position={[0, 0.16, 0.02]}>
        <boxGeometry args={[0.46, 0.06, 0.08]} />
      </mesh>

      {/* Plaquetas de nariz */}
      {[-1, 1].map((s) => (
        <mesh
          key={`nose-${s}`}
          material={black}
          position={[s * 0.26, -0.1, 0.1]}
        >
          <capsuleGeometry args={[0.028, 0.16, 4, 8]} />
        </mesh>
      ))}

      {/* Bisagras + patillas — nacen DENTRO del marco y el botón cubre la unión */}
      {[-1, 1].map((s) => {
        const hingeX = s * (lensOffset + outerR - 0.15); // bien dentro del marco
        return (
          <group key={`temple-${s}`} position={[hingeX, 0, 0]}>
            {/* botón de bisagra: cubre la unión aro-patilla */}
            <mesh material={black} position={[0, 0, 0.04]}>
              <sphereGeometry args={[0.11, 20, 20]} />
            </mesh>
            {/* patilla: nace pegada al marco y va recta hacia atrás */}
            <mesh
              material={black}
              position={[s * 0.07, 0, -0.64]}
              rotation={[0, s * 0.05, 0]}
            >
              <boxGeometry args={[0.075, 0.085, 1.6]} />
            </mesh>
            {/* terminal (codo) que baja detrás de la oreja */}
            <mesh
              material={black}
              position={[s * 0.12, -0.14, -1.4]}
              rotation={[0.5, s * 0.05, 0]}
            >
              <boxGeometry args={[0.07, 0.08, 0.42]} />
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
      camera={{ position: [0, 0.05, 5.9], fov: 32 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} />
      <directionalLight position={[-5, 1, 2]} intensity={0.5} />
      <directionalLight
        position={[0, -2, -6]}
        intensity={0.6}
        color="#3A35D6"
      />
      <Suspense fallback={null}>
        <Float speed={1.1} rotationIntensity={0.04} floatIntensity={0.28}>
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
