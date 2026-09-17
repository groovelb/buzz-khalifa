# The Vertical Breath

부르즈 할리파의 여섯 건설 공정을 스크롤로 따라가는 React 19, TypeScript, React Three Fiber 인터랙티브 에디토리얼입니다. 콘텐츠와 3D 기하 데이터는 정적이며, Tailwind 런타임 CDN 대신 로컬 Tailwind 빌드와 Vite로 스타일을 생성합니다.

## 시작하기

Node.js와 pnpm이 필요합니다.

```bash
pnpm install
pnpm dev
```

## 확인 명령

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm storybook
pnpm build-storybook
```

기획 문서와 컴포넌트 스토리는 `pnpm storybook`으로 확인합니다.

## 구조

`src/App.tsx`는 Header, Footer, ConstructionExperience를 조립합니다. Canvas와 Scroll HTML의 본문은 ConstructionExperience가 소유합니다. 공정 콘텐츠, 기하 데이터, 진행도 설정은 `src/data/`에 분리하고, 여섯 장의 공정 사진은 `src/assets/stages/`에 둡니다.

| 영역 | 위치 |
|---|---|
| 3D 장면과 공정 | `src/components/three/` |
| 문서형 스크롤 본문 | `src/components/scroll/` |
| 텍스트·이미지 등장 | `kinetic-typography/`, `media/` |
| 간행 정보 | `src/components/layout/` |
| 전역 스타일 | `src/styles/global.css` |
| 계획 문서 | `docs/buzz-khalifa/` |

## Storybook

Storybook 10은 컴포넌트와 계획 문서를 함께 다룹니다. 계획 문서 페이지는 `docs/buzz-khalifa/`의 Markdown을 `?raw`로 불러와 `EditorialDocument`로 렌더링합니다. Storybook에 문서 본문을 복사하지 않습니다.

리팩터링의 구조와 이관 계약은 [architecture migration appendix](docs/buzz-khalifa/appendix-architecture-migration.md)에 기록합니다.

Google Fonts와 drei의 기존 city 환경맵은 외부 네트워크를 사용합니다. 사진과 모델 데이터는 로컬 자산입니다.

## 배포

Vercel `groovelbs-projects/buzz-khalifa`에서 앱과 Storybook을 함께 제공한다.

- 앱: https://buzz-khalifa.vercel.app/
- Storybook: https://buzz-khalifa.vercel.app/storybook/
- 통합 빌드: `pnpm build:deploy`

`vercel.json`은 통합 빌드 결과인 `dist/`를 배포한다. 앱은 루트에, Storybook은 `dist/storybook/`에 복사한다. Storybook 자산 경로는 상대 경로이며 `/storybook`은 `/storybook/`으로 리다이렉트된다.

로그인된 Vercel CLI에서 `vercel --prod`로 배포한다. CLI 배포는 Git 커밋·푸시와 별개다.
