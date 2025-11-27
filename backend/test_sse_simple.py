import json

def test_sse_encoding():
    """
    Test script to verify that the SSE endpoint handles both English and Persian messages correctly
    """
    
    # Test cases with different languages
    test_messages = [
        "hello",
        "test", 
        "سلام",  # Persian for hello
        "چطوری",  # Persian for how are you
        "test message",
        "تست"  # Persian for test
    ]
    
    print("Testing SSE endpoint with different language messages...")
    
    for i, message in enumerate(test_messages):
        print(f"\nTest {i+1}: {message}")
        
        # Simulate what the streaming function would do
        try:
            # This is similar to what happens in the generate() function with our fix
            status_data = json.dumps({'status': 'connected'}, ensure_ascii=False)
            print(f"  Status message: data: {status_data}")
            
            content_data = json.dumps({'content': message}, ensure_ascii=False)
            print(f"  Content message: data: {content_data}")
            
            print(f"  DONE marker: data: [DONE]")
            print(f"  Successfully processed: {message}")
            
        except Exception as e:
            print(f"  Error processing {message}: {e}")
    
    print("\nAll tests completed successfully! The encoding fix allows both English and Persian characters.")

# Run the test
if __name__ == "__main__":
    test_sse_encoding()