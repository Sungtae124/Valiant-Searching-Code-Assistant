export function getRecommendations(): string[] {
    // 여기에서 추천 코드를 동적으로 생성하거나, 데이터베이스에서 불러오는 등의 로직을 작성합니다.
    return [
        'function greet(name: string): string { return "Hello, " + name + "!"; }',
        'class Calculator { add(a: number, b: number): number { return a + b; } }',
        // 추가적인 추천 코드를 원하는 만큼 추가하세요.
    ];
}