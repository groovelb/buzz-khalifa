---
paths:
  - "src/components/three/**/*.tsx"
  - "src/components/three/**/*.ts"
  - "**/*Three*.tsx"
  - "**/*Canvas*.tsx"
---

# Three.js & React Three Fiber 규칙

## 필수 패턴

### 컴포넌트 구조
- 모든 3D 컴포넌트는 `src/components/three/` 디렉토리에 배치
- R3F 컴포넌트는 반드시 `<Canvas>` 내부에서만 렌더링
- DOM 컴포넌트와 R3F 컴포넌트 명확히 분리

### Geometry & Material
```tsx
// GOOD: 재사용 가능한 geometry와 material
const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 4, 0.1), []);
const material = useMemo(() => new MeshStandardMaterial({ color: '#ffffff' }), []);

// BAD: 인라인 생성 (매 렌더마다 새로 생성됨)
<mesh>
  <boxGeometry args={[1, 1, 1]} />  // 피하기
</mesh>
```

### 메모리 관리
- `useEffect` cleanup에서 geometry.dispose(), material.dispose() 호출
- 대량의 인스턴스는 `InstancedMesh` 사용
- 텍스처 로딩 시 `useTexture`와 `Suspense` 조합

### useFrame 최적화
```tsx
// GOOD: ref 직접 조작
useFrame(() => {
  meshRef.current.rotation.y += 0.01;
});

// BAD: 상태 업데이트 (불필요한 리렌더링 유발)
useFrame(() => {
  setRotation(prev => prev + 0.01);  // 절대 금지
});
```

## drei 유틸리티 활용
- `RoundedBox` - 모든 박스형 오브젝트에 필수
- `ScrollControls` & `useScroll` - 스크롤 기반 애니메이션
- `Environment` - 환경 조명 (preset: "city")
- `ContactShadows` - 부드러운 바닥 그림자
- `OrthographicCamera` - 아이소메트릭 뷰 구현

## 카메라 설정
```tsx
// Orthographic Camera로 원근감 없는 뷰 구현
<OrthographicCamera
  makeDefault
  zoom={50}
  position={[10, 10, 10]}
/>
```

## 금지 사항
- `<Canvas>` 외부에서 Three.js 훅 사용
- useFrame 내부에서 React 상태 업데이트
- geometry/material 인라인 생성 (성능 저하)
- dispose 없이 동적 생성된 리소스 방치
