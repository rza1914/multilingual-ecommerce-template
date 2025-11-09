import asyncio
import os
from dotenv import load_dotenv
from groq import AsyncGroq

async def test_real_groq():
    try:
        # Load environment variables
        load_dotenv()
        
        # Get the API key from environment
        api_key = os.getenv("GROQ_API_KEY")
        print("API key from env:", api_key)
        
        if not api_key:
            print("ERROR - GROQ_API_KEY not found in environment")
            return False
            
        client = AsyncGroq(api_key=api_key)
        
        response = await client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Hello, respond with 'API working'"}
            ],
            max_tokens=50
        )
        
        print("SUCCESS - Groq response:", response.choices[0].message.content)
        return True
    except Exception as e:
        print("ERROR - Groq failed:", str(e))
        return False

if __name__ == "__main__":
    result = asyncio.run(test_real_groq())
    print("Test result:", result)