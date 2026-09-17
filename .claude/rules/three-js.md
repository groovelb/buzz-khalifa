---
paths:
  - "src/components/three/**/*.ts"
  - "src/components/three/**/*.tsx"
---

# Three.js와 React Three Fiber 규칙

## 구조

- Canvas 경계는 `ConstructionExperience`, 장면 조립은 `ConstructionScene`, 타워 조립은 `Building`이 맡는다.
- 공정별 형상은 `three/stages/`, 하늘과 조명은 `three/environment/`에 둔다.
- R3F 훅은 Canvas 하위에서만 호출한다. DOM 레이아웃과 Canvas 코드를 서로 import하지 않는다.

## geometry와 material

- 반복되거나 비용이 큰 geometry와 material은 `useMemo` 또는 공유 데이터로 재사용한다.
- 대량 반복 요소는 인스턴싱을 검토한다. 정적 소수 요소의 JSX geometry는 명확성을 위해 허용한다.
- 동적으로 만든 geometry, material, texture는 소유자가 명확히 dispose한다.
- 표면 값과 색은 `burjKhalifaData`를 우선하며, 임의의 파스텔 대체값을 추가하지 않는다.

## 프레임과 카메라

- `useFrame`은 ref를 직접 갱신하고 React state를 갱신하지 않는다.
- 정사영 카메라의 각도는 안정적으로 유지하며, 줌과 장면 이동은 `scrollConfig`의 timing을 따른다.
- ScrollControls와 `useScroll`은 한 진행도를 공유한다. 공정별 별도 스크롤 컨트롤러를 만들지 않는다.

## 금지

- Canvas 밖에서 Three 훅 호출
- frame loop 내부의 `setState`
- 스크롤 수치와 공정 경계의 중복 하드코딩
- dispose 없는 동적 GPU 리소스
