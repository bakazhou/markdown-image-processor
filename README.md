# Markdown 图片处理工具

这是一个用于处理 Markdown 文件中的图片的工具，可以自动将本地图片上传到图床（SM.MS）并更新 Markdown 文件中的图片链接。

## 功能特点

- 自动检测 Markdown 文件中的本地图片
- 将图片上传到 SM.MS 图床
- 自动更新 Markdown 文件中的图片链接
- 保留原始文件，生成新的处理后文件

## 使用方法

1. 安装依赖：

```bash
npm install
```

2. 配置信息：
   在 `config.js` 中设置必要信息：

- `smms.credentials.username`：SM.MS 的用户名
- `smms.credentials.password`：SM.MS 的密码
- `markdown.filePath`：需要处理的 Markdown 文件的完整路径

3. 运行程序：

```bash
node main.js
```

4. 查看结果：
   在原markdown文件的同级目录下会生成一个新的markdown文件，名称为{原名_updated.md}，其中的图片链接已经被替换为SM.MS的链接。

