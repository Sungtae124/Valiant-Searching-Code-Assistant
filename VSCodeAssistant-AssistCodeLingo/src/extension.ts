//extension.ts

import * as vscode from 'vscode';

// interaction.ts 파일에서 Interaction 및 InteractionModel 클래스 가져오기
import { Interaction, InteractionModel } from './interaction';
//코드 추천 부분을 recommendationProvider에서 가져오기.
import { RecommendationProvider } from './recommendationProvider';
// 코드 추천 함수 부분 구현을 별도 클래스에서 가져오기.
import { getRecommendations } from './recommendationService';
// 코드 분석 구현을 codeAnalyzer에서 가져오기
import { externalAnalysisIO } from './externalAnalysisIO';
// fileCopy 모듈 import
import { readCurrentFileContent } from './fileCopy';
// buttonProvider 모듈 import
import { ButtonProvider } from './buttonProvider';

// OutputChannel 선언
let outputChannel: vscode.OutputChannel;

// 전역 변수 선언
let currentAnalysisResult: string[];    // 현재 분석 결과 중 1,2,3 순위를 string 배열로 저장해둠.
let chosenOption: number;               // 선택된 분석 결과를 표시하기 위한 인덱스.

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "Assist! CodeLingo" is now active!');

    // InteractionModel을 생성하는 코드 추가
    const interactionModel = new InteractionModel();
    vscode.window.createTreeView('interactions', { treeDataProvider: interactionModel });
    // RecommendationProvider 생성
    const recommendationProvider = new RecommendationProvider();
    // testIconView를 생성하여 Primary Sidebar에 추가
    const testIconView = vscode.window.createTreeView('testIconView', { treeDataProvider: recommendationProvider });
    context.subscriptions.push(testIconView);

    // ButtonProvider 생성 및 testIconView에 추가
    const myButtonProvider = new ButtonProvider();
    const myButton = vscode.window.createTreeView('testIconView', { treeDataProvider: myButtonProvider });
    context.subscriptions.push(myButton);

    // OutputChannel 초기화
    outputChannel = vscode.window.createOutputChannel('CodeLingo Output');



    let askStart = vscode.commands.registerCommand('CodeLingo.start', () => {
        vscode.commands.executeCommand('workbench.view.extension.codelingoActivity');

        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new Interaction("Code Lingo is started!", 'start');
        interactionModel.addInteraction(interaction);

        vscode.window.showInformationMessage('May I assist you?');
    });


    // 사용자의 코드를 분석하는 파이썬 코드 불러오기.
    // 코드 분석중에는 "분석중입니다."라고 표시
    // 코드 분석 완료시 notification으로 "이런 코드를 작성하고 계신가요?" 물어보고 버튼 클릭으로 답변.


    // 파일의 코드를 가져오는 함수
    let getFileContent = vscode.commands.registerCommand('CodeLingo.getFileContent', () => {
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new Interaction("Getting file content", 'getFileContent');
        interactionModel.addInteraction(interaction);

        // fileCopy.ts 모듈을 사용하여 현재 열린 파일의 코드를 가져옴
        const fileContent = readCurrentFileContent();


        if (fileContent !== null) {
            // 파일 내용을 콘솔에 출력하거나 다른 원하는 동작 수행
            console.log('현재 열린 파일의 내용:');
            console.log(fileContent);

            // 여기에서 fileContent를 활용하여 원하는 로직 수행
            // 예: 코드 분석, 추천 등
        } else {
            vscode.window.showErrorMessage('파일 내용을 가져올 수 없습니다.');
        }
    });

    // 코드 분석을 위한 함수
    let letsAnalyzeCode = vscode.commands.registerCommand('CodeLingo.letsAnalyzeCode', async () => {
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new Interaction("Start analyzing your code", 'analyze');
        interactionModel.addInteraction(interaction);

        vscode.window.showInformationMessage("Let's analyze your code!");

        // 파일의 코드를 가져오는 함수 호출
        const fileContent = readCurrentFileContent();

        if (fileContent !== null) {
            // 파일 내용을 콘솔에 출력하거나 다른 원하는 동작 수행
            console.log('현재 열린 파일의 내용:');
            console.log(fileContent);

            // 여기에서 fileContent를 활용하여 원하는 로직 수행
            // 예: 코드 분석, 추천 등
        } else {
            vscode.window.showErrorMessage('파일 내용을 가져올 수 없습니다.');
        }

        //코드 분석 파이썬 파일 실행
        if (fileContent !== null) {
            try {
                // 코드 분석을 시작하고 결과를 받아옵니다.
                // 이 결과가 매우 중요. 기본 검색어로도 전달하고 클립보드에도 복사되도록 하면 좋겠다.
                const analysisResult = await externalAnalysisIO(fileContent);

                //경우에 따라 배열 인덱스로 한 값만 받아오는 것으로 변경할 가능성 있다!
                currentAnalysisResult = analysisResult;

                // OutputChannel에 결과를 표시합니다.
                outputChannel.clear(); // 기존 내용을 지우고 새로운 결과를 출력
                outputChannel.appendLine('Code analysis result:');

                //outputChannel.append(analysisResult);
                // 배열 전체를 문자열로 변환하지 않고 각 요소를 개별적으로 출력
                analysisResult.forEach(line => {
                    outputChannel.appendLine(line);
                });

                outputChannel.show(true); // OutputChannel 표시

            } catch (error: any) {
                // 여기서 any를 사용하여 타입을 명시합니다.
                // 코드 분석 중 오류가 발생하면 오류 메시지를 표시합니다.
                vscode.window.showErrorMessage(error.message);
            }
        } else {
            vscode.window.showErrorMessage('파일 내용을 가져올 수 없습니다.');
        }

        //분석이 완료되면 자동으로 askAnalyzedCode command 실행되어야 함.
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
        // 구현 변경 필요. 선택된 질문을 복사하도록 했기 때문에 분석 코드 확인 이후로 옮김.
        copyToClipboard();      //clipboard에 currentAnalysisResult 복사.
    });

    // 다중 선택지 구현을 위한 함수
    async function showOptionsQuickPick() {
        const option1 = currentAnalysisResult[1];
        const option2 = currentAnalysisResult[2];
        const requestAnalyze = 'Request code analyze again!';

        const options = [option1, option2, requestAnalyze];
        //const options = ['Option 1', 'Option 2', 'Request code analyze again!'];
        // options는 배열이므로 하나씩 지정해서 추가 가능. 여러 선택지를 추가하세요
        const selectedOption = await vscode.window.showQuickPick(options, {
            placeHolder: 'Select an option',
        });

        if (selectedOption) {
            if (selectedOption === 'Request code analyze again!') {
                chosenOption = -1;
                // 사용자와의 상호작용을 InteractionModel에 추가
                const interaction = new Interaction("Now analyze your code again", 're-analyze');
                interactionModel.addInteraction(interaction);

                vscode.window.showInformationMessage('Let me analyze your code again...');

                // 여기에 코드를 다시 분석하는 동작을 추가합니다.
                // 재분석 요청 시 자동으로 letsAnalyzedCode command 실행되어야 함.
                // 재분석 시 키워드 변경이나 제외 같은 로직은 파이썬 측에서 구현 필요.
                await vscode.commands.executeCommand('CodeLingo.letsAnalyzeCode');

            } else {
                if (selectedOption === option1) {
                    chosenOption = 1;
                }
                else if (selectedOption === option2) {
                    chosenOption = 2;
                }
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

    // 코드 추천을 위한 함수
    let recommendCode = vscode.commands.registerCommand('CodeLingo.recommend', () => {
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new Interaction("Recommend usual code", 'recommendation');
        interactionModel.addInteraction(interaction);

        vscode.window.showInformationMessage("Now I will serve you recommend CODE!");

        // 상호작용 모델을 통해 추천 코드를 가져오는 로직 또는 동적으로 생성하는 로직을 추가
        const recommendations = getRecommendations(); // 예시: recommendationService.ts에서 추천 코드를 가져오는 로직을 추가
        recommendationProvider.setRecommendations(recommendations);
    });

    // 도움 요청을 위한 함수
    let requestAssist = vscode.commands.registerCommand('CodeLingo.assist', () => {
        // 사용자와의 상호작용을 InteractionModel에 추가
        const interaction = new Interaction("Assist! Code Lingo", 'callAssiatant');
        interactionModel.addInteraction(interaction);

        vscode.window.showInformationMessage("What do you want to do?");
        vscode.window.showInformationMessage("You can choose actions by buttons!");
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

            // 코드 분석 이전의 기본 검색어를 Code Lingo로 설정.
            // 검색어가 입력되지 않았을 경우, 기본 검색어를 사용하여 구글 검색을 실행합니다.
            const defaultSearchQuery = `${currentAnalysisResult[chosenOption]}`; // 여기에 원하는 기본 검색어를 입력하세요. => 코드 분석 내용 입력. => 선택된 옵션 질문 1개만 기본 검색어로 설정.
            const defaultSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(defaultSearchQuery)}`;
            vscode.env.openExternal(vscode.Uri.parse(defaultSearchUrl));
            vscode.window.showInformationMessage('No query input.');
            vscode.window.showInformationMessage('Based on the analyzed user code, I enter recommended search terms.');
        }


    });

    context.subscriptions.push(askStart, askAnalyzedCode, searchingInternet, recommendCode, getFileContent);

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