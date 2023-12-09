from libs.tokenizer import tokenizer
from libs.models import Word2Vec, FastText, get_result
import sys

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

    result = {key: wv_result.get(key, 0) + ft_result.get(key, 0) for key in set(wv_result) | set(ft_result)}
    result = [s.replace('_', ' ') for s in list(result.keys())]
    
    print(result)