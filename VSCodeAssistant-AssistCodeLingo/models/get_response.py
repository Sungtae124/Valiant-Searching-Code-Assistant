from libs.gpt_api import get_response
import sys

if __name__ == '__main__':
    question = sys.stdin.readline()
    print(get_response(question))