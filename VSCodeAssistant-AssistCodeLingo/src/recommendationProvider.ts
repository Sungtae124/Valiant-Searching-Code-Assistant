import * as vscode from 'vscode';
import { getRecommendations } from './recommendationService';

export class RecommendationProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private recommendations: string[] = getRecommendations();

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        return Promise.resolve(
            element
                ? []
                : this.recommendations.map(code => {
                    const treeItem = new vscode.TreeItem(code);
                    treeItem.contextValue = 'recommendationItem';
                    return treeItem;
                })
        );
    }

    refresh(): void {
        // 변경 사항을 알릴 때 사용하는 메서드
        this._onDidChangeTreeData.fire(undefined);
    }

    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | null | undefined> = new vscode.EventEmitter<vscode.TreeItem | null | undefined>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | null | undefined> = this._onDidChangeTreeData.event;
}
