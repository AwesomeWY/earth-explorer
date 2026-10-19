# Context Notes

- 2026-10-19: `npm install`이 ERESOLVE로 실패했다. vite 8이 esbuild ^0.27 이상을 요구하는데 package.json은 ^0.25였다. esbuild를 ^0.28로 올렸다.
- `@google/genai`, `express`, `dotenv`, `tsx`, `@types/express`는 src 어디에서도 쓰지 않아 제거했다. AI Studio 템플릿의 흔적이다. 같은 이유로 `.env.example`도 지웠다.
- 복습 라운드는 난이도가 섞이므로 GameScreen에서 `mode = currentWord.difficulty`로 문제마다 형식을 정한다. App의 selectedDifficulty는 복습 시 의미가 없어 'normal'로 둔다.
- 난이도별 통계는 라운드 difficulty 대신 각 결과의 `word.difficulty`로 쌓는다. 일반 라운드에서는 결과가 같다.
- 발음 듣기는 수동 버튼 클릭만 퀘스트에 반영한다. 문제 로드 시 자동 재생은 세지 않는다.
- 브랜드 로고 파일이 없어 텍스트 크레딧으로 넣었다 (전역 브랜딩 규칙).
- 정적 SPA이므로 Vercel은 Vite 프리셋 기본값(build → dist)으로 배포한다.
