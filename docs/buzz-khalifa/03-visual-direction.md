# Buzz Khalifa: Visual Direction

> 이 문서가 결정하는 것: 정체성과 화면이 어떻게 보이는가
> 입력: 01 3절 정체성, 02 2.1절 페이지, 02 4절 원칙 · 출력 대상: theme.js, /component-work, /layout-composer, /visual-asset-prompt (넘기는 항목은 이 문서 6절 표)

## 결정 현황

이 표의 확정 항목만 다음 문서가 그대로 인용한다. 잠정은 `(잠정)` 표시를 달고 인용하고, 미정은 인용하지 않는다.

| 섹션 | 상태 | 비고 |
|---|---|---|
| 1. 무드 | 잠정 | 코드에서 역추출 (Q5) |
| 2. 레이아웃 전략 | 잠정 | 배정 미승인 (Q6) |
| 3.1 색 | 확정 | 코드 실제 값 |
| 3.2 타이포 | 확정 | 코드 실제 값 |
| 3.3 형태·표면·모션 | 확정 | 코드 실제 값 |
| 4. 이미지·에셋 방향 | 확정 | 저장소 파일 근거 |
| 4.1 레퍼런스 | 확정 | 저장소 제공 파일 |
| 5. 변경 토큰 요약 | 확정 | 현재값 없음 |
| 6. 다음 문서로 넘기는 것 | 확정 | MUI 미사용 |

문서 상태: 잠정 승인 (하드 게이트 충족)
개정: 2026-09-17 v2 · 변경: 야간 창 발광 값과 재질 범위를 코드대로 정정

비고:

- **3절 값 출처**: `index.html`과 `index.css`의 CSS 변수와 서체, `hooks/useTheme.ts`의 낮·밤 배색, `components/DayNightCycle.tsx`의 하늘색, `components/BurjKhalifaData.ts`의 `COLORS`, `components/Illumination.tsx`·`Spire.tsx`의 발광값, `App.tsx`의 카메라와 후처리값이다.
- **PRD 팔레트 폐기**: PRD 3절과 `metadata.json`은 파스텔 장난감 톤(지면 `#e5e5e5`, 구조물 `#ffffff`, 유리 `#a2d2ff`)을 적었지만 코드에는 그 값이 없다. 실제는 청회색 계열의 잡지 지면 톤이다. 이 문서는 코드 값을 적었다.
- **MUI 없음**: 테마 파일이 없어 3.1절·3.2절의 토큰 칸에는 CSS 변수와 유틸리티 클래스 이름을, 5절 현재값 칸에는 "해당 없음(MUI 미사용)"을 적었다.
- **2절 잠정 (Q6)**: 아키타입 id는 스타터킷 택소노미(`src/data/layoutTaxonomyData.js`)에서 골랐다. 이 저장소에는 택소노미 파일이 없다.
- **1절 잠정 (Q5)**: 무드 선언이 원천에 없다. 지면 톤과 재질값에서 역추출했다.
- **분량**: 228줄(권장 200). 값 표가 길어 늘었다. 5절 변경 토큰 표를 `appendix-tokens.md`로 분리 가능하다.

---

## 1. 무드

- **키워드** (최대 5, 01 3.2절에서 파생): Architectural Editorial · Isometric · Blue Grey Neutral · Day-to-Night · Quiet Precision
- **태도 선언** (최대 3): 설명은 잡지 기사처럼 쓰고 화면은 도면처럼 둔다. 원근을 쓰지 않는다, 정사영으로 높이를 비교하게 한다. 색은 하늘이 정하고 지면의 글자가 따라간다.
- **하지 않는 것** (최대 5): 파스텔 장난감 톤 · 카드 배경면 · 둥근 패널과 그림자 상자 · 다색 강조 · 원근 왜곡

---

## 2. 레이아웃 전략

구조:

