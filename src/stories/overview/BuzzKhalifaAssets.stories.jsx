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
  PageContainer,
  SectionTitle,
} from '../../components/storybookDocumentation';
import { CONSTRUCTION_STAGES } from '../../data/constructionStages';

// 공정 사진 (번들에 포함되는 유일한 이미지 묶음)
import stage1Image from '../../assets/stages/1.jpeg';
import stage2Image from '../../assets/stages/2.jpeg';
import stage3Image from '../../assets/stages/3.jpeg';
import stage4Image from '../../assets/stages/4.jpeg';
import stage5Image from '../../assets/stages/5.jpeg';
import stage6Image from '../../assets/stages/6.jpeg';

export default {
  title: 'Overview/Buzz Khalifa/07 Assets',
  parameters: {
    layout: 'padded',
  },
};

/** src/assets/stages 6장. 파일 용량은 저장소 실제 크기다. */
const STAGE_PHOTOS = [
  { file: '1.jpeg', src: stage1Image, size: '531 KB' },
  { file: '2.jpeg', src: stage2Image, size: '1.2 MB' },
  { file: '3.jpeg', src: stage3Image, size: '928 KB' },
  { file: '4.jpeg', src: stage4Image, size: '2.1 MB' },
  { file: '5.jpeg', src: stage5Image, size: '3.6 MB' },
  { file: '6.jpeg', src: stage6Image, size: '4.9 MB' },
];

/**
 * 루트 reference/ 자료. 번들에 들어가지 않고 모델 치수와 비율의 근거로만 쓴다.
 * refId 는 03 4.1절 레퍼런스 표의 ID다.
 */
const REFERENCE_FILES = [
  { path: 'reference/e5109a08a6045581269caec7f60b8fba.jpg', size: '185 KB', refId: 'REF-01', note: '티어별 높이 단면도' },
  { path: 'reference/Erection-of-Spire-of-Burj-Khalifa.jpg', size: '191 KB', refId: 'REF-02', note: '첨탑 인양 시퀀스' },
  { path: 'reference/images (1).jpeg', size: '6 KB', refId: 'REF-03', note: '층별 평면 변화' },
  { path: 'reference/images (3).jpeg', size: '5 KB', refId: 'REF-04', note: 'Y자 평면 세트백 패턴' },
  { path: 'reference/paper.md', size: '39 KB', refId: 'REF-05', note: '버트레스드 코어 구조 논문' },
  { path: 'reference/images (2).jpeg', size: '7 KB', refId: '', note: '분류되지 않은 평면 자료' },
  { path: 'reference/images.jpeg', size: '6 KB', refId: '', note: '분류되지 않은 평면 자료' },
  { path: 'reference/01_2.jpg', size: '66 KB', refId: '', note: '외관 사진' },
  { path: 'reference/3-Figure1-1.png', size: '91 KB', refId: '', note: '논문 도판' },
  { path: 'reference/12-Figure18-1.png', size: '629 KB', refId: '', note: '논문 도판' },
  { path: 'reference/Thetower.png', size: '152 KB', refId: '', note: '전체 실루엣' },
  { path: 'reference/Screenshot 2026-01-13 at 1.42.01 AM.png', size: '5.7 MB', refId: '', note: '작업 중 화면 캡처' },
  { path: 'reference/Screenshot 2026-01-13 at 1.42.09 AM.png', size: '5.8 MB', refId: '', note: '작업 중 화면 캡처' },
];

/** 라벨과 이미지를 세로로 쌓은 단일 셀. 원본 비율 유지 */
function AssetCell({ label, caption, src }) {
  return (
    <Stack spacing={ 0.75 }>
      <Box
        sx={ {
          width: '100%',
          backgroundColor: 'grey.100',
          overflow: 'hidden',
          lineHeight: 0,
        } }
      >
        <Box
          component="img"
          src={ src }
          alt={ label }
          loading="lazy"
          sx={ { width: '100%', height: 'auto', display: 'block' } }
        />
      </Box>
      <Typography variant="body2" sx={ { fontWeight: 600 } }>
        { label }
      </Typography>
      <Typography
        variant="caption"
        sx={ { fontFamily: 'monospace', fontSize: 10, color: 'text.secondary' } }
      >
        { caption }
      </Typography>
    </Stack>
  );
}

