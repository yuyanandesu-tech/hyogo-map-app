# デプロイ手順

このアプリはビルド不要の静的サイトです。`index.html` があるプロジェクトルートをそのまま公開します。

## 公開前チェック

```bash
python3 -m http.server 8765
```

ブラウザで `http://localhost:8765` を開き、以下を確認します。

- 地図が表示される
- 市区町村クリックで詳細が切り替わり、詳細欄へスクロールする
- 家賃、検索、指標、通勤フィルタが動く
- コメントの追加・削除ができる
- ブラウザの開発者ツールで重大なエラーが出ていない

## Cloudflare Pages

1. GitHub などにこのフォルダを push する
2. Cloudflare Pages で対象リポジトリを選ぶ
3. Build command は `exit 0`
4. Build output directory は `.`
5. デプロイする

## Netlify

1. Netlify にこのフォルダをドラッグ＆ドロップする、または Git リポジトリ連携する
2. Build command は空欄
3. Publish directory は `.`
4. デプロイする

## GitHub Pages

1. GitHub リポジトリに push する
2. Settings > Pages を開く
3. Source を `Deploy from a branch` にする
4. Branch を `main`、folder を `/root` にする
5. `.nojekyll` は配置済み

## 本番後チェック

- トップページが表示される
- `assets/hyogo-map-bg.png` が読み込まれる
- `data/areas.js` が読み込まれる
- 地図クリック、候補リスト、コメントが動く
- スマホ幅でサイドバーと地図が崩れない

## 注意

ユーザーコメントは `localStorage` 保存です。他ユーザーと共有されません。共有コメントにしたい場合は、Supabase、Firebase、自前APIなどに置き換えます。
