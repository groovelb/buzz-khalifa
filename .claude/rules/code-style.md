---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# TypeScript와 React 코드 스타일

## 타입과 import

- props와 공개 함수의 입출력 타입을 명시한다.
- `any`를 쓰지 않고 불확실한 값은 `unknown`으로 좁힌다.
- 데이터 상수는 `as const`와 `satisfies`를 우선한다.
- `@/`는 `src/`를 가리킨다. 타입 import는 `import type`로 분리한다.
- import 순서는 외부 패키지, `@/` 모듈, 상대 모듈, 타입 순서다.

```ts
import { useMemo } from 'react';
import { PHASES } from '@/data/scrollConfig';
import type { StageRange } from '@/types';
```

## 모듈 경계

- `App.tsx`는 layout과 experience를 조립한다. overlay는 experience의 Scroll HTML 안에 둔다.
- Canvas 코드는 `components/three/`, DOM 본문은 `components/scroll/`에 둔다.
- 새 공정 형상은 `components/three/stages/`, 환경 요소는 `three/environment/`에 둔다.
- 콘텐츠는 `constructionStages`, 기하는 `burjKhalifaData`, 시간과 구간은 `scrollConfig`에 둔다.
- 재사용 공개 모듈만 각 디렉터리의 `index.ts`에서 export한다.

## React 패턴

- 함수 컴포넌트와 named export를 사용한다.
- 복잡한 파생값은 render 전에 계산하거나 `useMemo`로 안정화한다.
- 3D frame loop에서 ref를 조작하고 React 상태 갱신을 피한다.
- Tailwind class와 전역 CSS를 DOM에 사용한다. R3F의 재질·변환 props는 Canvas 표현에 필요한 예외다.
- 중첩 삼항, 의미 없는 매직 넘버, 사용하지 않는 export를 남기지 않는다.
