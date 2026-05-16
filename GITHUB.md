# 用 GitHub 发布介绍页（GitHub Pages）

按顺序操作即可。

**你的仓库：** https://github.com/QiLiang-Li/qiliang1113  
**上线后网址：** https://qiliang-li.github.io/qiliang1113/

## 第一步：把项目推到 GitHub

在 **PowerShell** 中进入项目目录：

```powershell
cd C:\Users\良\.cursor\projects\empty-window\diary-finance-app
```

若还没有 Git 仓库，初始化并提交：

```powershell
git init
git add .
git commit -m "Initial commit: diary finance app and website"
```

关联远程仓库（把下面的地址换成你自己的）：

```powershell
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

若远程仓库**已有内容**（例如创建时勾选了 README），先拉再推：

```powershell
git pull origin main --rebase
git push -u origin main
```

> 若 `git remote add` 提示已存在，用 `git remote set-url origin https://github.com/你的用户名/你的仓库名.git` 修改地址。

---

## 第二步：开启 GitHub Pages

1. 打开仓库 **Actions**，确认 **Deploy website to GitHub Pages** 运行成功（绿色 ✓）
2. 打开 **Settings** → **Pages**
3. **Build and deployment** → **Source** 选 **Deploy from a branch**
4. **Branch** 选 `gh-pages`，文件夹选 `/ (root)`，点 **Save**

首次推送 `main` 后，Actions 会把 `website/` 发布到 `gh-pages` 分支。

---

## 第三步：访问你的网站

部署成功后（Actions 里绿色 ✓），网址一般为：

```text
https://你的用户名.github.io/你的仓库名/
```

例如用户名为 `zhangsan`、仓库名为 `diary-app`，则：

```text
https://zhangsan.github.io/diary-app/
```

在仓库 **Settings → Pages** 顶部也会显示 **Visit site** 链接。

---

## 第四步：配置 App 下载（可选）

1. 打包 Android APK，放到 `website/releases/diary-finance.apk`
2. 编辑 `website/config.json`：

```json
{
  "androidApkUrl": "./releases/diary-finance.apk",
  "version": "1.0.0"
}
```

3. 提交并推送：

```powershell
git add website
git commit -m "Add APK download"
git push
```

几分钟后网站上的「下载 Android」按钮即可点击。

---

## 常见问题

### Actions 失败

- 确认 **Settings → Pages → Source** 为 **GitHub Actions**
- 确认仓库 **Settings → Actions → General** 允许运行 Actions

### 页面 404

- 等 1～3 分钟再刷新
- 确认访问的是 `https://用户名.github.io/仓库名/`（注意仓库名大小写）
- 看 **Actions** 里最近一次部署是否成功

### 只改了网站没触发部署

工作流仅在 `website/` 或工作流文件变更时自动运行。也可在 **Actions** 里手动点 **Run workflow**。

### 私有仓库

GitHub 免费账号的私有仓库也可使用 Pages，但需在同一账号下访问。
