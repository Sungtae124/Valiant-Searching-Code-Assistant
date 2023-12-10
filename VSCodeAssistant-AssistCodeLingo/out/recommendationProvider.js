"use strict";
// recommendationProvider.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationProvider = void 0;
class RecommendationProvider {
    recommendations = '';
    outputChannel;
    constructor(outputChannel) {
        this.outputChannel = outputChannel;
    }
    setRecommendations(recommendations) {
        this.recommendations = recommendations;
        this.updateOutputChannel();
    }
    updateOutputChannel() {
        this.outputChannel.clear();
        this.outputChannel.appendLine('Recommended Codes:');
        this.outputChannel.append(this.recommendations);
        this.outputChannel.show(true);
    }
}
exports.RecommendationProvider = RecommendationProvider;
//# sourceMappingURL=recommendationProvider.js.map