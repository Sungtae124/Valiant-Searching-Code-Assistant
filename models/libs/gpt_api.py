from openai import OpenAI

KEY = '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'
ORGINIZATION_ID = 'org-tJR4mOQyItBZUWA4EwP2qVu0'
client = OpenAI(api_key=KEY, organization=ORGINIZATION_ID)

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