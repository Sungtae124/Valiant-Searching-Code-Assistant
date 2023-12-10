# Valiant-Searching Code Assistant

![CodeLingo Icon](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/535aedd1-7352-4920-9732-fb3b15652623)

---


## VS Code Assistant - Assist! Code Lingo

<b><Assist! Code Lingo></b>는 작성 중인 파이썬 코드를 분석 및 요약하여 추천 코드를 제공하거나, 분석 내용을 인터넷에 검색하는 **VSCode Extension**입니다.


## Motivation

최근에 가장 널리 사용되는 IDE를 꼽자면 단연 VSCode라고 할 수 있습니다. 

Extension을 통해서 수많은 프로그래밍 언어와 다양한 테마를 제공할뿐만 아니라, 코드 완성에 박차를 가하는 탁월한 기능 덕분일 것입니다. 

우리는 여기서 Idea를 얻었습니다. 

'어떤 기능을 하더라도 Extension의 형태로 한 번 만들어보자!' 라고 말이죠.

그렇게 시작한 이 프로젝트는 Valiant-Searching(VS) 이라는 키워드에 맞게 사용자의 코드를 분석하고 다음과 같은 기능을 갖추게 되었습니다.

- 코드 분석을 통한 세 가지 요약 질문 제공
- 사용자 요청에 의한 코드 추천 Assistant
- 분석된 코드에 대한 질문을 자동으로 포함하는 구글 검색 기능

해당 기능은 모두 Sidebar에 위치한 버튼으로 실행할 수 있으며, 매우 긴밀하게 협력하여 당신의 코딩을 도와줄 것입니다!

## 목차

