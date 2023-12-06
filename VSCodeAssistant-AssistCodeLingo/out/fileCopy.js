"use strict";
//fileCopy.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCurrentFileContent = void 0;
const fs = __importStar(require("fs"));
const vscode = __importStar(require("vscode"));
function readCurrentFileContent() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        console.error('파일을 찾을 수 없습니다.');
        return null;
    }
    try {
        const currentFilePath = editor.document.uri.fsPath;
        // 파일을 동기적으로 읽어서 문자열로 반환합니다.
        const fileContent = fs.readFileSync(currentFilePath, 'utf-8');
        return fileContent;
    }
    catch (error) {
        console.error('파일을 읽는 도중 오류가 발생했습니다:', error);
        return null;
    }
}
exports.readCurrentFileContent = readCurrentFileContent;
/*
// readCurrentFileContent 함수 호출
const fileContent = readCurrentFileContent();

if (fileContent !== null) {
    console.log('현재 열린 파일의 내용:');
    console.log(fileContent);
}
*/ 
//# sourceMappingURL=fileCopy.js.map