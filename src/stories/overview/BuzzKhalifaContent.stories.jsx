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
import { CONSTRUCTION_STAGES } from '../../data/constructionStages';

export default {
  title: 'Overview/Buzz Khalifa/06 Content Data',
  parameters: {
    layout: 'padded',
  },
};

/** 구간 이름은 02 2.1절 페이지 리스트의 이름을 그대로 쓴다. */
const PAGE_NAMES = [
  'Stage I Foundation',
  'Stage II The Core',
  'Stage III Setbacks',
  'Stage IV Cladding',
  'Stage V Illumination',
  'Stage VI The Spire',
];

/** 표 머리글 셀 */
function HeadCell({ width, children }) {
  return (
    <TableCell sx={ { fontWeight: 600, width } }>{ children }</TableCell>
  );
}

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

/** 공정 단계 카피 (ConstructionStage) */
export const Default = {
  render: () => (
    <>
      <DocumentTitle
        title="Content Data"
        status="Available"
        note="공정 단계 여섯 벌의 제목 · 해설 · 기술 노트 · 수치"
        brandName="Design System"
        systemName="Buzz Khalifa"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          Content Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
          <code>src/data/constructionStages.ts</code>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
          지면에 실리는 카피는 전부 이 한 곳에서 온다. 한 벌은 번호, 제목, 부제, 해설,
          기술 노트, 수치, 사진으로 이루어지고 구간 안에서 이 차례로 등장한다.
        </Typography>

        <SectionTitle
          title="CONSTRUCTION_STAGES · 머리 카피"
          description={ `${ CONSTRUCTION_STAGES.length }개 · 번호(로마 숫자) · 제목 · 부제 · 등장 구간` }
        />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <HeadCell width={ 60 }>number</HeadCell>
                <HeadCell width={ 140 }>title</HeadCell>
                <HeadCell width={ 260 }>subtitle</HeadCell>
                <HeadCell>등장 구간 (02 2.1절)</HeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { CONSTRUCTION_STAGES.map((stage, index) => (
                <TableRow key={ stage.number } sx={ { '&:hover': { backgroundColor: 'action.hover' } } }>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ stage.number }</TableCell>
                  <TableCell sx={ { fontSize: 13, fontWeight: 600 } }>{ stage.title }</TableCell>
                  <TableCell sx={ { fontSize: 13 } }>{ stage.subtitle }</TableCell>
                  <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>
                    { PAGE_NAMES[index] }
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle
          title="CONSTRUCTION_STAGES.description"
          description="구간 본문. 한 글자씩 올라오는 등장 연출의 대상이다."
        />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <HeadCell width={ 60 }>number</HeadCell>
                <HeadCell width={ 140 }>title</HeadCell>
                <HeadCell>description</HeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { CONSTRUCTION_STAGES.map((stage) => (
                <TableRow key={ stage.number }>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ stage.number }</TableCell>
                  <TableCell sx={ { fontSize: 13, fontWeight: 600 } }>{ stage.title }</TableCell>
                  <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>
                    { stage.description }
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle
          title="CONSTRUCTION_STAGES.technicalNote / measurement"
          description="가는 선 아래 보조 문단과 대표 수치 한 줄"
        />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <HeadCell width={ 60 }>number</HeadCell>
                <HeadCell width={ 180 }>measurement</HeadCell>
                <HeadCell>technicalNote</HeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { CONSTRUCTION_STAGES.map((stage) => (
                <TableRow key={ stage.number }>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ stage.number }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                    { stage.measurement || '' }
                  </TableCell>
                  <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>
                    { stage.technicalNote }
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle
          title="CONSTRUCTION_STAGES.image · 공정 사진(StagePhoto)"
          description="단계마다 한 장. 번들된 파일 경로는 07 Assets 에서 미리보기와 함께 확인한다."
        />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <HeadCell width={ 90 }>미리보기</HeadCell>
                <HeadCell width={ 60 }>number</HeadCell>
                <HeadCell width={ 140 }>title</HeadCell>
                <HeadCell>image</HeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { CONSTRUCTION_STAGES.map((stage) => (
                <TableRow key={ stage.number }>
                  <TableCell>
                    { stage.image ? <StageThumb src={ stage.image } alt={ stage.title } /> : null }
                  </TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ stage.number }</TableCell>
                  <TableCell sx={ { fontSize: 13, fontWeight: 600 } }>{ stage.title }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 11, color: 'text.secondary' } }>
                    { stage.image }
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>
      </PageContainer>
    </>
  ),
};