| 페이지 (02 2.1절) | 공간 모델 | 아키타입 | 구분 언어 |
|---|---|---|---|
| Stage I Foundation | 유동 | scrollytelling + alternating-rows (잠정) | 선 |
| Stage II The Core | 유동 | scrollytelling + alternating-rows (잠정) | 선 |
| Stage III Setbacks | 유동 | scrollytelling + alternating-rows (잠정) | 선 |
| Stage IV Cladding | 유동 | scrollytelling + alternating-rows (잠정) | 선 |
| Stage V Illumination | 유동 | scrollytelling + alternating-rows (잠정) | 선 |
| Stage VI The Spire | 유동 | scrollytelling + alternating-rows (잠정) | 선 |
| 고정 레이어 | 고정 | full-bleed-content + z-axis-layering (잠정) | 여백 |

콘텐츠 신호 (/layout-composer 입력):

| 페이지 | 밀도 | text / media / repeat / hierarchy |
|---|---|---|
| Stage I Foundation | airy | long / accent / single / two-tier |
| Stage II The Core | airy | long / accent / single / two-tier |
| Stage III Setbacks | airy | long / accent / single / two-tier |
| Stage IV Cladding | airy | long / accent / single / two-tier |
| Stage V Illumination | airy | long / accent / single / two-tier |
| Stage VI The Spire | airy | long / accent / single / two-tier |
| 고정 레이어 | compact | micro / dominant / single / flat |

- 공간 모델: 유동 / 고정 / 혼합. 아키타입: 스타터킷 택소노미 `src/data/layoutTaxonomyData.js`의 id. 구분 언어: 선 / 면 / 여백.
- 여섯 구간은 한 템플릿을 공유하고 좌우 정렬만 번갈아 바뀐다. 홀수 구간은 왼쪽, 짝수 구간은 오른쪽에 붙고 정렬 방향에 따라 본문 세로선도 좌우로 옮겨간다.
- 전역 리듬: 구간 하나가 화면 한 높이이고 다섯째 구간만 두 배다. 본문은 화면을 다 쓰지 않고 한쪽에 치우친 좁은 단으로 두어, 비는 쪽에 3차원 타워가 서도록 자리를 남긴다. 바깥 여백은 화면 폭에 따라 세 단계로 커지고, 머리말과 꼬리말은 늘 같은 자리에 떠 있다.

---

## 3. 토큰 방향

### 3.1 색 (역할 팔레트)

지면 (낮과 밤 두 벌):

| 역할 | 이름 | 값 (낮 / 밤) | 토큰 | 근거 (01 3절) |
|---|---|---|---|---|
| 지면 바탕 | Warm White | `#f5f3f0` (고정) | `--color-warm-white` | Record |
| 제목·강조 글자 | Ink / Paper | `#1a1a1a` / `#f5f3f0` | `--ui-text-primary` | Legibility |
| 본문 글자 | Charcoal / Mist | `#2a2a2a` / `#d0d0d0` | `--ui-text-body` | Legibility |
| 보조 글자 | Slate / Ash | `#3a3a3a` / `#b0b0b0` | `--ui-text-secondary` | Record |
| 캡션 글자 | Stone / Grey | `#5a5a5a` / `#808080` | `--ui-text-muted` | Record |
| 유일한 악센트 | Gold | `#1a1a1a` / `#d4b878` | `--ui-gold` | Verticality |
| 본문 테두리 | Accent Line | `#1a1a1a` / `#d4b878` | `--ui-border-accent` | Legibility |

3차원 장면:

| 역할 | 이름 | 값 | 토큰 | 근거 (01 3절) |
|---|---|---|---|---|
| 하늘 | Sky 7단계 | 표 아래 목록 | `SKY_COLORS` | Record |
| 콘크리트 | Concrete | `#c8cdd2` | `COLORS.CONCRETE` | Legibility |
| 기초 | Foundation Grey | `#b0b8c0` | `COLORS.FOUNDATION` | Legibility |
| 유리 | Deep Blue Grey | `#506872` | `COLORS.GLASS` | Verticality |
| 알루미늄·멀리언 | Silver | `#d0d5da` | `COLORS.ALUMINUM` | Record |
| 첨탑 스틸 | Steel | `#d4d8dc` | `COLORS.STEEL` | Verticality |
| 야간 창 발광 | Warm Window | `#FFF4E0 / #FFF8E8 / #FFFAF0` (구간별) | 발광 재질 | Record |
| 야간 띠조명 | LED Cyan | `#60D0FF` | 발광 재질 | Verticality |
| 항공장애등 | Beacon Red | `#ff4444` | 발광 재질 | Record |

비고:

- 하늘 7단계: dawn `#87CEEB`, morning `#7EC8E3`, midday `#4A90C2`, afternoon `#F4A460`, sunset `#FF6B35`, dusk `#1a0a30`, night `#010108`. 읽기 진행도에 따라 이웃한 두 값을 섞는다.
- 낮에는 금색을 쓰지 않는다. 악센트 토큰이 잉크색과 같은 값이어서 낮 화면의 강조는 색이 아니라 선과 자간으로만 생긴다.
- 지면에는 배경 면이 없다. 카드 배경 토큰이 두 배색 모두 투명이다.
- 야간 창 발광은 구간마다 기본색이 다르다(하부 `#FFF4E0`, 중부 `#FFF8E8`, 상부 `#FFFAF0`). 실행 중에는 층과 시간에 따라 다섯 색(`#FFF4E0`, `#FFE8CC`, `#FFDAB9`, `#FFE4B5`, `#FFF5EE`)이 순환하며 발광색을 덮어쓴다.
- 그림자 계열과 어두운 변형(`CONCRETE_DARK`, `GLASS_DARK`, `SPINE`, `EDGE_FIN`)은 같은 청회색의 명도 단계이고 따로 새 색을 만들지 않는다.

### 3.2 타이포

| 역할 | 서체 | 방향 (웨이트·크기·자간·행간) | 클래스 |
|---|---|---|---|
| 제호·구간 제목 | Bebas Neue (Oswald 폴백) | 400, 대문자, 자간 넓게 | `.font-headline` |
| 부제·간행 정보 | Oswald | 500, 대문자, 자간 넓게 | `.font-condensed` |
| 로마 숫자·인용 | Cormorant Garamond (Georgia) | 300, 아주 큰 크기, 행간 1 | `.font-editorial` |
| 본문·기술 노트 | Source Sans 3 (Helvetica Neue) | 300~600, 행간 여유 | `.font-body` |
| 수치 라벨 | Source Sans 3 | 가장 작은 크기, 자간 0.25em, 대문자 | `.tracking-editorial` |

비고: 제목 계열은 전부 대문자 영문이고 한글을 쓰지 않는다. 로마 숫자가 구간 번호를 대신하며 본문 서체와 크기 차이가 가장 큰 자리다.

### 3.3 형태·표면·모션

| 축 | 방향 | 값 |
|---|---|---|
| 투영 | 원근 제거 | 정사영 카메라, 초기 배율 90 |
| 시점 이동 | 각도 고정, 배율만 변함 | 배율 95에서 52로, 마지막에 15로 |
| 회전 | 읽는 동안 4분의 1 바퀴 | 진행도 전체에서 90도 |
| 3차원 모서리 | 각지지 않게 살짝 굴림 | 반경 0.015~0.05 |
| 지면 면 | 배경 면 없음, 한 변 선만 | 본문 테두리 2px, 보조 선 1px |
| 표면·콘크리트 | 거친 무광 | roughness 0.68~1.0, metalness 0.10 이하 |
| 표면·금속 | 광택 있는 프레임 | roughness 0.22, metalness 0.92 |
| 표면·유리 | 맑고 반투명 | roughness 0.04~0.05, 불투명도 0.85~0.88 |
| 발광 | 밝은 부분만 번짐 | 세기 1.2, 임계 0.9 |
| 배색 전환 | 낮과 밤 사이 느린 교차 | 0.7s ease (색·배경·테두리) |
| 글자 등장 | 아래에서 한 글자씩 | 400~800ms, 글자 간격 6~80ms |
| 이징 | 튀지 않고 빠르게 안착 | `cubic-bezier(0.16, 1, 0.3, 1)` |
| 스크롤 감쇠 | 즉시 반응하지 않음 | damping 0.25 |