- 설치
- [사용법 - 구현 위치 별 설명](#사용법)
- [기능 구현 별 설명](#기능-구현-별-설명-개발자들을-위한-설명)
- [분석 모델 설명](#분석-모델-설명)
- [License](#license)
- [참고자료](#참고자료)
- [개발 관련 사항](#개발-관련-사항)
    - [개발 진행 중인 사항](#개발-진행-중인-사항)
    - [개발 예정 사항](#개발-예정-사항)
<!-- - [기능 구현에 사용된 모델 성능 평가](#기능-구현에-사용된-모델-성능-평가)
- [사용된 API](#사용된-api) -->

## 사용법

### 구현 위치 별 설명

기존에 VSCode와 Extension을 사용해보신 분들은 큰 어려움 없이 사용하실 수 있습니다.

처음 사용하시는 분도 추가적인 설명 없이 쓸 수 있도록 설계했지만, 혹시 궁금한 점이 있다면 아래의 설명을 참고해주세요!

<img width="1681" alt="architecture-containers" src="https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/352218ed-40d2-4489-9ae4-942d72695e15">

(from. [https://code.visualstudio.com/api/ux-guidelines/overview](https://code.visualstudio.com/api/ux-guidelines/overview))

### 1. Activity Bar - Code Lingo’s Icon

- Icon을 클릭하면 Code Lingo와 상호작용 할 수 있는 View가 Primary Sidebar에서 열립니다.

### 2. Primary Sidebar - Buttons & Interaction View

- **Buttons**
    
    ![Buttons](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/5924749c-0f88-456f-b93d-dd3012b1a327)
    
    - 사용자는 버튼을 통해서 사전 등록된 명령어와 연결된 각 기능을 실행할 수 있으며, 이는 유기적으로 동작합니다. 자세한 설명은 기능 구현 별 설명에 첨부하였습니다.
    - Start Code Lingo : Code Lingo가 호출되고 인사해줍니다.
    - Analyze Code : 코드를 분석한 뒤 키워드를 기반으로 질문 형태로 나타내 줍니다.
    - Assist! Code Lingo : 사용자가 선택한 질문을 기반으로 추천 코드를 생성하고 보여줍니다.
    - Search on Google :
        - Analyze Code에서 제기된 질문을 기본 검색어로 받아와 검색합니다. (Enter키 한번)
        - 검색어를 직접 입력 받아 검색할 수 있습니다.
        - 기본 브라우저의 새 창으로 띄워줍니다.
- **Interaction View**
- Code Lingo의 기본 안내 메세지들은 좌측의 Interactions로 표시됩니다.
    - 각 command가 실행되며 사용자에게 진행 상황과 관련 정보를 보여줍니다.
- 어떤 명령어가 실행되었는지 보여줌으로써 Extension이 정상적으로 동작하는지 확인할 수 있습니다.
    
    ![Interactions](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/85b38398-a521-4a78-8460-60808a0ff734)
    

### 3. Information Message

- 사용자에게 직접 알려줘야 하는 정보에 대해서 별도로 Message를 띄워줍니다. (우측 하단)

![Notification   Information](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/a2020950-155f-4188-bd31-093de1e0882d)

### 4. Notifications

- 코드 분석 후 사용자에게 분석된 정보를 담은 질문이 적절한지 물어보고, 사용자는 버튼으로 간단하게 답변이 가능합니다.
    - Yes : 현재 질문이 적절하다는 응답으로, 이 질문을 기반으로 관련 함수나 알고리즘을 추천해 드립니다.
    - No : 현재 질문이 부정확하다는 응답이므로, 생성된 질문 중 2,3 번째 질문을 옵션으로 제공하여 사용자가 선택할 수 있도록 합니다.
    - 옵션 중 “Request analysis”를 선택 시 코드 분석을 다시 요청합니다.
    - 미응답 : 추후에 다시 분석을 진행하고 응답을 받도록 안내합니다.
- 사용자가 버튼을 통해 선택한 응답에 따라 질문이 저장됩니다.
    - 이 질문은 검색 기능의 기본 검색어로 저장됩니다.
    - 이 질문이 클립보드에 복사되어 바로 붙여넣기가 가능합니다.


### 5-1. QuickPick

![QuickPick](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/5e8038dd-a522-4c84-9d8d-8ba543c1f899)

- 3가지 옵션을 제공하여 사용자가 선택하면 해당하는 동작을 수행합니다.
    - 분석한 코드로부터 생성된 질문 중에 사용자에게 선택 옵션을 제공합니다.
    - 코드 재분석 요청 옵션을 제공합니다.

### 5-2. Output Channel

![Output](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/d42c2607-4f07-44e7-a08e-105b868fbf34)

- 코드 분석 후에 도출된 결과 질문을 정확도 순서대로 3개까지 보여줍니다.
- 사용자는 질문을 확인한 뒤 Notification과 QuickPick으로 응답이 가능합니다.


### 5-3. Quick Input

![QuickInput](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/531ec548-037f-4fe1-b97e-29c901997ed7)

- Search on Google 버튼 클릭시 입력값을 받습니다.


## 기능 구현 별 설명 (개발자들을 위한 설명)

Button / Interaction (View) / Information message / Notification, Quick Pick, Output Channel / Console / Command

### 1. 호출 및 실행

![CodeLingo_gif](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/f9ad58e8-f65c-4667-8fc7-02707736a57a)

- Button : Start Code Lingo
- Command : CodeLingo.start
- Title : Code Lingo start
- 동작 : 명령 실행 시 “Code Lingo is started! May I assist you?”라고 물으며 인사합니다.

### 2. 코드 내용 복사

- Command : CodeLingo.getFileContent
- Title : get file content
- 연결 파일 : fileCopy.ts
- 함수 : readCurrentFileContent()
- 동작 : VSCode 내에 열려있는 외부 경로의 코드 내용을 동기적으로 읽어서 문자열로 반환합니다.
- “Getting file content”
    - console.log로 VSCode에 열려있는 스크립트 내용이 성공적으로 복사되었는지 확인이 가능합니다. “파일 내용을 가져왔습니다. “
    - fileCopy.ts 측에서 스크립트 복사 시에 에러가 있다면 콘솔로 알려줍니다.
        - “파일을 읽는 도중 오류가 발생했습니다.”
- fileContent를 정상적으로 불러오지 못했다면 : “파일 내용을 가져올 수 없습니다.” 출력.


### 3. 코드 분석

![analysis_text_gif](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/8743524d-97e4-43b5-8c75-520f6bc9f3b5)

- Button : Analyze Code
- Command : CodeLingo.letsAnalyzeCode
- Title : Let’s analyze your code!
- 연결 파일 : fileCopy.ts & externalAnalysisIO.ts & analyze.py
- 동작 : **********************************************************[3-1. 외부 코드 입출력]********************************************************** **+ [4. 코드 분석 이후]** 자동 실행
- “Let’s analyze your code!”
    - try - catch를 사용한 Error Handling
    - externalAnalysisIO.ts에서 analyze.py가 정상적으로 종료되면
        - “Code analysis succeeded!”
    - 오류 또는 비정상 종료 시
        - `Code analysis failed with exit code ${result.status}.`
        - reject(`Code analysis failed with exit code ${result.status}.`)


### 3-1. 외부 코드 입출력

- 별도의 Command 설정 없이 extension.ts 파일의 letsAnalyzeCode 명령어 내부에서 구현했습니다.
- 연결 파일 : externalAnalysisIO.ts & analyze.py
- 동작 : letsAnalyzeCode 명령어 내부에서 복사해온 코드 전체를 표준 입력을 이용해 string으로 코드 분석 파일인 main.py에 넘겨줍니다.
    
    분석 진행 후 결과값을 string[]로 받아와서 Output Channel에서 보여줍니다.
    
    - “Code analysis result: “
    - 결과 리턴 시 에러가 있을 경우 Information Message로 띄워줍니다.


### 4. 분석 결과 확인

![Notification_QuickPick](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/d006ba12-64dc-4a1c-889a-8b753d577af9)

- Command : CodeLingo.askAnalyzedCode
- Title : Do you writing this code?
- 연결 함수 : copyToClipBoard
- 동작 : 분석한 코드로부터 도출된 질문이 맞는지 사용자에게 확인합니다.
- “Are you writing this type of code?”
- **Notification 활용**
    - Yes : 현재 질문이 적절하다는 응답으로, 이 질문을 기반으로 기본 검색어와 추천 코드를 제공합니다.
        - “Great! Let me assist you.”
        - “I will recommend functions and algorithms.”
    - 미응답 : 추후에 다시 분석을 진행하고 응답을 받도록 안내합니다.
        - “It's Okay. Let me assist you later!”
- **QuickPick 활용**
![PickSecondQuestion](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/9847dcb9-1754-41df-bb32-7de36144ee64)
![PickThirdQuestion](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/7732e756-8f6c-4035-b44f-8b53a15520be)
    - No : 현재 질문이 부정확하다는 응답이므로, 생성된 질문 중 2,3 번째 질문을 QuickPick의 옵션으로 제공하여 사용자가 선택할 수 있도록 합니다.
        - "You chose No, let me show you options”
        - `You selected ${selectedOption}!`
        - “I will recommend functions and algorithms.”
    - 옵션 중 ‘Request analysis’를 선택 시 코드 분석을 다시 요청합니다.
        - “Let me analyze your code again..”
        - **3. 코드 분석** 진행
  ![RequestReanalyze](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/9dd57973-6b44-45f8-a994-265f94ca18f0)
    - 만약 QuickPick 창에서 그냥 나간다면..
        - “You did not select any option.”
- 사용자가 선택한 질문의 인덱스를 chosenOption 변수에 저장합니다.
    - Yes(1번 질문) ⇒ **0** / No ⇒ option 1(2번 질문) : **1** / option 2(3번질문) : **2** / re-analyze(분석 재요청) : **-1**
- 사용자가 버튼을 통해 선택한 응답에 따라 질문이 저장됩니다.
    - 선택된 질문은 검색 기능의 기본 검색어로 저장됩니다.
    - 선택된 질문이 클립보드에 복사 되어 바로 붙여넣을 수 있습니다.

### 5. 검색 기능

![searching_text_gif](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/400c4dc8-2626-4bd9-b580-0c68ade50264)

- Button : Search on Google
- Command : CodeLingo.searching
- Title : What do you want to search?
- 동작 : Quick Input을 통해 사용자에게 검색어를 입력 받습니다. + “Please enter query”
- Quick Input: “Enter your search query.”, “What do you want to search?”
- 코드 분석 이전의 기본 검색어는 Code Lingo로 설정되어 있습니다.
- 검색어를 입력하지 않고 엔터 시 선택된 질문을 기본 검색어로 설정하여 검색을 실시합니다.
    - “No query input.”
    - “"I enter selected option as query.”
- 구글 검색을 실행 후 검색 결과를 기본 브라우저의 새 창으로 열어줍니다.

### 6. Assist! 기능(코드 추천 기능)

![recommendation_gif](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/128397778/ca656399-0924-48aa-90bc-51694e9026e7)

- Button : Assist! Code Lingo
- Command : CodeLingo.assist
- Title : Assist! Code Lingo
- 동작 : "Assist! Code Lingo”, "Recommend usual code”
- 사용자에게 선택된 질문 기반으로 생성된 추천 코드를 보여줍니다.(Output Channel 활용)

### 7. (2번, 3번 내용에 대한 추가 코멘트)

- 파일 경로 설정에 대한 숱한 고민 끝에 현재 코드에 사용된 방식을 유지하기로 결정하였습니다.
- 외부 파일을 여는 상황(getFileContent 명령어와 fileCopy.ts)에서는 VSCode 에디터 내에 열려있는 폴더와 스크립트의 경로를 기준으로 하여 탐색합니다.
    
    ```tsx
    const editor = vscode.window.activeTextEditor;
    //에디터 내에 열려있는 스크립트의 경로를 탐색합니다.
    const currentFilePath = editor.document.uri.fsPath;
    ```
    
- 파이썬으로 구현된 코드 분석 모델을 사용하기 위해서는 다음과 같이 경로를 설정하였습니다.
    - externalAnalysisIO.ts를 extension.ts가 포함된 src폴더 내부에 위치 시켰습니다.
    - codeAnalyzeMachine 폴더를 전체 Extension의 루트 폴더 하위에 위치 시켰습니다. (src 폴더와 동등한 루트 아래)
    - 상대 경로를 파악하여 externalAnalysisIO.ts 기준
        - 상위 폴더 이동 → codeAnalyzeMachine 폴더로 이동 → [analyze.py](http://analyze.py) 접근
        
        이러한 방식으로 접근하였습니다.
        
    
    ```tsx
    // 현재 실행 중인 스크립트 파일의 디렉토리를 얻습니다.
    const scriptDir = path.dirname(__dirname);
    // 코드 분석 스크립트의 경로를 계산합니다.
    const scriptPath = path.join(scriptDir, 'codeAnalyzeMachine', 'analyze.py');
    ```
    
- 기존의 방식은 이렇게 되어있었습니다. 현재는 fileCopy.ts와 externalAnalysisIO.ts로 분리되었기 때문에 변경되었습니다. (파일이 열려있는 경로와 파일명을 조합하여 경로를 지정하는 방식)
    
    ```tsx
    const currentFilePath = editor.document.uri.fsPath;
    const fileName = path.basename(currentFilePath); // 파일 이름 가져오기
    const scriptPath = path.join(path.dirname(currentFilePath), fileName);
    ```
    

<!-- ## 기능 구현에 사용된 모델 성능 평가

## 사용된 API -->

## 분석 모델 설명

### 1. Tokenizer
1. 파이썬 기본 라이브러리 **tokenize**를 사용하여 연산자, 구분자를 제외한 변수명, 함수명, 클래스명 등을 추출합니다.

2. 추출된 단어들 중, **if, else, for, def** 와 같이 분석에 필요 없는 불용어는 모두 제외하여 토큰화를 수행합니다.

토큰화 예시
![tokenize image](https://github.com/Sungtae124/Valiant-Searching-Code-Assistant/assets/101165696/9668af05-16a4-4d60-af6c-2198b18bc8fb)


### 2. Word Embedding Model Ensemble
1. 비슷한 단어를 가까운 vector로 매핑하는 word embedding 모델을 사용하여 코드 내부 단어들에 대해 word embedding을 수행합니다.

2. 모델의 embedding 결과의 신뢰성을 높이기 위해, 2개 이상의 모델을 사용했습니다. (Word2Vec, FastText)

3. embedding 후, 각 단어들과 나머지 단어들의 cosine similarity를 구하고 모두 더합니다.<br>
$C_i = \sum_{k=1}^{n}{similarity(i, k)}$

4. 모든 단어들에 대해 $C$값을 구한 후, 정규화를 위해 softmax를 취합니다.<br>
$SC_i = softmax(C_i)=\frac{exp(c_i)}{\sum_{j=1}^{n}{exp(c_j)}}$

5. 각 모델의 $SC$ 값을 더하여 앙상블을 수행합니다.<br>
$SC^{ensemble} = SC^{Word2Vec} + SC^{FastText}$



### 3. GPT - API
1. 위에서 구한 $SC^{ensemble}$ 값 크기 순서대로 상위 10개 단어만 추출하였고, 이를 **질문 생성 역할을 부여한 GPT**에게 하나의 질문 형식의 문장으로 생성하여 사용자에게 보여줍니다.

2. 사용자로부터 승인된 질문이 들어오면, 해당 질문을 **파이썬 튜터 역할을 부여한 GPT**에게 전달하여 자세한 설명을 하도록 합니다.

## License

- 기본적으로 MIT License를 따릅니다.
- 저희는 이 코드가 최대한 널리 퍼지고, 수정되는 것을 목적으로 개발을 시작하였기 때문에 얼마든지 활용하셔도 좋습니다. 출처만 남겨주세요!
- 이 코드를 직접 수정하실 의향이 있다면 메일로 연락 주시면 감사하겠습니다.

## 참고자료

### Extension 개발 파트

- VS Code extension API 공식 문서
    
    [https://code.visualstudio.com/api/get-started/your-first-extension](https://code.visualstudio.com/api/get-started/your-first-extension)
    
- [Vscode extionsion API](https://code.visualstudio.com/api)의 한국어 번역
    
    [https://github.com/pg-vscode-extn-kr/pg-vscode-extn-kr.github.io/tree/master](https://github.com/pg-vscode-extn-kr/pg-vscode-extn-kr.github.io/tree/master)
    
- 개발 자체에 직접적인 참고는 아니지만 TypeScript 이해를 위해 참고한 강의입니다.
    - 코딩앙마님의 JavaScript 초, 중급 & TypeScript 강의 [(Youtube)](https://www.youtube.com/playlist?list=PLZKTXPmaJk8KhKQ_BILr1JKCJbR0EGlx0)
    

### 모델 개발 파트

- Word2Vec
    
    [Efficient Estimation of Word Representations in Vector Space](https://arxiv.org/pdf/1301.3781.pdf)

- FastText

    [Enriching Word Vectors with Subword Information](https://arxiv.org/pdf/1607.04606.pdf)


- GPT-API 공식 문서

    [https://platform.openai.com/docs/guides/text-generation](https://platform.openai.com/docs/guides/text-generation)

## 개발 진행 중 제한 사항

### Extension marketplace 배포

- 프로젝트 시작 시에는 pip install이나 기존의 Extension과 같이 사용자가 직접 설치하여 사용할 수 있는 수준까지 만드는 것이 목표였습니다.
- 그 목표를 이루기 위해서는 배포 및 마켓플레이스 등록이 필수적이지만, 아래 적어둔 GPT-API 키 관련 문제로 실행시키지 못했습니다.
- 추후에 지속적인 개발 예정이므로, 언젠가는 마켓플레이스와 VSCode 내의 Extensions 탭에서 꼭 뵐 수 있도록 노력하겠습니다.

### GPT-API 사용 관련

- GPT-API를 사용하기 위해서는 고유 키가 필요합니다.
- 오픈소스의 목적에 맞게 키를 그대로 넣어두고 Extension 배포 후 자유롭게 사용할 수 있도록 하고 싶었지만..
- 인터넷과 깃허브 등의 공개 서버에 키를 올리는 순간 open-ai 측에서 키를 없애버리는 상황이라 불가피하게 키만 삭제하여 업로드하였습니다.


## 개발 관련 사항

### 개발 진행 중인 사항

### 개발 예정 사항
