# 건축 공정 스테이지 규칙

## 공정과 책임

| # | 공정 | 모듈 | 누적되는 구조 |
|---|---|---|---|
| I | Foundation | `stages/Foundation` | 매트와 파일 |
| II | The Core | `stages/Core` | 중심 코어 |
| III | Setbacks | `stages/Setbacks` | Y자 날개와 후퇴 |
| IV | Cladding | `stages/Cladding` | 유리와 멀리언 |
| V | Illumination | `stages/Illumination` | 조명과 야간 전환 |
| VI | The Spire | `stages/Spire` | 첨탑과 항공장애등 |

범위와 높이 비율은 `src/data/scrollConfig.ts`, `src/data/burjKhalifaData.ts`에서 읽는다. 스테이지 컴포넌트가 공정 경계나 색상 상수를 소유하지 않는다.

## 모델링 원칙

- 공정은 앞 단계의 구조를 지우지 않고 위에 쌓는다.
- 세트백은 Y자 평면과 세 날개의 다른 종료 높이에서 나온다. 단순화해도 수직 리듬을 보존한다.
- 클레딩은 티어와 같은 순서로 자라며, 유리·멀리언의 역할을 분리한다.
- Illumination은 독립 공정이다. 낮과 밤의 상태는 진행도에서 파생하며, 장면과 문서 UI가 같은 경계를 읽는다.
- Spire는 최종 조망을 위한 시점 변화와 연결하지만, 자유 카메라 조작을 만들지 않는다.

## 스테이지 인터페이스

공정 모듈은 전체 진행도와 필요한 local progress를 입력으로 받고, 데이터 모듈에서 기하와 재질 기준을 읽는다. 재사용이 필요한 prop 타입은 `src/types/`에 둔다.
