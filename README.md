# 마케팅 캠페인 성과 대시보드

마케팅 캠페인의 성과 데이터를 시각화하고 관리하는 대시보드 애플리케이션입니다.

## 실행 방법

### 사전 요구사항

- Node.js 18 이상
- npm 9 이상

### 설치 및 실행

```bash
# 의존성 설치
npm install

# API 서버와 개발 서버를 동시에 실행 (터미널 2개 필요)

# 터미널 1: json-server (Mock API, port 3001)
npm run server

# 터미널 2: Vite 개발 서버 (port 5173)
npm run dev
```

브라우저에서 `http://localhost:5173` 으로 접속합니다.

> json-server가 먼저 실행된 상태에서 개발 서버를 실행해야 데이터가 정상적으로 로드됩니다.

### 빌드

```bash
npm run build
npm run preview
```

---

## 기술 스택 선택 근거

### React 19 + TypeScript + Vite

과제 필수 스택(React/Next.js + TypeScript)을 충족하면서, 단일 페이지 대시보드 특성상 SSR이 불필요하다고 판단해 Next.js 대신 Vite + React를 선택했습니다. 빌드 속도와 개발 환경 설정이 간결하다는 점도 고려했습니다.

### 상태 관리: Zustand

| 선택지         | 이유                                                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zustand** ✅ | 글로벌 필터 상태 하나를 여러 컴포넌트에서 구독하는 단순한 구조에 적합. Redux 대비 보일러플레이트가 없고, Context API 대비 불필요한 리렌더링을 방지하는 선택적 구독이 가능 |
| Redux Toolkit  | 이 규모의 프로젝트에서는 과도한 복잡도                                                                                                                                    |
| Context API    | 전역 필터가 변경될 때마다 Provider 하위 전체가 리렌더링되는 성능 문제                                                                                                     |

### 서버 상태 관리: TanStack Query v5

캐싱, 백그라운드 리페치, 낙관적 업데이트 등 서버 데이터 관리에 특화된 기능이 필요했습니다. 상태 변경(캠페인 등록, 상태 일괄 변경) 후 `invalidateQueries`로 캐시를 갱신해 새로고침 없이 목록에 즉시 반영되도록 구현했습니다.

### 차트: Recharts

Recharts를 선택한 주요 이유는 React 컴포넌트 기반 API로 TypeScript와의 통합이 자연스럽기 때문입니다. D3 대비 학습 곡선이 낮고, Chart.js 대비 React의 선언적 패턴에 더 부합합니다. AreaChart(추이 차트), PieChart(도넛 차트), BarChart(랭킹 차트) 모두 Recharts 하나로 통일해 번들 크기도 관리했습니다.

### 스타일링: Tailwind CSS v4

유틸리티 클래스 방식으로 컴포넌트별 스타일 파일 없이 빠른 UI 구성이 가능합니다. 조건부 클래스는 템플릿 리터럴과 삼항 연산자로 처리했습니다.

### 날짜 처리: date-fns

경량 함수형 API로 필요한 함수만 import해 번들 크기를 최소화했습니다. moment.js 대비 트리쉐이킹이 용이하고, 순수 함수 기반이라 예측 가능한 동작을 보장합니다.

---

## 폴더 구조 및 아키텍처

```
src/
├── api/                    # 외부 통신 레이어
│   ├── index.ts            # Axios 인스턴스 및 API 함수 정의
│   └── queryClient.ts      # React Query 클라이언트 설정
│
├── components/             # UI 컴포넌트
│   ├── _common/            # 범용 재사용 컴포넌트 (Button, Card, Modal, Input, FormField)
│   ├── FilterBar/          # 글로벌 필터 영역
│   │   ├── FilterBar.tsx   # 날짜·상태·매체 필터 조합
│   │   └── FilterGroup.tsx # 체크박스 그룹 재사용 컴포넌트
│   ├── CampaignTable/      # 캠페인 목록 테이블
│   │   ├── CampaignTable.tsx
│   │   ├── TableHeader.tsx
│   │   ├── TableRow.tsx
│   │   ├── TableActions.tsx
│   │   ├── TablePagination.tsx
│   │   └── StatusBadge.tsx
│   ├── DashboardChart.tsx  # 일별 추이 차트
│   ├── PlatformChart.tsx   # 플랫폼별 도넛 차트
│   ├── CampaignRanking.tsx # 캠페인 랭킹 Top3
│   ├── CampaignCreateModal.tsx
│   └── Header.tsx
│
├── hooks/                  # 비즈니스 로직 (커스텀 훅)
│   ├── useDashboardData.ts     # 필터 적용 후 집계 데이터 파생
│   ├── useDashboardChart.ts    # 일별 추이 메트릭 토글 상태
│   ├── usePlatformChart.ts     # 도넛 차트 + 양방향 필터 연동
│   ├── useCampaignRanking.ts   # Top3 랭킹 계산
│   ├── useCampaignTable.ts     # 정렬·검색·페이지네이션·일괄변경
│   └── useCampaignCreateForm.ts # 폼 유효성 검사 및 제출
│
├── store/
│   └── useFilterStore.ts   # Zustand 글로벌 필터 스토어
│
├── types/
│   └── dashboard.ts        # Campaign, DailyStat 등 타입 정의
│
├── constants/
│   └── dashboard.ts        # 필터 옵션, 메트릭 정의, 페이지 크기 등
│
├── utils/
│   └── metrics.ts          # CTR, CPC, ROAS 계산 유틸 (division-by-zero 안전 처리)
│
├── App.tsx
└── main.tsx
```

