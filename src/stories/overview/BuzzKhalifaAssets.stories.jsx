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
import assetInventory from '../../data/assetInventory.js';
import { CONSTRUCTION_STAGES } from '../../data/constructionStages';

export default {
  title: 'Overview/Buzz Khalifa/07 Assets',
  parameters: {
    layout: 'padded',
  },
};

/** src/assets 아래 모든 이미지의 번들 URL. 인벤토리의 importKey 와 같은 키를 쓴다. */
const ASSET_URLS = import.meta.glob(
  '../../assets/**/*.{png,jpg,jpeg,webp,gif,svg}',
  { eager: true, query: '?url', import: 'default' },
);

/** 바이트를 사람이 읽는 단위로 */
const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes >= 1024 * 1024) return `${ (bytes / 1024 / 1024).toFixed(1) } MB`;
  return `${ Math.round(bytes / 1024) } KB`;
};

/** 인벤토리 항목에 번들 URL을 붙인다. */
const withUrl = (item) => ({
  ...item,
  src: ASSET_URLS[item.importKey] || item.url || '',
});

/** 인벤토리 파일명(1.jpeg)으로 공정 단계를 찾는다. */
const stageOf = (item) => {
  const index = Number.parseInt(item.name, 10) - 1;
  return CONSTRUCTION_STAGES[index];
};

/** 고정 비율 격자 한 칸. 잘라내지 않고 안에 맞춘다. */
function AssetCell({ label, caption, src }) {
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
          src={ src }
          alt={ label }
          loading="lazy"
          sx={ { maxWidth: '100%', maxHeight: '100%', display: 'block' } }
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

/** 작은 썸네일. 표 안에서 쓴다. */
function Thumb({ src, alt }) {
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

/** 에셋: 번들되는 이미지 전부와 번들되지 않는 레퍼런스 목록 */
export const Default = {
  render: () => {
    const items = assetInventory.items.map(withUrl);
    const images = items.filter((item) => item.kind === 'image');
    const stageImages = images.filter((item) => item.folder === 'stages');
    const referenceImages = images.filter((item) => item.folder === 'reference');
    const others = items.filter((item) => item.kind !== 'image');
    const folders = Object.entries(assetInventory.summary);
    const missing = images.filter((item) => !item.src);

    return (
      <>
        <DocumentTitle
          title="Assets"
          status="Available"
          note="src/assets 전체 이미지와 모델 근거 레퍼런스 자료"
          brandName="Design System"
          systemName="Buzz Khalifa"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Assets
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
            <code>src/data/assetInventory.js</code> · 재생성: <code>pnpm generate-assets</code>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
            번들에 들어가는 이미지는 한 장도 빠짐없이 그린다. 화면에 싣지 않고 모델 근거로만 쓰는
            루트 자료는 목록 표로만 싣는다.
          </Typography>

          <SectionTitle
            title="폴더 요약"
            description={ `인벤토리 생성 시각 ${ assetInventory.generatedAt }` }
          />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600 } }>폴더</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 90 } }>파일 수</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 110 } }>합계 용량</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 110 } }>이미지</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { folders.map(([folder, summary]) => (
                  <TableRow key={ folder }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ folder }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ summary.files }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                      { formatBytes(summary.bytes) }
                    </TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ summary.image }</TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h5" sx={ { fontWeight: 700, mt: 2, mb: 2 } }>
            In Bundle
          </Typography>

          <SectionTitle
            title="Stage Photos"
            description={ `${ stageImages.length }장 전부 · constructionStages.ts 가 import 하고 ConstructionSection 이 구간 본문 아래에 렌더한다.` }
          />
          <Grid container spacing={ 3 } sx={ { mb: 6 } }>
            { stageImages.map((item) => {
              const stage = stageOf(item);
              return (
                <Grid key={ item.path } size={ { xs: 12, sm: 6, md: 4 } }>
                  <AssetCell
                    label={ stage ? `${ stage.number } ${ stage.title }` : item.name }
                    caption={ `${ item.path } · ${ formatBytes(item.bytes) }` }
                    src={ item.src }
                  />
                </Grid>
              );
            }) }
          </Grid>

          { others.length > 0 && (
            <>
              <SectionTitle
                title="이미지가 아닌 에셋"
                description={ `${ others.length }개 · 비디오, 폰트, 모델 등` }
              />
              <TableContainer sx={ { mb: 6 } }>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={ { fontWeight: 600 } }>경로</TableCell>
                      <TableCell sx={ { fontWeight: 600, width: 100 } }>종류</TableCell>
                      <TableCell sx={ { fontWeight: 600, width: 110 } }>용량</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { others.map((item) => (
                      <TableRow key={ item.path }>
                        <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ item.path }</TableCell>
                        <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ item.kind }</TableCell>
                        <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                          { formatBytes(item.bytes) }
                        </TableCell>
                      </TableRow>
                    )) }
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) }

          <SectionTitle
            title="파일 목록"
            description="인벤토리 항목 전부. 썸네일은 위 격자와 같은 파일이다."
          />
          <TableContainer sx={ { mb: 6 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: 100 } }>미리보기</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>경로</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 110 } }>용량</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 180 } }>쓰이는 곳</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { items.map((item) => {
                  const stage = stageOf(item);
                  return (
                    <TableRow key={ item.path }>
                      <TableCell>
                        { item.kind === 'image' && item.src ? (
                          <Thumb src={ item.src } alt={ item.name } />
                        ) : null }
                      </TableCell>
                      <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ item.path }</TableCell>
                      <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                        { formatBytes(item.bytes) }
                      </TableCell>
                      <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>
                        { stage ? `${ stage.number } ${ stage.title }` : '' }
                      </TableCell>
                    </TableRow>
                  );
                }) }
              </TableBody>
            </Table>
          </TableContainer>

          { missing.length > 0 && (
            <Typography variant="body2" color="error.main" sx={ { mb: 4 } }>
              번들 URL을 찾지 못한 이미지 { missing.length }개:
              { ' ' }{ missing.map((item) => item.path).join(', ') }
            </Typography>
          ) }

          <Typography variant="h5" sx={ { fontWeight: 700, mt: 4, mb: 2, color: 'text.secondary' } }>
            Research Reference
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
            리서치 자료 { referenceImages.length }장과 논문 한 편은 <code>src/assets/reference/</code>에 있다.
            화면에 싣지 않고 모델 치수와 규칙의 근거로만 쓴다. 각 자료가 어떤 결정에 쓰였는지는
            <a href="?path=/story/overview-buzz-khalifa-08-domain-knowledge-research--default" target="_top"> 08 Domain Knowledge &amp; Research </a>
            에서 용도와 함께 본다.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            리팩터링 전 루트에 있던 <code>stages/</code>와 <code>reference/</code>는
            <code> src/assets/</code> 아래로 옮겨졌고, 루트에는 더 이상 남아 있지 않다.
          </Typography>
        </PageContainer>
      </>
    );
  },
};
