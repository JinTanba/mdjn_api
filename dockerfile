# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./
COPY tsconfig.json ./

# 開発依存関係を含むすべての依存関係をインストール
RUN npm ci

# ソースコードをコピー
COPY src/ ./src/

# TypeScriptのビルド
RUN npm run build

# 実行ステージ
FROM node:18-alpine AS runner

WORKDIR /app

# プロダクション依存関係のみをインストール
COPY package*.json ./
RUN npm ci --only=production

# ビルドステージからビルド済みファイルをコピー
COPY --from=builder /app/dist ./dist

# 非rootユーザーで実行
USER node

# Node.jsにESMを使用することを明示的に伝える
ENV NODE_OPTIONS="--experimental-specifier-resolution=node"

CMD ["node", "--experimental-modules", "dist/index.js"]