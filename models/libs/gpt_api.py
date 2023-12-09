from openai import OpenAI

KEY = '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'
client = OpenAI(api_key=KEY)

def get_response(words):

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a search query generator, creating natural queries by seamlessly combining some of the given words."},
            {"role": "user", "content": ', '.join(words)},
        ],
    )

    output = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": response.choices[0].message.content},
        ],
    )

    print(output.choices[0].message.content)