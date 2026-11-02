import os
from dotenv import load_dotenv
from sarvamai import SarvamAI

load_dotenv()

api_key = os.environ.get("SARVAM_API_KEY")
if not api_key:
    raise SystemExit("Error: SARVAM_API_KEY is not set. Paste your key into .env and try again.")

client = SarvamAI(api_subscription_key=api_key)

response = client.chat.completions(
    model="sarvam-105b-conversations",
    messages=[
        {"role": "system", "content": "You are a helpful and concise assistant."},
        {"role": "user", "content": "Hello! Tell me one interesting fact about India."},
    ],
)

print(response.choices[0].message.content)
