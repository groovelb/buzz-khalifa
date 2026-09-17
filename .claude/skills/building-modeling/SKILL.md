---
name: building-modeling
description: Create stable, performant 3D building components for the Burj Khalifa visualization. Use when adding new construction phases, modifying building geometry, or fixing 3D rendering issues. Preserves the project editorial blue-grey direction with React Three Fiber best practices.
---

This skill guides creation of stable, high-performance 3D building components for The Vertical Breath project. Existing geometry and animation remain unchanged during structural refactors. Current visual direction is defined by `docs/buzz-khalifa/03-visual-direction.md` and `.claude/rules/design-system.md`.

## Core Principles

### Project Visual Direction
- Preserve the existing rounded geometry and 24-tier model.
- Use `src/data/burjKhalifaData.ts` colors and dimensions.
- Keep the editorial blue-grey materials and scroll-driven day/night lighting.
- Do not replace the current scene with the legacy pastel toy palette.

### Performance Requirements (Critical)
Every component MUST follow these patterns to prevent memory leaks and maintain 60fps:

```typescript
// 1. Materials - ALWAYS useMemo
const material = useMemo(() => new THREE.MeshStandardMaterial({
  color: '#f5f5f0',
  roughness: 0.85,
  metalness: 0.02,
}), []);

// 2. Geometry - ALWAYS useMemo when shared
const geometry = useMemo(() => new THREE.BoxGeometry(1, 2, 1), []);

// 3. Multiple meshes - share material/geometry
{positions.map((pos, i) => (
  <mesh key={i} geometry={geometry} material={material} position={pos} />
))}

// 4. Animation - skip when not visible
useFrame(() => {
  if (!groupRef.current?.visible) return;
  // expensive calculations only when visible
});
```

## Component Structure

Every stage component follows this pattern:

```typescript
const StageName: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  // Phase boundaries (7 pages total)
  const PHASE_START = 0.286;  // Adjust per phase
  const PHASE_END = 0.429;

  const material = useMemo(() => /* ... */, []);

  useFrame(() => {
    const offset = scroll.offset;
    const isVisible = offset > PHASE_START - 0.02;
    const localProgress = Math.max(0, Math.min(1,
      (offset - PHASE_START) / (PHASE_END - PHASE_START)
    ));

    if (groupRef.current) groupRef.current.visible = isVisible;
    if (!isVisible) return;

    // Animation logic here
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* 3D content with RoundedBox */}
    </group>
  );
};
```

## Y-Shape Pattern (Burj Khalifa)

The building uses a Y-shaped footprint with 3 wings at 120° intervals:

```typescript
const WING_ANGLES = [0, 120, 240];

{WING_ANGLES.map((angle, i) => (
  <group key={i} rotation={[0, THREE.MathUtils.degToRad(angle), 0]}>
    <RoundedBox
      args={[width, height, depth]}
      radius={0.05}
      position={[0, y, radius / 2]}
      material={material}
    />
  </group>
))}
```

## Setback (Tapering) Structure

For the spiraling setback effect:

```typescript
const tierData = [
  { height: 1.5, radius: 1.8, rotation: 0 },
  { height: 1.4, radius: 1.6, rotation: 40 },
  { height: 1.3, radius: 1.4, rotation: 80 },
  // ... progressively smaller and rotated
];
```

## Material Recipes

| Type | Color | Roughness | Metalness |
|------|-------|-----------|-----------|
| Concrete | #f5f5f0 | 0.85 | 0.02 |
| Glass | #87ceeb | 0.05 | 0.1 |
| Steel | #d8dce0 | 0.25 | 0.85 |
| LED (emissive) | #00bfff | - | - |

## Z-Fighting Prevention

When surfaces overlap:
```typescript
// Use polygonOffset
material.polygonOffset = true;
material.polygonOffsetFactor = 1;  // or -1 for front layer
material.polygonOffsetUnits = 1;

// Or position offset
const GLASS_OFFSET = 0.08;
position={[x, y, z + GLASS_OFFSET]}
```

## Checklist for New Components

- [ ] Materials defined with `useMemo`
- [ ] Geometry shared when possible
- [ ] `RoundedBox` used (not `Box`)
- [ ] Pastel colors from palette
- [ ] Early return when `!isVisible`
- [ ] Phase boundaries calculated correctly
- [ ] No memory leaks (dispose if needed)

For detailed examples, see the existing components: `Foundation.tsx`, `Core.tsx`, `Setbacks.tsx`, `Cladding.tsx`, `Illumination.tsx`, `Spire.tsx`.
