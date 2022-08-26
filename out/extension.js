"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const Main_1 = require("./Main");
const vscode = require("vscode");
function activate(context) {
    context.subscriptions.push(Main_1.Main.watch());
}
exports.activate = activate;
function deactivate() {
    vscode.window.showInformationMessage("卸载");
    Main_1.Main.uninstall();
 }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map