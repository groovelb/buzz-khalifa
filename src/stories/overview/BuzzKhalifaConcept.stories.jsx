import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
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
import { BUILDING, WING_ANGLES, TIER_DATA } from '../../data/burjKhalifaData';
import { CONSTRUCTION_STAGES } from '../../data/constructionStages';

export default {
  title: 'Overview/Buzz Khalifa/09 Concept & Flow',
  parameters: { layout: 'padded' },
};

/**
 * 웨비나 슬라이드(cases.js, content.js)에서 옮긴 컨셉.
 * 값은 VDL src/data/presentations/webinar04/cases.js, content.js를 그대로 썼다.
 */
const CONCEPT = {
  experiment: 'Extreme domain learning',
  subtitle: '도메인 영역의 고강도 학습을 통한 재현',
  desc: '고도화된 세계관과 도메인을 리버스 엔지니어링해서 시각화',
  approach: '로직 먼저',
  frame: { name: '메타 학습', oneLiner: '전문가라서가 아닙니다. 필요한 요소를 빨리 파악하고, 심화 리서치하고, AI에 학습시킨 결과입니다' },
  metaLearning: {
    question: '내가 건축을 아는가? 아닙니다.',
    needed: '높이, 날개 각도, 티어, 세트백, 공정 순서처럼 초고층 실루엣을 만드는 조건',
    note: '그 조건들을 심화 리서치해 수치와 규칙으로 정리하고 AI에 학습시킨 결과',
  },
};

/** 흐름 표. doc 은 문서 헤딩, artifact 는 파일 경로, story 는 스토리 id. */
const FLOW_ROWS = [
  {
    stage: '기획',
    decided: '완성 외형이 아닌 건설 공정을 주제로, 여섯 공정을 스크롤 시간축에 배치',
    artifact: 'docs/buzz-khalifa/01-project-summary.md 1·4.2·5절',
    story: 'overview-buzz-khalifa-04-project-structure--default',
    docId: 'overview-buzz-khalifa-01-project-summary--docs',
  },
  {
    stage: 'UX',
    decided: '여섯 공정을 일곱 화면에 배분(조명 공정만 2배), 공정 단계·구조 요소·티어·시간대·사진 다섯 데이터 모델',
    artifact: 'docs/buzz-khalifa/02-ux-flow.md 1·3·5절, src/data/scrollConfig.ts',
    story: 'overview-buzz-khalifa-05-stage-data--default',
    docId: 'overview-buzz-khalifa-02-ux-flow--docs',
  },
  {
    stage: '비주얼 디렉션',
    decided: '청회색 계열 팔레트, 둥근 모서리 조각 형태, 구조 레퍼런스를 3D 모델 근거로 지정',
    artifact: 'docs/buzz-khalifa/03-visual-direction.md 1·3·4절',
    story: 'overview-buzz-khalifa-06-content-data--default',
    docId: 'overview-buzz-khalifa-03-visual-direction--docs',
  },
  {
    stage: '재료 준비',
    decided: `구조 논문과 단면·평면 도판을 읽어 티어 ${ TIER_DATA.length }개 높이표, 날개 세트백 스케줄, 공정 수치로 정리`,
    artifact: 'src/assets/reference (paper.md, 이미지 12장), src/data/burjKhalifaData.ts, constructionStages.ts',
    story: 'overview-buzz-khalifa-08-domain-knowledge-research--default',
  },
  {
    stage: '화면',
    decided: '규칙이 코드가 된 자리: 티어 배열이 세 공정 컴포넌트로, 시간대 상태가 하늘·조명·글자색으로',
    artifact: 'src/components/three/stages/Core.tsx, Setbacks.tsx, Spire.tsx, environment/DayNightCycle.tsx',
    story: 'custom-component-1-building-stages-core--default',
  },
];

