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
exports.RecommendationProvider = void 0;
const vscode = __importStar(require("vscode"));
class RecommendationProvider {
    recommendations = [];
    constructor(recommendations = []) {
        this.recommendations = recommendations;
    }
    setRecommendations(recommendations) {
        this.recommendations = recommendations;
        this.refresh();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        return Promise.resolve(element
            ? []
            : this.recommendations.map(code => {
                const treeItem = new vscode.TreeItem(code);
                treeItem.contextValue = 'recommendationItem';
                return treeItem;
            }));
    }
    refresh() {
        // 변경 사항을 알릴 때 사용하는 메서드
        this._onDidChangeTreeData.fire(undefined);
    }
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
}
exports.RecommendationProvider = RecommendationProvider;
//# sourceMappingURL=recommendationProvider.js.map