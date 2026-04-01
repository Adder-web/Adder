Adder Project

AI 기반 향수 설계 서비스 Adder
사용자와의 대화를 통해 개인 맞춤 향을 생성하고 저장하는 웹 서비스

📁 프로젝트 구조
ADDER/
├─ frontend/   # React + Vite
├─ backend/    # Spring Boot
└─ logo/       # 디자인 에셋
프론트엔드와 백엔드를 하나의 레포에서 관리
.git은 루트에만 존재
FE / BE 역할을 명확히 분리
🧰 기술 스택
Frontend
Package Manager: pnpm
Framework: Vite + React
Language: TypeScript
Styling: Tailwind CSS
State Management: Zustand
Data Fetching: TanStack Query
Font: Pretendard
Backend
Framework: Spring Boot
Language: Java 17
Build Tool: Gradle
Database: MySQL (예정)
ORM: Spring Data JPA (예정)
🔄 시스템 구조
Frontend (React)
      ↓
   API 요청
      ↓
Backend (Spring)
      ↓
 비즈니스 로직 처리
      ↓
   JSON 응답
🗂 Frontend 구조
src/
├─ main.tsx
├─ App.tsx
├─ globals.css
├─ assets/
├─ components/
├─ pages/
├─ hooks/
├─ services/
├─ types/
├─ utils/
└─ styles/
구조 원칙
UI 컴포넌트와 로직 분리
API 호출은 services 또는 hooks에서 관리
재사용 가능한 컴포넌트 우선 설계
⚙️ Backend 구조
com.adder.backend
├─ controller/
├─ service/
├─ domain/
├─ dto/
├─ repository/
├─ config/
└─ common/
구조 원칙
Controller: 요청/응답 처리
Service: 비즈니스 로직
Repository: 데이터 접근
DTO: 요청/응답 분리
🎨 디자인 시스템
Color
:root {
  --color-core-1: #6666e5;
  --color-core-2: #e6e6f3;
  --color-core-3: #b7b7f3;

  --color-text-black: #171718;
  --color-text-gray1: #494a50;
  --color-text-gray2: #5b5d6b;
  --color-text-gray3: #9b9ba1;
}
Typography
.text-title
.text-body
.text-caption
.text-headline
규칙
디자인 토큰 기반으로 스타일링
반복되는 스타일은 globals.css에 정의
Tailwind 유틸과 혼합 사용
🔄 상태 관리 전략
서버 상태 → TanStack Query
클라이언트 상태 → Zustand
원칙
서버 데이터는 Query로 관리
UI 상태만 Zustand 사용
두 상태를 혼용하지 않음
🌐 API 컨벤션
규칙
모든 API는 /api로 시작
리소스 중심 설계
JSON 형식 통일
예시
GET    /api/recipes
POST   /api/recipes
GET    /api/recipes/{id}
DELETE /api/recipes/{id}

POST   /api/chat
응답 구조
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "요청 성공",
  "result": {}
}
🧾 커밋 컨벤션
형식
type: 내용
타입
feat      기능 추가
fix       버그 수정
refactor  구조 개선
chore     설정 / 환경
docs      문서
style     포맷 / 스타일
규칙
한 커밋 = 하나의 목적
짧고 명확하게 작성
동사형 사용
🧩 개발 원칙
1. UI와 비즈니스 로직을 분리한다
2. Controller는 요청/응답만 처리한다
3. 비즈니스 로직은 Service에서 처리한다
4. API 응답 구조는 일관되게 유지한다
💻 코드 컨벤션
TypeScript / React
export default function UserProfile() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {};

  return <div />;
}
규칙
들여쓰기: 2 spaces
세미콜론 사용
큰따옴표 사용
PascalCase (컴포넌트)
camelCase (변수/함수)
Boolean: is / has / should
handler: handle prefix
Tailwind CSS
클래스 순서
1. layout
2. position
3. size
4. spacing
5. background / border
6. text
7. effect
8. state
🔐 환경변수
frontend
VITE_API_BASE_URL=http://localhost:8080
backend
OPENAI_API_KEY=...
🚀 시작하기
frontend
cd frontend
pnpm install
pnpm run dev
backend
cd backend
./gradlew bootRun
🔧 개발 흐름
1. backend API 구현
2. frontend API 연결
3. UI 구성
4. 상태 관리 적용
5. 기능 확장
