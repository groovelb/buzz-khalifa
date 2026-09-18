import React from 'react';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
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
import {
  BUILDING,
  COLORS,
  TIER_DATA,
  WING_ANGLES,
  getSetbackSchedules,
  getTiersByPhase,
} from '../../data/burjKhalifaData';
import { CONSTRUCTION_STAGES } from '../../data/constructionStages';
import {
  DAY_NIGHT_TIMING,
  PHASES,
  SCENE_TIMING,
  SCROLL_CONFIG,
  SECTION_HEIGHTS,
} from '../../data/scrollConfig';
import buildingModelRaw from '../../components/three/BuildingModel.tsx?raw';

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

/** 세트백 스케줄과 면적 레벨. 손으로 적지 않고 데이터 파일에서 읽는다. */
const SETBACKS = getSetbackSchedules();

/** 진행도 구간을 읽기 쉬운 문자열로. 예: 0.286 ~ 0.429 */
const rangeText = (phase) => `${ phase.start } ~ ${ phase.end }`;

/**
 * 의사결정 흐름 격자의 열. "로직 먼저" 갈래라 리서치에서 코드까지가 앞에 온다.
 * story 가 있으면 열 머리에서 해당 스토리로 간다.
 */
const STAGES = [
  { key: 'research', label: '리서치', doc: 'src/assets/reference', story: 'overview-buzz-khalifa-08-domain-knowledge-research--default' },
  { key: 'number', label: '수치', doc: 'src/data/burjKhalifaData.ts', story: 'overview-buzz-khalifa-05-stage-data--default' },
  { key: 'rule', label: '규칙', doc: '생성 함수·상수' },
  { key: 'code', label: '코드', doc: 'src/components/three', story: 'custom-component-3-scene-buildingmodel--default' },
  { key: 'visual', label: '비주얼 디렉션', doc: '03 문서', story: 'overview-buzz-khalifa-03-visual-direction--docs' },
  { key: 'screen', label: '화면', doc: 'src/data/scrollConfig.ts', story: 'overview-buzz-khalifa-06-content-data--default' },
];

/**
 * 격자의 행. 스레드 하나가 결정 하나의 전파 경로다.
 * 라벨은 한 줄, 근거(문서 절·파일·함수명)는 ref 에 둔다. null 은 그 단계에 결정이 없다는 뜻.
 * 수치는 데이터 파일에서 읽어 넣는다.
 */
