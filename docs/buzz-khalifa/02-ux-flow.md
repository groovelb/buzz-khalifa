# Buzz Khalifa: UX Flow

> 이 문서가 결정하는 것: 각 과업을 어떤 화면과 데이터로 이루는가
> 입력: 01 4절 사용자·대상, 01 5절 과업 · 출력 대상: 03-visual-direction, 구현 컴포넌트

## 결정 현황

| 섹션 | 상태 | 비고 |
|---|---|---|
| 1. UX-flow 시나리오 | 확정 | 기존 승인 유지 |
| 2.1 페이지 리스트 | 확정 | 단일 화면 유지 |
| 2.2 계층 트리 | 잠정 | 새 파일 경로 반영 |
| 3.1 대상 정의 | 확정 | 이름 계약 유지 |
| 3.2 이름 사전 | 확정 | 서버 데이터 없음 |
| 4. 인터랙션 원칙 | 잠정 | 코드 동작에서 추론 |
| 5. 컴포넌트 리스트 | 잠정 | 스타터 이관 중 |
| 6. 다음 문서로 넘기는 것 | 잠정 | Storybook 문서 추가 |

문서 상태: 잠정 승인 (하드 게이트 충족)
개정: 2026-09-17 v3 · 변경: `src/` 기반 모듈 경계와 데이터 이관을 반영

비고:

- 사용자는 리팩터링을 승인했으며 콘텐츠 승인까지 의미하지 않는다. 이번에 바뀐 파일 경로와 모듈 경계는 잠정이다.
- 단일 페이지, 여섯 공정, 일곱 페이지 높이의 경험과 정적 데이터 모델은 기존 승인 상태를 유지한다.
- 정확한 기존 파일에서 새 모듈로의 이동은 [Appendix Architecture Migration](appendix-architecture-migration.md)을 따른다.

---

## 1. UX-flow 시나리오 (01 5절 과업과 1:1)

R 읽기 · W 생성 · D 갱신/삭제.

### 1.1 여섯 공정의 순서를 끝까지 따라본다

- 사용자: 건축 애호가, 건축 학습자 (잠정) · 진입: 직접 방문 · 성공 조건: 마지막 공정에 도달 · 예외: 없음

| 단계 | 화면 | 사용자 행동 | 다루는 대상 | 결과 |
|---|---|---|---|---|
| 1 | Stage I Foundation | 첫 화면을 본다 | ConstructionStage R | 매트와 파일이 나타난다 |
| 2 | Stage II The Core | 스크롤한다 | StructureElement R | 중심 코어가 솟는다 |
| 3 | Stage III Setbacks | 계속 내린다 | Tier R | 날개가 후퇴한다 |
| 4 | Stage IV Cladding | 계속 내린다 | Tier R | 외피가 입혀진다 |
| 5 | Stage V Illumination | 긴 구간을 지난다 | TimeOfDay R | 하늘과 조명이 변한다 |
| 6 | Stage VI The Spire | 끝까지 내린다 | StructureElement R | 첨탑과 전체가 보인다 |

### 1.2 한 단계에 머물러 해설과 수치, 현장 사진을 확인한다

- 사용자: 건축 학습자, 건축 애호가 (잠정) · 진입: 어느 공정 구간 · 성공 조건: 한 자리에서 읽음 · 예외: 빠르게 지나가면 완성 상태

| 단계 | 화면 | 사용자 행동 | 다루는 대상 | 결과 |
|---|---|---|---|---|
| 1 | 공정 구간 | 멈춰 제목을 본다 | ConstructionStage R | 번호와 제목이 드러난다 |
| 2 | 공정 구간 | 해설과 노트를 읽는다 | ConstructionStage R | 구조 원리를 읽는다 |
| 3 | 공정 구간 | 수치를 본다 | ConstructionStage R | 대표 수치가 남는다 |
| 4 | 공정 구간 | 사진을 본다 | StagePhoto R | 현장 기록을 확인한다 |
| 5 | 고정 장면 | 모형과 사진을 견준다 | StructureElement R | 같은 공정으로 읽는다 |

### 1.3 완성된 타워가 밤으로 넘어가는 장면을 관람한다

- 사용자: 연출 관람자, 건축 애호가 (잠정) · 진입: Stage V Illumination · 성공 조건: 전환을 관람 · 예외: 새로고침 시 처음으로 돌아감

| 단계 | 화면 | 사용자 행동 | 다루는 대상 | 결과 |
|---|---|---|---|---|
| 1 | Stage V Illumination | 긴 구간에 들어선다 | TimeOfDay R | 하늘색이 바뀐다 |
| 2 | 고정 장면 | 지면 글자를 본다 | TimeOfDay R | 문서 배색이 전환된다 |
| 3 | Stage V Illumination | 건물을 본다 | StructureElement R | 창과 띠조명이 켜진다 |
| 4 | Stage VI The Spire | 끝까지 내린다 | StructureElement R | 첨탑 등이 보인다 |

---

## 2. 정보 구조

### 2.1 페이지 리스트

| 페이지 | 경로 | 한 줄 목적 | 다루는 대상 | 시나리오 |
|---|---|---|---|---|
| Stage I Foundation | `/` 0~14% | 기초 매트와 파일 | 단계, 구조 요소 | 1, 2 |
| Stage II The Core | `/` 14~29% | 중심 코어 상승 | 단계, 구조 요소 | 1, 2 |
| Stage III Setbacks | `/` 29~43% | 나선형 세트백 | 단계, 티어 | 1, 2 |
| Stage IV Cladding | `/` 43~57% | 커튼월 외피 | 단계, 티어 | 1, 2 |
| Stage V Illumination | `/` 57~86% | 야간 조명 | 단계, 티어, 시간대 | 1, 2, 3 |
| Stage VI The Spire | `/` 86~100% | 첨탑과 전체 조망 | 단계, 구조 요소 | 1, 2, 3 |
| 고정 레이어 | 경로 없음 | 제호, 크레딧, 장면 | 시간대, 공정 사진 | 2, 3 |

