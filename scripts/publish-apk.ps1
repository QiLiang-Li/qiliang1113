param(
    [Parameter(Mandatory = $true)]
    [string]$ApkPath,
    [string]$Version = "1.0.0"
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$configPath = Join-Path $root "website\config.json"
$tag = "v$Version"
$releaseUrl = "https://github.com/QiLiang-Li/qiliang1113/releases/download/$tag/diary-finance.apk"

if (-not (Test-Path -LiteralPath $ApkPath)) {
    Write-Error "APK not found: $ApkPath"
}

Set-Location $root

$gh = Get-Command gh -ErrorAction SilentlyContinue
if (-not $gh) {
    Write-Error "Need GitHub CLI (gh). Install: winget install GitHub.cli"
}

Write-Host ">>> Creating GitHub Release $tag ..." -ForegroundColor Cyan
$releaseExists = gh release view $tag 2>$null
if ($LASTEXITCODE -ne 0) {
    gh release create $tag $ApkPath --repo "QiLiang-Li/qiliang1113" --title "招财猫 $tag" --notes "Android APK for 招财猫 diary-finance app."
} else {
    gh release upload $tag $ApkPath --repo "QiLiang-Li/qiliang1113" --clobber
}
if ($LASTEXITCODE -ne 0) {
    Write-Error "gh release failed. Run: gh auth login"
}

Write-Host "Release URL: $releaseUrl" -ForegroundColor Green

$today = Get-Date -Format "yyyy-MM-dd"
$configJson = @"
{
  "appName": "\u62db\u8d22\u732b",
  "version": "$Version",
  "androidApkUrl": "$releaseUrl",
  "iosAppStoreUrl": "",
  "updatedAt": "$today"
}
"@
[System.IO.File]::WriteAllText($configPath, $configJson, [System.Text.UTF8Encoding]::new($false))
Write-Host "Updated website/config.json" -ForegroundColor Green

$env:GIT_AUTHOR_NAME = "QiLiang-Li"
$env:GIT_AUTHOR_EMAIL = "QiLiang-Li@users.noreply.github.com"
$env:GIT_COMMITTER_NAME = "QiLiang-Li"
$env:GIT_COMMITTER_EMAIL = "QiLiang-Li@users.noreply.github.com"

git add website/config.json website/js/main.js
$status = git status --porcelain
if (-not [string]::IsNullOrWhiteSpace($status)) {
    git commit -m "Point download to GitHub Release $tag"
    git push origin main
}

Write-Host ""
Write-Host "Done. Site (1-3 min):" -ForegroundColor Cyan
Write-Host "https://qiliang-li.github.io/qiliang1113/#download" -ForegroundColor White
Write-Host "Direct APK:" -ForegroundColor Cyan
Write-Host $releaseUrl -ForegroundColor White
