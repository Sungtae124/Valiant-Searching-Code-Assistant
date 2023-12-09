from libs.tokenizer import tokenizer
from libs.models import Word2Vec, FastText, get_result
from libs.gpt_api import get_questions, get_response
import sys
import re

if __name__ == '__main__':

    n = int(input())
    source_code = ''
    for i in range(n):
        source_code += '\n' + sys.stdin.readline()
    
    token = tokenizer(source_code)
    
    wv = Word2Vec(token, window=5, min_count=1, workers=4, epochs=5)
    ft = FastText(token, window=5, min_count=1, workers=4, epochs=5)

    wv_result = get_result(wv)
    ft_result = get_result(ft)

    result = { key: wv_result.get(key, 0) + ft_result.get(key, 0) for key in set(wv_result) | set(ft_result) }
    result = [word[0] for word in list(sorted(result.items(), key=lambda x: x[1], reverse=True))]
    result = [s.replace('_', ' ') for s in result]

    result = result[:10] if len(result) > 10 else result
    
    questions = re.sub(r'\b\d+\.\s', '', get_questions(result)).split('\n')
    for question in questions:
        print(question)