/** 증거 표. status 는 '있음' | '파생' | '없음'. */
const EVIDENCE_ROWS = [
  { id: 'G1', item: '01 한 줄 요약, 다루는 대상, 핵심 과업', source: 'docs/buzz-khalifa/01-project-summary.md 1·4.2·5절', status: '있음', note: '' },
  { id: 'G2', item: '02 시나리오, 데이터 모델, 컴포넌트 리스트', source: 'docs/buzz-khalifa/02-ux-flow.md 1·3·5절', status: '있음', note: '컴포넌트 23개(신규 18, 재활용 5) 표' },
  { id: 'G3', item: '03 무드, 토큰 방향, 이미지·에셋 방향 표', source: 'docs/buzz-khalifa/03-visual-direction.md 1·3·4절', status: '있음', note: '' },
  { id: 'G4', item: '03 4절 에셋 방향이 실제 에셋으로 존재', source: 'src/assets/stages(6장), src/assets/reference(12장 + paper.md)', status: '있음', note: '' },
  { id: 'G5', item: '데이터 모델이 실제 데이터 파일로 존재', source: 'src/data/burjKhalifaData.ts, constructionStages.ts, scrollConfig.ts', status: '있음', note: '' },
  { id: 'G6', item: '컴포넌트 리스트가 스토리로 존재', source: 'src/stories/components/*.stories.tsx (18개 프로젝트 전용)', status: '있음', note: '' },
  { id: 'G7', item: '사고 지도 sources·artifact 경로 실존', source: 'VDL src/data/thinking/buzz-khalifa.js', status: '파생', note: '이번 점검에서 옛 구조 경로 다수를 현재 경로로 고쳤다. 삭제된 문서 2건(PRD.md, REMODELING_PLAN.md)은 git 이력으로만 남음' },
  { id: 'E1', item: '도메인 리서치 자료 목록', source: 'src/assets/reference 12장 + paper.md, docs 03 4.1절 레퍼런스 표', status: '있음', note: '용도 미기록 자료도 08 페이지에 그대로 표기' },
  { id: 'E2', item: '리서치에서 뽑은 규칙·수치', source: 'src/data/burjKhalifaData.ts(WING_ANGLES, TIER_DATA, AREA_LEVELS), scrollConfig.ts(PHASES)', status: '있음', note: '' },
  { id: 'E3', item: '규칙이 코드가 된 자리(생성기, 렌더러)', source: 'src/components/three/stages/*.tsx, BuildingModel.tsx, ConstructionScene.tsx', status: '있음', note: '외부 3D 모델 파일(glb/gltf) 없음, 코드가 지오메트리를 생성' },
  { id: 'E4', item: '원작에 있는 것과 프로젝트가 더한 것의 구분', source: 'src/stories/overview/BuzzKhalifaResearch.stories.jsx의 PRD_NOTES(살린 것/바꾼 것/버린 것)', status: '있음', note: '' },
  { id: 'E5', item: '메타 학습 질문의 근거', source: 'cases.js metaLearning, 01 project-summary 4.2·5절, 08 KNOWLEDGE_SETS', status: '있음', note: '' },
  { id: 'E6', item: '학습시킨 자료가 AI 입력으로 들어간 흔적', source: '.claude/CLAUDE.md, .claude/rules/stages.md, .claude/skills/building-modeling/SKILL.md, REFERENCE.md', status: '있음', note: '' },
];

const STATUS_COLOR = { 있음: 'success', 파생: 'info', 없음: 'default' };

/**
 * 리서치 자료 → 규칙 → 코드로 이어진 대응.
 * 08 Research 페이지의 evidenceRows 표와 겹치는 행(단면도 높이, 세 날개 각도, 티어·면적,
 * 공정 기록 수치)은 여기서 다시 적지 않는다. 08에 없는 행(스크롤 구간 배분)만 남긴다.
 */
const RULE_ROWS = [
  { research: '.claude/skills/building-modeling/REFERENCE.md의 공정 경계표', rule: '조명 공정만 2배 구간(0.571~0.857)으로 배분', code: 'src/data/scrollConfig.ts PHASES.UPPER_TOWER, SECTION_HEIGHTS=[1,1,1,1,2,1]' },
];

/** 메타 학습 근거 표. */
const META_ROWS = [
  { needed: '초고층 시공 순서(기초, 코어, 세트백, 커튼월, 첨탑)', learnedFrom: '구조 논문(paper.md), 공개 시공 기록', placedIn: 'docs/buzz-khalifa/01-project-summary.md 4절, constructionStages.ts' },
  { needed: '버트레스드 코어와 나선형 세트백 구조', learnedFrom: 'reference 폴더의 단면도·평면도 12장', placedIn: 'src/data/burjKhalifaData.ts WING_ANGLES, 세트백 스케줄' },
  { needed: `티어 ${ TIER_DATA.length }개의 실제 높이·누적 비율`, learnedFrom: '단면도에서 읽은 707m 대 122m 비율', placedIn: 'src/data/burjKhalifaData.ts TIER_DATA, BUILDING' },
  { needed: '3D 모델링 시 지켜야 할 성능·형태 규칙', learnedFrom: '리팩터 과정에서 굳힌 재질·형태 레시피', placedIn: '.claude/skills/building-modeling/SKILL.md, REFERENCE.md' },
];