비고:

- 배율 변화는 두 구간으로 나뉜다. 건설 구간에서는 천천히 물러나고 마지막 구간에서만 급격히 물러나 전체 실루엣을 보여준다.
- 사진은 글자보다 늦게, 아래에서 30px 올라오며 800ms 동안 들어온다.
- 그림자는 방향광 하나가 만든다. 야간에는 지면 업라이트와 창 발광이 그 자리를 대신한다.
- 금속과 유리의 반사는 도심 환경맵(city 프리셋)에서 가져온다. 별도의 접지 그림자 효과는 쓰지 않는다.

---

## 4. 이미지·에셋 방향

| 에셋 유형 | 쓰이는 곳 | LOOK 키워드 (1~2) |
|---|---|---|
| 공정 사진 | 여섯 구간 본문 아래 | archival construction photo |
| 구조 레퍼런스 | 3차원 모델 제작 근거 | technical section drawing |

에셋별 방향 (에셋 유형마다 한 블록):

- **공정 사진**
  - FORMAT: 원본 비율 그대로, 본문 단 폭 안, 구간 정렬과 같은 쪽에 붙임
  - LOOK: archival construction photo, 보정으로 톤을 통일하지 않음
  - SUBJECT: 해당 공정이 진행 중인 실제 부르즈 할리파 현장 한 장면
  - 하지 않는 것: 임의 크롭, 3차원 렌더 합성, 완성 사진으로 대체
- **구조 레퍼런스**
  - FORMAT: 화면에 싣지 않음. 모델 치수와 비율을 정하는 근거 자료
  - LOOK: technical section drawing, 도면과 평면도 위주
  - SUBJECT: 티어별 높이 단면, 첨탑 인양 시퀀스, 층별 평면 변화
  - 하지 않는 것: 지면에 노출, 출처 없는 도면 추가

### 4.1 레퍼런스 (사용자 제공만)

| ID | 파일 | 참고 포인트 | 잠금 |
|---|---|---|---|
| REF-01 | 단면도 (해시 이름 jpg) | 티어별 높이와 누적 비율 | 예 |
| REF-02 | 첨탑 인양 사진 | 상부 티어와 첨탑 기초 | 예 |
| REF-03 | 층별 평면도 | 날개별 종료 높이 차이 | 예 |
| REF-04 | 평면 세트백 패턴 | Y자 평면의 둥근 날개 끝 | 예 |
| REF-05 | 구조 논문 | 버트레스드 코어 구조 설명 | 예 |
| REF-06 | 공정 사진 여섯 장 | 구간 본문에 싣는 실사 | 예 |

비고: 파일 경로는 `reference/e5109a08a6045581269caec7f60b8fba.jpg`(REF-01), `reference/Erection-of-Spire-of-Burj-Khalifa.jpg`(REF-02), `reference/images (1).jpeg`(REF-03), `reference/images (3).jpeg`(REF-04), `reference/paper.md`(REF-05), `stages/1.jpeg`부터 `stages/6.jpeg`(REF-06)이다. 모두 저장소에 들어 있는 제공 자료이고 새로 만든 경로가 없다.

---

## 5. 변경 토큰 요약 (theme.js 입력)

