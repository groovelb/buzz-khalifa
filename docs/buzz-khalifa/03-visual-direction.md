# Buzz Khalifa: Visual Direction

> 이 문서가 결정하는 것: 정체성과 화면이 어떻게 보이는가
> 입력: 01 3절 정체성, 02 2.1절 페이지, 02 4절 원칙 · 출력 대상: 스타일, 구현 컴포넌트, Storybook Docs

## 결정 현황

| 섹션 | 상태 | 비고 |
|---|---|---|
| 1. 무드 | 잠정 | 콘텐츠 승인 전 |
| 2. 레이아웃 전략 | 잠정 | 이관 구조 반영 |
| 3.1 색 | 확정 | 기존 승인 유지 |
| 3.2 타이포 | 확정 | 기존 승인 유지 |
| 3.3 형태·표면·모션 | 확정 | 기존 승인 유지 |
| 4. 이미지·에셋 방향 | 잠정 | 에셋 경로 이관 |
| 4.1 레퍼런스 | 잠정 | 경로 갱신 필요 |
| 5. 변경 토큰 요약 | 잠정 | `global.css` 이관 |
| 6. 다음 문서로 넘기는 것 | 잠정 | Docs 추가 |

문서 상태: 잠정 승인 (하드 게이트 충족)
개정: 2026-09-17 v3 · 변경: 로컬 Tailwind 빌드와 `src/styles/global.css` 구조 반영

비고:

- 사용자가 승인한 것은 스타터 기반 구현과 리팩터링이다. 무드, 레퍼런스 해석, 자산 방향은 별도 콘텐츠 승인 전이라 잠정이다.
- 이전의 파스텔 장난감 전제는 현재 에디토리얼 청회색 방향과 맞지 않는다. 구조물 모델의 단순화와 성능 원칙은 유지한다.
- 색과 타이포 값은 새 경로로 옮겨도 값 자체가 바뀌지 않는 한 기존 확정 상태를 유지한다.

---

## 1. 무드

- 키워드: Architectural Editorial · Isometric · Blue Grey Neutral · Day-to-Night · Quiet Precision
- 태도 선언: 설명은 잡지 기사처럼 쓰고 화면은 도면처럼 둔다. 정사영으로 높이를 비교하게 한다. 색은 하늘의 변화에 따라 움직인다.
- 하지 않는 것: 파스텔 장난감 톤 · 카드 배경면 · 둥근 패널 · 다색 강조 · 원근 왜곡

---

## 2. 레이아웃 전략

구조:

| 페이지 | 공간 모델 | 아키타입 | 구분 언어 |
|---|---|---|---|
| Stage I Foundation | 유동 | scrollytelling (잠정) | 선 |
| Stage II The Core | 유동 | scrollytelling (잠정) | 선 |
| Stage III Setbacks | 유동 | scrollytelling (잠정) | 선 |
| Stage IV Cladding | 유동 | scrollytelling (잠정) | 선 |
| Stage V Illumination | 유동 | scrollytelling (잠정) | 선 |
| Stage VI The Spire | 유동 | scrollytelling (잠정) | 선 |
| 고정 레이어 | 고정 | z-axis-layering (잠정) | 여백 |

콘텐츠 신호:

| 페이지 | 밀도 | text / media / repeat / hierarchy |
|---|---|---|
| Stage I Foundation | airy | long / accent / single / two-tier |
| Stage II The Core | airy | long / accent / single / two-tier |
| Stage III Setbacks | airy | long / accent / single / two-tier |
| Stage IV Cladding | airy | long / accent / single / two-tier |
| Stage V Illumination | airy | long / accent / single / two-tier |
| Stage VI The Spire | airy | long / accent / single / two-tier |
| 고정 레이어 | compact | micro / dominant / single / flat |

비고: 각 구간은 한쪽의 좁은 본문 단과 반대쪽의 3D 타워가 짝을 이룬다. 홀짝 구간의 정렬만 바뀌며 Stage V만 두 페이지 높이다.

---

## 3. 토큰 방향

### 3.1 색 (역할 팔레트)

| 역할 | 이름 | 값 | 적용 경계 |
|---|---|---|---|
| 지면 바탕 | Warm White | `#f5f3f0` | 문서 배경 |
| 제목·강조 | Ink / Paper | `#1a1a1a` / `#f5f3f0` | 제호, 제목 |
| 본문 | Charcoal / Mist | `#2a2a2a` / `#d0d0d0` | 해설 |
| 보조 | Slate / Ash | `#3a3a3a` / `#b0b0b0` | 부제, 인용 |
| 야간 강조 | Gold | `#d4b878` | 라벨, 경계선 |
| 콘크리트 | Concrete | `#c8cdd2` | 코어, 티어 |
| 유리 | Deep Blue Grey | `#506872` | 커튼월 |
| 금속 | Silver / Steel | `#d0d5da` / `#d4d8dc` | 프레임, 첨탑 |
| 야간 발광 | Warm Window | 따뜻한 3색 | 창, 조명 |

비고: 하늘은 dawn부터 night까지 일곱 청색·주황색 단계를 진행도에 따라 섞는다. 낮의 강조는 색보다 선과 자간으로 만든다.

