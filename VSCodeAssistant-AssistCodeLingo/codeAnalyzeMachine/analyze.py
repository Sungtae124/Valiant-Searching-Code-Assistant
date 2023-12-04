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
