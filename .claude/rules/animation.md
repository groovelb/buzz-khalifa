# 애니메이션 & 스크롤 규칙

## 스크롤 기반 애니메이션

### ScrollControls 설정
```tsx
<ScrollControls pages={5} damping={0.1}>
  <BuildingScene />
</ScrollControls>
```

### 스크롤 매핑 (5단계 공정)
```typescript
export const STAGES = {
  FOUNDATION: { start: 0.0, end: 0.2 },   // 0% ~ 20%
  CORE:       { start: 0.2, end: 0.4 },   // 20% ~ 40%
  SETBACKS:   { start: 0.4, end: 0.6 },   // 40% ~ 60%
  CLADDING:   { start: 0.6, end: 0.8 },   // 60% ~ 80%
  SPIRE:      { start: 0.8, end: 1.0 },   // 80% ~ 100%
} as const;
```

### useScroll 활용 패턴
```tsx
const { scroll } = useScroll();

useFrame(() => {
  const progress = scroll.current;  // 0 ~ 1

  // 스테이지별 로컬 진행도 계산
  const stageProgress = getStageProgress(progress, STAGES.CORE);
});

// 유틸리티 함수
function getStageProgress(
  globalProgress: number,
  stage: { start: number; end: number }
): number {
  if (globalProgress < stage.start) return 0;
  if (globalProgress > stage.end) return 1;
  return (globalProgress - stage.start) / (stage.end - stage.start);
}
```

## @react-spring/three 애니메이션

### 물리 기반 보간
```tsx
import { useSpring, animated } from '@react-spring/three';

// 스프링 애니메이션
const { scale, position } = useSpring({
  scale: isVisible ? 1 : 0,
  position: [0, height, 0],
  config: { mass: 1, tension: 170, friction: 26 }
});

<animated.mesh scale={scale} position={position}>
  ...
</animated.mesh>
```

### 권장 스프링 config
```typescript
export const SPRING_CONFIGS = {
  // 부드러운 등장
  gentle: { mass: 1, tension: 120, friction: 14 },
  // 표준 움직임
  default: { mass: 1, tension: 170, friction: 26 },
  // 빠른 반응
  snappy: { mass: 1, tension: 300, friction: 30 },
  // 바운시한 효과
  bouncy: { mass: 1, tension: 180, friction: 12 },
} as const;
```

## 애니메이션 패턴

### 건물 상승 효과
```tsx
// Y축 스케일로 솟아오르는 효과
const scaleY = lerp(0, 1, stageProgress);
meshRef.current.scale.y = scaleY;
meshRef.current.position.y = scaleY * height / 2;  // 피벗 보정
```

### 순차적 등장
```tsx
// 여러 요소가 순차적으로 나타나는 효과
const getDelayedProgress = (index: number, total: number) => {
  const delay = index / total * 0.3;  // 30% 딜레이 분산
  return Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
};
```

### 페이드 인/아웃
```tsx
// opacity 대신 scale 사용 (Three.js 성능 최적화)
const visibility = stageProgress > 0.5 ? 1 : 0;
meshRef.current.scale.setScalar(visibility);
```

## 금지 패턴
- `setInterval`/`setTimeout`으로 애니메이션 제어
- CSS 애니메이션과 Three.js 애니메이션 혼용
- useFrame 외부에서 매 프레임 업데이트
- 과도한 이징 함수 중첩

## 성능 가이드라인
- 동시에 애니메이션되는 오브젝트 수 최소화
- 복잡한 계산은 useFrame 외부에서 미리 계산
- `lerp`, `clamp` 등 단순 수학 함수 활용
- 가능하면 GPU 기반 애니메이션 (셰이더) 고려
