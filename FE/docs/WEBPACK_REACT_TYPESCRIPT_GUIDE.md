# Webpack 기반 React & TypeScript 개발환경 가이드

## 1. 목적

이 프로젝트는 다음 요구사항을 충족하기 위해 Vite나 Next.js 없이 Webpack 개발환경을 직접 구성했다.

- Webpack 기반 프론트엔드 프로젝트를 직접 설정하고 번들링에 필요한 요소를 이해한다.
- React와 TypeScript 개발에 필요한 환경을 구성하고 실행한다.

핵심은 React 화면을 띄우는 것뿐 아니라, 소스 코드가 브라우저용 파일로 변환되는 흐름과 빌드 오류가 발생했을 때 확인할 위치를 이해하는 것이다.

## 2. 빌드 흐름

```text
src/index.tsx
    ↓
Webpack이 import 관계 분석
    ↓
ts-loader가 TypeScript와 TSX 변환
css-loader가 CSS 해석
Asset Modules가 이미지 처리
    ↓
JavaScript와 CSS 번들 생성
    ↓
HtmlWebpackPlugin이 HTML에 번들 연결
    ↓
개발 서버 실행 또는 dist/ 생성
```

Webpack은 `entry`에서 시작해 `import`된 파일들의 관계를 만든다. 이를 **의존성 그래프**라고 한다. 그래프에 포함된 파일들을 브라우저가 사용할 수 있도록 묶은 결과가 **번들**이다.

## 3. 주요 도구

| 도구 | 역할 |
|---|---|
| Node.js | 프론트엔드 개발 도구 실행 |
| pnpm | 패키지 설치와 버전 관리 |
| React | 컴포넌트 기반 UI 작성 |
| React DOM | React를 브라우저 DOM에 연결 |
| TypeScript | 정적 타입 검사 |
| Webpack | 의존성 분석 및 번들 생성 |
| ts-loader | TypeScript와 TSX 변환 |
| css-loader | CSS import와 URL 해석 |
| style-loader | 개발 환경에서 CSS 적용 |
| HtmlWebpackPlugin | HTML 생성 및 번들 자동 연결 |
| MiniCssExtractPlugin | 운영 환경에서 CSS 파일 분리 |
| webpack-dev-server | 개발 서버와 HMR 제공 |

```text
React      → 화면 구성
TypeScript → 타입 검사
Webpack    → 파일 변환과 번들링 관리
```

## 4. 프로젝트 구조

```text
FE/
├─ public/index.html
├─ src/
│  ├─ types/assets.d.ts
│  ├─ App.css
│  ├─ App.tsx
│  ├─ index.css
│  ├─ index.tsx
│  └─ logo.svg
├─ package.json
├─ pnpm-lock.yaml
├─ tsconfig.json
└─ webpack.config.js
```

| 파일 | 역할 |
|---|---|
| `public/index.html` | React가 연결되는 `#root` 제공 |
| `src/index.tsx` | 애플리케이션 진입점 |
| `src/App.tsx` | 최상위 React 컴포넌트 |
| `src/types/assets.d.ts` | CSS와 이미지 import 타입 선언 |
| `tsconfig.json` | TypeScript 검사 규칙 |
| `webpack.config.js` | 번들링 및 개발 서버 설정 |
| `package.json` | 의존성과 실행 명령 관리 |

## 5. Webpack 핵심 설정

### Entry와 Output

```javascript
entry: "./src/index.tsx";
```

`entry`는 Webpack이 파일 분석을 시작하는 위치다.

```javascript
output: {
  path: path.resolve(__dirname, "dist"),
  filename: "assets/[name].[contenthash:8].js",
  publicPath: "/",
  clean: true,
}
```

- `path`: 빌드 결과 위치
- `contenthash`: 파일 내용에 따른 이름을 생성하여 캐시 관리
- `publicPath`: 정적 리소스의 기준 경로
- `clean`: 이전 빌드 결과 제거

### Loader

loader는 파일을 Webpack이 처리할 수 있는 형태로 변환한다.

| 대상 | 처리 도구 |
|---|---|
| `.ts`, `.tsx` | `ts-loader` |
| `.css` | `css-loader`, `style-loader` |
| 이미지 | Webpack Asset Modules |

CSS loader는 오른쪽에서 왼쪽으로 실행된다.

```text
CSS → css-loader → style-loader → 브라우저 적용
```

운영 빌드에서는 `style-loader` 대신 `MiniCssExtractPlugin`을 사용해 CSS를 별도 파일로 만든다.