/** 파일 목록 표 (번들되지 않는 자료용) */
function FileTable({ rows }) {
  return (
    <TableContainer sx={ { mb: 4 } }>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={ { fontWeight: 600, width: 90 } }>ID</TableCell>
            <TableCell sx={ { fontWeight: 600 } }>경로</TableCell>
            <TableCell sx={ { fontWeight: 600, width: 90 } }>용량</TableCell>
            <TableCell sx={ { fontWeight: 600, width: '30%' } }>쓰임</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { rows.map((row) => (
            <TableRow key={ row.path }>
              <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                { row.refId || '-' }
              </TableCell>
              <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' } }>
                { row.path }
              </TableCell>
              <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ row.size }</TableCell>
              <TableCell sx={ { fontSize: 13 } }>{ row.note }</TableCell>
            </TableRow>
          )) }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/** 에셋 목록: 번들되는 공정 사진과 번들되지 않는 레퍼런스 자료 */
export const Default = {
  render: () => (
    <>
      <DocumentTitle
        title="Assets"
        status="Available"
        note="공정 사진 6장과 모델 근거 레퍼런스 자료"
        brandName="Design System"
        systemName="Buzz Khalifa"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          Assets
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
          번들에 들어가 화면에 보이는 에셋을 상단에, 화면에 싣지 않고 모델 근거로만 쓰는 자료를
          하단에 정리한다. 모든 이미지는 원본 비율 그대로 표시된다.
        </Typography>

        <Typography variant="h5" sx={ { fontWeight: 700, mt: 2, mb: 2 } }>
          In Use
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
          공정 사진은 구간 본문 아래에 한 장씩 실린다. 사진 등장은 글자보다 늦게 시작한다.
        </Typography>

        <SectionTitle
          title="Stage Photos"
          description={ `${ STAGE_PHOTOS.length }장 · src/assets/stages/*.jpeg · constructionStages.ts 가 import 하고 ConstructionSection 이 렌더한다.` }
        />
        <Grid container spacing={ 3 } sx={ { mb: 6 } }>
          { STAGE_PHOTOS.map((photo, index) => (
            <Grid key={ photo.file } size={ { xs: 12, sm: 6, md: 4 } }>
              <AssetCell
                label={ `${ CONSTRUCTION_STAGES[index]?.number } ${ CONSTRUCTION_STAGES[index]?.title }` }
                caption={ `src/assets/stages/${ photo.file } · ${ photo.size }` }
                src={ photo.src }
              />
            </Grid>
          )) }
        </Grid>

        <Typography variant="h5" sx={ { fontWeight: 700, mt: 4, mb: 2, color: 'text.secondary' } }>
          Reference Only (번들 제외)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
          저장소 루트 <code>reference/</code>에 있는 자료다. <code>src</code> 밖이라 번들에 포함되지 않고
          화면에도 노출하지 않는다. 03 4.1절 레퍼런스 표의 ID와 짝이 맞는 것만 ID를 적었다.
        </Typography>

        <SectionTitle
          title="reference/"
          description={ `${ REFERENCE_FILES.length }개 파일 · 티어 높이, 첨탑 인양, 평면 변화, 구조 논문` }
        />
        <FileTable rows={ REFERENCE_FILES } />

        <Typography variant="body2" color="text.secondary">
          리팩터링 전 루트에 있던 <code>stages/</code> 폴더는 <code>src/assets/stages/</code>로 옮겨졌고,
          루트에는 더 이상 남아 있지 않다.
        </Typography>
      </PageContainer>
    </>
  ),
};
