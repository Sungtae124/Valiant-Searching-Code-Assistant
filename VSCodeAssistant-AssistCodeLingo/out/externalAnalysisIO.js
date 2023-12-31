"use strict";
// externalAnalysisIO.ts
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
exports.externalRecommendationIO = exports.externalAnalysisIO = void 0;
const cp = __importStar(require("child_process"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
async function externalAnalysisIO(inputValue) {
    return new Promise((resolve, reject) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            reject('Open a file to analyze the code.');
            return;
        }
        // 입력값의 줄 수를 세어 줄 수 정보를 추가합니다.
        const lineCount = inputValue.split('\n').length;
        // 현재 실행 중인 스크립트 파일의 디렉토리를 얻습니다.
        const scriptDir = path.dirname(__dirname);
        // 코드 분석 스크립트의 경로를 계산합니다.
        const scriptPath = path.join(scriptDir, 'models', 'main.py');
        // 변경: spawn 대신 spawnSync 사용
        const result = cp.spawnSync('python', [scriptPath], {
            input: `${lineCount}\n${inputValue}`, // 줄 수 정보를 추가하여 전달
            encoding: 'utf-8',
            // stdio: 'pipe', // 필요에 따라 stdio 설정을 조정할 수 있습니다.
        });
        // 변경: 결과가 정상적으로 반환되면 resolve 호출
        if (result.error) {
            // 오류가 있을 경우 reject 호출
            reject(result.error);
        }
        else if (result.status === 0) {
            // 코드가 0인 경우 (성공적으로 종료된 경우)
            vscode.window.showInformationMessage('Code analysis succeeded!');
            // 변경: 여러 줄의 결과를 배열로 변환하여 resolve 호출
            const dataArray = result.stdout.trim().split('\n');
            resolve(dataArray);
        }
        else {
            console.log('Debug Output:', result);
            console.log('Python Script Error:', result.stderr);
            // 그 외의 경우 (오류 또는 비정상 종료)
            vscode.window.showErrorMessage(`Code analysis failed with exit code ${result.status}.`);
            reject(`Code analysis failed with exit code ${result.status}.`);
        }
    });
}
exports.externalAnalysisIO = externalAnalysisIO;
async function externalRecommendationIO(selectedQuestion) {
    return new Promise(async (resolve, reject) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            reject('Open a file to analyze the code.');
            return;
        }
        // 현재 실행 중인 스크립트 파일의 디렉토리를 얻습니다.
        const scriptDir = path.dirname(__dirname);
        // 코드 분석 스크립트의 경로를 계산합니다.
        const scriptPath = path.join(scriptDir, 'models', 'get_response.py');
        // 변경: spawn 대신 spawnSync 사용
        const result = cp.spawnSync('python', [scriptPath], {
            input: selectedQuestion, // 선택된 질문 1개 전달.
            encoding: 'utf-8',
            // stdio: 'pipe', // 필요에 따라 stdio 설정을 조정할 수 있습니다.
        });
        // 변경: 결과가 정상적으로 반환되면 resolve 호출
        if (result.error) {
            // 오류가 있을 경우 reject 호출
            reject(result.error);
        }
        else if (result.status === 0) {
            // 코드가 0인 경우 (성공적으로 종료된 경우)
            vscode.window.showInformationMessage('Here is an recommended Code!');
            // 변경: 여러 줄의 결과에 대해 string 형태로 resolve 호출
            const resultRecommendation = await result.stdout.trim();
            resolve(resultRecommendation);
        }
        else {
            console.log('Debug Output:', result);
            console.log('Python Script Error:', result.stderr);
            // 그 외의 경우 (오류 또는 비정상 종료)
            vscode.window.showErrorMessage(`Code recommendation failed with exit code ${result.status}.`);
            reject(`Code recommendation failed with exit code ${result.status}.`);
        }
    });
}
exports.externalRecommendationIO = externalRecommendationIO;
//# sourceMappingURL=externalAnalysisIO.js.map