### Plugin

plugin은 빌드 전체 과정에 기능을 추가한다.

- `HtmlWebpackPlugin`: HTML을 생성하고 JavaScript와 CSS를 자동 연결
- `MiniCssExtractPlugin`: 운영 빌드에서 CSS 파일 분리

```text
loader → 파일 단위 변환
plugin → 빌드 과정 확장
```

### 기타 설정

| 설정 | 역할 |
|---|---|
| `mode` | development 또는 production 결정 |
| `devtool` | Source Map 생성 방식 결정 |
| `resolve` | import한 파일의 확장자와 경로 탐색 |
| `optimization` | runtime과 공통 코드를 청크로 분리 |
| `devServer` | 개발 서버, HMR, SPA fallback 설정 |
| `performance` | production 번들 크기 경고 |
| `stats` | 터미널에 표시할 빌드 정보 결정 |

## 6. TypeScript 설정

`tsconfig.json`의 주요 옵션은 다음과 같다.

| 옵션 | 역할 |
|---|---|
| `target` | 변환할 JavaScript 문법 수준 |
| `lib` | DOM과 JavaScript 타입 제공 |
| `module` | ES Module 문법 유지 |
| `moduleResolution` | 번들러 방식으로 import 해석 |
| `jsx` | React JSX 변환 방식 |
| `strict` | 엄격한 타입 검사 |
| `forceConsistentCasingInFileNames` | 파일명 대소문자 오류 검사 |

TypeScript는 CSS와 이미지의 타입을 알 수 없으므로 `assets.d.ts`에 선언한다. Webpack은 별도의 loader 또는 Asset Module 규칙으로 실제 파일을 처리한다.

## 7. 실행 방법

```bash
# 의존성 설치
pnpm install --frozen-lockfile

# 개발 서버: http://localhost:3000
pnpm dev

# 타입 검사
pnpm typecheck

# 운영 빌드
pnpm build
```

운영 빌드는 타입 검사 후 Webpack production 빌드를 수행하고 `dist/`를 생성한다.

```text
dist/
├─ index.html
└─ assets/
   ├─ runtime.[hash].js
   ├─ [vendor].[hash].js
   ├─ main.[hash].js
   ├─ main.[hash].css
   └─ logo.[hash].svg
```

## 8. Development와 Production

| Development | Production |
|---|---|
| 빠른 재빌드 | 코드 압축 및 최적화 |
| Source Map 제공 | content hash 적용 |
| HMR 사용 | CSS 별도 파일 생성 |
| 개발 서버에서 실행 | `dist/`에 결과 생성 |

production 빌드 결과는 AWS Amplify Hosting 또는 S3와 CloudFront 같은 정적 호스팅에 배포할 수 있다.

## 9. 오류 확인 위치

| 증상 | 확인할 항목 |
|---|---|
| 모듈을 찾지 못함 | import 경로와 파일명 대소문자 |
| TSX를 처리하지 못함 | `ts-loader`, `tsconfig.json`의 `jsx` |
| CSS가 적용되지 않음 | CSS import와 loader 순서 |
| 이미지 import 오류 | Asset Module과 `assets.d.ts` |
| 화면이 비어 있음 | HTML의 `#root`, `index.tsx`, 브라우저 콘솔 |
| 하위 URL에서 404 | `historyApiFallback`과 배포 rewrite |
| 로컬은 성공하고 CI만 실패 | Node/pnpm 버전, lockfile, 파일명 대소문자 |
| 번들이 너무 큼 | 대형 라이브러리, 이미지, 중복 의존성 |

TypeScript는 현재 `ts-loader`와 호환되는 `6.0.3`으로 고정했다. TypeScript나 loader의 메이저 버전을 변경하면 다음 명령을 모두 확인해야 한다.

```bash
pnpm typecheck
pnpm build
```

## 10. 완료 기준

- [x] React와 TypeScript가 설치되어 있다.
- [x] Webpack의 entry와 output을 직접 설정했다.
- [x] TypeScript, CSS, 이미지 처리 규칙을 설정했다.
- [x] HTML에 번들이 자동 연결된다.
- [x] 개발 서버와 HMR이 동작한다.
- [x] `pnpm typecheck`가 성공한다.
- [x] `pnpm build`가 성공한다.
- [x] 운영 결과물이 `dist/`에 생성된다.
- [x] 파일에 content hash가 적용된다.
- [x] 실행, 빌드, 오류 확인 방법이 문서화되어 있다.
