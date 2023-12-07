import * as vscode from 'vscode';

// Interaction 클래스 정의
export class Interaction {
    constructor(
        public readonly label: string,
        public readonly contextValue: string | undefined,
        public readonly messages: string[] = []
    ) {}

    // 사용자 응답을 메시지로 추가하는 메서드
    addMessage(message: string): void {
        this.messages.push(message);
    }
}

// InteractionModel 클래스 정의
export class InteractionModel implements vscode.TreeDataProvider<Interaction> {
    private _onDidChangeTreeData: vscode.EventEmitter<Interaction | null | undefined> = new vscode.EventEmitter<Interaction | null | undefined>();

    // onDidChangeTreeData 프로퍼티
    readonly onDidChangeTreeData: vscode.Event<Interaction | null | undefined> = this._onDidChangeTreeData.event;

    // 사용자와의 상호작용을 저장하는 배열
    private interactions: Interaction[] = [];

    // 사용자와의 상호작용을 InteractionModel에 추가하는 메서드
    addInteraction(interaction: Interaction): void {
        this.interactions.push(interaction);
        this.refresh(); // 트리를 새로 고침하여 변경 사항을 즉시 반영
    }

    // 사용자와의 상호작용에 메시지를 추가하는 메서드
    addMessageToInteraction(label: string, message: string): void {
        const interaction = this.interactions.find((i) => i.label === label);
        if (interaction) {
            interaction.addMessage(message);
            this.refresh();
        }
    }

    // 변경 사항을 알릴 때 사용하는 메서드
    refresh(): void {
        this._onDidChangeTreeData.fire(undefined); // 변경 사항을 알릴 때 매개변수를 넘겨야 합니다.
    }

    // treeView에서 필요한 구현 코드
    getTreeItem(element: Interaction): vscode.TreeItem | Thenable<vscode.TreeItem> {
        const treeItem = new vscode.TreeItem(element.label);
        treeItem.contextValue = element.contextValue;
        return treeItem;
    }

    getChildren(element?: Interaction | undefined): vscode.ProviderResult<Interaction[]> {
        // 트리에 표시할 상호작용 목록을 반환
        if (element) {
            // element가 제공된 경우 해당 요소의 자식 요소를 반환
            return element.messages.map(message => new Interaction(message, undefined, []));
        } else {
            // element가 제공되지 않은 경우 루트 요소를 반환
            return this.interactions.length > 0 ? this.interactions : [];
        }
    }
}
