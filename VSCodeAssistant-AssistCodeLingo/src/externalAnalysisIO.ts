// externalAnalysisIO.ts
import * as cp from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';

export async function externalAnalysisIO(inputValue: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
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

        // Write input value to the external process
        pythonProcess.stdin.write(inputValue);
        pythonProcess.stdin.end();

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
            } else {
                // 그 외의 경우 (오류 또는 비정상 종료)
                vscode.window.showErrorMessage(`Code analysis failed with exit code ${code}.`);
                reject(`Code analysis failed with exit code ${code}.`);
            }
        });
    });
}

// Example of how to call the function with an input value
const inputValue = 'your_input_value';

externalAnalysisIO(inputValue)
    .then((result) => {
        vscode.window.showInformationMessage('Analysis Result:', result);
    })
    .catch((error) => {
        vscode.window.showInformationMessage('Error:', error);
    });