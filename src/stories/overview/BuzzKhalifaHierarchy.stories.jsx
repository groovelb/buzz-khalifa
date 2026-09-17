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
  TreeNode,
} from '../../components/storybookDocumentation';
import projectStructure from '../../data/projectStructure.js';
import { ASSEMBLY_STEPS } from './assemblySteps.js';

export default {
  title: 'Custom Component/0. Hierarchy',
  parameters: {
    layout: 'padded',
  },
};

/** 스토리가 없는 노드와 그 이유. 지금은 App 하나뿐이다. */
const NO_STORY_REASON = {
  App: '페이지 스토리(Page/Buzz Khalifa)가 이 컴포넌트다',
};

/** 트리에 나타나지 않는 파일과 그 이유 */
const OFF_TREE = [
  {
    name: 'CinematicCamera',
    reason: '어디에서도 import 되지 않는 미사용 파일. 스토리는 카메라 경로만 보여 준다',
    storyId: 'custom-component-2-environment-camera-cinematiccamera--default',
  },
];

/** 분류 표시 순서 */
const GROUP_ORDER = ['Page', 'Template', 'Section', 'Custom Component', '스토리 없음'];

/** Context 모듈은 하위를 펼치지 않고 리프로 둔다. */
const isContextName = (name) => /Context$/.test(name);

/** projectStructure 의 storyId 는 제목 슬러그다. 링크에는 스토리 이름까지 필요하다. */
const toStoryPath = (storyId) => (storyId.includes('--') ? storyId : `${ storyId }--default`);

/** title 첫 마디가 분류다. 스토리가 없으면 "스토리 없음". */
const groupOf = (node) => (node.storyTitle ? node.storyTitle.split('/')[0] : '스토리 없음');

/** 트리에서 컴포넌트 노드만 깊이 우선으로 모은다. 같은 이름은 한 번만 센다. */
function collectComponents(node, depth = 0, seen = new Map()) {
  if (!seen.has(node.name)) {
    seen.set(node.name, {
      name: node.name,
      file: node.file,
      depth,
      storyTitle: node.storyTitle,
      storyId: node.storyId,
    });
  }
  if (!isContextName(node.name)) {
    for (const child of node.children || []) {
      if (child.ref) continue;
      collectComponents(child, depth + 1, seen);
    }
  }
  return seen;
}

/** 노드 하나를 TreeNode 가 읽는 값으로. 리프는 분류 라벨 문자열이다. */
function nodeToTree(node) {
  const label = node.storyTitle || NO_STORY_REASON[node.name] || '스토리 없음';
  const children = isContextName(node.name) ? [] : node.children || [];

  if (children.length === 0) {
    return label;
  }

  const out = { '(분류)': label };
  const nameCount = {};
  for (const child of children) {
    // 다른 가지에서 이미 펼친 파일은 참조 리프로만 표시한다
    if (child.ref) {
      out[child.name + ' (참조)'] = '이미 펼친 가지';
      continue;
    }
    let key = child.name;
    if (nameCount[key] !== undefined) {
      nameCount[key] += 1;
      key = `${ child.name }#${ nameCount[key] }`;
    } else {
      nameCount[key] = 0;
    }
    out[key] = nodeToTree(child);
  }
  return out;
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

/** 분류 위계: 페이지에서 컴포넌트까지, 그리고 조립 순서 */
export const Default = {
  render: () => {
    const root = projectStructure.root;
    const tree = nodeToTree(root);
    const components = [...collectComponents(root).values()];

    const groupCounts = GROUP_ORDER.map((group) => ({
      group,
      items: components.filter((component) => groupOf(component) === group),
    }));

    return (
      <>
        <DocumentTitle
          title="Hierarchy"
          status="Available"
          note="Page · Template · Section · Custom Component 분류와 조립 순서"
          brandName="Design System"
          systemName="Buzz Khalifa"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Hierarchy
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
            <code>src/data/projectStructure.js</code> · 재생성: <code>pnpm generate-structure</code>
          </Typography>

          <SectionTitle
            title="조립 순서"
            description="리서치에서 페이지까지 여섯 단계. 08 Domain Knowledge & Research 와 같은 목록을 쓴다."
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
            title="분류별 수"
            description={ `트리에 등장하는 컴포넌트 ${ components.length }개를 스토리 분류로 나눈 수` }
          />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: 180 } }>분류</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 80 } }>수</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>컴포넌트</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { groupCounts.map((row) => (
                  <TableRow key={ row.group }>
                    <TableCell sx={ { fontSize: 13, fontWeight: 600 } }>{ row.group }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ row.items.length }</TableCell>
                    <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>
                      { row.items.map((item) => item.name).join(', ') || '없음' }
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle
            title="포함 관계 트리"
            description="App 을 루트로 페이지 → 템플릿 → 섹션 → 컴포넌트, 그리고 장면 → 모델 → 공정 순서다. 각 노드의 (분류) 줄이 스토리 제목을 알려준다."
          />
          <Box sx={ { p: 2, mb: 4, border: '1px solid', borderColor: 'divider', borderRadius: 1 } }>
            <Box sx={ { fontFamily: 'monospace' } }>
              <TreeNode keyName={ root.name } value={ tree } depth={ 0 } defaultOpen />
            </Box>
          </Box>

          <SectionTitle
            title="스토리 바로가기"
            description="트리와 같은 순서. 스토리가 있는 노드는 링크로, 없는 노드는 이유와 함께 적는다."
          />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: 220 } }>컴포넌트</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 130 } }>분류</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>스토리 또는 이유</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { components.map((component) => (
                  <TableRow key={ component.name }>
                    <TableCell sx={ { fontSize: 13, fontWeight: 600, pl: 1 + component.depth * 2 } }>
                      { component.name }
                    </TableCell>
                    <TableCell sx={ { fontSize: 13 } }>{ groupOf(component) }</TableCell>
                    <TableCell sx={ { fontSize: 13, color: component.storyId ? 'text.primary' : 'text.secondary' } }>
                      { component.storyId ? (
                        <StoryLinks
                          stories={ [{ label: component.storyTitle, id: toStoryPath(component.storyId) }] }
                        />
                      ) : (
                        NO_STORY_REASON[component.name] || ''
                      ) }
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle
            title="트리 밖 파일"
            description="구조 트리에 나타나지 않지만 저장소에 있는 컴포넌트"
          />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: 220 } }>컴포넌트</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>이유</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 200 } }>스토리</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { OFF_TREE.map((item) => (
                  <TableRow key={ item.name }>
                    <TableCell sx={ { fontSize: 13, fontWeight: 600 } }>{ item.name }</TableCell>
                    <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>{ item.reason }</TableCell>
                    <TableCell sx={ { fontSize: 13 } }>
                      <StoryLinks stories={ [{ label: 'CinematicCamera', id: item.storyId }] } />
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="body2" color="text.secondary">
            문서 스토리(Overview 01~08)는 컴포넌트가 아니므로 이 표에서 세지 않는다.
            재사용 모듈(storybookDocumentation 5개)은 문서 전용이라 제품 트리에 들어가지 않는다.
          </Typography>
        </PageContainer>
      </>
    );
  },
};
