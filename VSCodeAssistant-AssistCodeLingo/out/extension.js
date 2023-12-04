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
const vscode = __importStar(require("vscode"));
// interaction.ts 파일에서 Interaction 및 InteractionModel 클래스 가져오기
const interaction_1 = require("./interaction");
function activate(context) {
    console.log('Congratulations, your extension "Assist! CodeLingo" is now active!');
    // InteractionModel을 생성하는 코드 추가
    const interactionModel = new interaction_1.InteractionModel();
    vscode.window.createTreeView('interactions', { treeDataProvider: interactionModel });
    let askStart = vscode.commands.registerCommand('CodeLingo.start', () => {
        vscode.commands.executeCommand('workbench.view.extension.codelingoActivity');
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new interaction_1.Interaction("Code Lingo is started!", 'start');
        interactionModel.addInteraction(interaction);
        vscode.window.showInformationMessage('May I assist you?');
    });
    // Code Lingo를 호출하면 자동으로 코드를 분석하게 할 것인가? 그렇다면 May I assist you?가 나올때마다?
    // 코드 분석을 위한 함수
    let letsAnalyzeCode = vscode.commands.registerCommand('CodeLingo.letsAnalyzeCode', () => {
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new interaction_1.Interaction("Start analyzing your code", 'analyze');
        interactionModel.addInteraction(interaction);
        vscode.window.showInformationMessage("Let's analyze your code!");
        //코드 분석 파이썬 파일 실행
    });
    //코드 분석 후 사용자에게 확인.
    let askAnalyzedCode = vscode.commands.registerCommand('CodeLingo.askAnalyzedCode', async () => {
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new interaction_1.Interaction("Asking anaylized code", 'askAnalyzedCode');
        interactionModel.addInteraction(interaction);
        const answer = await vscode.window.showInformationMessage('Are you writing this type of code?', { modal: false }, 'Yes', 'No');
        if (answer === 'Yes') {
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction = new interaction_1.Interaction("You chose YES, Start recommend", 'startRecommend');
            interactionModel.addInteraction(interaction);
            vscode.window.showInformationMessage('Great! Let me assist you.');
            vscode.window.showInformationMessage('I will recommend functions and algorithms suitable for this task.');
            // 여기에 Yes를 선택했을 때의 동작을 추가합니다.
        }
        else if (answer === 'No') {
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction = new interaction_1.Interaction("You chose No, let me show you options", 'answerNO, showOption');
            interactionModel.addInteraction(interaction);
            await showOptionsQuickPick();
        }
        else {
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction = new interaction_1.Interaction("Not answered.", 'notAnswered');
            interactionModel.addInteraction(interaction);
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
                // 사용자와의 상호작용을 InteractionModel에 추가
                const interaction = new interaction_1.Interaction("Now analyze your code again", 're-analyze');
                interactionModel.addInteraction(interaction);
                vscode.window.showInformationMessage('Let me analyze your code again...');
                // 여기에 코드를 다시 분석하는 동작을 추가합니다.
            }
            else {
                // 사용자와의 상호작용을 InteractionModel에 추가
                const interaction = new interaction_1.Interaction(`${selectedOption} selected, Now recommend`, 'optionSelected + startRecommend');
                interactionModel.addInteraction(interaction);
                vscode.window.showInformationMessage(`You selected ${selectedOption}!`);
                vscode.window.showInformationMessage('I will recommend functions and algorithms suitable for this task.');
                // 선택한 옵션에 대한 동작을 추가합니다.
            }
        }
        else {
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction = new interaction_1.Interaction("You did not select any option", 'notSelectOption');
            interactionModel.addInteraction(interaction);
            vscode.window.showInformationMessage('You did not select any option.');
            // 선택을 취소했을 때의 동작을 추가합니다.
        }
    }
    //인터넷 검색을 위한 기능 구현.
    let searchingInternet = vscode.commands.registerCommand('CodeLingo.searching', async () => {
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new interaction_1.Interaction("Searching command input, now enter query", 'searchingStart');
        interactionModel.addInteraction(interaction);
        // 검색어를 입력받기 위한 Quick Input을 사용합니다.
        const searchQuery = await vscode.window.showInputBox({
            placeHolder: 'Enter your search query',
            prompt: 'What do you want to search?', //여기를 멘트 + 기본 키워드로 띄워주기.
            ignoreFocusOut: true, // 입력 상자가 다른 곳에 포커스되어도 닫히지 않도록 합니다.
        });
        if (searchQuery) {
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction = new interaction_1.Interaction("Searching entered query", 'search!');
            interactionModel.addInteraction(interaction);
            // 사용자가 검색어를 입력했을 경우, 구글 검색을 실행하고 결과를 브라우저에서 열어줍니다.
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            vscode.env.openExternal(vscode.Uri.parse(searchUrl));
        }
        else {
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction = new interaction_1.Interaction("NO query entered", 'searchByKeyword');
            interactionModel.addInteraction(interaction);
            // 검색어가 입력되지 않았을 경우, 기본 검색어를 사용하여 구글 검색을 실행합니다.
            const defaultSearchQuery = 'Analyzed your code'; // 여기에 원하는 기본 검색어를 입력하세요.
            const defaultSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(defaultSearchQuery)}`;
            vscode.env.openExternal(vscode.Uri.parse(defaultSearchUrl));
            vscode.window.showInformationMessage('No query input.');
            vscode.window.showInformationMessage('Based on the analyzed user code, I enter recommended search terms.');
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