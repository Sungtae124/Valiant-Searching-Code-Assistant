// recommendationProvider.ts

import * as vscode from 'vscode';

export class RecommendationProvider {
    private recommendations: string = '';
    private outputChannel: vscode.OutputChannel;

    constructor(outputChannel: vscode.OutputChannel) {
        this.outputChannel = outputChannel;
    }

    setRecommendations(recommendations: string): void {
        this.recommendations = recommendations;
        this.updateOutputChannel();
    }

    private updateOutputChannel(): void {
        this.outputChannel.clear();
        this.outputChannel.appendLine('Recommended Codes:');
        this.outputChannel.append(this.recommendations);
        this.outputChannel.show(true);
    }
}