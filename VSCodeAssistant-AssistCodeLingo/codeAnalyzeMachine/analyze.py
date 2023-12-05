#analyze.py
import sys

# analyze.py
def perform_analysis(code):
    # 분석 로직 수행
    #result = f"Analysis result for code:\n{code}"
    print(code)

if __name__ == "__main__":
    #print("Enter the code to analyze (press Ctrl+D to finish input):")
    code_to_analyze = sys.stdin.read()
    perform_analysis(code_to_analyze)

# 실제 분석 코드가 들어간다면 배열에 3순위 결과치까지 입력해 둘 것.
# 추후에 옵션 선택시 넘겨주고 선택지 부여. + 많은 코드와 함수에서 결과값 가져가서 쓸 수 있도록..