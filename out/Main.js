"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const vscode = require("vscode");
const path = require("path");
const version_1 = require("./version");
const Dom_1 = require("./Dom");
const Uninstall_1 = require("./uninstall");
class Main {
    static watch() {
        const base = path.dirname(require.main.filename);
        const filePath = path.join(base, 'vs', 'code', 'electron-sandbox', 'workbench', 'workbench.js');
        const extName = "diana-substitute";
        let DomApi = new Dom_1.Dom(extName, filePath, version_1.default, extName);
        return vscode.workspace.onDidChangeConfiguration(() => DomApi.install());
    }
    static uninstall() {
        const extName = "diana-substitute";
        let uninstallApi = new Uninstall_1.Uninstall(extName);
        uninstallApi.uninstall();
    }
}
exports.Main = Main;
//# sourceMappingURL=Main.js.map