# Buzz Khalifa: Appendix Architecture Migration

> 이 문서가 결정하는 것: 승인된 스타터 기반 리팩터링의 모듈 경계와 기존 코드의 이관 책임
> 입력: 기존 런타임 구조, Vibe Design Starter Kit v1.0 · 출력 대상: 구현, Storybook Docs, 유지보수

## 결정 현황

| 섹션 | 상태 | 비고 |
|---|---|---|
| 1. 기준 스타터 | 확정 | d2754f9, 5840904 |
| 2. 런타임 목표 구조 | 잠정 | 구현 검증 전 |
| 3. 데이터 이관 | 잠정 | 경로 이관 중 |
| 4. 문서와 검증 | 잠정 | 스크립트 추가 중 |

문서 상태: 작성 중
개정: 2026-09-17 v1 · 변경: 승인된 리팩터링의 이관 계약 추가

비고:

- 사용자는 전체 문서와 컴포넌트 리팩터링을 승인했다. 이 문서는 그 구현 범위만 기록하며 콘텐츠 승인으로 해석하지 않는다.
- 기준 가져오기: Vibe Design Starter Kit v1.0의 `d2754f9`(기획 문서 포맷과 에디토리얼 렌더러), `5840904`(문서 동기화 범위).

---

## 1. 기준 스타터

| 기준 | 적용 책임 |
|---|---|
| React 19 + TypeScript | 런타임 진입과 타입 경계 |
| Storybook 10 addon-docs | 원본 계획 문서의 Docs 노출 |
| EditorialDocument | raw Markdown 렌더링 |
| 로컬 Tailwind 빌드 | DOM 스타일 생성 |
| `src/` 레이아웃 | 기능별 모듈 경계 |

---

## 2. 런타임 목표 구조

```text
src/
├── App.tsx
├── main.tsx
├── assets/stages/1.jpeg … 6.jpeg
├── components/
│   ├── layout/Header.tsx, Footer.tsx
│   ├── three/stages/, three/environment/
│   ├── three/ConstructionExperience.tsx
│   ├── scroll/ConstructionOverlay.tsx, ConstructionSection.tsx
│   ├── kinetic-typography/TextReveal.tsx
│   └── media/ImageReveal.tsx
├── data/constructionStages.ts, burjKhalifaData.ts, scrollConfig.ts
├── hooks/useDayNight.ts, useTheme.ts
├── styles/global.css
├── types/index.ts
└── utils/index.ts
```

비고: `App.tsx`는 Header, Footer, `ConstructionExperience`를 조립하는 얇은 경계다. Canvas와 Scroll HTML의 본문은 `ConstructionExperience` 안에 두고, 데이터 책임은 `src/data/`에 둔다. 기능별 폴더와 `components/index.ts`에 named export barrel을 둔다.

---

## 3. 데이터와 컴포넌트 이관

| 기존 책임 | 새 책임 | 이관 내용 |
|---|---|---|
| `Overlay` 인라인 데이터 | `constructionStages` | 제목, 해설, 노트, 사진 |
| `BurjKhalifaData` | `burjKhalifaData` | 색, 티어, 기하 생성 |
| `PHASES`와 높이 배열 | `scrollConfig` | 구간, 배색, 카메라 시간 |
| `Experience` | `ConstructionScene` | 조명·카메라 장면 |
| `Building` | `three/Building` | 타워 조립 |
| 공정 컴포넌트 | `three/stages` | Foundation부터 Spire |
| `DayNightCycle` | `three/environment` | 하늘과 조명 |
| `Overlay` | `scroll` | 본문과 섹션 |
| `TextReveal`, `ImageReveal` | 기능별 디렉터리 | 텍스트와 사진 등장 |
| 최상위 `stages/` | `src/assets/stages/` | 사진 6장 |

비고: 이 표는 구현된 이름과 책임의 이관을 기록한다. 콘텐츠 결정 상태와 코드 검증 결과는 별도로 관리한다.

---

## 4. 문서와 검증

| 항목 | 계약 |
|---|---|
| 계획 문서 | `docs/buzz-khalifa/`가 원본 |
| Storybook Docs | 원본 `.md`를 `?raw` import |
| 문서 렌더링 | `EditorialDocument` 사용, 본문 복제 금지 |
| 스타일 | Tailwind는 로컬 빌드, 런타임 CDN 금지 |
| 확인 명령 | 타입 검사, 앱 빌드, 스토리북 빌드, 테스트 (비고 참조) |

비고: 확인 명령은 `pnpm typecheck`, `pnpm build`, `pnpm build-storybook`, `pnpm test`다. 타입 검사와 회귀 테스트 7개를 통과했다. 기준 커밋 `75471c5`의 형상·공정 본문·낮과 밤 계산을 비교했고 사진 6장은 바이트 단위로 보존했다. 앱과 Storybook은 정적 빌드로 검증하며 브라우저 시각 검증은 수행하지 않았다.

- 정적 빌드는 Three.js와 문서 도구의 500 kB 초과 청크 경고를 남긴다.
- Google Fonts와 기존 city 환경맵은 외부 네트워크를 사용한다. Tailwind CSS는 로컬 빌드다.