비고: 경로 값은 읽기 진행도 범위다. Stage V는 두 페이지 높이여서 전체가 일곱 페이지 높이다.

### 2.2 계층 트리

```
App
├── Header / Footer
└── ConstructionExperience (Canvas)
    ├── ConstructionScene
    │   ├── stages (6)
    │   └── environment
    └── Scroll HTML
        └── ConstructionOverlay
            └── ConstructionSection (6)
                ├── TextReveal
                └── ImageReveal
```

비고: 이 트리는 승인된 리팩터링 목표의 모듈 경계다. 최종 export 이름과 Storybook 경로는 구현 검증 전 잠정이다.

---

## 3. 데이터 모델 (01 4.2절 이름 그대로)

### 3.1 대상 정의

| 이름 | 식별자 | 주요 속성 | 영속성 |
|---|---|---|---|
| 공정 단계 | ConstructionStage | 제목, 해설, 노트, 수치 | 정적 |
| 구조 요소 | StructureElement | 공정, 형태, 재질 | 정적 |
| 티어 | Tier | 높이, 날개 길이와 폭 | 정적 |
| 시간대 | TimeOfDay | 하늘색, 발광 강도 | 휘발 |
| 공정 사진 | StagePhoto | 경로, 대체 텍스트 | 정적 |

| 이름 | 만드는 곳 | 보이는 페이지 | 관계 |
|---|---|---|---|
| 공정 단계 | `constructionStages` | 여섯 구간 | 사진 하나를 참조 |
| 구조 요소 | `burjKhalifaData` | 여섯 구간 | 티어와 시간대 참조 |
| 티어 | 기하 데이터 계산 | III, IV, V | 구조 요소에 속함 |
| 시간대 | 진행도에서 파생 | 전 구간, 고정 장면 | 색과 조명에 영향 |
| 공정 사진 | `src/assets/stages` | 여섯 구간 | 공정 단계에 종속 |

### 3.2 데이터 모델 활용 (이름 사전)

| 데이터명 | 한국어 | 코드 식별자 | 예상 테이블명 | 생성 책임 |
|---|---|---|---|---|
| `ConstructionStage` | 공정 단계 | `constructionStage` | (정적) | 없음 |
| `StructureElement` | 구조 요소 | `structureElement` | (정적) | 없음 |
| `Tier` | 티어 | `tier` | (정적) | 없음 |
| `TimeOfDay` | 시간대 | `timeOfDay` | (클라이언트) | 고정 장면 |
| `StagePhoto` | 공정 사진 | `stagePhoto` | (정적) | 없음 |

비고: 서버 데이터가 없으므로 테이블을 만들지 않는다. 데이터 이관 책임은 `constructionStages`, `burjKhalifaData`, `scrollConfig`에 나뉜다. (잠정)

---

## 4. 인터랙션 원칙

| 원칙 | 근거 | 드러나는 곳 | 유도 모듈 |
|---|---|---|---|
| 조작은 읽기 진행 하나다 | Verticality | 전 구간 | `scrollConfig` |
| 한 번에 한 공정만 자란다 | Legibility | 공정 경계 | stages |
| 시점보다 건물이 움직인다 | Verticality | 전 구간 | 3D scene |
| 시간은 진행도에서 파생된다 | Record | V, VI | environment |
| 글과 사진은 공정에 맞춰 드러난다 | Legibility | 본문 | reveal modules |

---

## 5. 컴포넌트 리스트

| 모듈 | 책임 | 구분 | 위치 |
|---|---|---|---|
| App | 얇은 조립 지점 | 수정 | `src/App.tsx` |
| Header, Footer | 간행 정보와 크레딧 | 신규 | `components/layout` |
| ConstructionExperience | Canvas 경계 | 신규 | `components/three` |
| ConstructionScene | 스크롤 반응 장면 | 수정 | `components/three` |
| BuildingModel | 진행도로 서는 순수 모델 | 신규 | `components/three` |
| 6 stage modules | 공정별 형상 | 수정 | `components/three/stages` |
| DayNightCycle | 하늘과 조명 | 수정 | `components/three/environment` |
| ConstructionOverlay | 스크롤 본문 | 수정 | `components/scroll` |
| ConstructionSection | 구간 한 벌 | 신규 | `components/scroll` |
| TextReveal | 텍스트 등장 | 수정 | `kinetic-typography` |
| ImageReveal | 사진 등장 | 수정 | `media` |
| 3 data modules | 콘텐츠, 기하, 진행 | 수정 | `src/data` |

비고: 스크롤을 읽는 곳은 ConstructionScene 하나다. BuildingModel 은 진행도만 받아 형상을 그린다(옛 Building 모듈을 둘로 나눴다). Storybook 문서용 래퍼는 원본 Markdown을 raw import하며 본문을 복제하지 않는다.

---

## 6. 다음 문서로 넘기는 것

| 받는 곳 | 가져가는 것 |
|---|---|
| 03-visual-direction | 구간 목록, 콘텐츠 신호, 인터랙션 원칙 |
| 구현 모듈 | 3절 데이터 책임, 4절 원칙, 5절 모듈 경계 |
| Storybook Docs | 원본 계획 Markdown의 raw import |
