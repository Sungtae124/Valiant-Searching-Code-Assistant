from io import BytesIO
import tokenize
import re

class tokenizer:

    def __init__(self, code):
        self.result = self.tokenize(code)
        self.tokens = list(set([token for line in self.result for token in line]))
        self.num_tokens = len(self.tokens)
    

    def tokenize(self, code) -> list:

        def line_tokenize(code):
            code_bytes = code.encode('utf-8')
            result = []
            
            with BytesIO(code_bytes) as f:
                for token in tokenize.tokenize(f.readline):
                    stopwords = ['if', 'elif', 'else', 'for', 'while', 'try', 'except', 'pass', 'def', 'class', 'as', 'import', 'from', 'with', 'self', 'super', 'in', 'is', 'not', 'and', 'or', 'return', 'None', 'True', 'False', 'i', 'int', 'float', 'str', 'args', 'kwargs', 'range']
                    # only name
                    if (token[0] in [1]) and (token[1] not in stopwords):
                        token = token[1]
                        if re.search(r'__.*?__', token) is not None: continue
                        result.append(token)
                        
            return result
        
        
        code_str = ''
        result = []

        for line in code.splitlines():
            code_str += line
            try:
                tokenized = line_tokenize(code_str)
                if len(tokenized) <= 1:
                    code_str = ''
                    continue
                result.append(tokenized)
                code_str = ''
            except:
                pass

        return result