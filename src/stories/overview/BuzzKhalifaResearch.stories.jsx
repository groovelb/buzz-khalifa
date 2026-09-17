import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
  DocumentTitle,
  EditorialDocument,
  PageContainer,
  SectionTitle,
} from '../../components/storybookDocumentation';
import assetInventory from '../../data/assetInventory.js';
import {
  BUILDING,
  WING_ANGLES,
  TIER_DATA,
  COLORS,
  getSetbackSchedules,
} from '../../data/burjKhalifaData';
import { CONSTRUCTION_STAGES } from '../../data/constructionStages';
import { ASSEMBLY_STEPS } from './assemblySteps.js';
import paperDocument from '../../assets/reference/paper.md?raw';

export default {
  title: 'Overview/Buzz Khalifa/08 Research',
  parameters: {
    layout: 'padded',
  },
};

/** 리서치 자료 URL. 인벤토리의 importKey 와 같은 키를 쓴다. */
const REFERENCE_URLS = import.meta.glob(
  '../../assets/reference/*.{png,jpg,jpeg,webp,gif,svg}',
  { eager: true, query: '?url', import: 'default' },
);

/**
 * 자료 파일명 → 무엇을 읽어 어떤 결정에 썼는지 한 줄.
 * 근거가 남아 있지 않은 자료는 "용도 미기록"으로 둔다. 지어내지 않는다.
 */
const REFERENCE_NOTES = {
  'e5109a08a6045581269caec7f60b8fba.jpg': '티어별 높이 단면도. 타워와 첨탑의 높이 비율을 여기서 읽었다',
  'Erection-of-Spire-of-Burj-Khalifa.jpg': '첨탑 인양 시퀀스. 첨탑이 위에서 내려와 꽂히는 연출의 근거',
  'images (1).jpeg': '층별 평면 변화. 세 날개가 서로 다른 높이에서 끝난다는 사실을 여기서 얻었다',
  'images (3).jpeg': 'Y자 평면의 세트백 패턴. 날개 끝이 둥근 형태라는 근거',
  '3-Figure1-1.png': '논문 도판. 버트레스드 코어 구조의 개념도',
  '12-Figure18-1.png': '논문 도판. 구조 시스템 상세',
  '01_2.jpg': '용도 미기록 (외관 사진)',
  'images (2).jpeg': '용도 미기록 (평면 자료)',
  'images.jpeg': '용도 미기록 (평면 자료)',
  'Thetower.png': '용도 미기록 (전체 실루엣)',
  'Screenshot 2026-01-13 at 1.42.01 AM.png': '용도 미기록 (작업 중 화면 캡처)',
  'Screenshot 2026-01-13 at 1.42.09 AM.png': '용도 미기록 (작업 중 화면 캡처)',
};

/** 바이트를 사람이 읽는 단위로 */
const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes >= 1024 * 1024) return `${ (bytes / 1024 / 1024).toFixed(1) } MB`;
  return `${ Math.round(bytes / 1024) } KB`;
};

/** 자료 한 장. 고정 비율 칸 안에 원본을 잘라내지 않고 맞춘다. */
function ReferenceCell({ item }) {
  return (
    <Stack spacing={ 0.75 }>
      <Box
        sx={ {
          width: '100%',
          aspectRatio: '4 / 3',
          backgroundColor: 'grey.100',
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        } }
      >
        <Box
          component="img"
          src={ item.src }
          alt={ item.name }
          loading="lazy"
          sx={ { maxWidth: '100%', maxHeight: '100%', display: 'block' } }
        />
      </Box>
      <Typography variant="body2" sx={ { fontWeight: 600 } }>
        { REFERENCE_NOTES[item.name] || '용도 미기록' }
      </Typography>
      <Typography
        variant="caption"
        sx={ { fontFamily: 'monospace', fontSize: 10, color: 'text.secondary' } }
      >
        { item.name } · { formatBytes(item.bytes) }
      </Typography>
    </Stack>
  );
}

/** 스토리 링크. Storybook 프레임 밖으로 이동시키려고 target 을 _top 으로 둔다. */
function StoryLinks({ stories }) {
  return (
    <>
      { stories.map((story, index) => (
        <span key={ story.id }>
          { index > 0 ? ' · ' : '' }
          <a href={ `?path=/story/${ story.id }` } target="_top">{ story.label }</a>
        </span>
      )) }
    </>
  );
}

