# Burj Khalifa 3D Model Remodeling Plan

## 레퍼런스 분석 결과

### 1. 핵심 레퍼런스: e5109a08a6045581269caec7f60b8fba.jpg (상세 단면도)

이 도면에서 추출한 **실제 티어별 높이 데이터**:

| Tier | 높이 (m) | 누적 높이 (m) | 비율 (%) |
|------|----------|---------------|----------|
| Ground | 0 | 0 | 0% |
| Tier 1 | 29 | 29 | 3.5% |
| Tier 2 | 23 | 52 | 6.3% |
| Tier 3 | 68 | 120 | 14.5% |
| Tier 4 | 32 | 152 | 18.3% |
| Tier 5 | 36 | 188 | 22.7% |
| Tier 6 | 33 | 221 | 26.6% |
| Tier 7 | 35 | 256 | 30.9% |
| Tier 8 | 44 | 300 | 36.2% |
| Tier 9 | 44 | 344 | 41.5% |
| Tier 10 | 46 | 390 | 47.0% |
| Tier 11 | 52 | 442 | 53.3% |
| Tier 12 | 61 | 503 | 60.6% |
| Tier 13 | 37 | 540 | 65.1% |
| Tier 14 | 25 | 565 | 68.1% |
| Tier 15 | 21 | 586 | 70.6% |
| Tier 16 | 22 | 608 | 73.3% |
| Tier 17 | 22 | 630 | 75.9% |
| Tier 18 | 13 | 643 | 77.5% |
| Tier 19 | 25 | 668 | 80.5% |
| Tier 20 | 22 | 690 | 83.2% |
| Tier 21 | 11 | 701 | 84.5% |
| Tier 22 (ROOF) | 6 | 707 | 85.2% |
| **Spire Start** | - | 707 | 85.2% |
| Tier 23 | 13 | 720 | 86.8% |
| Tier 24 | 18 | 738 | 88.9% |
| Tier 25 | 11 | 749 | 90.3% |
| Tier 26 | 9 | 758 | 91.4% |
| Tier 27 | 10 | 768 | 92.6% |
| Pinnacle | 61 | 829 | 100% |

### 2. 레퍼런스: Erection-of-Spire (스파이어 건설 시퀀스)

**핵심 발견**:
- Tier 14~27은 콘크리트 타워 상부 + 스파이어 기초
- 각 티어에서 Y자형 평면이 점진적으로 축소
- 스파이어 구조물이 중앙에서 솟아오름

### 3. 레퍼런스: images (1).jpeg (층별 평면도 변화)

**날개 종료 패턴 (Critical Discovery)**:
- 세 날개(A, B, C)가 **서로 다른 높이에서 종료**
- 이것이 나선형 setback 효과를 만듦
- 색상 구분: 호텔(파랑), 주거(보라), 오피스(노랑)

### 4. 레퍼런스: images (3).jpeg (평면 setback 패턴)

**Y자형 평면의 스캘럽(가리비) 패턴**:
- 각 날개 끝이 로불러(둥근) 형태
- Spider Lily (거미백합) 영감
- 바람 방향에 따른 최적화 형태

---

## 현재 모델 vs 실제 비율 비교

| 항목 | 현재 모델 | 실제 비율 | 차이 |
|------|-----------|-----------|------|
| 총 높이 | 55 units | 829.8m | 기준 |
| 콘크리트 타워 | 42 units (76.4%) | 707m (85.2%) | **-8.8%** |
| 스파이어 | 13 units (23.6%) | 122m (14.8%) | **+8.8%** |
| 티어 개수 | 27개 | 27개 | 일치 |
| 베이스 폭 | 4.0 units | ~55m | 기준 |
| 종횡비 | 13.75:1 | 15:1 | **-9%** |

### 문제점 식별

