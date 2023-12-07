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
exports.InteractionModel = exports.Interaction = void 0;
const vscode = __importStar(require("vscode"));
// Interaction 클래스 정의
class Interaction {
    label;
    contextValue;
    messages;
    constructor(label, contextValue, messages = []) {
        this.label = label;
        this.contextValue = contextValue;
        this.messages = messages;
    }
    // 사용자 응답을 메시지로 추가하는 메서드
    addMessage(message) {
        this.messages.push(message);
    }
}
exports.Interaction = Interaction;
// InteractionModel 클래스 정의
class InteractionModel {
    _onDidChangeTreeData = new vscode.EventEmitter();
    // onDidChangeTreeData 프로퍼티
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    // 사용자와의 상호작용을 저장하는 배열
    interactions = [];
    // 사용자와의 상호작용을 InteractionModel에 추가하는 메서드
    addInteraction(interaction) {
        this.interactions.push(interaction);
        this.refresh(); // 트리를 새로 고침하여 변경 사항을 즉시 반영
    }
    // 사용자와의 상호작용에 메시지를 추가하는 메서드
    addMessageToInteraction(label, message) {
        const interaction = this.interactions.find((i) => i.label === label);
        if (interaction) {
            interaction.addMessage(message);
            this.refresh();
        }
    }
    // 변경 사항을 알릴 때 사용하는 메서드
    refresh() {
        this._onDidChangeTreeData.fire(undefined); // 변경 사항을 알릴 때 매개변수를 넘겨야 합니다.
    }
    // treeView에서 필요한 구현 코드
    getTreeItem(element) {
        const treeItem = new vscode.TreeItem(element.label);
        treeItem.contextValue = element.contextValue;
        return treeItem;
    }
    getChildren(element) {
        // 트리에 표시할 상호작용 목록을 반환
        if (element) {
            // element가 제공된 경우 해당 요소의 자식 요소를 반환
            return element.messages.map(message => new Interaction(message, undefined, []));
        }
        else {
            // element가 제공되지 않은 경우 루트 요소를 반환
            return this.interactions.length > 0 ? this.interactions : [];
        }
    }
}
exports.InteractionModel = InteractionModel;
//# sourceMappingURL=interaction.js.map