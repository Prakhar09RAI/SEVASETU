import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ShieldCheck, Clock, Briefcase, Wrench } from 'lucide-react';
import { WebGlErrorBoundary } from '../common/WebGlErrorBoundary';
import { SceneLoadingFallback } from '../common/SceneLoadingFallback';
import { ControlledCamera } from '../common/ControlledCamera';
import { Accessible3dAlternative } from '../common/Accessible3dAlternative';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useIsMobile } from '../hooks/useIsMobile';
import { useSceneVisibility } from '../hooks/useSceneVisibility';

interface Props {
  isVerified: boolean;
  onboardingStatus: string;
  skillsCount: number;
  servicesCount: number;
  hasAvailability: boolean;
  className?: string;
}

const VerificationCore: React.FC<{ isVerified: boolean; prefersReducedMotion: boolean }> = ({
  isVerified,
  prefersReducedMotion,
}) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!prefersReducedMotion) {
      if (coreRef.current) {
        coreRef.current.rotation.y += delta * 0.3;
      }
      if (ringRef.current) {
        ringRef.current.rotation.z += delta * 0.4;
      }
    }
  });

  const coreColor = isVerified ? '#059669' : '#3b82f6';
  const emissiveColor = isVerified ? '#10b981' : '#60a5fa';

  return (
    <group position={[0, 0, 0]}>
      {/* Central Identity Sphere */}
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={emissiveColor}
          emissiveIntensity={isVerified ? 0.6 : 0.25}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Orbiting Verification Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.35, 0.035, 16, 48]} />
        <meshBasicMaterial
          color={isVerified ? '#34d399' : '#93c5fd'}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* HTML Status Tag */}
      <Html position={[0, 0, 0]} center distanceFactor={9}>
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-md whitespace-nowrap select-none backdrop-blur-md ${
            isVerified
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-400'
              : 'bg-neutral-900/90 text-neutral-200 border-neutral-600'
          }`}
        >
          {isVerified ? (
            <>
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Verified Partner</span>
            </>
          ) : (
            <>
              <Clock size={13} className="text-amber-400" />
              <span>Standard Partner</span>
            </>
          )}
        </div>
      </Html>
    </group>
  );
};

const SatelliteNode: React.FC<{
  position: [number, number, number];
  label: string;
  count: number | string;
  iconType: 'skills' | 'services' | 'availability';
  prefersReducedMotion: boolean;
}> = ({ position, label, count, iconType, prefersReducedMotion }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && !prefersReducedMotion) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          color="#4f46e5"
          emissive="#6366f1"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      <Html position={[0, -0.65, 0]} center distanceFactor={10}>
        <div className="flex flex-col items-center px-2.5 py-1 rounded-xl bg-white/95 dark:bg-neutral-900/95 border border-neutral-200/90 text-[11px] font-semibold text-neutral-800 shadow-sm whitespace-nowrap">
          <div className="flex items-center gap-1">
            {iconType === 'skills' && <Wrench size={11} className="text-indigo-600" />}
            {iconType === 'services' && <Briefcase size={11} className="text-blue-600" />}
            {iconType === 'availability' && <Clock size={11} className="text-amber-600" />}
            <span className="font-bold text-neutral-900">{count}</span>
          </div>
          <span className="text-[9px] text-neutral-500 font-normal">{label}</span>
        </div>
      </Html>
    </group>
  );
};

/**
 * 3D Provider Activity & Operational Readiness Scene
 * Shows verified trust state, skills, service offerings, and schedule status based on real DB records.
 */
export const ProviderActivityScene: React.FC<Props> = ({
  isVerified,
  onboardingStatus,
  skillsCount,
  servicesCount,
  hasAvailability,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useSceneVisibility(containerRef);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const radius = isMobile ? 2.5 : 3.0;

  const accessibleItems = useMemo(() => [
    {
      id: 'verification',
      label: `Trust Status: ${isVerified ? 'Verified Active Partner' : 'Verification In Progress'}`,
      badge: isVerified ? 'VERIFIED' : 'PENDING',
    },
    {
      id: 'skills',
      label: `Active Trade Skills: ${skillsCount} registered`,
    },
    {
      id: 'services',
      label: `Catalog Service Offerings: ${servicesCount} active`,
    },
    {
      id: 'availability',
      label: `Weekly Schedule: ${hasAvailability ? 'Operating hours configured' : 'Schedule unconfigured'}`,
    },
  ], [isVerified, skillsCount, servicesCount, hasAvailability]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-neutral-50 via-indigo-50/20 to-neutral-50 border border-neutral-200/90 shadow-2xs ${className}`}
      style={{ height: isMobile ? '230px' : '270px' }}
      aria-label="Provider Service Readiness and Trust 3D Hub"
    >
      <WebGlErrorBoundary fallbackTitle="Partner Readiness Overview">
        <Suspense fallback={<SceneLoadingFallback heightClassName="h-full" label="Loading readiness visualizer..." />}>
          {isVisible ? (
            <Canvas
              camera={{ position: [0, 0, isMobile ? 7.2 : 6.5], fov: isMobile ? 55 : 45 }}
              dpr={[1, isMobile ? 1.5 : Math.min(window.devicePixelRatio, 2)]}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={1.1} />
              <directionalLight position={[6, 8, 6]} intensity={1.3} />
              <pointLight position={[0, 0, 3]} intensity={0.9} color={isVerified ? '#34d399' : '#818cf8'} />

              <Float
                speed={prefersReducedMotion ? 0 : 1.2}
                rotationIntensity={prefersReducedMotion ? 0 : 0.15}
                floatIntensity={prefersReducedMotion ? 0 : 0.2}
              >
                {/* Central Verification & Identity Beacon */}
                <VerificationCore isVerified={isVerified} prefersReducedMotion={prefersReducedMotion} />

                {/* Satellite Nodes reflecting factual counts */}
                <SatelliteNode
                  position={[-radius * 0.9, 0.4, 0]}
                  label="Registered Skills"
                  count={skillsCount}
                  iconType="skills"
                  prefersReducedMotion={prefersReducedMotion}
                />
                <SatelliteNode
                  position={[radius * 0.9, 0.4, 0]}
                  label="Active Services"
                  count={servicesCount}
                  iconType="services"
                  prefersReducedMotion={prefersReducedMotion}
                />
                <SatelliteNode
                  position={[0, -radius * 0.65, 0]}
                  label="Operating Hours"
                  count={hasAvailability ? 'Configured' : 'Needed'}
                  iconType="availability"
                  prefersReducedMotion={prefersReducedMotion}
                />
              </Float>

              <ControlledCamera
                enableZoom={false}
                autoRotate={false}
                minPolarAngle={Math.PI / 2.3}
                maxPolarAngle={Math.PI / 2}
              />
            </Canvas>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
              <span>Scene paused</span>
            </div>
          )}
        </Suspense>
      </WebGlErrorBoundary>

      <Accessible3dAlternative
        title="Partner Console Status"
        description={`Onboarding state: ${onboardingStatus}. Actual profile metrics from PostgreSQL.`}
        items={accessibleItems}
        srOnly
      />

      <div className="absolute bottom-2.5 left-3 text-[10px] text-neutral-500 font-medium px-2 py-0.5 rounded-md bg-white/70 backdrop-blur-xs border border-neutral-200/50">
        <span>Factual Partner Telemetry • Live DB Grounding</span>
      </div>
    </div>
  );
};
