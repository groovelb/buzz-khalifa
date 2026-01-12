---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# TypeScript & React 코드 스타일

## TypeScript 규칙

### 타입 정의
- 모든 props는 명시적 타입 정의 필수
- `any` 사용 금지, 불가피할 경우 `unknown` 사용
- 상수 객체는 `as const` assertion 활용

```typescript
// 컴포넌트 Props 정의
interface BuildingStageProps {
  progress: number;
  stageIndex: number;
  children?: React.ReactNode;
}

// 상수 정의
export const COLORS = {
  ground: '#e5e5e5',
  structure: '#ffffff',
} as const;

type ColorKey = keyof typeof COLORS;
```

### Import 순서
```typescript
// 1. React/라이브러리
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

// 2. 프로젝트 컴포넌트
import { Building } from '@/components/three/Building';

// 3. 훅/유틸리티
import { useStageProgress } from '@/hooks/useStageProgress';

// 4. 상수/타입
import { COLORS, STAGES } from '@/constants';
import type { StageConfig } from '@/types';
```

### 경로 별칭
- `@/` = `src/` 디렉토리
- 상대 경로 `../../../` 대신 절대 경로 사용

## React 패턴

### 함수형 컴포넌트
```typescript
// 화살표 함수 + 명시적 반환 타입
export const BuildingCore: React.FC<BuildingCoreProps> = ({ height, progress }) => {
  // ...
  return (
    <group>
      {/* ... */}
    </group>
  );
};
```

### 커스텀 훅
- `use` 접두사 필수
- 단일 책임 원칙 준수
- 재사용 가능한 로직 추출

```typescript
// hooks/useStageProgress.ts
export const useStageProgress = (
  globalProgress: number,
  stage: StageConfig
): number => {
  return useMemo(() => {
    if (globalProgress < stage.start) return 0;
    if (globalProgress > stage.end) return 1;
    return (globalProgress - stage.start) / (stage.end - stage.start);
  }, [globalProgress, stage]);
};
```

### 상태 관리
- 로컬 상태: `useState`, `useReducer`
- 3D 씬 상태: `useRef` + `useFrame` 직접 조작
- 전역 상태: 최소화 (필요시 Context API)

## 파일 명명 규칙

### 컴포넌트
- PascalCase: `BuildingCore.tsx`, `FoundationStage.tsx`
- 한 파일에 한 컴포넌트 원칙

### 훅
- camelCase + use 접두사: `useStageProgress.ts`

### 상수/유틸
- camelCase: `colors.ts`, `stageHelpers.ts`

### 타입
- 별도 파일: `types/index.ts` 또는 `types/stages.ts`

## 폴더 구조
```
src/
├── components/
│   ├── three/           # R3F 3D 컴포넌트
│   │   ├── Building.tsx
│   │   ├── stages/      # 각 스테이지별 컴포넌트
│   │   │   ├── Foundation.tsx
│   │   │   ├── Core.tsx
│   │   │   ├── Setbacks.tsx
│   │   │   ├── Cladding.tsx
│   │   │   └── Spire.tsx
│   │   └── environment/ # 환경 (조명, 그림자)
│   └── ui/              # DOM UI 컴포넌트
├── hooks/
├── constants/
├── types/
└── utils/
```

## 금지 패턴
- 클래스 컴포넌트 사용
- `export default` (named export 선호)
- 인라인 스타일 (Tailwind 또는 styled 사용)
- 중첩 삼항 연산자
- 매직 넘버 (상수로 추출)