### 3.2 타이포

| 역할 | 서체 | 방향 |
|---|---|---|
| 제호·구간 제목 | Bebas Neue, Oswald 폴백 | 대문자, 넓은 자간 |
| 부제·간행 정보 | Oswald | 대문자, 압축된 폭 |
| 로마 숫자·인용 | Cormorant Garamond | 큰 크기, 가는 웨이트 |
| 본문·기술 노트 | Source Sans 3 | 읽기용 행간 |
| 수치 라벨 | Source Sans 3 | 작은 대문자, 넓은 자간 |

### 3.3 형태·표면·모션

| 축 | 방향 | 값 |
|---|---|---|
| 투영 | 원근 제거 | 정사영 카메라 |
| 시점 | 각도 고정, 배율 변화 | 완성 구간에서 전체 조망 |
| 3D 모서리 | 필요한 만큼만 완화 | 반경 0.015~0.05 |
| 콘크리트 | 거친 무광 | 높은 roughness |
| 금속 | 광택 프레임 | 높은 metalness |
| 유리 | 맑고 반투명 | 낮은 roughness |
| 배색 전환 | 느린 교차 | 낮에서 밤 |
| 글자·사진 | 공정 뒤에 등장 | 진행도 기반 reveal |

비고: 3D 모서리는 drei `RoundedBox`로 만든다. PRD가 지시한 `RoundedBoxGeometry`가 이 컴포넌트의 기하이고, 기초·코어·티어가 모두 같은 프리미티브를 쓴다.

---

## 4. 이미지·에셋 방향

| 에셋 유형 | 쓰이는 곳 | LOOK 키워드 |
|---|---|---|
| 공정 사진 | 여섯 공정 본문 | archival construction photo |
| 구조 레퍼런스 | 3D 모델 근거 | technical section drawing |

- 공정 사진
  - FORMAT: 원본 비율, 본문 단 폭, 해당 공정의 정렬을 따른다.
  - LOOK: archival construction photo
  - SUBJECT: 해당 공정이 진행 중인 실제 현장 한 장면
  - 하지 않는 것: 임의 크롭, 3D 렌더 합성, 완성 사진 대체
- 구조 레퍼런스
  - FORMAT: 화면에 노출하지 않고 치수와 비율의 근거로 쓴다.
  - LOOK: technical section drawing
  - SUBJECT: 티어 높이, 첨탑, 층별 평면 변화
  - 하지 않는 것: 출처 없는 도면 추가

### 4.1 레퍼런스 (사용자 제공만)

| ID | 자료 | 참고 포인트 | 잠금 |
|---|---|---|---|
| REF-01 | 제공 단면도 | 티어 비율 | 예 |
| REF-02 | 제공 첨탑 사진 | 상부 티어와 첨탑 | 예 |
| REF-03 | 제공 층별 평면도 | 날개 종료 높이 | 예 |
| REF-04 | 제공 세트백 자료 | Y자 평면 패턴 | 예 |
| REF-05 | 제공 구조 논문 | 버트레스드 코어 | 예 |
| REF-06 | 제공 공정 사진 6장 | 본문별 현장 기록 | 예 |

비고: REF-06은 리팩터링 후 `src/assets/stages/1.jpeg`부터 `6.jpeg`를 쓴다. 나머지는 `src/assets/reference/`로 옮겨졌다. REF-01 `e5109a08a6045581269caec7f60b8fba.jpg`, REF-02 `Erection-of-Spire-of-Burj-Khalifa.jpg`, REF-03 `images (1).jpeg`, REF-04 `images (3).jpeg`, REF-05 `paper.md`. 모두 저장소에 있는 제공 자료이고 새로 만든 경로가 없다. 파일 목록과 용량은 스토리북 07 Assets에, 자료별 용도와 논문 전문은 08 Research에 있다.

---

## 5. 변경 토큰 요약 (스타일 입력)

| 토큰 또는 책임 | 현재 구조 | 이관 구조 | 적용 대상 |
|---|---|---|---|
| 문서 색 변수 | 기존 CSS | `src/styles/global.css` | 배경, 글자, 선 |
| 제목·본문 서체 | 기존 CSS | `src/styles/global.css` | 지면 타이포 |
| Tailwind 유틸리티 | 없음 | 로컬 빌드 출력 | DOM 배치 |
| 장면 색 | 기하 데이터 | `burjKhalifaData` | 타워, 하늘 |
| 진행도 색 전환 | 훅과 장면 | `scrollConfig`, environment | 낮과 밤 |
| 에셋 경로 | 최상위 stages | `src/assets/stages` | 공정 사진 |

비고: Tailwind는 런타임 CDN을 쓰지 않고 로컬 빌드 산출물을 사용한다. 표의 새 경로는 구현 리팩터링 범위라 잠정이다.

---

## 6. 다음 문서로 넘기는 것

| 받는 곳 | 가져가는 것 |
|---|---|
| `src/styles/global.css` | 색, 타이포, 지면 규칙 |
| Three modules | 3.3절 표면과 모션 |
| scroll modules | 2절 밀도와 reveal 규칙 |
| Storybook Docs | 원본 Markdown, 문서 전용 중립 테마 |
