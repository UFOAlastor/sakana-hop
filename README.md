# Sakana-Hop[石蒜摇] 使用简介

原作者：[卜卜口 itorr](https://github.com/itorr)

原项目仓库：https://github.com/itorr/sakana

移植：[Zander Alastor](https://github.com/UFOAlastor)

# 简单预览

![show](https://github.com/itorr/sakana/raw/main/html/takina.png)

![show](https://github.com/itorr/sakana/raw/main/html/chisato.png)

# 功能概况


# 使用介绍

>   若依赖启动失败：
>
>     - windows可尝试使用以管理者身份运行vscode
>     - mac 请留意是否将vscode从【下载】移动到【应用程序】里
>     - mac 可通过【检查vscode是否可以更新】来判断软件是否处于可写的硬盘中

>    删除时请注意：
>
>   -   先进入插件设置取消勾选“启动”
>
>       直接删除插件会导致注入vscode的js代码未被删除
>
>   -   如果已经直接删除插件，图像还存在于vscode上，请进入以下路径手动删除：
>
>       (旧版本vscode) C:\Users\your_id\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\code\electron-browser\workbench\
>
>       (新版本vscode) C:\Users\your_id\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\code\electron-sandbox\workbench\
>
>   -   文件目录下只有workbench.js和workbench.html是原始文件，其余皆为插件注入的文件


## Warns 警告：

> **本插件是通过修改 vscode 的 js 文件的方式运行**
> 所以会在初次安装，或者 vscode 升级的时候，出现以下提示，请选择 【不再提示】:
>
> **This extension works by editting the vscode's css file.**
> So, a warning appears while the first time to install or vscode update. U can click the [never show again] to avoid it.

## 请勿使用该项目进行商业盈利