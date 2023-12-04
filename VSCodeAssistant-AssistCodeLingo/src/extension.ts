import * as vscode from 'vscode';

// interaction.ts 파일에서 Interaction 및 InteractionModel 클래스 가져오기
import { Interaction, InteractionModel } from './interaction';
//코드 추천 부분을 recommendationProvider에서 가져오기.
import { RecommendationProvider } from './recommendationProvider';
// 코드 추천 함수 부분 구현을 별도 클래스에서 가져오기.
import { getRecommendations } from './recommendationService';
// 코드 분석 구현을 codeAnalyzer에서 가져오기
import { externalAnalysisIO } from './externalAnalysisIO';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "Assist! CodeLingo" is now active!');

    // InteractionModel을 생성하는 코드 추가
    const interactionModel = new InteractionModel();
    vscode.window.createTreeView('interactions', { treeDataProvider: interactionModel });
    // RecommendationProvider 생성
    const recommendationProvider = new RecommendationProvider();
    // testIconView를 생성하여 Primary Sidebar에 추가
    const testIconView = vscode.window.createTreeView('testIconView', { treeDataProvider: recommendationProvider });

    let askStart = vscode.commands.registerCommand('CodeLingo.start', () => {
        vscode.commands.executeCommand('workbench.view.extension.codelingoActivity');

        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new Interaction("Code Lingo is started!", 'start');
        interactionModel.addInteraction(interaction);

        vscode.window.showInformationMessage('May I assist you?');
    });

    // Code Lingo를 호출하면 자동으로 코드를 분석하게 할 것인가? 그렇다면 May I assist you?가 나올때마다?

    // 사용자의 코드를 분석하는 파이썬 코드 불러오기.
    // 코드 분석중에는 "분석중입니다."라고 표시
    // 코드 분석 완료시 notification으로 "이런 코드를 작성하고 계신가요?" 물어보고 버튼 클릭으로 답변.

    // 코드 분석을 위한 함수
    let letsAnalyzeCode = vscode.commands.registerCommand('CodeLingo.letsAnalyzeCode', async () => {
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new Interaction("Start analyzing your code", 'analyze');
        interactionModel.addInteraction(interaction);

        vscode.window.showInformationMessage("Let's analyze your code!");


        //코드 분석 파이썬 파일 실행
        try {
            // 코드 분석을 시작하고 결과를 받아옵니다.
            const analysisResult = await externalAnalysisIO();
    
            // 코드 분석 결과를 사용자에게 표시합니다.
            vscode.window.showInformationMessage(`Code analysis result: ${analysisResult}`);
        } catch (error: any) {      // 여기서 any를 사용하여 타입을 명시합니다.
            // 코드 분석 중 오류가 발생하면 오류 메시지를 표시합니다.
            vscode.window.showErrorMessage(error.message);
        }
    });

    //코드 분석 후 사용자에게 확인.
    let askAnalyzedCode = vscode.commands.registerCommand('CodeLingo.askAnalyzedCode', async () => {
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new Interaction("Asking anaylized code", 'askAnalyzedCode');
        interactionModel.addInteraction(interaction);

        const answer = await vscode.window.showInformationMessage(
            'Are you writing this type of code?',
            { modal: false },
            'Yes',
            'No'
        );

        if (answer === 'Yes') {
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction = new Interaction("You chose YES, Start recommend", 'startRecommend');
            interactionModel.addInteraction(interaction);

            vscode.window.showInformationMessage('Great! Let me assist you.');
            vscode.window.showInformationMessage('I will recommend functions and algorithms suitable for this task.');
            // 여기에 Yes를 선택했을 때의 동작을 추가합니다.

        } else if (answer === 'No') {
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction = new Interaction("You chose No, let me show you options", 'answerNO, showOption');
            interactionModel.addInteraction(interaction);

            await showOptionsQuickPick();
        }
        else {
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction = new Interaction("Not answered.", 'notAnswered');
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
                const interaction = new Interaction("Now analyze your code again", 're-analyze');
                interactionModel.addInteraction(interaction);

                vscode.window.showInformationMessage('Let me analyze your code again...');

                // 여기에 코드를 다시 분석하는 동작을 추가합니다.
            } else {
                // 사용자와의 상호작용을 InteractionModel에 추가
                const interaction = new Interaction(`${selectedOption} selected, Now recommend`, 'optionSelected + startRecommend');
                interactionModel.addInteraction(interaction);

                vscode.window.showInformationMessage(`You selected ${selectedOption}!`);
                vscode.window.showInformationMessage('I will recommend functions and algorithms suitable for this task.');

                // 선택한 옵션에 대한 동작을 추가합니다.
            }
        } else {
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction = new Interaction("You did not select any option", 'notSelectOption');
            interactionModel.addInteraction(interaction);

            vscode.window.showInformationMessage('You did not select any option.');

            // 선택을 취소했을 때의 동작을 추가합니다.
        }
    }

    // 코드 분석을 위한 함수
    let recommendCode = vscode.commands.registerCommand('CodeLingo.recommend', () => {
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new Interaction("Recommend usual code", 'recommendation');
        interactionModel.addInteraction(interaction);

        vscode.window.showInformationMessage("Now I will serve you recommend CODE!");

        // 상호작용 모델을 통해 추천 코드를 가져오는 로직 또는 동적으로 생성하는 로직을 추가
        const recommendations = getRecommendations(); // 예시: recommendationService.ts에서 추천 코드를 가져오는 로직을 추가
        recommendationProvider.setRecommendations(recommendations);
    });

    //인터넷 검색을 위한 기능 구현.
    let searchingInternet = vscode.commands.registerCommand('CodeLingo.searching', async () => {
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new Interaction("Searching command input, now enter query", 'searchingStart');
        interactionModel.addInteraction(interaction);

        // 검색어를 입력받기 위한 Quick Input을 사용합니다.
        const searchQuery = await vscode.window.showInputBox({
            placeHolder: 'Enter your search query',
            prompt: 'What do you want to search?',          //여기를 멘트 + 기본 키워드로 띄워주기.
            ignoreFocusOut: true, // 입력 상자가 다른 곳에 포커스되어도 닫히지 않도록 합니다.
        });

        if (searchQuery) {
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction = new Interaction("Searching entered query", 'search!');
            interactionModel.addInteraction(interaction);

            // 사용자가 검색어를 입력했을 경우, 구글 검색을 실행하고 결과를 브라우저에서 열어줍니다.
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            vscode.env.openExternal(vscode.Uri.parse(searchUrl));
        } else {
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction = new Interaction("NO query entered", 'searchByKeyword');
            interactionModel.addInteraction(interaction);

            // 검색어가 입력되지 않았을 경우, 기본 검색어를 사용하여 구글 검색을 실행합니다.
            const defaultSearchQuery = 'Analyzed your code'; // 여기에 원하는 기본 검색어를 입력하세요.
            const defaultSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(defaultSearchQuery)}`;
            vscode.env.openExternal(vscode.Uri.parse(defaultSearchUrl));
            vscode.window.showInformationMessage('No query input.');
            vscode.window.showInformationMessage('Based on the analyzed user code, I enter recommended search terms.');
        }
    });

    context.subscriptions.push(askStart, askAnalyzedCode, searchingInternet, recommendCode);
}

// This method is called when your extension is deactivated
export function deactivate() { }