| 토큰 경로 | 현재값 | 변경값 | 적용 대상 |
|---|---|---|---|
| `--color-warm-white` | 해당 없음(MUI 미사용) | `#f5f3f0` | 지면 바탕 |
| `--ui-text-primary` | 해당 없음(MUI 미사용) | `#1a1a1a` / 밤 `#f5f3f0` | 제호, 구간 제목 |
| `--ui-text-body` | 해당 없음(MUI 미사용) | `#2a2a2a` / 밤 `#d0d0d0` | 해설 본문 |
| `--ui-text-secondary` | 해당 없음(MUI 미사용) | `#3a3a3a` / 밤 `#b0b0b0` | 부제, 인용 |
| `--ui-text-muted` | 해당 없음(MUI 미사용) | `#5a5a5a` / 밤 `#808080` | 캡션, 기술 노트 |
| `--ui-gold` | 해당 없음(MUI 미사용) | `#1a1a1a` / 밤 `#d4b878` | 로마 숫자, 수치 라벨 |
| `--ui-border-accent` | 해당 없음(MUI 미사용) | `#1a1a1a` / 밤 `#d4b878` | 본문 세로선 |
| `--ui-bg-card` | 해당 없음(MUI 미사용) | `transparent` (두 배색 공통) | 본문 블록 배경 |
| `SKY_COLORS` | 해당 없음(MUI 미사용) | 7단계 (3.1절 비고) | 장면 배경 |
| `COLORS.CONCRETE` | 해당 없음(MUI 미사용) | `#c8cdd2` | 코어, 티어 구조 |
| `COLORS.GLASS` | 해당 없음(MUI 미사용) | `#506872` | 커튼월 유리 |
| `COLORS.ALUMINUM` | 해당 없음(MUI 미사용) | `#d0d5da` | 프레임, 멀리언 |
| `COLORS.STEEL` | 해당 없음(MUI 미사용) | `#d4d8dc` | 첨탑 |
| `COLORS.FOUNDATION` | 해당 없음(MUI 미사용) | `#b0b8c0` | 매트, 파일 |
| 야간 창 발광 | 해당 없음(MUI 미사용) | `#FFF4E0` / `#FFF8E8` / `#FFFAF0` | 하부·중부·상부 티어 창 |
| 야간 발광 순환 | 해당 없음(MUI 미사용) | 따뜻한 5색 순환 (3.1절 비고) | 층·시간별 발광색 |
| 띠조명·항공장애등 | 해당 없음(MUI 미사용) | `#60D0FF`, `#ff4444` | 상부 띠조명, 첨탑 등 |
| 서체 4종 | 해당 없음(MUI 미사용) | Bebas Neue, Oswald, Cormorant, Source Sans 3 | 제목, 부제, 인용, 본문 |
| `tracking-editorial` | 해당 없음(MUI 미사용) | 자간 0.25em | 간행 정보, 수치 라벨 |
| 배색 전환 | 해당 없음(MUI 미사용) | 0.7s ease | 색, 배경, 테두리 |
| 등장 이징 | 해당 없음(MUI 미사용) | `cubic-bezier(0.16, 1, 0.3, 1)` | 글자, 사진 등장 |
| 카메라 배율 | 해당 없음(MUI 미사용) | 95 에서 52, 마지막 15 | 장면 전체 |
| 발광 후처리 | 해당 없음(MUI 미사용) | 세기 1.2, 임계 0.9 | 야간 발광부 |
| 스크롤 감쇠 | 해당 없음(MUI 미사용) | 0.25 | 전 구간 |

비고: 현재값 칸이 전부 비는 이유는 MUI 테마 파일이 없어서다. 이 표는 `theme.js` 대신 `index.css`, `hooks/useTheme.ts`, `components/BurjKhalifaData.ts`, `App.tsx`로 들어간다.

---

## 6. 다음 문서로 넘기는 것

| 받는 곳 | 가져가는 것 |
|---|---|
| 토큰 적용 (theme.js 없음) | 5절 표 |
| /component-work | 3절 토큰 방향, 5절 표 |
| /layout-composer | 2절 두 표의 아키타입·콘텐츠 신호 |
| /visual-asset-prompt | 4절 표와 에셋별 방향, 4.1절 |
