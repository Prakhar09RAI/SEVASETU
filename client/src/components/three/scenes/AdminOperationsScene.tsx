import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Users, Briefcase, CalendarClock, ShieldAlert, Activity } from 'lucide-react';
import type { AdminDashboardMetrics } from '@sevasetu/shared';
import { WebGlErrorBoundary } from '../common/WebGlErrorBoundary';
import { SceneLoadingFallback } from '../common/SceneLoadingFallback';
import { ControlledCamera } from '../common/ControlledCamera';
import { Accessible3dAlternative } from '../common/Accessible3dAlternative';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useIsMobile } from '../hooks/useIsMobile';
import { useSceneVisibility } from '../hooks/useSceneVisibility';

interface Props {
  metrics: AdminDashboardMetrics | null;
  isHealthy: boolean;
  className?: string;
}

const TelemetryNode: React.FC<{
  position: [number, number, number];
  title: string;
  metricValue: number | string;
  subValue?: string;
  color: string;
  glowColor: string;
  iconType: 'users' | 'providers' | 'bookings' | 'trust';
  prefersReducedMotion: boolean;
}> = ({ position, title, metricValue, subValue, color, glowColor, iconType, prefersReducedMotion }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && !prefersReducedMotion) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={glowColor}
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.6}
        />
      </mesh>

      <Html position={[0, -0.7, 0]} center distanceFactor={10}>
        <div className="flex flex-col items-center px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-neutral-900/95 border border-neutral-200/90 text-center shadow-xs whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            {iconType === 'users' && <Users size={12} className="text-blue-600" />}
            {iconType === 'providers' && <Briefcase size={12} className="text-indigo-600" />}
            {iconType === 'bookings' && <CalendarClock size={12} className="text-purple-600" />}
            {iconType === 'trust' && <ShieldAlert size={12} className="text-amber-600" />}
            <span className="text-xs font-bold text-neutral-900">{metricValue}</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-medium">{title}</span>
          {subValue && <span className="text-[9px] text-amber-600 font-semibold">{subValue}</span>}
        </div>
      </Html>
    </group>
  );
};

