Adder Project Convention
📁 프로젝트 구조
ADDER/
├─ frontend/
├─ backend/
└─ logo/
프론트엔드와 백엔드를 하나의 레포지토리에서 관리한다
.git은 루트에만 존재한다
FE / BE 역할을 명확히 분리한다
🌿 브랜치 컨벤션
main
├─ feat/기능명
├─ fix/버그명
├─ refactor/구조명
└─ chore/설정명
규칙
기능 단위로 브랜치를 생성한다
작업 완료 후 PR을 통해 main에 병합한다
하나의 브랜치는 하나의 목적만 가진다
🧾 커밋 컨벤션
형식
type: 내용
타입
feat      기능 추가
fix       버그 수정
refactor  구조 개선 (동작 변화 없음)
chore     설정 / 환경 / 빌드
docs      문서
style     포맷 / 스타일
규칙
한 커밋에는 하나의 목적만 담는다
메시지는 짧고 명확하게 작성한다
동사형으로 작성한다
🔀 PR 컨벤션
규칙
PR 제목은 커밋 컨벤션과 동일한 형식을 사용한다
변경 목적, 주요 변경 사항, 테스트 방법을 포함한다
self-review 후 PR을 생성한다
🧪 검증 규칙
- frontend: 주요 화면 정상 동작 확인 후 병합
- backend: API 정상 응답 확인 후 병합
- 에러 없이 실행/빌드 가능한 상태만 커밋
🧩 개발 원칙
1. UI와 비즈니스 로직을 분리한다
2. Controller는 요청/응답만 처리한다
3. 비즈니스 로직은 Service에서 처리한다
4. API 응답 구조는 일관되게 유지한다
🗂 Frontend 구조
src/
├─ components/
├─ pages/
├─ hooks/
├─ services/
├─ types/
├─ utils/
├─ assets/
└─ styles/
역할 정의
components → 재사용 UI 컴포넌트
pages      → 라우트 단위 페이지
hooks      → 상태 및 로직 분리
services   → API 호출 및 데이터 처리
types      → 타입 정의
utils      → 공통 함수
⚙️ Backend 구조
com.adder.backend
├─ controller/
├─ service/
├─ domain/
├─ dto/
├─ repository/
├─ config/
└─ common/
역할 정의
controller → 요청/응답 처리
service    → 비즈니스 로직
repository → 데이터 접근
dto        → 요청/응답 객체
domain     → 엔티티
config     → 설정
🌐 API 컨벤션
규칙
- 모든 API는 /api로 시작한다
- 리소스는 명사형으로 작성한다
- 복수형을 우선 사용한다 (recipes)
- 동사 사용 금지 (getRecipe ❌)
- JSON 형식으로 통일한다
성공 응답
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "요청 성공",
  "result": {}
}
에러 응답
{
  "isSuccess": false,
  "code": "ERROR400",
  "message": "잘못된 요청입니다"
}
⚠️ 에러 처리 원칙
- 사용자 메시지와 내부 에러 로그를 구분한다
- 백엔드는 공통 응답 형식으로 에러를 반환한다
- 프론트는 서버 에러와 네트워크 에러를 구분하여 처리한다
🔄 상태 관리 전략
서버 상태 → TanStack Query
클라이언트 상태 → Zustand
규칙
- 서버 데이터는 Query로 관리한다
- UI 상태만 Zustand로 관리한다
- 두 상태를 혼용하지 않는다
💻 코드 컨벤션
- 들여쓰기: 2 spaces
- 세미콜론 사용
- 큰따옴표 사용
- 컴포넌트: PascalCase
- 변수/함수: camelCase
- Boolean: is / has / should
- handler: handle prefix
- 함수: 동사 + 명사
🎨 Tailwind CSS
1. layout
2. position
3. size
4. spacing
5. background / border
6. text
7. effect
8. state
🔐 환경 변수
.env.development
.env.production
규칙
- 민감 정보는 .env에만 저장한다
- .env 파일은 git에 포함하지 않는다
- 환경별 설정을 분리한다
- API Base URL은 환경변수로 관리한다
🚀 개발 흐름
1. backend API 구현
2. frontend API 연결
3. UI 구성
4. 상태 관리 적용
5. 기능 확장
🤝 협업 규칙
- PR 단위로 작업을 진행한다
- API 변경 시 사전에 공유한다
- 네이밍 규칙을 임의로 변경하지 않는다
- 구조 변경 시 문서를 먼저 수정한다
🧪 코드 리뷰 기준
- 중복 로직은 공통화 가능한지 확인한다
- 네이밍이 역할을 명확히 드러내는지 확인한다
- 하나의 함수/컴포넌트가 하나의 책임만 가지는지 확인한다
🌍 환경 분리 전략
- 개발 / 운영 환경을 분리한다
- API 주소 및 키는 환경변수로 관리한다
- 민감 정보는 코드에 포함하지 않는다
