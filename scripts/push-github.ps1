# 推送到 https://github.com/QiLiang-Li/qiliang1113 并触发介绍页部署
Set-Location $PSScriptRoot\..

$remote = "https://github.com/QiLiang-Li/qiliang1113.git"

if (-not (Test-Path .git)) {
  git init
  git branch -M main
}

git add .
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  git commit -m "Add diary finance app and website for GitHub Pages"
}

git remote remove origin 2>$null
git remote add origin $remote

Write-Host ">>> 拉取远程 main（合并仓库自带 README）..." -ForegroundColor Cyan
git pull origin main --allow-unrelated-histories --no-rebase 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "若提示冲突，请打开冲突文件解决后执行: git add . ; git commit ; git push" -ForegroundColor Yellow
}

Write-Host ">>> 推送到 GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "推送成功！请完成 Pages 设置：" -ForegroundColor Green
  Write-Host "1. 打开 https://github.com/QiLiang-Li/qiliang1113/settings/pages"
  Write-Host "2. Source 选择 GitHub Actions"
  Write-Host "3. 等待 Actions 完成后访问: https://qiliang-li.github.io/qiliang1113/"
}
