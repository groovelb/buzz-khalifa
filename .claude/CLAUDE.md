# The Vertical Breath 프로젝트 룰

## 프로젝트 개요

부르즈 할리파의 건설 과정을 다루는 단일 페이지 3D 에디토리얼이다. 스크롤은 Foundation, Core, Setbacks, Cladding, Illumination, Spire의 여섯 공정을 지나며 전체 경험은 일곱 페이지 높이다.

## 기술 기준

- Runtime: React 19, TypeScript strict, Vite
- 3D: Three.js, React Three Fiber, drei, postprocessing
- Styling: 로컬 Tailwind 빌드와 `src/styles/global.css`, 런타임 CDN 금지
- Docs: Storybook 10, addon-docs, `EditorialDocument`
- Package manager: pnpm

## 구조

```text
src/
├── App.tsx, main.tsx
├── assets/stages/
├── components/layout/
├── components/three/stages/, environment/
├── components/scroll/
├── components/kinetic-typography/, media/
├── data/
├── hooks/, types/, utils/
└── styles/global.css
```

`App.tsx`는 Header, Footer, ConstructionExperience만 조립한다. overlay는 Canvas의 Scroll HTML 안에 둔다. 공정 콘텐츠는 `constructionStages`, 타워 기하와 색은 `burjKhalifaData`, 스크롤·카메라·시간대 경계는 `scrollConfig`에 둔다. DOM과 Canvas 책임을 섞지 않는다.

## 작업 원칙

- 현재의 에디토리얼 청회색, 정사영, 낮에서 밤으로의 전환을 유지한다.
- 건물 형상은 공정이 누적되도록 만들고, 비싼 geometry·material과 반복 계산을 재사용한다.
- `useFrame`에서 React 상태를 갱신하지 않는다.
- 정적 문서는 `docs/buzz-khalifa/`만 원본으로 둔다. Storybook Docs에는 raw import와 `EditorialDocument`만 둔다.
- 도메인별 건물 모델링 지침은 `.claude/skills/building-modeling/`을 따른다.

## 명령

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm test
pnpm storybook
pnpm build-storybook
```

명령의 통과 여부는 실행 결과로만 판단한다.
