import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import type { BookingStatus } from '@sevasetu/shared';
import { WebGlErrorBoundary } from '../common/WebGlErrorBoundary';
import { SceneLoadingFallback } from '../common/SceneLoadingFallback';
import { ControlledCamera } from '../common/ControlledCamera';
import { Accessible3dAlternative } from '../common/Accessible3dAlternative';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useIsMobile } from '../hooks/useIsMobile';
import { useSceneVisibility } from '../hooks/useSceneVisibility';

// Sequential happy-path lifecycle stages
const ACTIVE_STAGES: Array<{ status: BookingStatus; label: string }> = [
  { status: 'PENDING_PROVIDER', label: 'Requested' },
  { status: 'ACCEPTED', label: 'Accepted' },
  { status: 'SCHEDULED', label: 'Scheduled' },
  { status: 'ON_THE_WAY', label: 'On The Way' },
  { status: 'ARRIVED', label: 'Arrived' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'COMPLETED', label: 'Completed' },
];

interface Props {
  status: BookingStatus;
  referenceCode?: string;
  className?: string;
}

const StageNode: React.FC<{
  label: string;
  stageStatus: 'passed' | 'current' | 'future' | 'terminated';
  position: [number, number, number];
  prefersReducedMotion: boolean;
}> = ({ label, stageStatus, position, prefersReducedMotion }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && !prefersReducedMotion) {
      if (stageStatus === 'current') {
        meshRef.current.rotation.y += delta * 1.0;
      } else if (stageStatus === 'passed') {
        meshRef.current.rotation.y += delta * 0.2;
      }
    }
  });

  const nodeColor = useMemo(() => {
    if (stageStatus === 'current') return '#3b82f6'; // Bright Indigo/Blue
    if (stageStatus === 'passed') return '#10b981';  // Emerald Success
    if (stageStatus === 'terminated') return '#ef4444'; // Red Cancelled/Declined
    return '#94a3b8'; // Muted Slate Future
  }, [stageStatus]);

  const emissiveColor = useMemo(() => {
    if (stageStatus === 'current') return '#60a5fa';
    if (stageStatus === 'passed') return '#34d399';
    if (stageStatus === 'terminated') return '#f87171';
    return '#000000';
  }, [stageStatus]);

  return (
    <group position={position}>
      {/* 3D Geometry */}
      <mesh ref={meshRef} scale={stageStatus === 'current' ? 1.35 : 0.9}>
        {stageStatus === 'passed' ? (
          <icosahedronGeometry args={[0.35, 1]} />
        ) : stageStatus === 'current' ? (
          <octahedronGeometry args={[0.42, 0]} />
        ) : (
          <sphereGeometry args={[0.28, 16, 16]} />
        )}
        <meshStandardMaterial
          color={nodeColor}
          emissive={emissiveColor}
          emissiveIntensity={stageStatus === 'current' ? 0.8 : stageStatus === 'passed' ? 0.4 : 0.05}
          roughness={0.25}
          metalness={0.6}
          transparent={stageStatus === 'future'}
          opacity={stageStatus === 'future' ? 0.4 : 1.0}
        />
      </mesh>

      {/* Active Stage Pulsing Ring */}
      {stageStatus === 'current' && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.62, 32]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Stage Label */}
      <Html position={[0, -0.75, 0]} center distanceFactor={10}>
        <div
          className={`flex flex-col items-center px-2 py-0.5 rounded-lg border whitespace-nowrap text-[11px] font-semibold backdrop-blur-sm shadow-xs ${
            stageStatus === 'current'
              ? 'bg-blue-600 text-white border-blue-400 font-bold scale-105'
              : stageStatus === 'passed'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
              : stageStatus === 'terminated'
              ? 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300'
              : 'bg-white/80 text-neutral-500 border-neutral-200 dark:bg-neutral-900/60 dark:text-neutral-400'
          }`}
        >
          <div className="flex items-center gap-1">
            {stageStatus === 'passed' && <CheckCircle2 size={11} className="text-emerald-600" />}
            {stageStatus === 'terminated' && <AlertCircle size={11} className="text-red-500" />}
            <span>{label}</span>
          </div>
          {stageStatus === 'current' && (
            <span className="text-[9px] uppercase tracking-wider text-blue-100 font-medium">Active</span>
          )}
        </div>
      </Html>
    </group>
  );
};

const ConnectingPipeline: React.FC<{
  positions: Array<[number, number, number]>;
}> = ({ positions }) => {
  const lineGeo = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(
      positions.map((p) => new THREE.Vector3(...p))
    );
  }, [positions]);

  return (
    <primitive
      object={
        new THREE.Line(
          lineGeo,
          new THREE.LineBasicMaterial({
            color: 0x94a3b8,
            transparent: true,
            opacity: 0.35,
            linewidth: 1,
          })
        )
      }
    />
  );
};

