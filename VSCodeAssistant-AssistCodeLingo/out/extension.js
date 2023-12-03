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
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "Assist! CodeLingo" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let askStart = vscode.commands.registerCommand('CodeLingo.start', () => {
        // testIconView View를 기본 사이드바에 표시.
        vscode.commands.executeCommand('workbench.view.extension.codelingoActivity');
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('May I assist you?');
    });
    // Code Lingo를 호출하면 자동으로 코드를 분석하게 할 것인가? 그렇다면 May I assist you?가 나올때마다?
    //코드 분석 후 사용자에게 확인.
    let askAnalyzedCode = vscode.commands.registerCommand('CodeLingo.askAnalyzedCode', async () => {
        const answer = await vscode.window.showInformationMessage('Are you writing this type of code?', { modal: false }, 'Yes', 'No');
        if (answer === 'Yes') {
            vscode.window.showInformationMessage('Great! Let me assist you.');
            vscode.window.showInformationMessage('I will recommend functions and algorithms suitable for this task.');
            // 여기에 Yes를 선택했을 때의 동작을 추가합니다.
        }
        else if (answer === 'No') {
            await showOptionsQuickPick();
        }
        else {
            vscode.window.showInformationMessage(`It's Okay. Let me assist you later!`);
        }
    });
    // 다중 선택지 구현을 위한 함수
    async function showOptionsQuickPick() {
        const options = ['Option 1', 'Option 2', 'Option 3', 'Request code analyze again!']; // 여러 선택지를 추가하세요
        const selectedOption = await vscode.window.showQuickPick(options, {
            placeHolder: 'Select an option',
        });
        if (selectedOption) {
            if (selectedOption === 'Request code analyze again!') {
                vscode.window.showInformationMessage('Let me analyze your code again...');
                // 여기에 코드를 다시 분석하는 동작을 추가합니다.
            }
            else {
                vscode.window.showInformationMessage(`You selected ${selectedOption}!`);
                vscode.window.showInformationMessage('I will recommend functions and algorithms suitable for this task.');
                // 선택한 옵션에 대한 동작을 추가합니다.
            }
        }
        else {
            vscode.window.showInformationMessage('You did not select any option.');
            // 선택을 취소했을 때의 동작을 추가합니다.
        }
    }
    //인터넷 검색을 위한 기능 구현.
    let searchingInternet = vscode.commands.registerCommand('CodeLingo.searching!', async () => {
        // 검색어를 입력받기 위한 Quick Input을 사용합니다.
        const searchQuery = await vscode.window.showInputBox({
            placeHolder: 'Enter your search query',
            prompt: 'What do you want to search?',
            ignoreFocusOut: true, // 입력 상자가 다른 곳에 포커스되어도 닫히지 않도록 합니다.
        });
        if (searchQuery) {
            // 사용자가 검색어를 입력했을 경우, 구글 검색을 실행하고 결과를 브라우저에서 열어줍니다.
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            vscode.env.openExternal(vscode.Uri.parse(searchUrl));
        }
        else {
            vscode.window.showInformationMessage('No search query entered.');
        }
    });
    context.subscriptions.push(askStart, askAnalyzedCode, searchingInternet);
    // 사용자의 코드를 분석하는 파이썬 코드 불러오기.
    // 코드 분석중에는 "분석중입니다."라고 표시
    // 코드 분석 완료시 notification으로 "이런 코드를 작성하고 계신가요?" 물어보고 버튼 클릭으로 답변.
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map