### 아키텍처 결정 원칙

**관심사 분리 (Separation of Concerns)**

컴포넌트는 렌더링만 담당하고, 비즈니스 로직은 커스텀 훅으로 분리했습니다. 예를 들어 `CampaignTable.tsx`는 레이아웃·이벤트 바인딩만 포함하고, 정렬·검색·페이지네이션 로직은 `useCampaignTable.ts`에 위치합니다.

**단방향 데이터 흐름**

`useFilterStore` → `useDashboardData` → 각 컴포넌트 순으로 데이터가 흐릅니다. 필터 변경이 모든 하위 위젯에 동기적으로 전파되도록 설계했습니다. 예외적으로 플랫폼 도넛 차트는 클릭 시 `useFilterStore`를 직접 업데이트하는 양방향 연동을 구현했습니다.

---

## 컴포넌트 설계

### 재사용 컴포넌트 (`_common/`)

공통 UI 요소(Button, Input, Modal, Card, FormField)를 `_common`으로 분리해 일관된 디자인 언어를 유지했습니다. 각 컴포넌트는 `variant`, `size` 등 Props로 외형을 제어할 수 있어 다양한 맥락에서 재사용 가능합니다.

### 테이블 분할 설계

`CampaignTable`은 역할별로 5개 서브 컴포넌트로 분리했습니다.

- `TableActions`: 검색과 일괄 상태 변경 (선택 캠페인 수 표시 포함)
- `TableHeader`: 정렬 가능한 컬럼 헤더
- `TableRow`: 개별 행 렌더링 및 체크박스
- `TablePagination`: 페이지 이동 및 건수 표시
- `StatusBadge`: 상태 시각화 (색상 코딩)

이렇게 분리하면 테이블 기능이 확장될 때(예: 컬럼 추가, 인라인 편집) 영향 범위를 최소화할 수 있습니다.

### 데이터 전처리 및 예외 처리

`utils/metrics.ts`에서 CTR, CPC, ROAS 계산 시 분모가 0이거나 `conversionsValue`가 null인 경우를 안전하게 처리합니다. `useDashboardData`에서 필터 적용 후 집계된 daily_stats를 기반으로 파생 지표를 실시간으로 계산합니다.

## 스크린샷

### 데스크탑

<img width="1203" height="924" alt="메인 대시보드 전체 뷰" src="https://github.com/user-attachments/assets/3d3bb4d5-b525-419f-ab0c-d660483f4dca" />

<img width="1181" height="739" alt="캠페인 테이블" src="https://github.com/user-attachments/assets/6335ae47-378e-47b5-8750-7a53948cc613" />

**캠페인 등록 모달**
<img width="628" height="564" alt="캠페인 등록 모달" src="https://github.com/user-attachments/assets/2de68082-6907-44f4-a488-1572dd6ab055" />

### 반응형

<table>
  <tr>
    <td><img width="555" height="850" alt="모바일 뷰 상단" src="https://github.com/user-attachments/assets/cf54622f-9931-4f17-94b0-a195bacdaef7" /></td>
    <td><img width="557" height="853" alt="모바일 뷰 하단" src="https://github.com/user-attachments/assets/6b58645f-95b9-4f01-8081-a43c2e9823a6" /></td>
  </tr>
  <tr>
    <td align="center">상단 — 필터 · 차트</td>
    <td align="center">하단 — 테이블 · 랭킹</td>
  </tr>
</table>
