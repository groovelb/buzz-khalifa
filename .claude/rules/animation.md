# 애니메이션과 스크롤 규칙

## 단일 기준

스크롤 범위, 페이지 높이, 카메라 이동, 낮과 밤의 경계는 `src/data/scrollConfig.ts`에서만 정한다. 각 컴포넌트에 구간 수치나 여섯 공정의 경계를 다시 적지 않는다.

```tsx
const scroll = useScroll();
const progress = scroll.offset;
const phase = PHASES.CORE;
const local = Math.max(0, Math.min(1, (progress - phase.start) / (phase.end - phase.start)));
```

`SCROLL_CONFIG.pages`는 7이고, `SECTION_HEIGHTS`는 여섯 공정의 문서 높이를 정한다. Stage V Illumination은 두 페이지 높이다.

## 공정 순서

1. Foundation
2. The Core
3. Setbacks
4. Cladding
5. Illumination
6. The Spire

이전 공정의 구조는 다음 공정에서 유지한다. 공정 경계는 급격히 끊지 말고 현재 구간의 local progress로 누적 표현한다.

## 구현 규칙

- R3F 프레임 변화는 `useFrame`과 ref 직접 조작으로 처리한다.
- 매 프레임 `setState`, 타이머 루프, 구간별 독립 스크롤 상태를 만들지 않는다.
- 반복 요소의 지연값, 티어 수, 전환 시간은 데이터나 설정에서 계산한다.
- DOM의 TextReveal, ImageReveal과 3D 장면은 같은 진행도만 읽는다. 서로의 상태를 제어하지 않는다.
- reduced-motion 처리가 필요하면 진행도를 보존하고 연출만 줄인다.
