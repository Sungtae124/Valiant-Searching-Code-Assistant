from gensim.models import Word2Vec as wv
from gensim.models import FastText as ft


class Word2Vec:
    def __init__(self, tokenizer, window=5, min_count=1, workers=4, epochs=5) -> None:
        
        self.sentences = tokenizer.result
        self.tokens = tokenizer.tokens
        self.model = wv(sentences=self.sentences, vector_size=round(tokenizer.num_tokens**0.25), window=window, min_count=min_count, workers=workers, epochs=epochs)    


class FastText:
    def __init__(self, tokenizer, window=5, min_count=1, workers=4, epochs=5):

        self.sentences = tokenizer.result
        self.tokens = tokenizer.tokens
        self.model = ft(sentences=self.sentences, vector_size=round(tokenizer.num_tokens**0.25), window=window, min_count=min_count, workers=workers, epochs=epochs)

    
def get_result(model) -> dict:
            
        doc_confidence = {}

        for token in model.tokens:
            for similar_token, conf in model.model.wv.most_similar(token):
                doc_confidence.setdefault(similar_token, 0)
                doc_confidence[similar_token] += conf

        result = sorted(doc_confidence.items(), key=lambda x: x[1], reverse=True)
        return result