const GatewayCore: React.FC<{ isHealthy: boolean; prefersReducedMotion: boolean }> = ({
  isHealthy,
  prefersReducedMotion,
}) => {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (coreRef.current && !prefersReducedMotion) {
      coreRef.current.rotation.y += delta * 0.3;
      coreRef.current.rotation.x += delta * 0.15;
    }
  });

  const coreColor = isHealthy ? '#059669' : '#d97706';
  const glowColor = isHealthy ? '#34d399' : '#fbbf24';

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.75, 1]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={glowColor}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      <Html position={[0, 0, 0]} center distanceFactor={9}>
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white border shadow-md select-none backdrop-blur-md ${
            isHealthy ? 'bg-emerald-950/90 border-emerald-400' : 'bg-amber-950/90 border-amber-400'
          }`}
        >
          <Activity size={12} className={isHealthy ? 'text-emerald-300' : 'text-amber-300'} />
          <span>{isHealthy ? 'Core Healthy' : 'Degraded'}</span>
        </div>
      </Html>
    </group>
  );
};

/**
 * 3D Admin Platform Operations Scene
 * Visualizes the 4 platform operational quadrants using real database metrics from AdminService.
 */
export const AdminOperationsScene: React.FC<Props> = ({
  metrics,
  isHealthy,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useSceneVisibility(containerRef);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const radius = isMobile ? 2.4 : 3.2;

  const accessibleItems = useMemo(() => [
    {
      id: 'gateway',
      label: `API Gateway Health: ${isHealthy ? 'Healthy & Operational' : 'Degraded State'}`,
      badge: isHealthy ? 'ONLINE' : 'ATTENTION',
    },
    {
      id: 'users',
      label: `Registered Platform Users: ${metrics?.totalUsers ?? 'Unavailable'}`,
    },
    {
      id: 'providers',
      label: `Service Providers: ${metrics?.totalProviders ?? 'Unavailable'} (${metrics?.pendingVerifications ?? 0} pending verification)`,
    },
    {
      id: 'bookings',
      label: `Active Bookings: ${metrics?.activeBookings ?? 'Unavailable'}`,
    },
    {
      id: 'trust',
      label: `Trust & Safety Disputes: ${metrics?.openDisputes ?? 'Unavailable'} open`,
    },
  ], [isHealthy, metrics]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-neutral-50 via-slate-50 to-neutral-50 border border-neutral-200/90 shadow-2xs ${className}`}
      style={{ height: isMobile ? '260px' : '300px' }}
      aria-label="3D Admin Platform Operations Overview"
    >
      <WebGlErrorBoundary fallbackTitle="Operations Ecosystem Hub">
        <Suspense fallback={<SceneLoadingFallback heightClassName="h-full" label="Initializing telemetry visualizer..." />}>
          {isVisible ? (
            <Canvas
              camera={{ position: [0, 0, isMobile ? 7.8 : 7.0], fov: isMobile ? 55 : 45 }}
              dpr={[1, isMobile ? 1.5 : Math.min(window.devicePixelRatio, 2)]}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={1.1} />
              <directionalLight position={[7, 10, 7]} intensity={1.3} />
              <pointLight position={[0, 0, 4]} intensity={0.9} color="#6366f1" />

              <Float
                speed={prefersReducedMotion ? 0 : 1.2}
                rotationIntensity={prefersReducedMotion ? 0 : 0.1}
                floatIntensity={prefersReducedMotion ? 0 : 0.15}
              >
                {/* Central Platform Gateway Node */}
                <GatewayCore isHealthy={isHealthy} prefersReducedMotion={prefersReducedMotion} />

                {/* Users Quadrant */}
                <TelemetryNode
                  position={[-radius * 0.9, radius * 0.5, 0]}
                  title="Registered Users"
                  metricValue={metrics?.totalUsers ?? '—'}
                  color="#2563eb"
                  glowColor="#60a5fa"
                  iconType="users"
                  prefersReducedMotion={prefersReducedMotion}
                />

                {/* Providers Quadrant */}
                <TelemetryNode
                  position={[radius * 0.9, radius * 0.5, 0]}
                  title="Partners"
                  metricValue={metrics?.totalProviders ?? '—'}
                  subValue={metrics && metrics.pendingVerifications > 0 ? `${metrics.pendingVerifications} in audit` : undefined}
                  color="#4f46e5"
                  glowColor="#818cf8"
                  iconType="providers"
                  prefersReducedMotion={prefersReducedMotion}
                />

                {/* Bookings Quadrant */}
                <TelemetryNode
                  position={[-radius * 0.9, -radius * 0.5, 0]}
                  title="Active Bookings"
                  metricValue={metrics?.activeBookings ?? '—'}
                  color="#7c3aed"
                  glowColor="#a78bfa"
                  iconType="bookings"
                  prefersReducedMotion={prefersReducedMotion}
                />

                {/* Trust & Safety Quadrant */}
                <TelemetryNode
                  position={[radius * 0.9, -radius * 0.5, 0]}
                  title="Open Cases"
                  metricValue={metrics?.openDisputes ?? '—'}
                  color="#d97706"
                  glowColor="#fbbf24"
                  iconType="trust"
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
        title="Admin Telemetry Hub"
        description="Factual platform operations summary reflecting live PostgreSQL health and metric queries."
        items={accessibleItems}
        srOnly
      />

      <div className="absolute top-2.5 right-3 text-[10px] text-neutral-500 font-medium px-2 py-0.5 rounded-md bg-white/70 backdrop-blur-xs border border-neutral-200/50">
        <span>Factual Telemetry Grounding • Real Admin API</span>
      </div>
    </div>
  );
};
