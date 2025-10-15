#!/bin/bash

# 照片管理系统启动脚本

echo "🚀 启动照片管理系统..."

# 检查Node.js版本
echo "📋 检查Node.js版本..."
node --version
npm --version

echo ""
echo "🔧 后端服务器状态检查..."

# 检查后端端口3001是否被占用
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ 后端服务器已在端口3001运行"
else
    echo "⚠️  后端服务器未运行，正在启动..."
    cd "d:\Code\JavaCode\my-project\backend"
    echo "📁 当前目录: $(pwd)"
    
    # 构建并启动后端
    echo "🔨 构建后端..."
    npm run build
    
    echo "🚀 启动后端服务器..."
    npm start &
    
    # 等待后端启动
    echo "⏳ 等待后端服务器启动..."
    for i in {1..30}; do
        if curl -s http://localhost:3001/health > /dev/null; then
            echo "✅ 后端服务器启动成功！"
            break
        fi
        sleep 1
        echo -n "."
    done
fi

echo ""
echo "🎨 启动前端服务器..."
cd "d:\Code\JavaCode\my-project\frontend"
echo "📁 当前目录: $(pwd)"

echo "🚀 启动React开发服务器..."
npm start

echo ""
echo "🎉 系统启动完成！"
echo "📱 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:3001"
echo "🏥 健康检查: http://localhost:3001/health"
