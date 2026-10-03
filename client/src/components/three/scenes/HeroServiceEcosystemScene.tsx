import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Layers } from 'lucide-react';
import { CORE_SERVICE_CATEGORIES } from '../../../constants/categories';
import { WebGlErrorBoundary } from '../common/WebGlErrorBoundary';
import { SceneLoadingFallback } from '../common/SceneLoadingFallback';
import { ControlledCamera } from '../common/ControlledCamera';
import { Accessible3dAlternative } from '../common/Accessible3dAlternative';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useIsMobile } from '../hooks/useIsMobile';
import { useSceneVisibility } from '../hooks/useSceneVisibility';
import { useThemeColors } from '../hooks/useThemeColors';

// Category color palettes for harmonious ecosystem visual
const CATEGORY_COLORS: Record<string, { primary: string; glow: string }> = {
  cleaning: { primary: '#0ea5e9', glow: '#38bdf8' },     // Sky Blue
  electrician: { primary: '#f59e0b', glow: '#fbbf24' },  // Amber/Gold
  plumber: { primary: '#06b6d4', glow: '#22d3ee' },      // Cyan
  carpenter: { primary: '#d97706', glow: '#f59e0b' },    // Warm Wood
  maid: { primary: '#10b981', glow: '#34d399' },         // Emerald
  driver: { primary: '#6366f1', glow: '#818cf8' },       // Indigo
};

interface NodeProps {
  category: (typeof CORE_SERVICE_CATEGORIES)[number];
  position: [number, number, number];
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (slug: string) => void;
  prefersReducedMotion: boolean;
}

