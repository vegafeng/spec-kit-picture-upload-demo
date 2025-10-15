# 启动照片管理系统
Write-Host "启动照片管理系统..." -ForegroundColor Green

# 启动后端服务器
Write-Host "启动后端服务器..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\Code\JavaCode\my-project\backend'; npm start"

# 等待2秒
Start-Sleep -Seconds 2

# 启动前端服务器
Write-Host "启动前端服务器..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\Code\JavaCode\my-project\frontend'; npm start"

Write-Host "项目启动完成！" -ForegroundColor Green
Write-Host "后端服务器: http://localhost:3001" -ForegroundColor Cyan
Write-Host "前端服务器: http://localhost:3000" -ForegroundColor Cyan
Write-Host "请等待前端编译完成后访问前端地址" -ForegroundColor Yellow
