# Bibbidi App

React Native와 TypeScript로 개발하는 비비디 모바일 앱입니다.

## 시작하기

요구 환경은 Node.js 24와 pnpm 11입니다. 저장소 루트에서 실행합니다.

```bash
pnpm install
pnpm app
```

Android 기기에서 확인하려면 다음 명령을 사용합니다.

```bash
pnpm app:android
```

## 검사

```bash
pnpm app:typecheck
pnpm --filter @bibbidi/app lint
```

## Android 빌드

로컬 Debug 빌드는 다음 명령으로 생성합니다.

```powershell
pnpm --filter @bibbidi/app build:android:debug
```

Google Play 업로드용 Production AAB는 GitHub Actions의 **Android Release AAB** 워크플로에서 생성합니다. 빌드가 성공하면 실행 결과의 Artifacts에서 AAB와 `mapping.txt`를 내려받을 수 있습니다.
