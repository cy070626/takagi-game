# 高木同学互动网站 V98

默认 Chapter 7“夏日祭”。保留既有角色、引擎重试、小游戏、音乐、记忆与移动布局，增加可读公式、表格及临时HTML互动卡片。

- 玩家和本次改动说明：[更新说明.md](更新说明.md)
- 目录维护说明：[维护指南.md](维护指南.md)
- 部署方法：[上传说明.md](上传说明.md)
- 本地组件预览：pages/reply-check.html，不调用API。

构建：npm ci，npm run check。回归检查：npm test。
日常编辑 js/main、js/features、css/source 与 netlify/functions，再重新构建。

新功能可以在聊天中输入“生成一个HTML分数小游戏”。展开后运行，收起后停止并重置。只支持小型本地互动，不连接外部服务。

上传本文件夹内容到原仓库发布根目录。Netlify环境变量继续沿用。预览服务器只用于静态页面检查，线上聊天需Netlify Functions。
