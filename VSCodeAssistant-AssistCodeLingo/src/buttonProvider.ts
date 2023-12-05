//buttonProvider.ts

import * as vscode from 'vscode';

export class ButtonProvider implements vscode.TreeDataProvider<MyTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<MyTreeItem | undefined | null> = new vscode.EventEmitter<MyTreeItem | undefined | null>();
    readonly onDidChangeTreeData: vscode.Event<MyTreeItem | undefined | null> = this._onDidChangeTreeData.event;

    getTreeItem(element: MyTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: MyTreeItem): Thenable<MyTreeItem[]> {
        if (!element) {
            return Promise.resolve([
                new MyTreeItem('Start Code Lingo', vscode.TreeItemCollapsibleState.None, {
                    command: 'CodeLingo.start',
                    title: 'Start Code Lingo'
                }),
                new MyTreeItem('Analyze Code', vscode.TreeItemCollapsibleState.None, {
                    command: 'CodeLingo.letsAnalyzeCode',
                    title: 'Analyze Code'
                }),                               
                new MyTreeItem('Assist! Code Lingo', vscode.TreeItemCollapsibleState.None, {
                    command: 'CodeLingo.assist',
                    title: 'Assist! Code Lingo'
                }),
                new MyTreeItem('Request recommendation', vscode.TreeItemCollapsibleState.None, {
                    command: 'CodeLingo.recommend',
                    title: 'Request recommendation'
                }),
                new MyTreeItem('Search on Google', vscode.TreeItemCollapsibleState.None, {
                    command: 'CodeLingo.searching',
                    title: 'Search on Google'
                })
            ]);
        }
        return Promise.resolve([]);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }
}

export class MyTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
    }
}
