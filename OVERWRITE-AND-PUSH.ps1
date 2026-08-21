param(
  [string]$RepoPath = "$env:USERPROFILE\Downloads\websitecongthanh-new",
  [string]$RepoUrl = "https://github.com/ungcongdanh94/websitecongthanh.git"
)

$ErrorActionPreference = "Stop"
$PackageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourcePath = Join-Path $PackageRoot "source"

if (-not (Test-Path (Join-Path $SourcePath "package.json"))) {
  throw "Khong tim thay bo ma nguon trong: $SourcePath"
}

if (-not (Test-Path (Join-Path $RepoPath ".git"))) {
  Write-Host "Thu muc Git chua ton tai. Dang clone lai tu GitHub..." -ForegroundColor Cyan
  $parent = Split-Path -Parent $RepoPath
  New-Item -ItemType Directory -Path $parent -Force | Out-Null
  if (Test-Path $RepoPath) { Remove-Item $RepoPath -Recurse -Force }
  git clone $RepoUrl $RepoPath
}

Write-Host "Dang sao luu file .env cuc bo..." -ForegroundColor Cyan
$envBackup = @{}
Get-ChildItem -Path $RepoPath -Force -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -like ".env*" -and $_.Name -ne ".env.example" } |
  ForEach-Object { $envBackup[$_.Name] = Get-Content $_.FullName -Raw }

Write-Host "Dang xoa ma nguon cu, giu lai .git..." -ForegroundColor Yellow
Get-ChildItem -Path $RepoPath -Force |
  Where-Object { $_.Name -ne ".git" } |
  Remove-Item -Recurse -Force

Write-Host "Dang chep toan bo ma nguon v0.8.1..." -ForegroundColor Cyan
Get-ChildItem -Path $SourcePath -Force | Copy-Item -Destination $RepoPath -Recurse -Force

foreach ($name in $envBackup.Keys) {
  Set-Content -Path (Join-Path $RepoPath $name) -Value $envBackup[$name] -NoNewline
}

Set-Location $RepoPath
Write-Host "Kiem tra phien ban va lenh chay:" -ForegroundColor Green
Get-Content package.json | Select-String '"version"|"start"'
Get-Content railway.json | Select-String 'startCommand'

Write-Host "Dang commit va push GitHub..." -ForegroundColor Cyan
git add -A
git commit -m "Fix product publish status and deploy v0.8.1"
if ($LASTEXITCODE -ne 0) {
  Write-Host "Khong co thay doi moi de commit; tiep tuc dong bo." -ForegroundColor Yellow
}
git pull --rebase origin main
git push origin main

Write-Host "HOAN TAT. Railway se deploy commit v0.8.1." -ForegroundColor Green
Write-Host "Log dung phai hien: congthanh-website@0.8.1" -ForegroundColor Green
