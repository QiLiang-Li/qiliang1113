# 日记记账

一款简洁的手机 App，整合了**每日日记**、**长文感言**和**分类记账**三大功能。数据保存在本机，无需联网。

**仓库：** https://github.com/QiLiang-Li/qiliang1113  
**介绍页（GitHub Pages）：** https://qiliang-li.github.io/qiliang1113/

## 功能

- **日记**：日历选日期，为每一天写日记；有日记的日期会显示小圆点
- **感言**：独立页签，撰写和保存较长的文字；支持新建、编辑、长按删除
- **记账**：记录收入与支出；收入为绿色、支出为红色；支出支持生活开支、购物、娱乐、交通、餐饮、其他等分类

## 技术栈

- [Expo](https://expo.dev) + React Native + TypeScript
- expo-router（底部三个 Tab）
- AsyncStorage（本地持久化）

## 运行方式

### 1. 安装依赖（首次或报错时）

```powershell
cd diary-finance-app
npm run setup
```

或手动执行：

```powershell
npm install
npx expo install --fix
node scripts/create-assets.js
```

若提示 `expo-asset cannot be found`，务必先执行 `npm run setup` 再 `npx expo start`。

### 2. 启动开发服务器

```bash
npx expo start
```

### 3. 在手机上预览

1. 在手机上安装 **Expo Go**（[Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)）
2. 确保手机和电脑在同一 Wi-Fi
3. 扫描终端里显示的二维码即可打开 App

### 4. 打包成独立 App（可选）

需要 Expo 账号，可使用 [EAS Build](https://docs.expo.dev/build/introduction/) 生成 Android / iOS 安装包。

## 介绍与下载网站

项目内 `website/` 文件夹为对外宣传页，包含功能介绍与 Android / iOS 下载入口。

- 本地预览：`cd website && npx serve .`
- 发布到公网：见 [website/DEPLOY.md](website/DEPLOY.md)
- 打包 APK 后放到 `website/releases/`，并更新 `website/config.json` 中的 `androidApkUrl`

## 项目结构

```
website/              # 对外介绍与下载页
app/
  (tabs)/diary.tsx    # 日记 + 日历
  (tabs)/essays.tsx   # 感言列表
  (tabs)/finance.tsx  # 记账
  essay-editor.tsx    # 感言编辑页
src/
  context/            # 全局状态与存储
  components/
  constants.ts
  types.ts
```
