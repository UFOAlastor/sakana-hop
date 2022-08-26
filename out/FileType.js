"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileType;
(function (FileType) {
    /**
     * 未修改的文件
     */
    FileType[FileType["empty"] = 0] = "empty";
    /**
     * hack 过的旧版本文件
     */
    FileType[FileType["isOld"] = 1] = "isOld";
    /**
     * hack 过的新版本的文件
     */
    FileType[FileType["isNew"] = 2] = "isNew";
})(FileType || (FileType = {}));
exports.default = FileType;
//# sourceMappingURL=FileType.js.map