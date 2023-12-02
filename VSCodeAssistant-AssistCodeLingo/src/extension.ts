// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

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

    let askAnalyzedCode = vscode.commands.registerCommand('CodeLingo.askAnalyzedCode', async () => {
        const answer = await vscode.window.showInformationMessage(
            'Are you currently working on any of the following options?',
            { modal: false },
            'Yes',
            'No'
        );

        if (answer === 'Yes') {
            vscode.window.showInformationMessage('Great! Let me assist you.');
            vscode.window.showInformationMessage('I will recommend functions and algorithms suitable for this task.');
            // 여기에 Yes를 선택했을 때의 동작을 추가합니다.

        } else if (answer === 'No') {
            await showOptionsQuickPick();
        }
        else {
            vscode.window.showInformationMessage(`It's Okay. Let me assist you later!`);
        }
    });

    async function showOptionsQuickPick() {
        const options = ['Option 1', 'Option 2', 'Option 3']; // 여러 선택지를 추가하세요
        const selectedOption = await vscode.window.showQuickPick(options, {
            placeHolder: 'Select an option',
        });

        if (selectedOption) {
            vscode.window.showInformationMessage(`You selected ${selectedOption}!`);
            vscode.window.showInformationMessage('I will recommend functions and algorithms suitable for this task.');
            // 여기에 선택한 옵션에 대한 동작을 추가합니다.

        } else {
            vscode.window.showInformationMessage('You did not select any option.');
            // 선택을 취소했을 때의 동작을 추가합니다.
        }
    }

	context.subscriptions.push(askStart, askAnalyzedCode);

    // 사용자의 코드를 분석하는 파이썬 코드 불러오기.
    // 코드 분석중에는 "분석중입니다."라고 표시
    // 코드 분석 완료시 notification으로 "이런 코드를 작성하고 계신가요?" 물어보고 버튼 클릭으로 답변.
}

// This method is called when your extension is deactivated
export function deactivate() {}