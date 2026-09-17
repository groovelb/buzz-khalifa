# Buzz Khalifa: Codex 진입점

## 작업 기준

- 최신 스타터키트 `vibe-design-starterkit-v1.0`의 2026-09-17 기획·컴포넌트 계약을 적용한다.
- 기획 문서 원본은 `docs/buzz-khalifa/`이고 Storybook MDX는 raw import 래퍼다.
- 컴포넌트 작업 전 `.agents/skills/vdl-component-work/SKILL.md`를 읽는다.
- 기획 요청 시 `.agents/skills/vdl-project-planning/SKILL.md`를 읽는다.
- 원본 스킬은 `.claude/skills/`에 보존한다. 컴포넌트 레지스트리는 `.claude/skills/component-work/resources/components.md`다.
- 코드·구조·스타일 작업 전 `.claude/rules/code-style.md`, `three-js.md`, `design-system.md`, `stages.md`를 읽는다.

## 이 프로젝트의 적용 범위

- TypeScript/TSX를 유지한다. JSX로 변환하지 않는다.
- 사용자 화면은 기존 Tailwind + CSS 변수와 R3F 기반이다. MUI는 Storybook 문서 렌더러에 사용한다.
- 스타터키트의 기능별 분류를 사용하며 3D 전용 컴포넌트는 `src/components/three/`에 둔다.
- 훅은 여러 3D 모듈이 공유하므로 `src/hooks/`, 데이터는 `src/data/`, 이미지 원본은 `src/assets/stages/`에 둔다.
- 스토리는 `src/stories/components/`와 `src/stories/page/`에 둔다. R3F는 Canvas 문맥을 제공한다.
- 기존 6단계, 7페이지, 낮/밤, 형상·재질·카메라 동작을 보존한다.
- 리팩토링은 문서 결정의 신규 승인이 아니다. 바뀐 결정은 잠정으로 기록한다.
- 문서·새 주석에 em dash를 쓰지 않는다.

## 검증

`pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm build-storybook`.
브라우저 없이 타입·데이터 계약·프로덕션 빌드를 확인한다.

## 브라우저 규칙

사용자가 브라우저·Playwright·스크린샷·캡처를 명시적으로 요청하기 전에는 어떤 브라우저 자동화도 실행하지 않는다.
