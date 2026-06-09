$raiz = $PSScriptRoot
Set-Location $raiz

function PararPorta($porta) {
    $conn = Get-NetTCPConnection -LocalPort $porta -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($conn) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }
}

function EsperarSite($url, $maxSeg = 90) {
    $esperou = 0
    while ($esperou -lt $maxSeg) {
        try {
            $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3
            if ($r.StatusCode -eq 200) { return $true }
        } catch {}
        Start-Sleep -Seconds 2
        $esperou += 2
        Write-Host "Aguardando $url ..." -ForegroundColor Yellow
    }
    return $false
}

Write-Host "TaskFlow - preparando..." -ForegroundColor Cyan

PararPorta 3000
PararPorta 3001

if (-not (Test-Path "$raiz\node_modules")) {
    Write-Host "Instalando front..."
    npm install
}

if (-not (Test-Path "$raiz\api\node_modules")) {
    Write-Host "Instalando api..."
    Set-Location "$raiz\api"
    npm install
    Set-Location $raiz
}

Set-Location "$raiz\api"
Write-Host "Banco de dados..."
npx prisma migrate deploy 2>$null
if ($LASTEXITCODE -ne 0) {
    npx prisma migrate dev --name init
}
npm run prisma:seed
Set-Location $raiz

Write-Host "Subindo API e front..." -ForegroundColor Green

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$raiz\api'; Write-Host 'API TaskFlow' -ForegroundColor Cyan; npm run start:dev"
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$raiz'; Write-Host 'Front TaskFlow' -ForegroundColor Cyan; npm run dev"

if (EsperarSite "http://localhost:3000") {
    Start-Process "http://localhost:3000"
    Write-Host ""
    Write-Host "Front: http://localhost:3000" -ForegroundColor Green
    Write-Host "API:   http://localhost:3001"
    Write-Host ""
    Write-Host "Login: gestor@taskflow.com / 123"
} else {
    Write-Host ""
    Write-Host "O front demorou para subir." -ForegroundColor Red
    Write-Host "Veja a janela 'Front TaskFlow' se deu erro."
    Write-Host "Quando aparecer 'Ready', abra: http://localhost:3000"
}
