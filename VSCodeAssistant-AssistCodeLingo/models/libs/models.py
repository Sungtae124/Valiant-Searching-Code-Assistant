from gensim.models import Word2Vec as wv
from gensim.models import FastText as ft
import numpy as np


class Word2Vec:
    def __init__(self, tokenizer, window=5, min_count=1, workers=4, epochs=5) -> None:
        
        self.sentences = tokenizer.result
        self.tokens = tokenizer.tokens
        self.model = wv(sentences=self.sentences, vector_size=round(tokenizer.num_tokens**0.25), window=window, min_count=min_count, workers=workers, epochs=epochs)

        #print(self.sentences)
        #raise Exception("Fuxxxxxing error please", self.sentences)
        #self.model = wv(vector_size=round(tokenizer.num_tokens**0.25), window=window, min_count=min_count, workers=workers, epochs=epochs) 
        #self.model.build_vocab(self.sentences)
        #self.model.train(self.sentences)    


class FastText:
    def __init__(self, tokenizer, window=5, min_count=1, workers=4, epochs=5):

        self.sentences = tokenizer.result
        self.tokens = tokenizer.tokens
        self.model = ft(sentences=self.sentences, vector_size=round(tokenizer.num_tokens**0.25), window=window, min_count=min_count, workers=workers, epochs=epochs)

    
def get_result(model) -> list:
            
        doc_confidence = {}

        for token in model.tokens:
            for similar_token, conf in model.model.wv.most_similar(token):
                doc_confidence.setdefault(similar_token, 0)
                doc_confidence[similar_token] += conf


        values = np.array(list(doc_confidence.values()))

        # softmax
        exp_values = np.exp(values)
        softmax_values = exp_values / np.sum(exp_values, axis=0)

        doc_confidence = {key: val for key, val in zip(doc_confidence.keys(), softmax_values)}
        return doc_confidence