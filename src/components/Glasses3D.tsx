import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Glasses({ mobile }: { mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (mobile) return; // en celular no hay mouse: gira sola
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mobile]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    // oscilación automática (se mueve sola, también en celular) + seguimiento del mouse
    const baseY = Math.sin(t * 0.5) * 0.5;
    const targetY = baseY + mouse.current.x * 0.35;
    const targetX = Math.sin(t * 0.32) * 0.06 - mouse.current.y * 0.16;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 6, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 6, delta);
  });

  const outerR = 0.92;
  const innerR = 0.83;
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
      bevelSegments: mobile ? 3 : 6,
      curveSegments: mobile ? 48 : 110,
    });
    geo.center();
    return geo;
  }, [mobile]);

  const lensGeo = useMemo(
    () => new THREE.SphereGeometry(innerR, mobile ? 28 : 64, mobile ? 28 : 64),
    [mobile],
  );
  const glintGeo = useMemo(
    () => new THREE.TorusGeometry(innerR * 0.52, 0.05, mobile ? 8 : 14, mobile ? 28 : 56, 1.5),
    [mobile],
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
  // En celular: vidrio simple semi-transparente (sin transmission, que es lo más pesado).
  // En desktop: vidrio real con transmission.
  const glass = useMemo(
    () =>
      mobile
        ? new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#cfdcea"),
            transparent: true,
            opacity: 0.4,
            roughness: 0.12,
            metalness: 0,
            clearcoat: 1,
          })
        : new THREE.MeshPhysicalMaterial({
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
    [mobile],
  );
  const glint = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color("#0a0a0c") }),
    [],
  );

  return (
    <group ref={group} scale={mobile ? 0.58 : 0.72}>
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

      {/* Puente — conecta ambos aros */}
      <mesh material={black} position={[0, 0.04, 0]}>
        <torusGeometry args={[0.2, 0.06, 16, 48, Math.PI]} />
      </mesh>
      <mesh material={black} position={[0, 0.16, 0.02]}>
        <boxGeometry args={[0.46, 0.06, 0.08]} />
      </mesh>

      {/* Plaquetas de nariz */}
      {[-1, 1].map((s) => (
        <mesh key={`nose-${s}`} material={black} position={[s * 0.26, -0.1, 0.1]}>
          <capsuleGeometry args={[0.028, 0.16, 3, 6]} />
        </mesh>
      ))}

      {/* Bisagras + patillas */}
      {[-1, 1].map((s) => {
        const hingeX = s * (lensOffset + outerR - 0.15);
        return (
          <group key={`temple-${s}`} position={[hingeX, 0, 0]}>
            <mesh material={black} position={[0, 0, 0.04]}>
              <sphereGeometry args={[0.11, 16, 16]} />
            </mesh>
            <mesh
              material={black}
              position={[s * 0.07, 0, -0.64]}
              rotation={[0, s * 0.05, 0]}
            >
              <boxGeometry args={[0.075, 0.085, 1.6]} />
            </mesh>
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
  // Detecta celular una vez (el componente es client-only vía lazy + Suspense)
  const [mobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches,
  );

  return (
    <Canvas
      camera={{ position: [0, 0.05, mobile ? 8.2 : 5.9], fov: 32 }}
      dpr={mobile ? 1 : [1, 1.8]}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={mobile ? 0.85 : 0.5} />
      <directionalLight position={[4, 6, 5]} intensity={mobile ? 2 : 1.5} />
      <directionalLight position={[-5, 1, 2]} intensity={0.6} />
      <directionalLight position={[0, -2, -6]} intensity={0.6} color="#3A35D6" />
      <Suspense fallback={null}>
        <Float speed={1.1} rotationIntensity={0.04} floatIntensity={mobile ? 0.2 : 0.28}>
          <Glasses mobile={mobile} />
        </Float>
        {/* Environment y sombras solo en desktop (en celular pesan demasiado) */}
        {!mobile && <Environment preset="studio" />}
        {!mobile && (
          <ContactShadows
            position={[0, -1.55, 0]}
            opacity={0.3}
            scale={9}
            blur={2.8}
            far={3.5}
            color="#14143E"
          />
        )}
      </Suspense>
    </Canvas>
  );
}
