# 发布介绍与下载网站

`website` 文件夹是一个静态介绍页，可部署到公网，供他人了解 App 并下载安装包。

## 本地预览

在项目根目录执行：

```bash
cd website
npx --yes serve .
```

浏览器打开终端提示的地址（通常是 http://localhost:3000）。

## 获取公开网址（三选一）

### 方式 A：Vercel（推荐，最快）

1. 注册 [vercel.com](https://vercel.com)
2. 安装 CLI：`npm i -g vercel`
3. 在 `website` 目录执行：`vercel`
4. 按提示登录，完成后会得到类似 `https://diary-finance-xxx.vercel.app` 的网址

### 方式 B：Netlify

1. 注册 [netlify.com](https://www.netlify.com)
2. 将 `website` 文件夹拖到 Netlify 控制台「Deploy manually」
3. 获得 `https://随机名.netlify.app`

### 方式 C：GitHub Pages（已有 GitHub 仓库时推荐）

项目已包含自动部署工作流 `.github/workflows/deploy-website.yml`。

**详细步骤见 [GITHUB.md](./GITHUB.md)**，简要如下：

1. 将本项目 `git push` 到你的 GitHub 仓库
2. 仓库 **Settings → Pages → Source** 选择 **GitHub Actions**
3. 等待 Actions 跑完，访问 `https://你的用户名.github.io/仓库名/`

## 配置 Android 下载链接

1. 打包 App 生成 `.apk`（见下方「打包 APK」）
2. 将文件复制到：`website/releases/diary-finance.apk`
3. 编辑 `website/config.json`：

```json
{
  "androidApkUrl": "./releases/diary-finance.apk",
  "version": "1.0.0"
}
```

4. 重新部署网站，下载按钮会自动启用。

iOS 上架 App Store 后，在 `config.json` 填写 `iosAppStoreUrl` 即可。

## 打包 APK（Expo EAS）

在项目根目录（`diary-finance-app`）：

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

构建完成后，从 Expo 控制台下载 `.apk`，放到 `website/releases/` 并更新 `config.json`。

## 文件说明

| 文件 | 作用 |
|------|------|
| `index.html` | 介绍页主页面 |
| `config.json` | 下载链接与版本号配置 |
| `releases/` | 存放 `.apk` 安装包 |
| `css/style.css` | 页面样式 |