const FLOW_THREADS = [
  {
    key: 'height', name: '높이·티어', stripe: COLORS.SPINE,
    nodes: [
      { label: '단면도의 누적 높이(타워 707m, 첨탑 122m)', ref: 'reference/e5109a08....jpg, 08 Research' },
      { label: `타워 ${ BUILDING.TOWER_HEIGHT } · 첨탑 ${ BUILDING.SPIRE_HEIGHT } · 전체 ${ BUILDING.TOTAL_HEIGHT }`, ref: 'BUILDING.TOWER_HEIGHT / SPIRE_HEIGHT' },
      { label: `아래가 높고 위가 낮은 ${ TIER_DATA.length }켜, ${ TIER_DATA[0].height }에서 ${ TIER_DATA[TIER_DATA.length - 1].height }까지`, ref: 'generateModuleBasedTiers() tierHeights' },
      { label: '누적 높이는 코어 위에서 다시 쌓는다', ref: 'getTierPositions(), getTowerTopY()' },
      { label: '원근을 빼고 높이를 비교하게 한다', ref: '03 1절 무드, 3.3 투영' },
      { label: `완성 장면까지 타워가 ${ SCENE_TIMING.buildingTravel }만큼 올라온다`, ref: 'SCENE_TIMING.buildingTravel' },
    ],
  },
  {
    key: 'wing', name: '날개·세트백', stripe: COLORS.GLASS,
    nodes: [
      { label: 'Y자 평면과 층별 평면 변화 도판', ref: 'reference/images (1)·(3).jpeg, 08 Research' },
      { label: `날개 각도 ${ WING_ANGLES.join(' / ') }, 면적 ${ SETBACKS.areaLevels.length }단계`, ref: 'WING_ANGLES, AREA_LEVELS' },
      { label: '세 날개가 서로 다른 높이에서 계단식으로 물러선다', ref: 'getWingLevelAtHeight(WING_A/B/C_SETBACK_HEIGHTS)' },
      { label: '날개마다 길이·폭을 따로 써서 나선 실루엣을 만든다', ref: 'Setbacks.tsx tier.wingLengths[wingIndex]' },
      { label: `둥근 모서리는 필요한 만큼만, 콘크리트는 무광(${ COLORS.CONCRETE })`, ref: '03 3.3 형태·표면, COLORS.CONCRETE' },
      { label: '세트백은 III·IV·V 세 구간에 나뉘어 보인다', ref: 'PHASES.LOWER / MID / UPPER_TOWER' },
    ],
  },
  {
    key: 'sequence', name: '공정 순서', stripe: COLORS.FOUNDATION_DARK,
    nodes: [
      { label: `현장 기록 사진 ${ CONSTRUCTION_STAGES.length }장이 준 공정 순서`, ref: 'src/assets/stages/1~6.jpeg, 08 Research' },
      { label: `공정 ${ CONSTRUCTION_STAGES.length }개의 제목·기술 노트·수치`, ref: 'CONSTRUCTION_STAGES[].measurement' },
      { label: `구간 길이를 [${ SECTION_HEIGHTS.join(', ') }]로 두어 조명만 두 배`, ref: 'SECTION_HEIGHTS, PHASES.UPPER_TOWER' },
      { label: '공정마다 구간 안에서 국소 진행도를 만든다', ref: 'stages/*.tsx localProgress' },
      { label: '글자와 사진은 공정이 선 뒤에 등장한다', ref: '03 3.3 진행도 기반 reveal' },
      { label: `스크롤 ${ SCROLL_CONFIG.pages }페이지에 구간 ${ Object.keys(PHASES).length }개`, ref: 'SCROLL_CONFIG.pages, PHASES' },
    ],
  },
  {
    key: 'daynight', name: '낮·밤', stripe: COLORS.EDGE_FIN,
    nodes: [
      null,
      { label: `석양 ${ DAY_NIGHT_TIMING.sunsetStart }, 황혼 ${ DAY_NIGHT_TIMING.twilightStart }, 완전한 밤 ${ DAY_NIGHT_TIMING.fullNight }`, ref: 'DAY_NIGHT_TIMING' },
      { label: '진행도 하나에서 낮·밤 강도와 조명색을 파생한다', ref: 'useDayNight.ts getDayNightState()' },
      { label: '하늘·태양·달과 창 발광이 같은 상태를 읽는다', ref: 'DayNightCycle.tsx, stages/*.tsx windowGlowIntensity' },
      { label: `하늘은 dawn부터 night까지, 유리는 깊은 청회색(${ COLORS.GLASS })`, ref: '03 3.1 색 팔레트, COLORS.GLASS' },
      { label: `${ DAY_NIGHT_TIMING.sunsetStart }부터 해가 지기 시작해 마지막 구간이 밤이다`, ref: `PHASES.SPIRE ${ rangeText(PHASES.SPIRE) }` },
    ],
  },
];

/** 공정 스테이지 컴포넌트 이름. BuildingModel.tsx 가 그리는 순서를 원문에서 읽는다. */
const STAGE_COMPONENTS = Array.from(buildingModelRaw.matchAll(/<([A-Z][A-Za-z]+) \/>/g)).map((match) => match[1]);

/** 스테이지 컴포넌트 원문. 블록 라벨을 손으로 적지 않고 코드에서 줄을 꺼낸다. */
const STAGE_SOURCES = import.meta.glob(
  '../../components/three/stages/*.tsx',
  { eager: true, query: '?raw', import: 'default' },
);

/**
 * 컴포넌트 이름으로 원문을 찾는다.
 *
 * @param {string} name - 컴포넌트 이름 (예: 'Setbacks')
 * @returns {string} 해당 파일 원문. 없으면 빈 문자열
 */
function sourceOf(name) {
  const key = Object.keys(STAGE_SOURCES).find((path) => path.endsWith(`/${ name }.tsx`));
  return key ? STAGE_SOURCES[key] : '';
}

/** 다이어그램이 예시로 펼쳐 보이는 스테이지. 티어·날개 규칙이 모두 나타나는 공정을 골랐다. */
const SAMPLE_COMPONENT = 'Setbacks';

/**
 * 템플릿 블록 규칙. 스테이지 컴포넌트 원문에서 이 정규식에 맞는 줄을 블록 하나로 본다.
 * slot 이 있는 블록은 스테이지마다 값이 바뀌고, 없는 블록은 규칙 자체가 같다.
 */