/** 리서치에서 데이터, 모델, 화면까지 어떻게 이어졌는지 */
export const Default = {
  render: () => {
    const referenceImages = assetInventory.items
      .filter((item) => item.folder === 'reference' && item.kind === 'image')
      .map((item) => ({ ...item, src: REFERENCE_URLS[item.importKey] || '' }));

    const setbacks = getSetbackSchedules();

    const evidenceRows = [
      {
        evidence: '단면도의 누적 높이 (타워 707m, 첨탑 122m)',
        value: `타워 ${ BUILDING.TOWER_HEIGHT } · 첨탑 ${ BUILDING.SPIRE_HEIGHT } · 전체 ${ BUILDING.TOTAL_HEIGHT }`,
        constant: 'BUILDING.TOWER_HEIGHT / SPIRE_HEIGHT / TOTAL_HEIGHT',
      },
      {
        evidence: '코어가 Tier 3(약 120m, 전체의 14.5%)까지 올라간다',
        value: `${ BUILDING.CORE_HEIGHT } 유닛`,
        constant: 'BUILDING.CORE_HEIGHT',
      },
      {
        evidence: 'Y자 평면의 세 날개가 120도 간격으로 뻗는다',
        value: WING_ANGLES.join(' / '),
        constant: 'WING_ANGLES',
      },
      {
        evidence: '세 날개가 서로 다른 높이에서 물러선다 (나선형 세트백)',
        value: `A ${ setbacks.wingA.join(', ') } · B ${ setbacks.wingB.join(', ') } · C ${ setbacks.wingC.join(', ') }`,
        constant: 'WING_A/B/C_SETBACK_HEIGHTS (getSetbackSchedules)',
      },
      {
        evidence: '면적은 점진적이 아니라 모듈 단위로 계단식으로 줄어든다',
        value: setbacks.areaLevels.map((level) => `${ level * 100 }%`).join(' / '),
        constant: 'AREA_LEVELS (getSetbackSchedules)',
      },
      {
        evidence: '하부가 높고 상부가 낮은 층 높이 분포',
        value: `${ TIER_DATA.length }켜 · ${ TIER_DATA[0].height } 에서 ${ TIER_DATA[TIER_DATA.length - 1].height } 까지`,
        constant: 'TIER_DATA',
      },
      {
        evidence: '유리와 콘크리트의 청회색 계열 외관',
        value: `${ COLORS.CONCRETE } · ${ COLORS.GLASS } · ${ COLORS.ALUMINUM } · ${ COLORS.STEEL }`,
        constant: 'COLORS',
      },
      ...CONSTRUCTION_STAGES.map((stage) => ({
        evidence: `${ stage.title } 공정의 기록 수치`,
        value: stage.measurement || '',
        constant: `CONSTRUCTION_STAGES[${ stage.number }].measurement`,
      })),
    ];

    return (
      <>
        <DocumentTitle
          title="Research"
          status="Available"
          note="리서치 자료와 그것이 들어간 상수, 그리고 조립 순서"
          brandName="Design System"
          systemName="Buzz Khalifa"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Research
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
            <code>src/assets/reference/</code> · 자료 { referenceImages.length }장과 구조 논문 한 편
          </Typography>

          <SectionTitle
            title="조립 순서"
            description="리서치에서 페이지까지 여섯 단계. 각 단계의 결과물은 스토리로 열어 볼 수 있다."
          />
          <TableContainer sx={ { mb: 6 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: 60 } }>단계</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 120 } }>이름</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>하는 일</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 220 } }>스토리</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { ASSEMBLY_STEPS.map((step) => (
                  <TableRow key={ step.step }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ step.step }</TableCell>
                    <TableCell sx={ { fontSize: 13, fontWeight: 600 } }>{ step.title }</TableCell>
                    <TableCell sx={ { fontSize: 13 } }>
                      { step.what }
                      <Typography
                        variant="caption"
                        sx={ { display: 'block', fontFamily: 'monospace', fontSize: 11, color: 'text.secondary' } }
                      >
                        { step.where }
                      </Typography>
                    </TableCell>
                    <TableCell sx={ { fontSize: 13 } }>
                      <StoryLinks stories={ step.stories } />
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle
            title="근거에서 데이터로"
            description="리서치에서 얻은 수치와 규칙이 어느 상수로 들어갔는지. 값은 코드에서 그대로 읽는다."
          />
          <TableContainer sx={ { mb: 6 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: '32%' } }>리서치에서 읽은 것</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>코드의 값</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: '28%' } }>상수</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { evidenceRows.map((row) => (
                  <TableRow key={ row.constant + row.evidence }>
                    <TableCell sx={ { fontSize: 13 } }>{ row.evidence }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ row.value }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' } }>
                      { row.constant }
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle
            title="레퍼런스 자료"
            description={ `${ referenceImages.length }장. 화면에는 싣지 않고 모델의 근거로만 쓴다. 용도가 기록되지 않은 자료는 그렇게 적었다.` }
          />
          <Grid container spacing={ 3 } sx={ { mb: 6 } }>
            { referenceImages.map((item) => (
              <Grid key={ item.path } size={ { xs: 12, sm: 6, md: 4 } }>
                <ReferenceCell item={ item } />
              </Grid>
            )) }
          </Grid>

          <SectionTitle
            title="구조 논문"
            description="src/assets/reference/paper.md · 버트레스드 코어와 구조 건전성 모니터링을 다룬 리뷰 논문 전문"
          />
        </PageContainer>

        <EditorialDocument source={ paperDocument } />
      </>
    );
  },
};
