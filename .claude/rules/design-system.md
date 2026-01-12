# 디자인 시스템 (Bruno Simon Style)

## 컬러 팔레트

### 필수 색상 코드
```typescript
export const COLORS = {
  // 지면 & 배경
  ground: '#e5e5e5',        // 연한 샌드/그레이
  background: '#f5f5f5',    // 밝은 배경

  // 구조물
  structure: '#ffffff',     // 웜 화이트 (콘크리트/코어)
  structureAlt: '#f0f0f0',  // 약간 어두운 구조물

  // 유리 & 외벽
  glass: '#a2d2ff',         // 파스텔 블루
  glassDark: '#8ec8ff',     // 진한 유리

  // 악센트
  accent: '#ffc8a2',        // 웜 파스텔 오렌지
  highlight: '#c2f0c2',     // 파스텔 그린
} as const;
```

## Geometry 규칙

### RoundedBox 필수
- 모든 박스형 오브젝트: `RoundedBox` 사용
- 최소 radius: `0.05` (작은 오브젝트) ~ `0.2` (큰 오브젝트)
- segments: `4` 이상 권장

```tsx
// 표준 RoundedBox 사용법
<RoundedBox args={[width, height, depth]} radius={0.1} smoothness={4}>
  <meshStandardMaterial color={COLORS.structure} />
</RoundedBox>
```

### 원통/파이프 처리
- `CylinderGeometry`에 `radiusSegments: 32` 이상
- 날카로운 모서리 대신 부드러운 느낌 유지

## 라이팅 설정

### 필수 조명 구성
```tsx
// Environment + ContactShadows 조합
<Environment preset="city" />
<ContactShadows
  position={[0, -0.01, 0]}
  opacity={0.4}
  scale={20}
  blur={2}
  far={4}
/>
```

### 조명 금지 사항
- 날카로운 DirectionalLight 단독 사용 금지
- 과도한 명암 대비 피하기
- 부드럽고 균일한 조명 유지

## 시각적 원칙

### DO (권장)
- 미니멀한 형태, 불필요한 디테일 제거
- 부드러운 그림자로 깊이감 표현
- 일관된 파스텔 톤 유지
- '장난감 같은' 친근한 느낌

### DON'T (금지)
- 포토리얼리스틱 텍스처
- 날카로운 모서리/하드 엣지
- 과도한 반사/광택
- 복잡한 디테일 추가
- 어두운/채도 높은 색상

## 스케일 기준
- 빌딩 전체 높이: 약 `20` 유닛
- 기초(Foundation): 높이 `2` 유닛
- 각 층(Floor): 높이 `0.3~0.5` 유닛
- 첨탑(Spire): 높이 `3` 유닛
