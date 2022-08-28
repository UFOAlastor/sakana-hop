# Sakana-Hop [石蒜摇]

# 使用简介 Introduction

原作者 OriginalAuthor：[卜卜口 itorr](https://github.com/itorr)

原项目仓库 OriginalGit：https://github.com/itorr/sakana

移植者 Transplanter：[Zander Alastor](https://github.com/UFOAlastor)

vscode插件仓库 ExtensionGit：https://github.com/UFOAlastor/sakana-hop

# 简单预览 Preview

![石蒜摇.gif](https://s2.loli.net/2022/08/27/RCsWxtk67TE5vAr.gif)

![show](https://github.com/itorr/sakana/raw/main/html/takina.png)

![show](https://github.com/itorr/sakana/raw/main/html/chisato.png)

# 功能概况 Overview

 - 支持放大缩小人物
 - 点击人物正下方按钮切换人物
 - 拖动人物正下方按钮移动人物
 - 自动模式，自动摇摆
 - 语言切换

E:
 - Supports zooming in and out of characters
 - Click the button below the character to switch the character
 - Drag the button below the character to move the character
 - Automatic mode, automatic swing
 - Language switching

# 已知问题 Bug

 - 人物摇摆时快速滑动窗口会导致闪烁，自动模式下尤其明显
 - 原作品的音效无法在vscode中播放，目前去除了“静音”按钮

E:
 - When the character swings, sliding the window quickly will cause flicker, especially in automatic mode
 - The sound effect of the original work cannot be played in vscode. At present, the "mute" button is removed

# 安装问题 Install

>若依赖启动失败：
> - windows可尝试使用以管理者身份运行vscode
> - mac 请留意是否将vscode从【下载】移动到【应用程序】里
> - mac 可通过【检查vscode是否可以更新】来判断软件是否处于可写的硬盘中

E:
>If the dependency startup fails:
> - Windows can try running vscode as administrator
> - Mac: please pay attention to whether to move vscode from [Download] to [application]
> - the Mac can determine whether the software is in the writable hard disk by checking whether the vscode can be updated

# 卸载注意！ Uinstall！

> - 先进入插件设置取消勾选“启动”
>
>   直接删除插件会导致注入vscode的js代码未被删除
>
> - 如果已经直接删除插件，图像还存在于vscode上，请进入以下路径手动删除：
>
>   (旧版本vscode) C:\Users\your_id\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\code\electron-browser\workbench\
>
>   (新版本vscode) C:\Users\your_id\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\code\electron-sandbox\workbench\
>
> - 文件目录下只有workbench.js和workbench.html是原始文件，其余皆为插件注入的文件
> - 其中workbench.js内第三行起由注释包裹部分也是注入的数据，若依旧存在需要手动删除

E:
> - Firstly, uncheck "start" in extension settings
>
>   Deleting the extension directly will cause the JS code injected into vscode not to be deleted!
>
> - if the extension has been deleted directly and the image still exists on vscode, please enter the following path to delete it manually:
>
>   (old version vscode) C: \ users \ your_ id\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\code\electron-browser\workbench\
>
>   (new version vscode) C: \ users \ your_ id\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\code\electron-sandbox\workbench\
>
> - in the file directory, only workbench.js and workbench.html are original files, and the rest are files injected by extensions
> - the part wrapped by comments in the third line of workbench.js is also the injected data. If it still exists, it needs to be deleted manually
>

## 警告 Warns：

> **本插件是通过修改 vscode 的 js 文件的方式运行**
> 所以会在初次安装，或者 vscode 升级的时候，出现以下提示，请选择 【不再提示】:

E:
> **This extension works by editting the vscode's css file.**
> So, a warning appears while the first time to install or vscode update. U can click the [never show again] to avoid it.

## 请勿使用该项目进行商业盈利 Commercial Profit Banned