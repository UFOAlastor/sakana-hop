"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uninstall = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const vsHelp_1 = require("./vsHelp");
const originalHtml_1 = require("./originalHtml");
class Uninstall {
    //初始化参数
    constructor(extName) {
        this.filePath = path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'workbench.js');
        this.extName = extName;
     }
    /**
     * 获取文件内容
     * @var mixed
     */
    getContent() {
        filePath = path.join(path.dirname)
        return fs.readFileSync(this.filePath, 'utf-8');
    }
    /**
     * 设置文件内容
     *
     * @private
     * @param {string} content
     */
    saveContent(content) {
        fs.writeFileSync(this.filePath, content, 'utf-8');
    }
    /**
     * 清理已经添加的代码
     *
     * @private
     * @param {string} content
     * @returns {string}
     */
    clearJSContent(content) {
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
    uninstall() {
        try {
            let content = this.getContent();
            content = this.clearJSContent(content);
            this.saveContent(content);
            // 还原HTML
            let originalHtml = originalHtml_1.default().replace(/\s*$/, '');
            const htmlPath = path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'workbench.html');
            fs.writeFileSync(htmlPath, originalHtml, 'utf-8');
            // 删除文件
            fs.unlinkSync(path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'locale.js'));
            fs.unlinkSync(path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'document.js'));
            fs.unlinkSync(path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'document.css'));
            fs.unlinkSync(path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'index.html'));
            fs.unlinkSync(path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'config.json'));
            removeFiles(path.join(path.dirname(require.main.filename), 'vs', 'code', 'electron-sandbox', 'workbench', 'model'));
            vsHelp_1.default.showInfoRestart(this.extName + "已经卸载插件，请重新启动！")
            return true;
        }
        catch (ex) {
            return false;
        }
    }
}
exports.Uninstall = Uninstall;
function removeFiles(path) {
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