/** 슬라이드 사고 지도(thinking/buzz-khalifa.js) 중 이 컨셉과 닿는 결정. */
const THINKING_ROWS = [
  { decision: 'A3', label: '타워를 티어와 날개 수치로 정의', evidence: '외부 3D 모델 없이 WING_ANGLES·TIER_DATA로 실루엣 조건을 코드에 넣음(E3)' },
  { decision: 'A6', label: '실측 비율로 티어 높이 재조정', evidence: '단면도 비율을 BUILDING.TOWER_HEIGHT/SPIRE_HEIGHT로 옮김(08 Research 근거에서 데이터로 표 1행)' },
  { decision: 'A5', label: '조명 공정을 더해 일곱 페이지로', evidence: 'REFERENCE.md Phase Boundaries 표가 scrollConfig.ts PHASES로 코드화(위 규칙 표 1행)' },
  { decision: 'A2', label: '공정 다섯 단계에 20퍼센트씩', evidence: '초고층 시공 순서 조사가 constructionStages.ts 여섯 항목으로(메타 학습 표 1행)' },
];

/**
 * 스토리 링크
 *
 * Props:
 * @param {string} id - 스토리 id (스모크 리포트의 title+storyName을 소문자·하이픈으로 바꾼 값) [Required]
 * @param {node} children - 링크 텍스트 [Required]
 */
function StoryLink({ id, children }) {
  return (
    <a href={ `?path=/story/${ id }` } target="_top" style={ { color: 'inherit' } }>
      { children }
    </a>
  );
}

