/**
 * 조립 순서 6단계.
 *
 * 08 Research 와 0. Hierarchy 가 같은 목록을 쓴다. 한 곳만 고치면 둘이 함께 바뀐다.
 * storyIds 의 값은 빌드된 `storybook-static/index.json` 의 story id 와 같아야 한다.
 */
export const ASSEMBLY_STEPS = [
  {
    step: 1,
    title: '리서치',
    what: '단면도, 평면 변화, 첨탑 인양 사진, 구조 논문을 모은다',
    where: 'src/assets/reference/',
    stories: [
      { label: '08 Domain Knowledge', id: 'overview-buzz-khalifa-08-domain-knowledge-research--default' },
    ],
  },
  {
    step: 2,
    title: '데이터',
    what: '리서치에서 얻은 수치와 규칙을 상수로 고정한다',
    where: 'src/data/burjKhalifaData.ts · constructionStages.ts · scrollConfig.ts',
    stories: [
      { label: '05 Stage Data', id: 'overview-buzz-khalifa-05-stage-data--default' },
      { label: '06 Content Data', id: 'overview-buzz-khalifa-06-content-data--default' },
    ],
  },
  {
    step: 3,
    title: '모델',
    what: '진행도 하나로 여섯 공정의 형상을 그린다. 스크롤과 카메라는 모른다',
    where: 'src/components/three/BuildingModel.tsx',
    stories: [
      { label: 'BuildingModel', id: 'custom-component-3-scene-buildingmodel--default' },
    ],
  },
  {
    step: 4,
    title: '스크롤 반응',
    what: '진행도를 한 번 읽어 모델, 회전과 이동, 카메라, 조명, 낮과 밤에 나눠 준다',
    where: 'src/components/three/ConstructionScene.tsx',
    stories: [
      { label: 'ConstructionScene', id: 'custom-component-3-scene-constructionscene--default' },
    ],
  },
  {
    step: 5,
    title: '해설 지면',
    what: '같은 진행도 위에 여섯 구간의 카피와 사진을 얹는다',
    where: 'src/components/scroll/ConstructionOverlay.tsx · ConstructionSection.tsx',
    stories: [
      { label: 'ConstructionOverlay', id: 'template-constructionoverlay--default' },
      { label: 'ConstructionSection', id: 'section-constructionsection--default' },
    ],
  },
  {
    step: 6,
    title: '페이지',
    what: 'Canvas, 스크롤 문맥, 장면, 지면, 머리말과 꼬리말을 조립한다',
    where: 'src/App.tsx · src/components/three/ConstructionExperience.tsx',
    stories: [
      { label: 'Buzz Khalifa', id: 'page-buzz-khalifa--default' },
      { label: 'ConstructionExperience', id: 'custom-component-3-scene-constructionexperience--default' },
    ],
  },
];