const BLOCK_RULES = [
  { key: 'progress', test: /useBuildingProgress\(\)/, label: '진행도 구독' },
  { key: 'phase', test: /PHASES\.[A-Z_]+/, label: '구간 경계 읽기', slot: 'PHASES.{구간}' },
  { key: 'visible', test: /isVisible = offset/, label: '구간에 닿기 전에는 숨긴다' },
  { key: 'local', test: /localProgress = Math\.max/, label: '구간 안 국소 진행도 0..1' },
  { key: 'material', test: /new THREE\.MeshStandardMaterial\(\{/, label: '재질은 COLORS 상수 + roughness·metalness', slot: 'COLORS.{재질}' },
  { key: 'tiers', test: /const tiers = useMemo\(\(\) => getTiersByPhase\(/, label: '이 구간이 맡은 티어 묶음', slot: 'getTiersByPhase({phase})' },
  { key: 'delay', test: /getTierAnimationDelay\(/, label: '티어가 아래부터 차례로 선다' },
  { key: 'smooth', test: /MathUtils\.smoothstep\(/, label: '등장 스케일은 스무스스텝' },
  { key: 'daynight', test: /getDayNightState\(offset\)/, label: '같은 진행도에서 낮·밤 상태' },
  { key: 'glow', test: /windowGlowIntensity/, label: '밤이면 창이 발광한다' },
  { key: 'wings', test: /WING_ANGLES\.map\(/, label: '세 날개를 120도씩 회전' },
  { key: 'wingdim', test: /tier\.wingLengths\[wingIndex\]/, label: '날개 길이·폭은 티어 행에서' },
  { key: 'label', test: /labelRef\.current\.style\.opacity/, label: '구간 라벨이 뜨는 진행도 창', slot: '{시작} ~ {끝}' },
  { key: 'html', test: /Phase 0\d:/, label: '구간 라벨 문구', slot: 'Phase 0N: {제목}' },
];

/**
 * 규칙마다 예시 줄과 적용 파일 수를 계산한다. 숫자를 적지 않고 원문에서 센다.
 *
 * @param {object[]} rules - BLOCK_RULES [Required]
 * @param {string[]} components - 스테이지 컴포넌트 이름 목록 [Required]
 * @param {string} sample - 예시로 펼칠 컴포넌트 이름 [Required]
 * @returns {object[]} { key, label, slot, line, used, total } 목록
 */
function toBlocks(rules, components, sample) {
  const order = [sample, ...components.filter((name) => name !== sample)];
  return rules.map((rule) => {
    const used = components.filter((name) => sourceOf(name).split('\n').some((line) => rule.test.test(line)));
    const source = order.find((name) => rule.test.test(sourceOf(name)));
    const line = source ? sourceOf(source).split('\n').find((text) => rule.test.test(text)).trim() : '';
    return { ...rule, line, used: used.length, total: components.length };
  });
}

const BLOCKS = toBlocks(BLOCK_RULES, STAGE_COMPONENTS, SAMPLE_COMPONENT);

/**
 * 스테이지마다 바뀌는 슬롯 값. 컴포넌트 원문과 데이터에서 읽는다.
 * CONSTRUCTION_STAGES 와 컴포넌트는 BuildingModel.tsx 의 그리는 순서대로 짝을 이룬다.
 */
const STAGE_SLOTS = STAGE_COMPONENTS.map((name, index) => {
  const raw = sourceOf(name);
  const phaseKey = (raw.match(/PHASES\.([A-Z_]+)/) || [])[1] || '';
  const tierPhase = (raw.match(/const tiers = useMemo\(\(\) => getTiersByPhase\((\d)\)/) || [])[1];
  const stage = CONSTRUCTION_STAGES[index];
  return {
    name,
    phaseKey,
    range: PHASES[phaseKey] ? rangeText(PHASES[phaseKey]) : '',
    tierCount: tierPhase ? getTiersByPhase(Number(tierPhase)).length : 0,
    number: stage ? stage.number : '',
    title: stage ? stage.title : '',
    measurement: stage ? stage.measurement : '',
    image: stage ? stage.image : '',
  };
});

const SAMPLE_SLOT = STAGE_SLOTS.find((slot) => slot.name === SAMPLE_COMPONENT) || STAGE_SLOTS[0];

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

/** 슬라이드 사고 지도(thinking/buzz-khalifa.js) 중 이 컨셉과 닿는 결정. */
const THINKING_ROWS = [
  { decision: 'A3', label: '타워를 티어와 날개 수치로 정의', evidence: '격자 날개·세트백 스레드: WING_ANGLES와 TIER_DATA가 규칙 칸을 거쳐 코드 칸으로 간다' },
  { decision: 'A6', label: '실측 비율로 티어 높이 재조정', evidence: '격자 높이·티어 스레드의 리서치 칸에서 수치 칸으로(단면도 비율이 BUILDING 상수로)' },
  { decision: 'A5', label: '조명 공정을 더해 일곱 페이지로', evidence: `격자 공정 순서 스레드의 규칙 칸: SECTION_HEIGHTS [${ SECTION_HEIGHTS.join(', ') }]` },
  { decision: 'A2', label: '공정 다섯 단계에 20퍼센트씩', evidence: `템플릿 구성의 반복 횟수: CONSTRUCTION_STAGES ${ CONSTRUCTION_STAGES.length }개로 늘어난 자리` },
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

/**
 * 격자 셀 하나. 결정 라벨과 근거를 짧게 보여 준다.
 *
 * Props:
 * @param {object} node - { label, ref } 또는 null [Optional, 기본값: null]
 * @param {string} stripe - 스레드 색 [Required]
 */
function FlowCell({ node, stripe }) {
  if (!node) {
    return <Box sx={ { minHeight: 64, border: 1, borderStyle: 'dashed', borderColor: 'divider', opacity: 0.5 } } />;
  }
  return (
    <Box sx={ { minHeight: 64, borderLeft: 4, borderColor: stripe, bgcolor: 'background.paper', px: 1, py: 0.75, boxShadow: 1 } }>
      <Typography variant="caption" component="div" sx={ { fontWeight: 600, lineHeight: 1.3 } }>{ node.label }</Typography>
      <Typography variant="caption" component="div" color="text.secondary" sx={ { fontFamily: 'monospace', fontSize: 10 } }>
        { node.ref }
      </Typography>
    </Box>
  );
}

/**
 * 템플릿 블록 하나. 슬롯이 있으면 채운 색, 없으면 외곽선(규칙 고정).
 *
 * Props:
 * @param {object} block - { label, slot, line, used, total } [Required]
 */
function TemplateBlock({ block }) {
  const isSlot = Boolean(block.slot);
  return (
    <Box
      title={ block.line }
      sx={ {
        px: 1, py: 0.5, mb: 0.5,
        border: 1, borderColor: isSlot ? COLORS.SPINE : 'divider',
        bgcolor: isSlot ? COLORS.SPINE : 'transparent',
        color: isSlot ? 'common.white' : 'text.primary',
      } }
    >
      <Stack direction="row" spacing={ 1 } alignItems="baseline" justifyContent="space-between">
        <Typography variant="caption" sx={ { fontWeight: isSlot ? 700 : 500 } }>
          { block.label }{ isSlot ? ' ' : '' }
          { isSlot && <Box component="span" sx={ { fontFamily: 'monospace' } }>{ block.slot }</Box> }
        </Typography>
        <Typography variant="caption" sx={ { fontSize: 10, opacity: 0.8, whiteSpace: 'nowrap', fontFamily: 'monospace' } }>
          { block.used }/{ block.total } 파일
        </Typography>
      </Stack>
    </Box>
  );
}

/**
 * 템플릿 한 벌: 입력 → 규칙 블록 스택 → 출력.
 *
 * Props:
 * @param {string} title - 템플릿 이름 [Required]
 * @param {string} repeat - 반복 횟수 설명 [Required]
 * @param {array} inputs - 왼쪽 입력 목록 [Required]
 * @param {array} blocks - TemplateBlock 목록 [Required]
 * @param {object} output - { image, number, title, range, tierCount, measurement } [Required]
 */
function TemplateStack({ title, repeat, inputs, blocks, output }) {
  return (
    <Grid container spacing={ 2 } alignItems="stretch">
      <Grid size={ { xs: 12, md: 3 } }>
        <Typography variant="overline" color="text.secondary">입력</Typography>
        { inputs.map((text) => (
          <Typography key={ text } variant="caption" component="div" sx={ { fontFamily: 'monospace', py: 0.25, lineHeight: 1.4 } }>
            { text }
          </Typography>
        )) }
      </Grid>
      <Grid size={ { xs: 12, md: 6 } }>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline">
          <Typography variant="overline" color="text.secondary">{ title }</Typography>
          <Typography variant="caption" color="text.secondary">{ repeat }</Typography>
        </Stack>
        { blocks.map((block) => <TemplateBlock key={ block.key } block={ block } />) }
      </Grid>
      <Grid size={ { xs: 12, md: 3 } }>
        <Typography variant="overline" color="text.secondary">출력</Typography>
        <Box
          component="img"
          src={ output.image }
          alt={ `${ output.number } ${ output.title }` }
          sx={ { width: '100%', maxWidth: 200, aspectRatio: '4 / 3', objectFit: 'cover', bgcolor: 'grey.100', display: 'block' } }
        />
        <Typography variant="caption" component="div" sx={ { fontWeight: 600, mt: 0.5 } }>
          { output.number } { output.title }
        </Typography>
        <Typography variant="caption" component="div" color="text.secondary" sx={ { fontFamily: 'monospace', fontSize: 10 } }>
          { output.phaseKey } { output.range }
        </Typography>
        <Typography variant="caption" component="div" color="text.secondary" sx={ { fontFamily: 'monospace', fontSize: 10 } }>
          { output.tierCount > 0 ? `티어 ${ output.tierCount }켜 · ` : '' }{ output.measurement }
        </Typography>
      </Grid>
    </Grid>
  );
}

/**
 * 스테이지 하나의 슬롯 값 카드. 같은 템플릿이 스테이지마다 무엇으로 채워지는지 보여 준다.
 *
 * Props:
 * @param {object} slot - STAGE_SLOTS 항목 [Required]
 */
function StageSlotCard({ slot }) {
  return (
    <Box sx={ { border: 1, borderColor: 'divider', p: 1, height: '100%' } }>
      <Box
        component="img"
        src={ slot.image }
        alt={ `${ slot.number } ${ slot.title }` }
        sx={ { width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', bgcolor: 'grey.100', display: 'block', mb: 0.5 } }
      />
      <Typography variant="caption" component="div" sx={ { fontWeight: 700 } }>
        { slot.number } { slot.title }
      </Typography>
      <Typography variant="caption" component="div" color="text.secondary" sx={ { fontFamily: 'monospace', fontSize: 10 } }>
        { slot.name }.tsx
      </Typography>
      <Typography variant="caption" component="div" color="text.secondary" sx={ { fontFamily: 'monospace', fontSize: 10 } }>
        { slot.phaseKey } { slot.range }
      </Typography>
      <Typography variant="caption" component="div" color="text.secondary" sx={ { fontFamily: 'monospace', fontSize: 10 } }>
        { slot.tierCount > 0 ? `티어 ${ slot.tierCount }켜` : '티어 없음' }
      </Typography>
    </Box>
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
              지면이 다루는 대상과 과업은{ ' ' }
              <StoryLink id="overview-buzz-khalifa-01-project-summary--docs">01 문서</StoryLink>의 1·4.2·5절에 있다.
            </Typography>
          </Stack>
        </Box>

        <SectionTitle
          title="의사결정 흐름"
          description="왼쪽 결정이 오른쪽 값이 된다. 로직 먼저 갈래라 리서치에서 코드까지가 앞에 온다"
        />
        <Box sx={ { overflowX: 'auto', mb: 1 } }>
          <Box sx={ { display: 'grid', gridTemplateColumns: '84px repeat(6, minmax(160px, 1fr))', columnGap: 1, rowGap: 1, minWidth: 1100 } }>
            <Box />
            { STAGES.map((stage) => (
              <Box key={ stage.key } sx={ { borderBottom: 2, borderColor: COLORS.SPINE, pb: 0.5 } }>
                <Typography variant="subtitle2">{ stage.label }</Typography>
                <Typography variant="caption" component="div" color="text.secondary" sx={ { fontFamily: 'monospace', fontSize: 10 } }>
                  { stage.story ? <StoryLink id={ stage.story }>{ stage.doc }</StoryLink> : stage.doc }
                </Typography>
              </Box>
            )) }
            { FLOW_THREADS.map((thread) => (
              <React.Fragment key={ thread.key }>
                <Box sx={ { display: 'flex', alignItems: 'center' } }>
                  <Typography variant="subtitle2" sx={ { color: thread.stripe } }>{ thread.name }</Typography>
                </Box>
                { thread.nodes.map((node, index) => (
                  <FlowCell key={ `${ thread.key }-${ STAGES[index].key }` } node={ node } stripe={ thread.stripe } />
                )) }
              </React.Fragment>
            )) }
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" component="div" sx={ { mb: 4 } }>
          점선 칸은 그 단계에 결정이 없다는 뜻이다(낮·밤은 리서치 자료 없이 진행도 규칙에서 나왔다).
          이 저장소에는 createTheme 테마가 없어 색 토큰 자리를 burjKhalifaData.ts의 COLORS 상수가 대신한다. 수치는 모두 데이터 파일에서 읽었다.
        </Typography>

        <SectionTitle
          title="템플릿 구성"
          description="반복 단위는 공정 하나다. 외곽선 블록은 스테이지마다 같은 규칙, 채운 블록은 값이 바뀌는 슬롯"
        />
        <Box sx={ { mb: 2 } }>
          <TemplateStack
            title="공정 스테이지 컴포넌트"
            repeat={ `× ${ CONSTRUCTION_STAGES.length } 스테이지` }
            inputs={ [
              `constructionStages.ts: 제목 · 기술 노트 · 수치 · 사진 (${ CONSTRUCTION_STAGES.length }행)`,
              `scrollConfig.ts PHASES: 구간 시작·끝 (${ Object.keys(PHASES).length }개)`,
              `burjKhalifaData.ts TIER_DATA: 높이 · 날개 길이 · 날개 폭 (${ TIER_DATA.length }켜)`,
              `burjKhalifaData.ts BUILDING: 전체 ${ BUILDING.TOTAL_HEIGHT } · 코어 ${ BUILDING.CORE_HEIGHT } · 날개 ${ BUILDING.BASE_WING_LENGTH.toFixed(1) }`,
              `burjKhalifaData.ts WING_ANGLES: ${ WING_ANGLES.join(' / ') }`,
              'burjKhalifaData.ts COLORS: 콘크리트 · 유리 · 금속 재질색',
            ] }
            blocks={ BLOCKS }
            output={ SAMPLE_SLOT }
          />
        </Box>
        <Stack direction="row" spacing={ 2 } sx={ { mb: 3 } }>
          <Chip size="small" variant="outlined" label="고정 블록: 스테이지마다 같은 규칙" />
          <Chip size="small" sx={ { bgcolor: COLORS.SPINE, color: 'common.white' } } label="슬롯: 스테이지마다 값이 바뀜" />
          <Chip size="small" variant="outlined" label="n/6 파일: 그 규칙을 쓰는 스테이지 수" />
        </Stack>

        <Typography variant="overline" color="text.secondary" component="div">
          슬롯 값 × { STAGE_SLOTS.length } 스테이지
        </Typography>
        <Grid container spacing={ 1 } sx={ { mb: 1 } }>
          { STAGE_SLOTS.map((slot) => (
            <Grid key={ slot.name } size={ { xs: 6, sm: 4, md: 2 } }>
              <StageSlotCard slot={ slot } />
            </Grid>
          )) }
        </Grid>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
          블록 라벨과 예시 줄은 stages 폴더의 컴포넌트 원문에서 꺼냈고(블록에 마우스를 올리면 원문 줄이 보인다),
          스테이지와 컴포넌트의 짝·순서는 BuildingModel.tsx가 그리는 순서에서 읽었다. 데이터 모델 이름은{ ' ' }
          <StoryLink id="overview-buzz-khalifa-02-ux-flow--docs">02 문서</StoryLink> 3.1절,
          스테이지별 코드는{ ' ' }
          <StoryLink id="custom-component-1-building-stages-setbacks--default">Building Stages</StoryLink> 스토리에 있다.
        </Typography>

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
          <Box component="li" sx={ { mb: 0.5 } }>
            <Typography variant="body2" color="text.secondary">
              낮·밤 연출의 리서치 자료: reference 폴더에 해당 자료가 없다. 격자의 낮·밤 스레드 리서치 칸을 빈칸으로 뒀다.
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
          이 페이지의 두 도식과 표는 저장소의 문서·데이터·코드 원문에서 파생했다. 저장소 밖 자료는 쓰지 않았다.
          공정 { CONSTRUCTION_STAGES.length }개, 세 날개 { WING_ANGLES.length }개, 티어 { TIER_DATA.length }켜의
          수치는 import한 데이터에서 계산했다.
        </Typography>
      </PageContainer>
    );
  },
};
