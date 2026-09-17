import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
  DocumentTitle,
  PageContainer,
  SectionTitle,
} from '../../components/storybookDocumentation';
import {
  BUILDING,
  WING_ANGLES,
  TIER_DATA,
  COLORS,
  getSetbackSchedules,
} from '../../data/burjKhalifaData';
import {
  SCROLL_CONFIG,
  PHASES,
  SECTION_HEIGHTS,
  SCENE_TIMING,
  DAY_NIGHT_TIMING,
} from '../../data/scrollConfig';
import { CONSTRUCTION_STAGES } from '../../data/constructionStages';

export default {
  title: 'Overview/Buzz Khalifa/05 Stage Data',
  parameters: {
    layout: 'padded',
  },
};

/** 구간 이름은 02 2.1절 페이지 리스트의 이름을 그대로 쓴다. */
const PHASE_LABELS = {
  FOUNDATION: 'Stage I Foundation',
  CORE: 'Stage II The Core',
  LOWER_TOWER: 'Stage III Setbacks',
  MID_TOWER: 'Stage IV Cladding',
  UPPER_TOWER: 'Stage V Illumination',
  SPIRE: 'Stage VI The Spire',
};

/** 3D 색 팔레트의 역할 설명 (03 3.1절 근거 칸과 같은 어휘) */
const COLOR_ROLES = {
  CONCRETE: '코어와 티어 구조',
  CONCRETE_DARK: '음영과 홈 디테일',
  CONCRETE_LIGHT: '밝은 콘크리트 면',
  GLASS: '커튼월 유리',
  GLASS_LIGHT: '상부 유리',
  GLASS_DARK: '어두운 유리 면',
  ALUMINUM: '프레임과 날개 끝',
  ALUMINUM_LIGHT: '밝은 프레임',
  MULLION: '멀리언',
  SPINE: '중앙 스파인',
  EDGE_FIN: '가장자리 핀',
  FRAME_DARK: '어두운 프레임',
  STEEL: '첨탑 스틸',
  STEEL_POLISHED: '광택 스틸',
  STEEL_BRUSHED: '헤어라인 스틸',
  FOUNDATION: '기초 매트',
  FOUNDATION_DARK: '파일과 기초 음영',
};

/** 진행도(0~1)를 퍼센트 문자열로 */
const toPercent = (value) => `${ (value * 100).toFixed(1) }%`;

/** 표 안에서 쓰는 공정 사진 썸네일 */
function StageThumb({ src, alt }) {
  return (
    <Box
      component="img"
      src={ src }
      alt={ alt }
      loading="lazy"
      sx={ {
        width: 72,
        height: 54,
        objectFit: 'cover',
        display: 'block',
        border: '1px solid',
        borderColor: 'divider',
      } }
    />
  );
}

