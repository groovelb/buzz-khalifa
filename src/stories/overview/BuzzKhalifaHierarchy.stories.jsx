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

export default {
  title: 'Custom Component/0. Hierarchy',
  parameters: {
    layout: 'padded',
  },
};

/**
 * 컴포넌트 이름 → 스토리 분류와 스토리 ID.
 * `src/data/projectStructure.js` 생성기가 `.stories.jsx` 형제 파일만 찾기 때문에
 * (이 저장소의 스토리는 `src/stories/`에 `.stories.tsx`로 모여 있다) 이 표로 보완한다.
 */
const STORY_INDEX = {
  App: { group: 'Page', title: 'Page/Buzz Khalifa', storyId: 'page-buzz-khalifa--default' },
  ConstructionOverlay: {
    group: 'Template',
    title: 'Template/ConstructionOverlay',
    storyId: 'template-constructionoverlay--default',
  },
  ConstructionSection: {
    group: 'Section',
    title: 'Section/ConstructionSection',
    storyId: 'section-constructionsection--default',
  },
  ConstructionExperience: {
    group: 'Custom Component',
    title: 'Custom Component/Three/ConstructionExperience',
    storyId: 'custom-component-three-constructionexperience--default',
  },
  TextReveal: {
    group: 'Custom Component',
    title: 'Custom Component/Kinetic Typography/TextReveal',
    storyId: 'custom-component-kinetic-typography-textreveal--default',
  },
  ImageReveal: {
    group: 'Custom Component',
    title: 'Custom Component/Media/ImageReveal',
    storyId: 'custom-component-media-imagereveal--default',
  },
};

/** 스토리를 만들지 않기로 한 컴포넌트와 그 이유 */
const NO_STORY_REASON = {
  Header: '고정 머리말. 페이지 스토리에서 함께 보인다',
  Footer: '고정 꼬리말. 페이지 스토리에서 함께 보인다',
  ConstructionScene: 'Canvas 안에서만 성립하는 3D 장면 루트',
  Building: 'Canvas 안에서만 성립하는 구조 묶음',
  DayNightCycle: 'Canvas 안에서만 성립하는 하늘과 조명',
  Foundation: 'Canvas 안에서만 성립하는 공정 형상',
  Core: 'Canvas 안에서만 성립하는 공정 형상',
  Setbacks: 'Canvas 안에서만 성립하는 공정 형상',
  Cladding: 'Canvas 안에서만 성립하는 공정 형상',
  Illumination: 'Canvas 안에서만 성립하는 공정 형상',
  Spire: 'Canvas 안에서만 성립하는 공정 형상',
};

/** 분류 표시 순서 */
const GROUP_ORDER = ['Page', 'Template', 'Section', 'Custom Component', '스토리 없음'];

/** 트리에서 컴포넌트 노드만 깊이 우선으로 모은다. 같은 이름은 한 번만 센다. */
function collectComponents(node, depth = 0, seen = new Map()) {
  if (!seen.has(node.name)) {
    seen.set(node.name, { name: node.name, file: node.file, depth });
  }
  for (const child of node.children || []) {
    collectComponents(child, depth + 1, seen);
  }
  return seen;
}

/** 노드 하나를 TreeNode 가 읽는 값으로. 리프는 분류 라벨 문자열이다. */
function nodeToTree(node) {
  const children = node.children || [];
  const entry = STORY_INDEX[node.name];
  const label = entry ? `${ entry.group } · ${ entry.title }` : NO_STORY_REASON[node.name] || '스토리 없음';

  if (children.length === 0) {
    return label;
  }

  const out = { '(분류)': label };
  const nameCount = {};
  for (const child of children) {
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

/** 스토리 링크 한 칸. Storybook 프레임 밖으로 이동시키려고 target 을 _top 으로 둔다. */
function StoryLink({ entry }) {
  if (!entry) {
    return <span>스토리 없음</span>;
  }
  return (
    <a href={ `?path=/story/${ entry.storyId }` } target="_top">
      { entry.title }
    </a>
  );
}

/** 분류 위계: 페이지에서 컴포넌트까지 한 화면에서 본다 */
export const Default = {
  render: () => {
    const root = projectStructure.root;
    const tree = nodeToTree(root);
    const components = [...collectComponents(root).values()];

    const groupCounts = GROUP_ORDER.map((group) => ({
      group,
      items: components.filter((component) => {
        const entry = STORY_INDEX[component.name];
        return group === '스토리 없음' ? !entry : entry.group === group;
      }),
    }));

    return (
      <>
        <DocumentTitle
          title="Hierarchy"
          status="Available"
          note="Page · Template · Section · Custom Component 분류와 스토리 연결"
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
            description="App 을 루트로 페이지 → 템플릿 → 섹션 → 컴포넌트 순서다. 각 노드의 (분류) 줄이 스토리 분류를 알려준다."
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
                  <TableCell sx={ { fontWeight: 600, width: 200 } }>컴포넌트</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 130 } }>분류</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>스토리 또는 이유</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { components.map((component) => {
                  const entry = STORY_INDEX[component.name];
                  return (
                    <TableRow key={ component.name }>
                      <TableCell sx={ { fontSize: 13, fontWeight: 600, pl: 1 + component.depth * 2 } }>
                        { component.name }
                      </TableCell>
                      <TableCell sx={ { fontSize: 13 } }>{ entry ? entry.group : '스토리 없음' }</TableCell>
                      <TableCell sx={ { fontSize: 13, color: entry ? 'text.primary' : 'text.secondary' } }>
                        { entry ? <StoryLink entry={ entry } /> : NO_STORY_REASON[component.name] || '' }
                      </TableCell>
                    </TableRow>
                  );
                }) }
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="body2" color="text.secondary">
            트리에 없는 파일: <code>components/three/CinematicCamera.tsx</code>는 어디에서도 import 되지 않아 구조에 나타나지 않는다.
            문서 스토리(Overview 01~07)는 컴포넌트가 아니므로 이 표에서 세지 않는다.
          </Typography>
        </PageContainer>
      </>
    );
  },
};