export const Default = {
  render: () => {
    const spireRatio = ((BUILDING.SPIRE_HEIGHT / BUILDING.TOTAL_HEIGHT) * 100).toFixed(1);

    return (
      <PageContainer>
        <DocumentTitle
          title="09 컨셉과 재료 흐름"
          status="Available"
          note={ `${ CONCEPT.experiment } · ${ CONCEPT.approach }` }
          brandName="Design System"
          systemName="Buzz Khalifa"
          version="1.0"
        />

        <SectionTitle
          title="웨비나 컨셉"
          description="WB4 Part C 실험 C-7. 값은 cases.js, content.js의 표기를 그대로 옮겼다."
        />
        <Box sx={ { p: 2.5, mb: 4, border: '1px solid', borderColor: 'divider', borderRadius: 1 } }>
          <Stack spacing={ 1 }>
            <Typography variant="subtitle1" sx={ { fontWeight: 700 } }>{ CONCEPT.experiment }</Typography>
            <Typography variant="body2" color="text.secondary">{ CONCEPT.subtitle }</Typography>
            <Typography variant="body2" color="text.secondary">{ CONCEPT.desc }</Typography>
            <Stack direction="row" spacing={ 1 }>
              <Chip size="small" label={ `갈래: ${ CONCEPT.approach }` } />
              <Chip size="small" label={ `프레임: ${ CONCEPT.frame.name }` } />
            </Stack>
            <Typography variant="body2" color="text.secondary">{ CONCEPT.frame.oneLiner }</Typography>
            <Typography variant="body2" sx={ { fontStyle: 'italic' } }>
              { `"${ CONCEPT.metaLearning.question }" ${ CONCEPT.metaLearning.needed }를 ${ CONCEPT.metaLearning.note }` }
            </Typography>
            <Typography variant="body2" sx={ { mt: 1 } }>
              이 예제가 이 컨셉의 증거인 이유: 프로젝트는 외부 3D 모델 파일(glb/gltf)을 쓰지 않고
              <code> src/data/burjKhalifaData.ts </code>의 WING_ANGLES와 TIER_DATA로 실루엣을 생성한다.
              그 수치는 <code>src/assets/reference</code>의 단면도·평면도·구조 논문을 읽어 얻었고,
              단면도의 707m 대 122m 비율은 지금 코드의 { BUILDING.TOWER_HEIGHT } 대 { BUILDING.SPIRE_HEIGHT }
              (첨탑 { spireRatio }%)로 재조정됐다(A6, 사고 지도 returns).
            </Typography>
          </Stack>
        </Box>

        <SectionTitle
          title="흐름: 기획에서 화면까지"
          description="다섯 단계마다 정한 것, 남긴 산출물, 보는 곳."
        />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 100 } }>단계</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>여기서 정한 것</TableCell>
                <TableCell sx={ { fontWeight: 600, width: '28%' } }>남긴 것</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 140 } }>보는 곳</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { FLOW_ROWS.map((row) => (
                <TableRow key={ row.stage }>
                  <TableCell sx={ { fontSize: 13, fontWeight: 600 } }>{ row.stage }</TableCell>
                  <TableCell sx={ { fontSize: 13 } }>{ row.decided }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 11, color: 'text.secondary' } }>
                    { row.artifact }
                  </TableCell>
                  <TableCell sx={ { fontSize: 12 } }>
                    <StoryLink id={ row.story }>스토리</StoryLink>
                    { row.docId ? (
                      <>
                        { ' · ' }
                        <StoryLink id={ row.docId }>문서</StoryLink>
                      </>
                    ) : null }
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle
          title="컨셉 증거"
          description="공통(G1~G7)과 C-7 전용(E1~E6) 항목."
        />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 50 } }>항목</TableCell>
                <TableCell sx={ { fontWeight: 600, width: '30%' } }>저장소 근거</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 80 } }>상태</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>비고</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { EVIDENCE_ROWS.map((row) => (
                <TableRow key={ row.id }>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ row.id }</TableCell>
                  <TableCell sx={ { fontSize: 12, fontFamily: 'monospace', color: 'text.secondary' } }>
                    { row.source }
                  </TableCell>
                  <TableCell>
                    <Chip size="small" color={ STATUS_COLOR[row.status] } label={ row.status } />
                  </TableCell>
                  <TableCell sx={ { fontSize: 12 } }>{ row.note }</TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle
          title="리서치 자료 → 규칙 → 코드"
          description="조사에서 읽은 것이 어느 규칙을 거쳐 어느 상수·데이터로 굳었는지."
        />
        <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
          단면도 높이, 세 날개 각도, 티어·면적, 공정 기록 수치의 근거는
          {' '}<StoryLink id="overview-buzz-khalifa-08-domain-knowledge-research--default">08 Research 페이지</StoryLink>의
          "근거에서 데이터로" 표에 이미 있어 여기서 다시 적지 않는다. 그 표에 없는 행만 아래에 남긴다.
        </Typography>
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: '30%' } }>리서치에서 읽은 것</TableCell>
                <TableCell sx={ { fontWeight: 600, width: '30%' } }>규칙</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>코드</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { RULE_ROWS.map((row) => (
                <TableRow key={ row.research }>
                  <TableCell sx={ { fontSize: 12 } }>{ row.research }</TableCell>
                  <TableCell sx={ { fontSize: 12 } }>{ row.rule }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 11, color: 'text.secondary' } }>
                    { row.code }
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle
          title="메타 학습 근거"
          description="필요했던 요소, 어디서 배웠나, 어디에 넣었나."
        />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: '32%' } }>필요했던 요소</TableCell>
                <TableCell sx={ { fontWeight: 600, width: '32%' } }>어디서 배웠나</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>어디에 넣었나</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { META_ROWS.map((row) => (
                <TableRow key={ row.needed }>
                  <TableCell sx={ { fontSize: 12 } }>{ row.needed }</TableCell>
                  <TableCell sx={ { fontSize: 12 } }>{ row.learnedFrom }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 11, color: 'text.secondary' } }>
                    { row.placedIn }
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle
          title="없는 것"
          description="저장소에 없어 확인 못 한 항목."
        />
        <Box component="ul" sx={ { mb: 4, pl: 3 } }>
          <Box component="li" sx={ { mb: 0.5 } }>
            <Typography variant="body2" color="text.secondary">
              PRD.md, REMODELING_PLAN.md: 리팩터로 삭제됐고 대체 문서(01, 02)에도 원문 그대로는 없다.
              08 Research 페이지의 PRD_NOTES가 살린 것·바꾼 것·버린 것으로 요약해 갈음한다.
            </Typography>
          </Box>
          <Box component="li" sx={ { mb: 0.5 } }>
            <Typography variant="body2" color="text.secondary">
              git log 커밋 3개(dbb67de, ea35e94, acd473d): 파일이 아니라 커밋 참조라 경로 검사 대상이 아니다.
              사고 지도 order 필드의 근거로만 쓰였다.
            </Typography>
          </Box>
        </Box>

        <SectionTitle
          title="슬라이드 사고 지도 대응"
          description="VDL thinking/buzz-khalifa.js의 결정 중 이 컨셉과 닿는 자리."
        />
        <TableContainer sx={ { mb: 2 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 60 } }>결정</TableCell>
                <TableCell sx={ { fontWeight: 600, width: '30%' } }>라벨</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>이 페이지의 근거</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { THINKING_ROWS.map((row) => (
                <TableRow key={ row.decision }>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ row.decision }</TableCell>
                  <TableCell sx={ { fontSize: 12 } }>{ row.label }</TableCell>
                  <TableCell sx={ { fontSize: 12, color: 'text.secondary' } }>{ row.evidence }</TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" color="text.secondary">
          이 페이지의 모든 표는 저장소의 문서·데이터·스크립트에서 파생했다. 저장소 밖 자료는 쓰지 않았다.
          공정 { CONSTRUCTION_STAGES.length }개, 세 날개 { WING_ANGLES.length }개, 티어 { TIER_DATA.length }켜의
          수치는 import한 데이터에서 계산했다.
        </Typography>
      </PageContainer>
    );
  },
};