/** 단순 key-value 표 (상수 객체용) */
function KeyValueTable({ data, keyLabel = 'key', valueLabel = 'value' }) {
  return (
    <TableContainer sx={ { mb: 4 } }>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={ { fontWeight: 600, width: '30%' } }>{ keyLabel }</TableCell>
            <TableCell sx={ { fontWeight: 600 } }>{ valueLabel }</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { Object.entries(data).map(([key, value]) => (
            <TableRow key={ key }>
              <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ key }</TableCell>
              <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>
                { typeof value === 'object' ? JSON.stringify(value) : String(value) }
              </TableCell>
            </TableRow>
          )) }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/** 색 견본이 붙은 팔레트 표 */
function PaletteTable({ colors, roles }) {
  return (
    <TableContainer sx={ { mb: 4 } }>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={ { fontWeight: 600, width: 60 } }>색</TableCell>
            <TableCell sx={ { fontWeight: 600, width: '30%' } }>토큰</TableCell>
            <TableCell sx={ { fontWeight: 600, width: 120 } }>값</TableCell>
            <TableCell sx={ { fontWeight: 600 } }>쓰이는 곳</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { Object.entries(colors).map(([token, value]) => (
            <TableRow key={ token }>
              <TableCell>
                <Box
                  sx={ {
                    width: 28,
                    height: 16,
                    backgroundColor: value,
                    border: '1px solid',
                    borderColor: 'divider',
                  } }
                />
              </TableCell>
              <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ token }</TableCell>
              <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ value }</TableCell>
              <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>
                { roles[token] || '' }
              </TableCell>
            </TableRow>
          )) }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/** 기하와 진행도 데이터 (티어 · 구간 · 3D 팔레트) */
export const Default = {
  render: () => {
    const setbacks = getSetbackSchedules();
    const phaseRows = Object.entries(PHASES).map(([key, range], index) => ({
      key,
      label: PHASE_LABELS[key],
      range,
      stage: CONSTRUCTION_STAGES[index],
      height: SECTION_HEIGHTS[index],
    }));
    const tierHeightSum = TIER_DATA.reduce((sum, tier) => sum + tier.height, 0);

    return (
      <>
        <DocumentTitle
          title="Stage Data"
          status="Available"
          note="구간 경계, 티어 기하, 3D 색 팔레트"
          brandName="Design System"
          systemName="Buzz Khalifa"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Stage Data
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
            <code>src/data/burjKhalifaData.ts</code> · <code>src/data/scrollConfig.ts</code>
          </Typography>

          <SectionTitle
            title="PHASES · 공정 단계(ConstructionStage)"
            description={ `${ phaseRows.length }개 구간. 읽기 진행도 범위가 곧 화면 단위다. Stage V만 두 페이지 높이다.` }
          />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: 90 } }>사진</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 60 } }>번호</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>구간</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 110 } }>키</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 130 } }>진행도</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 90 } }>페이지</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { phaseRows.map((row) => (
                  <TableRow key={ row.key }>
                    <TableCell>
                      { row.stage?.image ? (
                        <StageThumb src={ row.stage.image } alt={ row.stage.title } />
                      ) : null }
                    </TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>
                      { row.stage?.number }
                    </TableCell>
                    <TableCell sx={ { fontSize: 13, fontWeight: 600 } }>{ row.label }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ row.key }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                      { toPercent(row.range.start) } ~ { toPercent(row.range.end) }
                    </TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                      { row.height } page
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle title="SCROLL_CONFIG" description="스크롤 페이지 수와 감쇠" />
          <KeyValueTable data={ SCROLL_CONFIG } />

          <SectionTitle title="SCENE_TIMING" description="건물 이동량과 카메라 배율 구간" />
          <KeyValueTable data={ SCENE_TIMING } />

          <SectionTitle
            title="DAY_NIGHT_TIMING · 시간대(TimeOfDay)"
            description="석양에서 완전한 밤까지의 진행도 경계"
          />
          <KeyValueTable data={ DAY_NIGHT_TIMING } />

          <SectionTitle title="BUILDING" description="타워 치수 선언 상수 (단위: 모형 유닛)" />
          <KeyValueTable data={ BUILDING } />

          <SectionTitle
            title="WING_ANGLES"
            description="Y자 평면의 세 날개 각도 (도)"
          />
          <KeyValueTable data={ { angles: WING_ANGLES.join(', ') } } />

          <SectionTitle
            title="세트백 스케줄"
            description="날개마다 물러서는 높이가 달라 나선형 실루엣이 생긴다. 면적 레벨은 7단계다."
          />
          <KeyValueTable
            data={ {
              wingA: setbacks.wingA.join(', '),
              wingB: setbacks.wingB.join(', '),
              wingC: setbacks.wingC.join(', '),
              areaLevels: setbacks.areaLevels.join(', '),
            } }
          />

          <SectionTitle
            title="TIER_DATA · 티어(Tier)"
            description={ `${ TIER_DATA.length }켜 · 높이 합 ${ tierHeightSum.toFixed(1) } · 날개 길이는 레벨에 따라 계단식으로 줄어든다.` }
          />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: 50 } }>id</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 70 } }>height</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 70 } }>baseY</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 60 } }>phase</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 90 } }>levels</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>wingLengths</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { TIER_DATA.map((tier) => (
                  <TableRow key={ tier.id }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ tier.id }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                      { tier.height.toFixed(2) }
                    </TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                      { tier.baseY.toFixed(2) }
                    </TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ tier.phase }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                      { tier.wingLevels.join(' / ') }
                    </TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                      { tier.wingLengths.map((length) => length.toFixed(2)).join(' / ') }
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle
            title="COLORS · 구조 요소(StructureElement)"
            description="3D 장면의 재질 색. 지면 배색은 03 3.1절을 따른다."
          />
          <PaletteTable colors={ COLORS } roles={ COLOR_ROLES } />
        </PageContainer>
      </>
    );
  },
};
