import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  DocumentTitle,
  PageContainer,
  TreeNode,
} from '../../components/storybookDocumentation';
import projectStructure from '../../data/projectStructure.js';

export default {
  title: 'Overview/Buzz Khalifa/04 Project Structure',
  parameters: {
    layout: 'padded',
  },
};

/**
 * 컴포넌트가 아닌 항목(Hook / Data)의 목적·역할 설명.
 * 파일 이름 또는 export 이름을 키로 사용.
 */
const DESCRIPTIONS = {
  // Hooks
  useDayNight: 'Hook · 읽기 진행도에서 낮·석양·황혼·밤 상태 계산',
  useTheme: 'Hook · 진행도를 지면 CSS 변수(낮·밤 배색)로 반영',

  // Data
  constructionStages: 'Data · 공정 단계 여섯 벌의 카피와 사진',
  burjKhalifaData: 'Data · 타워 치수, 티어 24켜, 3D 색 팔레트',
  scrollConfig: 'Data · 스크롤 페이지 수와 구간 경계, 연출 타이밍',
  projectStructure: 'Data · 프로젝트 구조 자동 생성 데이터',
};

/**
 * 트리 노드를 TreeNode 가 받을 수 있는 중첩 객체로 변환.
 * - 컴포넌트: 중첩 객체 (자식 컴포넌트 포함)
 * - Hook / Data: 리프(설명 문자열)
 * 같은 이름이 여러 번 나오면 뒤에 `#n` 을 붙여 키 충돌을 막는다.
 */
function nodeToTree(node) {
  const out = {};
  const nameCount = {};

  for (const child of node.children || []) {
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

  for (const hook of node.hooks || []) {
    out[hook.name] = DESCRIPTIONS[hook.name] || 'Hook';
  }

  for (const data of node.data || []) {
    out[data.name] = DESCRIPTIONS[data.name] || 'Data';
  }

  return out;
}

/** Project Structure - App.tsx 를 루트로 한 전체 구조 트리 탐색기 */
export const Default = {
  render: () => {
    const root = projectStructure.root;
    const tree = nodeToTree(root);

    return (
      <>
        <DocumentTitle
          title="Project Structure"
          status="Available"
          note="App.tsx 를 루트로 한 전체 컴포넌트 포함 관계"
          brandName="Design System"
          systemName="Buzz Khalifa"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Project Structure
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
            클릭하여 펼치기/접기 | <code>src/App.tsx</code> · 재생성: <code>pnpm generate-structure</code>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
            컴포넌트는 중첩 구조로, 컴포넌트가 아닌 항목(Hook · Data)은 목적·역할 설명과 함께 리프로 표시한다.
            3D 장면(ConstructionScene)과 스크롤 본문(ConstructionOverlay)이 같은 읽기 진행도를 나눠 쓴다.
          </Typography>

          <Box sx={ { p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 } }>
            <Box sx={ { fontFamily: 'monospace' } }>
              <TreeNode keyName={ root.name } value={ tree } depth={ 0 } defaultOpen />
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={ { mt: 3 } }>
            생성 시각: <code>{ projectStructure.generatedAt }</code>
          </Typography>
        </PageContainer>
      </>
    );
  },
};
