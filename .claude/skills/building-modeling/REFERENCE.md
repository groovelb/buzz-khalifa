# Building Modeling Reference

## Scale Standards

```typescript
const SCALE = {
  BUILDING_TOTAL_HEIGHT: 20,
  FOUNDATION_HEIGHT: 2,
  FLOOR_HEIGHT: 0.3,
  CORE_RADIUS: 0.9,
  SPIRE_HEIGHT: 8,
  CROWN_HEIGHT: 4,
};
```

## Phase Boundaries (7 Pages)

| Phase | Name | Start | End | Duration |
|-------|------|-------|-----|----------|
| 1 | Foundation | 0.000 | 0.143 | 1x |
| 2 | Core | 0.143 | 0.286 | 1x |
| 3 | Setbacks | 0.286 | 0.429 | 1x |
| 4 | Cladding | 0.429 | 0.571 | 1x |
| 5 | Illumination | 0.571 | 0.857 | 2x |
| 6 | Spire | 0.857 | 1.000 | 1x |

## Animation Patterns

### Staggered Reveal
```typescript
tiers.forEach((tier, index) => {
  const threshold = index / tiers.length;
  const tierProgress = Math.max(0, Math.min(1,
    (localProgress - threshold) * tiers.length * 2
  ));
  mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, tierProgress > 0 ? 1 : 0.001, 0.08));
});
```

### Descend from Sky
```typescript
const targetY = THREE.MathUtils.lerp(BASE_Y + 15, BASE_Y, Math.min(localProgress * 1.8, 1));
ref.current.position.y = targetY;
```

### Rise from Ground
```typescript
ref.current.scale.y = Math.max(0.001, localProgress * 10);
ref.current.position.y = 0.5; // pivot at base
```

## Night Mode

```typescript
// Night progress (starts at 60% scroll)
const nightProgress = Math.max(0, Math.min(1, (offset - 0.6) / 0.35));

// Apply to lights
pointLight.intensity = nightProgress * 2;

// Apply to emissive materials
ledMaterial.emissiveIntensity = nightProgress * 3;
```

## Color Palette

```typescript
export const COLORS = {
  // Structure
  concrete: '#f5f5f0',
  concreteDark: '#e8e8e5',

  // Glass
  glass: '#87ceeb',
  glassDark: '#8ec8ff',

  // Metal
  steel: '#d8dce0',
  steelPolished: '#e5e8eb',

  // Lighting
  ledBlue: '#00bfff',
  ledGold: '#ffd700',
  warmWhite: '#fff8dc',

  // Beacon
  beacon: '#ff4444',
} as const;
```

## Common Issues & Solutions

### Z-Fighting
Use `polygonOffset` or position offset (0.08 units typical).

### Performance Drops
- Check for materials/geometries created inside render
- Ensure `useMemo` for all THREE objects
- Add `!isVisible` early return in useFrame

### Memory Leaks
R3F auto-disposes on unmount, but for dynamic content:
```typescript
useEffect(() => {
  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);
```
