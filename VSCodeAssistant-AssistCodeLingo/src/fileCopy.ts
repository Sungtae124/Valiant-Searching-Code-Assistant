//fileCopy.ts

import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function readCurrentFileContent(): string | null {
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
    } catch (error) {
        console.error('파일을 읽는 도중 오류가 발생했습니다:', error);
        return null;
    }
}

// readCurrentFileContent 함수 호출
const fileContent = readCurrentFileContent();

if (fileContent !== null) {
    console.log('현재 열린 파일의 내용:');
    console.log(fileContent);
}
