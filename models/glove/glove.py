import tokenize
from io import BytesIO
import re
from tqdm import tqdm
from glove import Corpus, Glove

def tokenize_code(code):

    def tokenizer(code):
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

    for line in tqdm(code.splitlines()):
        code_str += line
        try:
            tokenized = tokenizer(code_str)
            if len(tokenized) <= 1:
                code_str = ''
                continue
            result.append(tokenized)
            code_str = ''
        except:
            pass

    return result

if __name__ == '__main__':

    # source_code = input()
    source_code = '''
    import numpy as np
    from sklearn import (datasets, model_selection)
    from xgboost import XGBClassifier

    if __name__ == '__main__':
        # Load a dataset
        wdbc = datasets.load_breast_cancer()

        # Train a model
        model = XGBClassifier(n_estimators=100, learning_rate=0.5, max_depth=10, random_state=42) # TODO
        cv_results = model_selection.cross_validate(model, wdbc.data, wdbc.target, cv=5, return_train_score=True)

        # Evaluate the model
        acc_train = np.mean(cv_results['train_score'])
        acc_test = np.mean(cv_results['test_score'])
        print(f'* Accuracy @ training data: {acc_train:.3f}')
        print(f'* Accuracy @ test data: {acc_test:.3f}')
        print(f'* Your score: {max(10 + 100 * (acc_test - 0.9), 0):.0f}')
    '''
    tokenized_result = tokenize_code(source_code)

    corpus = Corpus()
    # corpus.fit(tokenized_result, )
    
    tokens = list(set([token for line in tokenized_result for token in line]))

    model = Glove(sentences=tokenized_result, vector_size=round(len(tokens)**0.25), window=5, min_count=1, workers=4, epochs=5)

    
    doc_confidence = {}

    for token in tokens:
        for similar_token, conf in model.wv.most_similar(token):
            doc_confidence.setdefault(similar_token, 0)
            doc_confidence[similar_token] += conf

    result = sorted(doc_confidence.items(), key=lambda x: x[1], reverse=True)
    print(result)