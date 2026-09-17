# Buzz Khalifa: Theme Sources

## 사용자 화면

- `src/styles/global.css`: CSS 변수와 에디토리얼 서체, 색상 유틸리티.
- `src/hooks/useTheme.ts`: 낮/밤에 따른 DOM 테마 전환.
- `src/data/burjKhalifaData.ts`: 모델 재질 색상과 치수.
- `src/hooks/useDayNight.ts`: 낮/밤 계산과 하늘 색상.
- `tailwind.config.js`: 기존 spacing, breakpoints를 유지한 로컬 CSS 빌드.

## Storybook 문서

- `src/components/storybookDocumentation/documentTheme.js`: 스타터키트의 중립 MUI 테마.
- `EditorialDocument`는 문서 테마를 내부 적용한다. 제품 화면에 문서 테마를 적용하지 않는다.
- 새 임의 색상 대신 위 원천을 사용한다. 기존 화면을 MUI sx로 일괄 변환하지 않는다.
