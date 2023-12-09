// externalAnalysisIO.ts

import * as cp from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';

export async function externalAnalysisIO(inputValue: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
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
        const scriptPath = path.join(scriptDir, 'codeAnalyzeMachine', 'analyze.py');

        // 변경: spawn 대신 spawnSync 사용
        const result = cp.spawnSync('python', [scriptPath, String(lineCount)], {    // 줄 수 정보를 추가하여 전달
            input: inputValue,  
            encoding: 'utf-8',
            // stdio: 'pipe', // 필요에 따라 stdio 설정을 조정할 수 있습니다.
        });

        // 변경: 결과가 정상적으로 반환되면 resolve 호출
        if (result.error) {
            // 오류가 있을 경우 reject 호출
            reject(result.error);
        } else if (result.status === 0) {
            // 코드가 0인 경우 (성공적으로 종료된 경우)
            vscode.window.showInformationMessage('Code analysis succeeded!');
            // 변경: 여러 줄의 결과를 배열로 변환하여 resolve 호출
            const lines = result.stdout.trim().split('\n');
            resolve(lines);
        } else {
            // 그 외의 경우 (오류 또는 비정상 종료)
            vscode.window.showErrorMessage(`Code analysis failed with exit code ${result.status}.`);
            reject(`Code analysis failed with exit code ${result.status}.`);
        }
    });
}