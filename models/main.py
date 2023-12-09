from libs.tokenizer import tokenizer
from libs.models import Word2Vec, FastText, get_result

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
    
    token = tokenizer(source_code)
    
    wv = Word2Vec(token, window=5, min_count=1, workers=4, epochs=5)
    ft = FastText(token, window=5, min_count=1, workers=4, epochs=5)

    print(get_result(wv))
    print(get_result(ft))