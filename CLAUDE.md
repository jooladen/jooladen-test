## 프로젝트 개요
- 프로젝트명: 현재 폴더명 자동 사용 (Windows: echo %CD% 로 읽을 것)
- 기술스택: Next.js 16, TypeScript, Tailwind CSS
- 백엔드: bkend.ai (BaaS)
- 배포: Vercel
- 레벨: Dynamic

## 언어
모든 응답은 한국어로 할 것

## bkit 설정
- 온보딩 메뉴 스킵
- 세션 시작시 바로 실행할 것

## 프로젝트 초기화 규칙
최초 1회만 실행 (이미 package.json 있으면 스킵):
0. move CLAUDE.md ..
1. npx create-next-app@latest . --yes
2. .env.local 생성
3. .env.example 생성
4. .gitignore에 .env.local 확인
5. move ..\CLAUDE.md .

## Git 자동화 규칙
초기화 완료 후 최초 1회만 실행:
1. for %I in (.) do set FOLDER_NAME=%~nxI (현재 폴더명 읽기)
2. gh repo create %FOLDER_NAME% --public
3. git init
4. git remote add origin [생성된 repo URL]
5. git add . && git commit -m "init: 프로젝트 초기화"
6. git push -u origin main

## 배포 규칙
- 최초 1회: vercel (수동 설정 - Y, 계정 선택, N, Enter, Enter)
- 이후: vercel --prod --yes (자동 배포)
- .vercel 폴더 존재 여부로 최초/이후 자동 판단
- 배포 완료 후 URL을 deploy_log.txt에 기록
- for %I in (.) do curl -H "Content-Type: text/plain" -d "[기능명] 배포완료! [URL]" ntfy.sh/jooladen-%~nxI

## 자동화 규칙
## 전체자동 헬로월드 버튼클릭카운터
"전체자동 [기능1] [기능2]..." 라고 하면
각 기능을 순서대로 멈추지 말고 끝까지 실행할 것

순서: plan → design → do → analyze → iterate → report
- 중간에 사용자 확인 요청 금지
- iterate는 90% 달성까지 자동 반복 (최대 5회)
- 기능 1개 report 완료되면:
  1. 실행 대기 목록에서 [ ] 를 [x] 로 변경
  2. npm run build (빌드 성공 확인 - 실패시 에러 처리 규칙으로)
  3. git add . && git commit -m "feat: [기능명] 완료"
  4. git push
  5. vercel --prod --yes (배포)
  6. 배포 URL을 deploy_log.txt에 기록
  7. for %I in (.) do curl -H "Content-Type: text/plain" -d "[기능명] 완료! 배포: [URL]" ntfy.sh/jooladen-%~nxI
  8. echo "[기능명] clear 시도" >> clear_log.txt
  9. /clear 실행
  10. /context >> context_after_clear.txt
  11. sleep 3
  12. for %I in (.) do curl -H "Content-Type: text/plain" -d "@context_after_clear.txt" ntfy.sh/jooladen-%~nxI
  13. echo "[기능명] clear 성공 확인" >> clear_log.txt
  14. (새 세션 시작시) echo "새 세션 시작 - 다음기능: [다음기능명]" >> clear_log.txt
  15. for %I in (.) do curl -H "Content-Type: text/plain" -d "새 세션 시작 - 다음기능: [다음기능명]" ntfy.sh/jooladen-%~nxI
  16. CLAUDE.md 읽고 [ ] 남은 다음 기능 자동 시작
  17. 모든 기능 [x] 되면:
     - for %I in (.) do curl -H "Content-Type: text/plain" -d "%~nxI 전체 완료! 🎉" ntfy.sh/jooladen-%~nxI
     - "전체완료!" 출력 후 종료
- 절대 멈추거나 사용자한테 묻지 말 것

## 에러 처리 규칙
- 에러 발생시 즉시 ERROR.md에 아래 형식으로 기록 후 3회 재시도:
```
  ## [기능명] - [날짜 시각]
  - 단계: plan / design / do / analyze / iterate / build 중
  - 에러 내용: (전체 에러 메시지)
  - 재시도: 1회차 / 2회차 / 3회차
  - 해결 방법:
  - 최종 결과: 성공 / 실패(다음기능으로 넘어감)
```
- 재시도마다 ERROR.md 업데이트
- error_log.txt에도 append로 누적 기록 (전체 히스토리 보존)
- 에러 수정 완료되면:
  1. git add . && git commit -m "fix: [기능명] - [에러 한 줄 요약]"
  2. git push
  3. for %I in (.) do curl -H "Content-Type: text/plain" -d "[기능명] 에러 발생! ERROR.md 확인" ntfy.sh/jooladen-%~nxI
- 3회 실패시 ERROR.md 기록 후 다음 기능으로 넘어갈 것
- 절대 멈추지 말 것

## 커밋 규칙
- feat: 새 기능
- fix: 버그 수정
- docs: 문서
- chore: 설정 변경

## 실행 대기 기능 목록
- [x] 헬로월드
- [x] 버튼클릭카운터

## 완료된 기능
- 헬로월드 (2026-02-20)
- 버튼클릭카운터 (2026-02-20)
