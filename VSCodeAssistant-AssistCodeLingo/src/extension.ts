//extension.ts
import * as vscode from 'vscode';

// interaction.ts 파일에서 Interaction 및 InteractionModel 클래스 가져오기
import { Interaction, InteractionModel } from './interaction';
//코드 추천 부분을 recommendationProvider에서 가져오기.
import { RecommendationProvider } from './recommendationProvider';
// 코드 분석 구현을 codeAnalyzer에서 가져오기
import { externalAnalysisIO, externalRecommendationIO } from './externalAnalysisIO';
// fileCopy 모듈 import
import { readCurrentFileContent } from './fileCopy';
// buttonProvider 모듈 import
import { ButtonProvider } from './buttonProvider';

// OutputChannel 선언
let outputChannel: vscode.OutputChannel;

// 전역 변수 선언
// 현재 분석 결과 중 1,2,3 순위를 string 배열로 저장해둠. & 기본 검색어를 위해 0번 인덱스에 "Code Lingo" 저장
let currentAnalysisResult: string[] = ["Code Lingo","option1","option2"];
let chosenOption: number = 0;               // 선택된 분석 결과를 표시하기 위한 인덱스.
let recommendedCode:string = "example recommendation";

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "Assist! CodeLingo" is now active!');

    // InteractionModel을 생성하는 코드 추가
    const interactionModel = new InteractionModel();
    vscode.window.createTreeView('interactions', { treeDataProvider: interactionModel });
    // ButtonProvider 생성 및 testIconView에 추가
    const myButtonProvider = new ButtonProvider();
    const myButton = vscode.window.createTreeView('testIconView', { treeDataProvider: myButtonProvider });
    context.subscriptions.push(myButton);
    // OutputChannel 초기화
    outputChannel = vscode.window.createOutputChannel('CodeLingo Output');
    // RecommendationProvider 생성 및 등록
    const recommendationProvider = new RecommendationProvider(outputChannel);

    // Code Lingo 호출
    let askStart = vscode.commands.registerCommand('CodeLingo.start', () => {
        vscode.commands.executeCommand('workbench.view.extension.codelingoActivity');

        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new Interaction("Code Lingo is started! May I assist you?", 'start');
        interactionModel.addInteraction(interaction);
    });

    // 파일의 코드를 가져오는 명령어
    let getFileContent = vscode.commands.registerCommand('CodeLingo.getFileContent', () => {
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new Interaction("Getting file content", 'getFileContent');
        interactionModel.addInteraction(interaction);

        // fileCopy.ts 모듈을 사용하여 현재 열린 파일의 코드를 가져옴
        const fileContent = readCurrentFileContent();

        if (fileContent !== null) {
            // 파일 내용을 콘솔에 출력하거나 다른 원하는 동작 수행
            console.log('파일 내용을 가져왔습니다.');
            console.log(fileContent);
        } else {
            console.error('파일 내용을 가져올 수 없습니다.');
        }
    });

    // 코드 분석을 위한 명령어
    let letsAnalyzeCode = vscode.commands.registerCommand('CodeLingo.letsAnalyzeCode', async () => {
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new Interaction("Let's analyze your code!", 'analyze');
        interactionModel.addInteraction(interaction);

        // 파일의 코드를 가져오는 함수 호출
        const fileContent = readCurrentFileContent();

        if (fileContent !== null) {
            // 파일 내용 콘솔에 출력
            console.log('현재 열린 파일의 내용:');
            console.log(fileContent);
        } else {
            console.error('파일 내용을 가져올 수 없습니다.');
        }

        //코드 분석 파이썬 파일 실행
        if (fileContent !== null) {
            try {
                // 코드 분석을 시작하고 결과를 받아옵니다.
                const analysisResult = await externalAnalysisIO(fileContent);

                currentAnalysisResult = analysisResult;

                // OutputChannel에 결과를 표시합니다.
                outputChannel.clear(); // 기존 내용을 지우고 새로운 결과를 출력
                outputChannel.appendLine('Code analysis result:');

                // 배열 전체를 문자열로 변환하지 않고 각 요소를 개별적으로 출력
                analysisResult.forEach(line => {
                    outputChannel.appendLine(line);
                });

                outputChannel.show(true); // OutputChannel 표시

            } catch (error: any) {
                // 여기서 any를 사용하여 타입을 명시합니다. 코드 분석 중 오류가 발생하면 오류 메시지를 표시합니다.
                vscode.window.showErrorMessage(error.message);
            }
        } else {
            console.error('파일 내용을 가져올 수 없습니다.');
        }
        //분석이 완료되면 자동으로 askAnalyzedCode command 실행
        await vscode.commands.executeCommand('CodeLingo.askAnalyzedCode');
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
            chosenOption = 0;
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction1 = new Interaction("Great! Let me assist you.", 'startRecommend');
            interactionModel.addInteraction(interaction1);
            const interaction2 = new Interaction("I will recommend functions and algorithms.", 'startRecommend');
            interactionModel.addInteraction(interaction2);
            
            // 선택된 질문 클립보드에 복사 & 코드 자동 추천
            copyToClipboard();
            recommendedCode = await externalRecommendationIO(currentAnalysisResult[chosenOption]);

        } else if (answer === 'No') {
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction = new Interaction("You chose No, let me show you options", 'answerNO, showOption');
            interactionModel.addInteraction(interaction);

            await showOptionsQuickPick();
        }
        else {
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction = new Interaction("It's Okay. Let me assist you later!", 'notAnswered');
            interactionModel.addInteraction(interaction);
        }
    });

    // 다중 선택지 구현을 위한 함수
    async function showOptionsQuickPick() {
        let option1 = "Question 2";
        let option2 = "Question 3";
        const requestAnalyze = 'Request code analyze again!';

        let options = [option1, option2, requestAnalyze];

        const selectedOption = await vscode.window.showQuickPick(options, {
            placeHolder: 'Select an option',
        });

        if (selectedOption) {
            console.log("option picked");
            if (selectedOption === 'Request code analyze again!') {
                chosenOption = -1;
                // 사용자와의 상호작용을 InteractionModel에 추가
                const interaction = new Interaction("Let me analyze your code again...", 're-analyze');
                interactionModel.addInteraction(interaction);

                // 코드 분석 명령어 재실행
                await vscode.commands.executeCommand('CodeLingo.letsAnalyzeCode');

            } else {
                if (selectedOption === option1) {
                    chosenOption = 1;
                }
                else if (selectedOption === option2) {
                    chosenOption = 2;
                }
                // 사용자와의 상호작용을 InteractionModel에 추가
                const interaction1 = new Interaction(`You selected ${selectedOption}!`, 'optionSelected');
                interactionModel.addInteraction(interaction1);
                const interaction2 = new Interaction(`I will recommend functions and algorithms.`, 'startRecommend');
                interactionModel.addInteraction(interaction2);

                // 선택된 질문 클립보드에 복사 & 코드 자동 추천
                copyToClipboard();      //clipboard에 currentAnalysisResult 복사.
                recommendedCode = await externalRecommendationIO(currentAnalysisResult[chosenOption]);
            }
        } else {
            // 사용자와의 상호작용을 InteractionModel에 추가
            const interaction = new Interaction("You did not select any option", 'notSelectOption');
            interactionModel.addInteraction(interaction);
        }
    }

    // 도움 요청을 위한 명령어. 코드 추천 기능 탑재
    let requestAssist = vscode.commands.registerCommand('CodeLingo.assist', () => {
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction1 = new Interaction("Assist! Code Lingo", 'callAssiatant');
        interactionModel.addInteraction(interaction1);
        const interaction = new Interaction("I will recommend usual code", 'recommendation');
        interactionModel.addInteraction(interaction);

        // 상호작용 모델을 통해 추천 코드를 가져오는 로직 또는 동적으로 생성하는 로직을 추가
        const recommendations = recommendedCode;
        recommendationProvider.setRecommendations(recommendations);
    });

    //인터넷 검색을 위한 기능 구현.
    let searchingInternet = vscode.commands.registerCommand('CodeLingo.searching', async () => {
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new Interaction("Please enter query", 'searchingStart');
        interactionModel.addInteraction(interaction);

        // 검색어를 입력받기 위한 Quick Input을 사용합니다.
        const searchQuery = await vscode.window.showInputBox({
            placeHolder: 'Enter your search query',
            prompt: 'What do you want to search?',          //여기를 멘트 + 기본 키워드로 띄워주기.
            ignoreFocusOut: true,       // 입력 상자가 다른 곳에 포커스되어도 닫히지 않도록 합니다.
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
            const interaction1 = new Interaction("NO query entered", 'noQueryEnter');
            interactionModel.addInteraction(interaction1);
            const interaction2 = new Interaction("I enter selected option as query", 'searchByBasicQuery');
            interactionModel.addInteraction(interaction2);

            // 코드 분석 이전의 기본 검색어는 Code Lingo로 설정.
            // 검색어가 입력되지 않았을 경우, 기본 검색어를 사용하여 구글 검색을 실행합니다.
            const defaultSearchQuery = currentAnalysisResult[chosenOption]; // 선택된 옵션 질문 1개만 기본 검색어로 설정.
            const defaultSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(defaultSearchQuery)}`;
            vscode.env.openExternal(vscode.Uri.parse(defaultSearchUrl));
        }
    });

    context.subscriptions.push(askStart, askAnalyzedCode, requestAssist, searchingInternet, getFileContent);

    context.subscriptions.push(vscode.commands.registerCommand('CodeLingo.refreshMyTreeView', () => {
        myButtonProvider.refresh();
    }));

    // 클립보드에 복사하는 함수
    function copyToClipboard() {
        vscode.env.clipboard.writeText(currentAnalysisResult[chosenOption])
            .then(() => {
                // 복사 성공 시 실행할 코드
                console.log('텍스트가 클립보드에 복사되었습니다.');
            },
                (error) => {
                    // 오류 발생 시 실행할 코드
                    console.error('클립보드 복사 중 오류가 발생했습니다:', error);
                });
    }
}

// This method is called when your extension is deactivated
export function deactivate() { }