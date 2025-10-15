# 📸 照片管理系统启动指南

## 🚀 快速启动

### 当前项目状态
- ✅ **后端服务器**: 已启动并运行在 http://localhost:3001
- ✅ **前端服务器**: 已启动并运行在 http://localhost:3000

**项目已成功启动！** 您可以通过以下地址访问：
- 前端应用：http://localhost:3000
- 后端API：http://localhost:3001/health

### 方法一：自动启动脚本（推荐）

**Windows PowerShell:**
```powershell
cd d:\Code\JavaCode\my-project
.\start-servers.ps1
```

**原有脚本:**
```powershell
.\start.ps1
```

**Bash/Git Bash:**
```bash
./start.sh
```

### 方法二：手动启动前端（后端已运行）

由于后端已经在运行，您只需要启动前端：

```powershell
# 在新的PowerShell窗口中运行
cd d:\Code\JavaCode\my-project\frontend
npm start
```

### 方法三：完全手动启动

#### 1. 启动后端服务器
```powershell
# 进入后端目录
cd d:\Code\JavaCode\my-project\backend

# 开发模式（推荐 - 自动重载）
npm run dev

# 或生产模式
npm run build
npm start
```

#### 2. 启动前端服务器
```powershell
# 新开一个终端，进入前端目录
cd d:\Code\JavaCode\my-project\frontend

# 启动React开发服务器
npm start
```

## 🌐 访问地址

- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:3001  
- **健康检查**: http://localhost:3001/health

## 📋 系统要求

- Node.js >= 18.0.0
- npm >= 8.0.0

## 🔧 开发命令

### 后端
```bash
npm run dev          # 开发模式（自动重载）
npm run build        # 构建TypeScript
npm start           # 启动生产服务器
npm test            # 运行测试
npm run lint        # 代码检查
```

### 前端  
```bash
npm start           # 启动开发服务器
npm run build       # 构建生产版本
npm test            # 运行测试
npm run lint        # 代码检查
```

## 🎯 功能特性

- ✅ **后端API服务器** (Express.js + TypeScript)
- ✅ **前端React应用** (React 18+ + TypeScript)
- ✅ **健康检查端点** 
- ✅ **CORS配置**
- ✅ **安全中间件**
- ✅ **请求日志记录**
- ✅ **错误处理**
- ⏳ **照片上传功能** (开发中)
- ⏳ **照片管理功能** (开发中)

## 🐛 故障排除

### 端口被占用
如果端口3000或3001被占用，请检查并关闭占用进程：

```powershell
# 检查端口占用
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# 终止进程（替换<PID>为实际进程ID）
taskkill /PID <PID> /F
```

### 依赖安装问题
如果遇到依赖问题，尝试重新安装：

```bash
# 后端
cd backend
rm -rf node_modules package-lock.json
npm install

# 前端  
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 开发状态

- **Phase 1**: ✅ 项目设置完成
- **Phase 2**: 🔄 基础架构开发中  
- **Phase 3**: ⏳ 用户故事实现（待开始）

---

💡 **提示**: 第一次启动可能需要较长时间来编译TypeScript和启动服务器，请耐心等待。