"use strict";
//buttonProvider.ts
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
exports.MyTreeItem = exports.ButtonProvider = void 0;
const vscode = __importStar(require("vscode"));
class ButtonProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
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
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
}
exports.ButtonProvider = ButtonProvider;
class MyTreeItem extends vscode.TreeItem {
    label;
    collapsibleState;
    command;
    constructor(label, collapsibleState, command) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.command = command;
    }
}
exports.MyTreeItem = MyTreeItem;
//# sourceMappingURL=buttonProvider.js.map