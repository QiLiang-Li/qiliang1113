# 一键修复依赖与资源（在项目根目录 PowerShell 中运行）
Set-Location $PSScriptRoot\..

Write-Host ">>> 安装依赖..." -ForegroundColor Cyan
npm install

Write-Host ">>> 对齐 Expo 依赖版本..." -ForegroundColor Cyan
npx expo install --fix

Write-Host ">>> 生成图标资源..." -ForegroundColor Cyan
node scripts/create-assets.js

Write-Host ">>> 完成。请执行: npx expo start" -ForegroundColor Green
