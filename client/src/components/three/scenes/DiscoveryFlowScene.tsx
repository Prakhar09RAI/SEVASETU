import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { WebGlErrorBoundary } from '../common/WebGlErrorBoundary';
import { SceneLoadingFallback } from '../common/SceneLoadingFallback';
import { ControlledCamera } from '../common/ControlledCamera';
import { Accessible3dAlternative } from '../common/Accessible3dAlternative';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useIsMobile } from '../hooks/useIsMobile';
import { useSceneVisibility } from '../hooks/useSceneVisibility';
import { useThemeColors } from '../hooks/useThemeColors';

interface FlowStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  color: string;
  glowColor: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    id: 'discover',
    stepNumber: 1,
    title: 'Discover',
    subtitle: 'Verified local catalog',
    color: '#0284c7', // Sky
    glowColor: '#38bdf8',
  },
  {
    id: 'match',
    stepNumber: 2,
    title: 'Match',
    subtitle: 'Transparent skill fit',
    color: '#4f46e5', // Indigo
    glowColor: '#818cf8',
  },
  {
    id: 'schedule',
    stepNumber: 3,
    title: 'Schedule',
    subtitle: 'Real-time calendar slot',
    color: '#7c3aed', // Purple
    glowColor: '#a78bfa',
  },
  {
    id: 'book',
    stepNumber: 4,
    title: 'Book',
    subtitle: 'Confirmed service order',
    color: '#d97706', // Amber
    glowColor: '#fbbf24',
  },
  {
    id: 'complete',
    stepNumber: 5,
    title: 'Complete',
    subtitle: 'Verified fulfillment & review',
    color: '#059669', // Emerald
    glowColor: '#34d399',
  },
];

const StepNode: React.FC<{
  step: FlowStep;
  position: [number, number, number];
  isSelected: boolean;
  onSelect: (id: string) => void;
  prefersReducedMotion: boolean;
}> = ({ step, position, isSelected, onSelect, prefersReducedMotion }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && !prefersReducedMotion) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* 3D Geometry Bead */}
      <mesh
        ref={meshRef}
        scale={isSelected ? 1.3 : 1.0}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(step.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={isSelected ? step.glowColor : step.color}
          emissive={step.color}
          emissiveIntensity={isSelected ? 0.8 : 0.25}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.72, 32]} />
        <meshBasicMaterial
          color={step.glowColor}
          transparent
          opacity={isSelected ? 0.9 : 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* HTML Step Indicator & Tooltip */}
      <Html position={[0, -0.95, 0]} center distanceFactor={10}>
        <button
          type="button"
          onClick={() => onSelect(step.id)}
          className={`flex flex-col items-center px-3 py-1.5 rounded-xl border text-center whitespace-nowrap backdrop-blur-md transition-all duration-200 cursor-pointer ${
            isSelected
              ? 'bg-neutral-900 text-white border-primary-400 shadow-lg scale-105'
              : 'bg-white/95 text-neutral-800 border-neutral-200 hover:bg-neutral-50 shadow-xs'
          }`}
          aria-label={`Step ${step.stepNumber}: ${step.title} - ${step.subtitle}`}
        >
          <div className="flex items-center gap-1">
            <span
              className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
              style={{ backgroundColor: step.color }}
            >
              {step.stepNumber}
            </span>
            <span className="text-xs font-bold">{step.title}</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-medium">{step.subtitle}</span>
        </button>
      </Html>
    </group>
  );
};

const PipelineBeam: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  active: boolean;
}> = ({ start, end, active }) => {
  const lineGeo = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ]);
  }, [start, end]);

  return (
    <primitive
      object={
        new THREE.Line(
          lineGeo,
          new THREE.LineBasicMaterial({
            color: active ? 0x6366f1 : 0xcbd5e1,
            transparent: true,
            opacity: active ? 0.9 : 0.4,
            linewidth: active ? 2 : 1,
          })
        )
      }
    />
  );
};

/**
 * DiscoveryFlowScene
 * Interactive 3D visualization showing the 5-step service fulfillment pipeline.
 */
export const DiscoveryFlowScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useSceneVisibility(containerRef);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const theme = useThemeColors();

  const [activeStepId, setActiveStepId] = useState<string>('discover');

  // Spacing calculation along the X-axis
  const stepSpacing = isMobile ? 1.7 : 2.4;
  const totalWidth = (FLOW_STEPS.length - 1) * stepSpacing;
  const startX = -totalWidth / 2;

  const stepPositions = useMemo<Array<[number, number, number]>>(() => {
    return FLOW_STEPS.map((_, i) => [startX + i * stepSpacing, 0, 0]);
  }, [startX, stepSpacing]);

  const accessibleItems = useMemo(() => {
    return FLOW_STEPS.map((s) => ({
      id: s.id,
      label: `Step ${s.stepNumber}: ${s.title}`,
      description: s.subtitle,
      badge: s.id === activeStepId ? 'Active View' : undefined,
      onClick: () => setActiveStepId(s.id),
      isActive: s.id === activeStepId,
    }));
  }, [activeStepId]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-neutral-50 via-primary-50/20 to-neutral-50 border border-neutral-200/80 shadow-2xs mb-6"
      style={{ height: isMobile ? '220px' : '260px' }}
      aria-label="3D Service Discovery and Matching Flow Pipeline"
    >
      <WebGlErrorBoundary fallbackTitle="Service Matching Pipeline">
        <Suspense fallback={<SceneLoadingFallback heightClassName="h-full" label="Loading Pipeline..." />}>
          {isVisible ? (
            <Canvas
              camera={{ position: [0, 0.2, isMobile ? 8.5 : 7.2], fov: isMobile ? 55 : 45 }}
              dpr={[1, isMobile ? 1.5 : Math.min(window.devicePixelRatio, 2)]}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={theme.isDark ? 0.7 : 1.1} />
              <directionalLight position={[5, 10, 7]} intensity={1.3} />
              <pointLight position={[0, 0, 4]} intensity={0.8} color="#6366f1" />

              <Float
                speed={prefersReducedMotion ? 0 : 1.2}
                rotationIntensity={prefersReducedMotion ? 0 : 0.15}
                floatIntensity={prefersReducedMotion ? 0 : 0.2}
              >
                {/* Connecting pipeline beams between consecutive steps */}
                {stepPositions.slice(0, -1).map((pos, idx) => (
                  <PipelineBeam
                    key={idx}
                    start={pos}
                    end={stepPositions[idx + 1] || [0, 0, 0]}
                    active={
                      FLOW_STEPS[idx]?.id === activeStepId ||
                      FLOW_STEPS[idx + 1]?.id === activeStepId
                    }
                  />
                ))}

                {/* 5 Step Nodes */}
                {FLOW_STEPS.map((step, idx) => (
                  <StepNode
                    key={step.id}
                    step={step}
                    position={stepPositions[idx] || [0, 0, 0]}
                    isSelected={activeStepId === step.id}
                    onSelect={setActiveStepId}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
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
        title="SevaSetu Service Flow"
        description="Understand each phase of booking and verified delivery on SevaSetu."
        items={accessibleItems}
        srOnly
      />
    </div>
  );
};
