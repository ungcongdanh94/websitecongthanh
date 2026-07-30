param(
  [string]$RepoPath = "C:\Users\ACER\Downloads\websitecongthanh-new"
)

$ErrorActionPreference = "Stop"
$PackageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourcePath = Join-Path $PackageRoot "source"

if (-not (Test-Path (Join-Path $RepoPath ".git"))) {
  throw "Khong tim thay thu muc Git tai: $RepoPath"
}
if (-not (Test-Path (Join-Path $SourcePath "package.json"))) {
  throw "Khong tim thay bo ma nguon trong: $SourcePath"
}

Write-Host "Dang sao luu file .env cuc bo..." -ForegroundColor Cyan
$envBackup = @{}
Get-ChildItem -Path $RepoPath -Force -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -like ".env*" } |
  ForEach-Object { $envBackup[$_.Name] = Get-Content $_.FullName -Raw }

Write-Host "Dang xoa ma nguon cu, giu lai .git..." -ForegroundColor Yellow
Get-ChildItem -Path $RepoPath -Force |
  Where-Object { $_.Name -ne ".git" } |
  Remove-Item -Recurse -Force

Write-Host "Dang chep toan bo ma nguon v0.8..." -ForegroundColor Cyan
Copy-Item -Path (Join-Path $SourcePath "*") -Destination $RepoPath -Recurse -Force
Copy-Item -Path (Join-Path $SourcePath ".gitignore") -Destination $RepoPath -Force
Copy-Item -Path (Join-Path $SourcePath ".env.example") -Destination $RepoPath -Force

foreach ($name in $envBackup.Keys) {
  Set-Content -Path (Join-Path $RepoPath $name) -Value $envBackup[$name] -NoNewline
}

Set-Location $RepoPath
Write-Host "Kiem tra phien ban:" -ForegroundColor Green
Get-Content package.json | Select-String '"version"|"start"'
Get-Content railway.json | Select-String 'startCommand'

Write-Host "Dang commit va push GitHub..." -ForegroundColor Cyan
git add -A
git commit -m "Replace full source with CÔNG THẢNH website v0.8" 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Khong co thay doi moi de commit; tiep tuc dong bo." -ForegroundColor Yellow
}
git pull --rebase origin main
git push origin main

Write-Host "HOAN TAT. Railway se deploy commit moi nhat." -ForegroundColor Green
