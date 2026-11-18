# Pretendard 서브셋 웹폰트

- 원본: https://github.com/orioncactus/pretendard/tree/v1.3.9
- 파일: 공식 v1.3.9 배포본의 `packages/pretendard/dist/web/static/woff2-subset/`
- Regular 400, Medium 500, SemiBold 600, Bold 700, ExtraBold 800의 원본 WOFF2 서브셋을 변경 없이 포함한다.
- 라이선스: 동봉한 `LICENSE.txt` (SIL Open Font License 1.1). 템플릿과 함께 전달할 때 이 파일도 보존한다.
- 선언: `/assets/css/fonts.css`. 브라우저는 현재 화면에서 사용하는 굵기만 요청한다. 모든 굵기를 preload하지 않는다.
- 서브셋은 원본 전체 글리프를 포함하지 않는다. 드문 한글·한자·외국어·기호는 시스템 대체 글꼴로 표시될 수 있으므로 실제 콘텐츠로 확인한다.
- 지정된 다섯 굵기 이외의 굵기를 사용하려면 해당 공식 파일과 @font-face를 함께 추가한다. 폰트 교체 시 크기·줄바꿈·버튼·확대·대체 글꼴을 다시 확인한다.
