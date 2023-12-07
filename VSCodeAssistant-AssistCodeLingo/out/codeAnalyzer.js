"use strict";
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
exports.externalAnalysisIO = void 0;
// codeAnalyzer.ts
const cp = __importStar(require("child_process"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
async function externalAnalysisIO() {
    return new Promise((resolve, reject) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            reject('Open a file to analyze the code.');
            return;
        }
        const currentFilePath = editor.document.uri.fsPath;
        const fileName = path.basename(currentFilePath); // 파일 이름 가져오기
        const scriptPath = path.join(path.dirname(currentFilePath), fileName);
        const pythonProcess = cp.spawn('python', [scriptPath]);
        let analysisResult = '';
        pythonProcess.stdout.on('data', (data) => {
            analysisResult = data.toString();
        });
        pythonProcess.stderr.on('data', (error) => {
            // 오류가 있을 경우 reject 호출
            reject(error);
        });
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                // 코드가 0인 경우 (성공적으로 종료된 경우)
                vscode.window.showInformationMessage('Code analysis succeeded!');
                resolve(analysisResult);
            }
            else {
                // 그 외의 경우 (오류 또는 비정상 종료)
                vscode.window.showErrorMessage(`Code analysis failed with exit code ${code}.`);
                reject(`Code analysis failed with exit code ${code}.`);
            }
        });
    });
}
exports.externalAnalysisIO = externalAnalysisIO;
//# sourceMappingURL=codeAnalyzer.js.map