const CategoryNode: React.FC<NodeProps> = ({
  category,
  position,
  isHovered,
  onHover,
  onClick,
  prefersReducedMotion,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const colorConfig = CATEGORY_COLORS[category.slug] || { primary: '#4f46e5', glow: '#818cf8' };

  useFrame((_, delta) => {
    if (meshRef.current && !prefersReducedMotion) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Node mesh */}
      <mesh
        ref={meshRef}
        scale={isHovered ? 1.25 : 1}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(category.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = 'default';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(category.slug);
        }}
      >
        <dodecahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={isHovered ? colorConfig.glow : colorConfig.primary}
          emissive={colorConfig.primary}
          emissiveIntensity={isHovered ? 0.7 : 0.2}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Outer subtle glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.76, 24]} />
        <meshBasicMaterial
          color={colorConfig.glow}
          transparent
          opacity={isHovered ? 0.8 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* HTML Annotation Label */}
      <Html position={[0, -0.9, 0]} center distanceFactor={10}>
        <button
          type="button"
          onClick={() => onClick(category.slug)}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm backdrop-blur-md transition-all duration-200 border cursor-pointer ${
            isHovered
              ? 'bg-neutral-900 text-white border-primary-400 scale-110 shadow-lg'
              : 'bg-white/90 text-neutral-800 border-neutral-200/90 hover:bg-neutral-50'
          }`}
          aria-label={`View ${category.name} services`}
        >
          {category.name}
        </button>
      </Html>
    </group>
  );
};

const ConnectionLines: React.FC<{
  positions: Array<[number, number, number]>;
  hoveredIndex: number | null;
}> = ({ positions, hoveredIndex }) => {
  const lineGeometries = useMemo(() => {
    return positions.map((pos) => {
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...pos)];
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, [positions]);

  return (
    <group>
      {lineGeometries.map((geo, idx) => {
        const isSelected = hoveredIndex === idx;
        return (
          <primitive
            key={idx}
            object={
              new THREE.Line(
                geo,
                new THREE.LineBasicMaterial({
                  color: isSelected ? 0x6366f1 : 0x94a3b8,
                  transparent: true,
                  opacity: isSelected ? 0.9 : 0.35,
                  linewidth: isSelected ? 2 : 1,
                })
              )
            }
          />
        );
      })}
    </group>
  );
};

const CentralPlatformNode: React.FC<{ prefersReducedMotion: boolean }> = ({ prefersReducedMotion }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!prefersReducedMotion) {
      if (coreRef.current) {
        coreRef.current.rotation.y += delta * 0.25;
      }
      if (ringRef.current) {
        ringRef.current.rotation.z -= delta * 0.35;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Platform Sphere */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial
          color="#1e40af"
          emissive="#2563eb"
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* Orbiting Platform Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.45, 0.04, 16, 48]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#60a5fa"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Central Platform Brand Badge */}
      <Html position={[0, 0, 0]} center distanceFactor={9}>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-900/90 text-white border border-primary-400/80 shadow-md text-xs font-bold pointer-events-none select-none">
          <Sparkles size={12} className="text-amber-300" />
          <span>SevaSetu</span>
        </div>
      </Html>
    </group>
  );
};

/**
 * Hero Service Ecosystem Scene Component
 * Renders the central SevaSetu platform with interactive category nodes.
 */
export const HeroServiceEcosystemScene: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useSceneVisibility(containerRef);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const theme = useThemeColors();

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const radius = isMobile ? 3.0 : 4.0;
  const categories = CORE_SERVICE_CATEGORIES;

  // Calculate circular orbital positions
  const nodePositions = useMemo<Array<[number, number, number]>>(() => {
    return categories.map((_, i) => {
      const angle = (i * 2 * Math.PI) / categories.length;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.65; // subtle tilt for dynamic oval perspective
      const z = Math.sin(angle * 2) * 0.4;
      return [x, y, z];
    });
  }, [categories, radius]);

  const hoveredIndex = useMemo(() => {
    if (!hoveredId) return null;
    return categories.findIndex((c) => c.id === hoveredId);
  }, [hoveredId, categories]);

  const handleCategoryClick = (slug: string) => {
    navigate(`/services?category=${encodeURIComponent(slug)}`);
  };

  const accessibleItems = useMemo(() => {
    return categories.map((cat) => ({
      id: cat.id,
      label: cat.name,
      badge: 'Explore Category',
      onClick: () => handleCategoryClick(cat.slug),
      isActive: hoveredId === cat.id,
    }));
  }, [categories, hoveredId]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-primary-950/5 via-slate-900/5 to-primary-900/10 border border-neutral-200/80 dark:border-neutral-800 shadow-sm"
      style={{ height: isMobile ? '320px' : '440px' }}
      aria-label="Interactive 3D SevaSetu Service Ecosystem"
    >
      {/* 3D Visual Canvas */}
      <WebGlErrorBoundary fallbackTitle="Service Ecosystem Explorer">
        <Suspense fallback={<SceneLoadingFallback heightClassName="h-full" label="Loading 3D Ecosystem..." />}>
          {isVisible ? (
            <Canvas
              camera={{ position: [0, 0, isMobile ? 8.5 : 9.5], fov: isMobile ? 55 : 45 }}
              dpr={[1, isMobile ? 1.5 : Math.min(window.devicePixelRatio, 2)]}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            >
              <ambientLight intensity={theme.isDark ? 0.8 : 1.2} />
              <directionalLight position={[10, 10, 10]} intensity={1.4} />
              <directionalLight position={[-10, -5, -5]} intensity={0.5} color="#3b82f6" />
              <pointLight position={[0, 0, 3]} intensity={1.0} color="#60a5fa" />

              <Float
                speed={prefersReducedMotion ? 0 : 1.5}
                rotationIntensity={prefersReducedMotion ? 0 : 0.2}
                floatIntensity={prefersReducedMotion ? 0 : 0.3}
              >
                {/* Central Platform Hub */}
                <CentralPlatformNode prefersReducedMotion={prefersReducedMotion} />

                {/* Connecting Web Lines */}
                <ConnectionLines positions={nodePositions} hoveredIndex={hoveredIndex} />

                {/* Interactive Orbital Category Nodes */}
                {categories.map((cat, idx) => (
                  <CategoryNode
                    key={cat.id}
                    category={cat}
                    position={nodePositions[idx] || [0, 0, 0]}
                    isHovered={hoveredId === cat.id}
                    onHover={setHoveredId}
                    onClick={handleCategoryClick}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </Float>

              <ControlledCamera
                enableZoom={false}
                autoRotate={!prefersReducedMotion}
                autoRotateSpeed={0.5}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 2}
              />
            </Canvas>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
              <span>Scene paused off-screen</span>
            </div>
          )}
        </Suspense>
      </WebGlErrorBoundary>

      {/* Screen reader and keyboard accessible navigation alternative */}
      <Accessible3dAlternative
        title="Browse Service Categories"
        description="Select any verified category node to discover local trade specialists."
        items={accessibleItems}
        srOnly
      />

      {/* Subtle overlay helper badge */}
      <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/60 text-neutral-500 text-[11px] pointer-events-none shadow-2xs">
        <Layers size={13} className="text-primary-600" />
        <span>Interactive 3D Ecosystem • Tap any category node to explore</span>
      </div>
    </div>
  );
};
