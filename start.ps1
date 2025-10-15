# 照片管理系统启动脚本 (PowerShell)

Write-Host "🚀 启动照片管理系统..." -ForegroundColor Green

# 检查Node.js版本
Write-Host "📋 检查Node.js版本..." -ForegroundColor Cyan
node --version
npm --version

Write-Host ""
Write-Host "🔧 后端服务器状态检查..." -ForegroundColor Cyan

# 检查后端端口3001是否被占用
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method Get -TimeoutSec 3
    Write-Host "✅ 后端服务器已在端口3001运行" -ForegroundColor Green
} catch {
    Write-Host "⚠️  后端服务器未运行，正在启动..." -ForegroundColor Yellow
    
    Set-Location "d:\Code\JavaCode\my-project\backend"
    Write-Host "📁 当前目录: $(Get-Location)" -ForegroundColor Blue
    
    # 构建并启动后端
    Write-Host "🔨 构建后端..." -ForegroundColor Cyan
    npm run build
    
    Write-Host "🚀 启动后端服务器..." -ForegroundColor Cyan
    Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow -PassThru
    
    # 等待后端启动
    Write-Host "⏳ 等待后端服务器启动..." -ForegroundColor Yellow
    for ($i = 1; $i -le 30; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method Get -TimeoutSec 1
            Write-Host "✅ 后端服务器启动成功！" -ForegroundColor Green
            break
        } catch {
            Start-Sleep 1
            Write-Host "." -NoNewline
        }
    }
}

Write-Host ""
Write-Host "🎨 启动前端服务器..." -ForegroundColor Cyan
Set-Location "d:\Code\JavaCode\my-project\frontend"
Write-Host "📁 当前目录: $(Get-Location)" -ForegroundColor Blue

Write-Host "🚀 启动React开发服务器..." -ForegroundColor Cyan
npm start

Write-Host ""
Write-Host "🎉 系统启动完成！" -ForegroundColor Green
Write-Host "📱 前端地址: http://localhost:3000" -ForegroundColor Blue
Write-Host "🔧 后端地址: http://localhost:3001" -ForegroundColor Blue  
Write-Host "🏥 健康检查: http://localhost:3001/health" -ForegroundColor Blue