/**
 * 3D Real-time Booking Lifecycle Tracker
 * Strictly visualization of actual backend booking status.
 */
export const BookingLifecycleScene: React.FC<Props> = ({
  status,
  referenceCode,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useSceneVisibility(containerRef);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const isTerminated = status === 'CANCELLED' || status === 'DECLINED' || status === 'EXPIRED';

  // Determine active index in sequence
  const currentStageIndex = useMemo(() => {
    const idx = ACTIVE_STAGES.findIndex((s) => s.status === status);
    return idx >= 0 ? idx : 0;
  }, [status]);

  // Display stages to render
  const stagesToRender = useMemo(() => {
    if (isTerminated) {
      return [
        { status: 'PENDING_PROVIDER' as BookingStatus, label: 'Requested' },
        { status, label: status === 'CANCELLED' ? 'Cancelled' : status === 'DECLINED' ? 'Declined' : 'Expired' },
      ];
    }
    return ACTIVE_STAGES;
  }, [isTerminated, status]);

  // Node positions along horizontal X-axis
  const spacing = isMobile ? 1.5 : 1.85;
  const startX = -((stagesToRender.length - 1) * spacing) / 2;

  const positions = useMemo<Array<[number, number, number]>>(() => {
    return stagesToRender.map((_, i) => [startX + i * spacing, 0, 0]);
  }, [stagesToRender, startX, spacing]);

  const accessibleItems = useMemo(() => {
    return stagesToRender.map((s, idx) => {
      const isPassed = !isTerminated && idx < currentStageIndex;
      const isCurrent = !isTerminated && idx === currentStageIndex;
      const statusLabel = isTerminated ? 'Terminated' : isCurrent ? 'Active State' : isPassed ? 'Completed' : 'Upcoming';
      return {
        id: s.status,
        label: `${s.label} (${statusLabel})`,
        isActive: isCurrent,
        badge: isCurrent ? 'ACTIVE' : undefined,
      };
    });
  }, [stagesToRender, isTerminated, currentStageIndex]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-slate-50 via-blue-50/20 to-slate-50 border border-neutral-200/90 shadow-2xs ${className}`}
      style={{ height: isMobile ? '200px' : '230px' }}
      aria-label={`Booking ${referenceCode || ''} Lifecycle Tracker: Status ${status}`}
    >
      <WebGlErrorBoundary fallbackTitle="Booking Progress Tracker">
        <Suspense fallback={<SceneLoadingFallback heightClassName="h-full" label="Visualizing booking lifecycle..." />}>
          {isVisible ? (
            <Canvas
              camera={{ position: [0, 0, isMobile ? 7.5 : 6.8], fov: isMobile ? 55 : 45 }}
              dpr={[1, isMobile ? 1.5 : Math.min(window.devicePixelRatio, 2)]}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={1.1} />
              <directionalLight position={[5, 8, 5]} intensity={1.4} />
              <pointLight position={[0, 0, 4]} intensity={0.8} color="#3b82f6" />

              <Float
                speed={prefersReducedMotion ? 0 : 1.0}
                rotationIntensity={prefersReducedMotion ? 0 : 0.1}
                floatIntensity={prefersReducedMotion ? 0 : 0.15}
              >
                {/* Connecting pipeline */}
                <ConnectingPipeline positions={positions} />

                {/* Stage nodes */}
                {stagesToRender.map((s, idx) => {
                  let stageStatus: 'passed' | 'current' | 'future' | 'terminated' = 'future';
                  if (isTerminated) {
                    stageStatus = idx === stagesToRender.length - 1 ? 'terminated' : 'passed';
                  } else if (idx < currentStageIndex) {
                    stageStatus = 'passed';
                  } else if (idx === currentStageIndex) {
                    stageStatus = 'current';
                  }

                  return (
                    <StageNode
                      key={s.status}
                      label={s.label}
                      stageStatus={stageStatus}
                      position={positions[idx] || [0, 0, 0]}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  );
                })}
              </Float>

              <ControlledCamera
                enableZoom={false}
                autoRotate={false}
                minPolarAngle={Math.PI / 2.2}
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
        title="Booking Progress States"
        description={`Current state: ${status}. Purely visual representation of backend booking progress.`}
        items={accessibleItems}
        srOnly
      />

      <div className="absolute top-2.5 right-3 flex items-center gap-1 text-[10px] text-neutral-500 font-medium px-2 py-0.5 rounded-md bg-white/70 backdrop-blur-xs border border-neutral-200/50">
        <ShieldCheck size={11} className="text-emerald-600" />
        <span>Verified Backend Status: {status}</span>
      </div>
    </div>
  );
};
