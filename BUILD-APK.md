# 打包 APK 并发布到介绍页下载

介绍页地址：https://qiliang-li.github.io/qiliang1113/

---

## 一、打包 APK（推荐：EAS 云构建，无需 Android Studio）

### 1. 安装并登录

```powershell
cd C:\Users\良\.cursor\projects\empty-window\diary-finance-app

npm install -g eas-cli

eas login
```

按提示用 Expo 账号登录（没有可免费注册：https://expo.dev/signup）。

### 2. 关联项目（首次执行）

```powershell
eas build:configure
```

一路回车即可。会在 `app.json` 里写入 `extra.eas.projectId`。

### 3. 生成应用图标（打包前必做）

```powershell
npm install
node scripts/create-assets.js
```

会生成 `assets/icon.png` 等 1024×1024 图标。若缺少或过小，EAS 会在 Prebuild 阶段失败。

### 4. 开始打包 Android APK

```powershell
eas build -p android --profile preview
```

- 选 **APK**（不要选 AAB，AAB 是给 Google Play 用的）
- 等待约 10～20 分钟（免费账号可能要排队）
- 完成后终端会给一个 **下载链接**，或在 https://expo.dev 控制台 → 你的项目 → Builds 里下载

下载得到的文件一般类似：`build-xxxxx.apk`

---

## 五、把 APK 挂到介绍页

### 方式 A：用脚本（推荐）

把下载好的 apk 放到任意位置，例如桌面 `C:\Users\良\Downloads\xxx.apk`，然后：

```powershell
cd C:\Users\良\.cursor\projects\empty-window\diary-finance-app

powershell -ExecutionPolicy Bypass -File scripts\publish-apk.ps1 -ApkPath "C:\Users\良\Downloads\你的apk文件名.apk"
```

脚本会：复制到 `website/releases/diary-finance.apk` → 更新 `config.json` → 提交并推送到 GitHub → 自动更新网站。

### 方式 B：手动操作

1. 复制 apk 到：
   ```
   website/releases/diary-finance.apk
   ```

2. 编辑 `website/config.json`：
   ```json
   {
     "appName": "日记记账",
     "version": "1.0.0",
     "androidApkUrl": "./releases/diary-finance.apk",
     "iosAppStoreUrl": "",
     "updatedAt": "2026-05-16"
   }
   ```

3. 推送：
   ```powershell
   git add website/releases website/config.json
   git commit -m "Add Android APK download"
   git push
   ```

4. 等 1～3 分钟，打开 https://qiliang-li.github.io/qiliang1113/ ，「下载 Android」按钮会变绿可点。

---

## 六、别人如何安装

1. 用手机浏览器打开介绍页
2. 点 **下载 Android 安装包 (.apk)**
3. 下载完成后安装
4. 若提示「不允许未知来源」，在系统设置里允许**浏览器**或**文件管理器**安装应用

---

## 七、更新版本时

1. 修改 `app.json` 里的 `version`（如 `1.0.1`）
2. 重新执行 `eas build -p android --profile preview`
3. 用新 apk 再跑一遍 `publish-apk.ps1`（或手动替换并改 `config.json` 的 `version`）

---

## 常见问题

| 问题 | 处理 |
|------|------|
| Prebuild 失败 / Unknown error | 先执行 `node scripts/create-assets.js`，确认 `assets/` 下有 1024 图标，再重新 `eas build` |
| `eas: command not found` | 重新执行 `npm install -g eas-cli`，关闭终端再开 |
| 构建失败 | 打开 Expo 构建页 → **Prebuild** 日志，把最后几行发出来排查 |
| 网页按钮仍是灰色 | 确认 `config.json` 里 `androidApkUrl` 已填写且已 `git push` |
| apk 超过 100MB | GitHub 单文件限制 100MB，大文件需用 [GitHub Releases](https://docs.github.com/releases) 或网盘，把链接写在 `config.json` |

---

## 备选：本机打包（需 Android Studio，较复杂）

仅当你已安装 Android SDK 时：

```powershell
npx expo prebuild -p android
cd android
.\gradlew assembleRelease
```

apk 在 `android\app\build\outputs\apk\release\` 下。再按「二」发布到网站。
