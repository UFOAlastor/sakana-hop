"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dom = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const FileType_1 = require("./FileType");
const vsHelp_1 = require("./vsHelp");
const allowScript_1 = require("./allowScript");
const originalHtml_1 = require("./originalHtml");
class Dom {
    //初始化参数
    constructor(configName, filePath, version, extName) {
        this.configName = configName;
        this.filePath = filePath;
        this.version = version;
        this.extName = extName;
        this.config = vscode.workspace.getConfiguration(this.configName);
        let firstload = this.checkFirstload(); // 是否初次加载插件
        let fileType = this.getFileType(); // 文件目前状态
        // 如果是第一次加载插件，或者旧版本
        if (firstload || fileType === FileType_1.default.isOld || fileType === FileType_1.default.empty) {
            const base = path.dirname(require.main.filename);
            copy(path.join(__dirname, '../main/'), path.join(base, 'vs', 'code', 'electron-sandbox', 'workbench'));
            this.install(true);
        }
    }
    /**
     * 安装插件，hack
     *
     * @private
     * @param {boolean} [refresh] 需要更新
     * @returns {void}
     */
    install (refresh) {
        let lastConfig = this.config; // 之前的配置
        let config = vscode.workspace.getConfiguration(this.configName); // 当前用户配置
        // 1.如果配置文件改变到时候，当前插件配置没有改变，则返回
        if (!refresh && JSON.stringify(lastConfig) === JSON.stringify(config)) {
            return;
        }
        // 之后操作有两种：1.初次加载  2.配置文件改变
        // 2.两次配置均为，未启动插件
        if (!lastConfig.enabled && !config.enabled) {
            return;
        }
        // 3.保存当前配置
        this.config = config; // 更新配置
        // 4.如果关闭插件
        if (!config.enabled) {
            this.uninstall();
            vsHelp_1.default.showInfoRestart(this.extName + '已关闭插件，请重新启动！');
            return;
        }
        // 5.hack 样式
        // 自定义的样式内容
        // let content = getJs_1.default(config, this.extName, this.version).replace(/\s*$/, ''); // 去除末尾空白
        let content = '\r\n';
        // const JsFile = fs.readFileSync(path.join('../main/main.html', 'utf-8')).split(/\r?\n/);
        content += '/*ext-' + this.extName + '-start*/\n';
        content += '/*ext.' + this.extName + '.ver.' + this.version + '*/\n';
        const lines = fs.readFileSync(path.join(__dirname, '..', 'main', 'main.html'), 'utf-8').split(/\r?\n/);
        lines.forEach((line) => {
            content += "document.writeln(\"" + line.replace(/\"/g, '\'') + "\");\n";
        })
        content += '/*ext-' + this.extName + '-end*/\n';
        // 添加代码到文件中，并尝试删除原来已经添加的
        let newContent = this.getContent();
        newContent = this.clearJSContent(newContent);
        newContent += content;
        this.saveContent(newContent);
        // 设置新的HTML
        let newHTML = allowScript_1.default().replace(/\s*$/, '');
        const htmlPath = path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'workbench.html');
        fs.writeFileSync(htmlPath, newHTML, 'utf-8');
        vsHelp_1.default.showInfoRestart(this.extName + ' 已更新配置，请重新启动！');
    }
    /**
     * 获取文件内容
     * @var mixed
     */
    getContent () {
        return fs.readFileSync(this.filePath, 'utf-8');
    }
    /**
     * 设置文件内容
     *
     * @private
     * @param {string} content
     */
    saveContent (content) {
        fs.writeFileSync(this.filePath, content, 'utf-8');
    }
    /**
     * 清理已经添加的代码
     *
     * @private
     * @param {string} content
     * @returns {string}
     */
    clearJSContent (content) {
        var re = new RegExp("\\/\\*ext-" + this.extName + "-start\\*\\/[\\s\\S]*?\\/\\*ext-" + this.extName + "-end\\*" + "\\/", "g");
        content = content.replace(re, '');
        content = content.replace(/\s*$/, '');
        return content;
    }
    /**
     * 卸载
     *
     * @private
     */
    uninstall () {
        try {
            let content = this.getContent();
            content = this.clearJSContent(content);
            this.saveContent(content);
            // 还原HTML
            let originalHtml = originalHtml_1.default().replace(/\s*$/, '');
            const htmlPath = path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'workbench.html');
            fs.unlinkSync(path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'locale.js'));
            fs.unlinkSync(path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'document.js'));
            fs.unlinkSync(path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'document.css'));
            fs.unlinkSync(path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'index.html'));
            fs.unlinkSync(path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'config.json'));
            removeFiles(path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'model'));
            fs.writeFileSync(htmlPath, originalHtml, 'utf-8');
            return true;
        }
        catch (ex) {
            return false;
        }
    }
    /**
     * 检测是否初次加载，并在初次加载的时候提示用户
     *
     * @private
     * @returns {boolean} 是否初次加载
     */
    checkFirstload () {
        const configPath = path.join(__dirname, '../main/config.json');
        let info = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (info.firstload) {
            // 提示
            vsHelp_1.default.showInfo('插件： ' + this.extName + '已启动! ');
            // 标识插件已启动过
            info.firstload = false;
            fs.writeFileSync(configPath, JSON.stringify(info, null, '    '), 'utf-8');
            return true;
        }
        return false;
    }
    /**
     * 获取文件状态
     *
     * @private
     * @returns {FileType}
     */
    getFileType () {
        let jsContent = this.getContent();
        // 未 hack 过
        let ifUnInstall = !~jsContent.indexOf(`ext.${this.extName}.ver`);
        if (ifUnInstall) {
            return FileType_1.default.empty;
        }
        // hack 过的旧版本
        let ifVerOld = !~jsContent.indexOf(`/*ext.${this.extName}.ver.${this.version}*/`);
        if (ifVerOld) {
            return FileType_1.default.isOld;
        }
        // hack 过的新版本
        return FileType_1.default.isNew;
    }
}
exports.Dom = Dom;
function copy (src, dst) {
    let paths = fs.readdirSync(src); //同步读取当前目录
    paths.forEach(function (path) {
        var _src = src + '/' + path;
        var _dst = dst + '/' + path;
        fs.stat(_src, function (err, stats) {
            //stats  该对象 包含文件属性
            if (err) {
                throw err;
            }
            if (stats.isFile()) {
                //如果是个文件则拷贝
                let readable = fs.createReadStream(_src); //创建读取流
                let writable = fs.createWriteStream(_dst); //创建写入流
                readable.pipe(writable);
            }
            else if (stats.isDirectory()) {
                //是目录则 递归
                checkDirectory(_src, _dst, copy);
            }
        });
    });
}
function checkDirectory (src, dst, callback) {
    fs.access(dst, fs.constants.F_OK, (err) => {
        if (err) {
            fs.mkdirSync(dst);
            callback(src, dst);
        }
        else {
            callback(src, dst);
        }
    });
}
function removeFiles (path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                removeFiles(curPath);
            }
            else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}