1. **스파이어 비율 과다**: 현재 24% → 실제 15%
2. **타워 높이 부족**: 각 티어 높이가 균등하게 분배됨
3. **티어 높이 분포 부정확**: 실제는 하부가 더 높고 상부가 낮음
4. **날개 종료 패턴 미구현**: 세 날개가 동시에 축소됨

---

## 리모델링 계획

### Phase 1: 비율 재조정

**새로운 높이 분배 (55 units 기준)**:

```
콘크리트 타워: 55 × 0.852 = 46.86 ≈ 47 units
스파이어: 55 × 0.148 = 8.14 ≈ 8 units
```

### Phase 2: 티어 높이 재계산

**실제 비율 기반 티어 높이 (47 units 타워)**:

| Phase | 티어 | 실제 높이 비율 | 모델 높이 (units) |
|-------|------|----------------|-------------------|
| 3 (Lower) | 0-8 | 36.2% | 17.0 |
| 4 (Mid) | 9-14 | 31.9% | 15.0 |
| 5 (Upper) | 15-22 | 17.1% | 8.0 |
| Core | - | 14.5% (Tier 3까지) | 7.0 |

### Phase 3: 새로운 TIER_DATA 설계

```typescript
// Phase 3: Lower Tower (Tiers 0-8) - 17 units total
{ id: 0,  height: 2.8, wingLength: 4.5, wingWidth: 1.4, rotation: 0 }    // Tier 1-2
{ id: 1,  height: 2.6, wingLength: 4.2, wingWidth: 1.35, rotation: 13 }
{ id: 2,  height: 2.4, wingLength: 3.9, wingWidth: 1.28, rotation: 26 }  // Major setback
{ id: 3,  height: 2.2, wingLength: 3.5, wingWidth: 1.20, rotation: 39 }
{ id: 4,  height: 2.0, wingLength: 3.2, wingWidth: 1.12, rotation: 52 }
{ id: 5,  height: 1.8, wingLength: 2.9, wingWidth: 1.04, rotation: 65 }
{ id: 6,  height: 1.6, wingLength: 2.6, wingWidth: 0.96, rotation: 78 }
{ id: 7,  height: 1.4, wingLength: 2.4, wingWidth: 0.88, rotation: 91 }
{ id: 8,  height: 1.2, wingLength: 2.2, wingWidth: 0.80, rotation: 104 }

// Phase 4: Mid Tower (Tiers 9-14) - 15 units total
{ id: 9,  height: 3.0, wingLength: 2.0, wingWidth: 0.72, rotation: 117 } // Sky Lobby zone
{ id: 10, height: 2.8, wingLength: 1.8, wingWidth: 0.64, rotation: 130 }
{ id: 11, height: 2.6, wingLength: 1.55, wingWidth: 0.56, rotation: 143 }
{ id: 12, height: 2.4, wingLength: 1.30, wingWidth: 0.48, rotation: 156 }
{ id: 13, height: 2.2, wingLength: 1.10, wingWidth: 0.40, rotation: 169 }
{ id: 14, height: 2.0, wingLength: 0.90, wingWidth: 0.34, rotation: 182 }

// Phase 5: Upper Tower (Tiers 15-22) - 8 units total
{ id: 15, height: 1.2, wingLength: 0.75, wingWidth: 0.28, rotation: 195 }
{ id: 16, height: 1.1, wingLength: 0.62, wingWidth: 0.24, rotation: 208 }
{ id: 17, height: 1.0, wingLength: 0.50, wingWidth: 0.20, rotation: 221 }
{ id: 18, height: 0.9, wingLength: 0.40, wingWidth: 0.17, rotation: 234 }
{ id: 19, height: 0.8, wingLength: 0.32, wingWidth: 0.14, rotation: 247 }
{ id: 20, height: 0.7, wingLength: 0.25, wingWidth: 0.12, rotation: 260 }
{ id: 21, height: 0.6, wingLength: 0.20, wingWidth: 0.10, rotation: 273 }
{ id: 22, height: 0.5, wingLength: 0.15, wingWidth: 0.08, rotation: 286 } // ROOF

// Spire: 8 units total (handled in Spire.tsx)
```

