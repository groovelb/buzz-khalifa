# Buzz Khalifa: Starter Kit Integration

원본: `vibe-design-starterkit-v1.0`, 2026-09-17 (`d2754f9`, `5840904`).

이 저장소는 최신 기획 문서 계약, 컴포넌트 분류, Storybook 10과 EditorialDocument를 도입한 독립 인터랙티브 프로젝트다.
원본 스타터키트 전체 데모를 복제하지 않고 필요한 구조와 문서 도구를 이식했다.

- React 19 + TypeScript + Vite 6, R3F/Three.js를 유지한다.
- DOM 스타일은 로컬 빌드 Tailwind 3와 `src/styles/global.css`의 CSS 변수다.
- MUI 7은 Storybook 문서 렌더러에서 사용한다.
- 컴포넌트 목록은 같은 폴더의 `components.md`가 유일한 기준이다.
- JSX, MUI sx 강제 전환 대신 기존 TSX와 시각 스타일을 유지한다.
- 구조·스토리 경로·예외는 루트 `AGENTS.md`를 따른다.
- 문서는 `docs/buzz-khalifa/`에서 관리하고 Storybook에 원문을 복사하지 않는다.
