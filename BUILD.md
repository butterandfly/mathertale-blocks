# 构建说明

本项目包含两个主要的构建目标：库文件和 CLI 工具。

## 构建脚本

### 库构建
```bash
npm run build:lib
```
构建 React 组件库，输出到 `dist/` 目录：
- `dist/core.js` / `dist/core.cjs` - 核心模块
- `dist/components.js` / `dist/components.cjs` - 组件模块
- `dist/style.css` - 样式文件
- `dist/*.d.ts` - TypeScript 类型定义

### CLI 工具构建
```bash
npm run build:bin
```
构建 CLI 工具，输出到 `dist/bin/` 目录：
- `dist/bin/cli.js` - 可执行的 CLI 工具

### 完整构建
```bash
npm run build:all
```
同时构建库文件和 CLI 工具。

## CLI 工具使用

构建完成后，可以通过以下方式使用 CLI 工具：

### 直接运行
```bash
./dist/bin/cli.js --help
```

### 安装为全局命令
如果将包发布到 npm，用户安装后可以使用：
```bash
mathertale-build --help
```

### 可用命令

#### 构建数据库
```bash
mathertale-build db <rootDir> [--output <outputDir>]
```

#### 构建独立任务
```bash
mathertale-build soloquests <rootDir> [--output <outputDir>]
```

## 配置文件说明

### TypeScript 配置
- `tsconfig.json` - 主要的 TypeScript 配置，包含库文件和 bin 目录
- `tsconfig.bin.json` - 专用于 bin 目录的 TypeScript 配置

### Vite 配置
- `vite.config.ts` - 库文件构建配置
- `vite.bin.config.ts` - CLI 工具构建配置

### 关键配置点

#### 外部依赖
CLI 工具的构建配置将以下依赖标记为外部：
- Node.js 内置模块 (`fs`, `path`, 等)
- 第三方库 (`chalk`, `commander`, `ora`, `fs-extra`, `marked`)

这意味着这些依赖不会被打包，而是在运行时从 `node_modules` 加载。

#### 内部模块解析
CLI 工具可以导入项目内部的模块（如 `../lib/core/core`），这些会被正确解析和打包。

## 注意事项

1. **执行权限**: 构建脚本会自动为生成的 CLI 文件添加执行权限
2. **Shebang**: CLI 文件包含 `#!/usr/bin/env node` 以支持直接执行
3. **模块格式**: CLI 工具使用 ES 模块格式，需要 Node.js 14+ 支持
4. **依赖管理**: 确保所有外部依赖都在 `package.json` 的 `dependencies` 中声明 