import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Glasses({ winkReq }: { winkReq: { current: boolean } }) {
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const winkT0 = useRef(-10);

  // Seguimiento del mouse en TODA la página (más natural)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      const idleY = Math.sin(t * 0.45) * 0.1;
      const targetY = idleY + mouse.current.x * 0.42;
      const targetX = -mouse.current.y * 0.22;
      // lerp más alto = responde sin "retraso"
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.13);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.13);
    }
    // Guiño DISPARADO AL CLICK
    if (winkReq.current) {
      winkReq.current = false;
      winkT0.current = t;
    }
    if (lid.current) {
      const c = t - winkT0.current;
      let v = 0;
      if (c >= 0 && c < 0.85) v = Math.sin((c / 0.85) * Math.PI); // 0 → 1 → 0 (guiño lento)
      lid.current.scale.y = v;
    }
  });

  const outerR = 0.92;
  const innerR = 0.83; // marco aún más FINO (outerR - innerR = 0.09)
  const frameDepth = 0.14;
  const lensOffset = 1.04;

  // Aro redondo, delgado, con un poco de volumen
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
      bevelSize: 0.03,
      bevelSegments: 6,
      curveSegments: 120,
    });
    geo.center();
    return geo;
  }, []);

  const lensGeo = useMemo(() => new THREE.SphereGeometry(innerR, 64, 64), []);
  const lidGeo = useMemo(() => new THREE.CircleGeometry(innerR * 0.98, 48), []);
  // Arco de reflejo (highlight) dentro del lente, como en el logo
  const glintGeo = useMemo(() => new THREE.TorusGeometry(innerR * 0.5, 0.028, 10, 40, 1.4), []);

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
    []
  );
  const metal = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color("#202022"), roughness: 0.3, metalness: 0.9 }),
    []
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
    []
  );
  const glint = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffffff"), transparent: true, opacity: 0.7 }),
    []
  );

  return (
    <group ref={group} scale={0.72}>
      {/* Ojos: aro + lente + reflejo (como el icono) */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * lensOffset, 0, 0]}>
          <mesh geometry={ringGeo} material={black} />
          <mesh geometry={lensGeo} material={glass} scale={[1, 1, 0.16]} />
          <mesh
            geometry={glintGeo}
            material={glint}
            position={[-0.12, 0.18, 0.13]}
            rotation={[0, 0, 1.95]}
          />
        </group>
      ))}

      {/* Párpado del guiño (ojo izquierdo) — delante del reflejo para taparlo al cerrar */}
      <group ref={lid} position={[-lensOffset, innerR * 0.98, 0.18]} scale={[1, 0, 1]}>
        <mesh geometry={lidGeo} material={black} position={[0, -innerR * 0.98, 0]} />
      </group>

      {/* Puente */}
      <mesh material={black} position={[0, 0.16, 0]}>
        <torusGeometry args={[0.3, 0.055, 20, 60, Math.PI]} />
      </mesh>

      {/* Plaquetas de nariz */}
      {[-1, 1].map((s) => (
        <mesh key={`nose-${s}`} material={black} position={[s * 0.26, -0.1, 0.1]}>
          <capsuleGeometry args={[0.03, 0.16, 4, 8]} />
        </mesh>
      ))}

      {/* Bisagras tipo botón (como el logo) + patillas */}
      {[-1, 1].map((s) => {
        const hingeX = s * (lensOffset + outerR - 0.02);
        return (
          <group key={`temple-${s}`} position={[hingeX, 0.05, 0]}>
            <mesh material={black} position={[s * 0.04, 0, 0.05]}>
              <sphereGeometry args={[0.075, 20, 20]} />
            </mesh>
            <mesh material={metal} position={[s * 0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
            </mesh>
            <mesh material={black} position={[s * 0.2, 0, -0.7]} rotation={[0, s * 0.1, 0]}>
              <boxGeometry args={[0.07, 0.09, 1.4]} />
            </mesh>
            <mesh material={black} position={[s * 0.33, -0.13, -1.38]} rotation={[0.5, s * 0.1, 0]}>
              <boxGeometry args={[0.065, 0.085, 0.4]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function Glasses3D() {
  const winkReq = useRef(false);
  return (
    <Canvas
      camera={{ position: [0, 0.05, 5.9], fov: 32 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      onPointerDown={() => {
        winkReq.current = true;
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} />
      <directionalLight position={[-5, 1, 2]} intensity={0.5} />
      <directionalLight position={[0, -2, -6]} intensity={0.6} color="#3A35D6" />
      <Suspense fallback={null}>
        <Float speed={1.1} rotationIntensity={0.04} floatIntensity={0.28}>
          <Glasses winkReq={winkReq} />
        </Float>
        <Environment preset="studio" />
        <ContactShadows position={[0, -1.55, 0]} opacity={0.3} scale={9} blur={2.8} far={3.5} color="#14143E" />
      </Suspense>
    </Canvas>
  );
}