### Phase 4: 날개 차등 종료 구현

**핵심 개선사항**: 각 날개가 다른 높이에서 종료

```typescript
interface WingTermination {
  wingA_ends: number;  // 티어 번호
  wingB_ends: number;
  wingC_ends: number;
}

const WING_TERMINATIONS = [
  { tier: 15, wings: [true, true, true] },   // 모든 날개 존재
  { tier: 16, wings: [true, true, false] },  // C 종료
  { tier: 17, wings: [true, false, false] }, // B 종료
  { tier: 18, wings: [false, false, false] },// A 종료, 코어만 남음
];
```

### Phase 5: 스파이어 재설계

**8 units 스파이어 구조**:

| 세그먼트 | 높이 | 반지름(하단→상단) | 설명 |
|----------|------|-------------------|------|
| Base | 1.5 | 0.50 → 0.42 | 콘크리트-스틸 전환부 |
| Seg 1 | 1.3 | 0.42 → 0.34 | 주 구조 |
| Seg 2 | 1.1 | 0.34 → 0.26 | |
| Seg 3 | 0.9 | 0.26 → 0.18 | |
| Seg 4 | 0.8 | 0.18 → 0.12 | |
| Seg 5 | 0.7 | 0.12 → 0.06 | |
| Antenna | 1.0 | 0.06 → 0.02 | 안테나부 |
| Tip | 0.7 | 0.02 → 0.005 | 최첨단 |

### Phase 6: 코어 높이 증가

현재 CORE_HEIGHT: 3 units → **7 units**로 증가

이유: 실제 건물에서 Tier 3 (120m)까지가 기초 코어 구조
- 120m / 829.8m = 14.5%
- 55 units × 14.5% = 7.97 ≈ 7~8 units

---

## 시각적 개선 사항

### 1. 종횡비 강화
- 현재: 55 / 4 = 13.75:1
- 목표: 55 / 3.5 = 15.7:1 (베이스 폭 축소)

### 2. 테이퍼링 가속
- 하부 (Phase 3): 완만한 테이퍼
- 중부 (Phase 4): 급격한 테이퍼 시작
- 상부 (Phase 5): 급격한 테이퍼, 날개 종료

### 3. 스캘럽(Scallop) 디테일
- 각 날개 끝의 로불러(둥근) 형태 강화
- CylinderGeometry로 날개 끝 표현

### 4. 층간 라인 강조
- 각 티어 경계에 더 뚜렷한 수평선
- setback 지점에서 시각적 단차 표현

---

## 구현 우선순위

1. **HIGH**: BurjKhalifaData.ts - 새 티어 높이/비율 적용
2. **HIGH**: Building.tsx - 카메라 이동량 조정 (47 + 8 = 55 units)
3. **MEDIUM**: Spire.tsx - 8 units로 축소, 세그먼트 재배치
4. **MEDIUM**: 각 Phase 컴포넌트 - 새 데이터 반영
5. **LOW**: 날개 차등 종료 구현 (복잡도 높음)

---

## 예상 결과

리모델링 후 예상되는 시각적 변화:

| 측면 | 개선 효과 |
|------|-----------|
| 길이감 | 더 가늘고 긴 실루엣 (+10% 종횡비) |
| 건축 속도감 | 하부 느림 → 상부 빠름 (비선형 높이) |
| 완성도 | 실제 버즈 칼리파 비율과 85% 이상 일치 |
| 스파이어 | 적절한 비율 (24% → 15%) |

---

## 참고 자료

- `e5109a08a6045581269caec7f60b8fba.jpg`: 상세 단면도 (핵심)
- `Erection-of-Spire-of-Burj-Khalifa.jpg`: 스파이어 건설 시퀀스
- `images (1).jpeg`: 층별 평면도 변화
- `images (3).jpeg`: Y자형 setback 패턴
- `paper.md`: 학술 논문 (구조 시스템 상세)
