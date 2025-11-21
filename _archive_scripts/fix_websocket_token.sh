#!/bin/bash
# Prompt for fixing WebSocket connection issue due to dummy "test" token
# Target File: backend/app/api/chat_websocket_router.py

echo "Starting WebSocket Token Validation Fix..."
echo "Target: Allow 'test' token for development in chat_websocket_router.py"

# --- Step 1: Backup Original File ---
ORIGINAL_FILE="backend/app/api/chat_websocket_router.py"
BACKUP_FILE="${ORIGINAL_FILE}.backup_$(date +%Y%m%d_%H%M%S)"

if [ -f "$ORIGINAL_FILE" ]; then
  echo "Creating backup: $BACKUP_FILE"
  cp "$ORIGINAL_FILE" "$BACKUP_FILE"
  if [ $? -eq 0 ]; then
    echo "Backup successful."
  else
    echo "ERROR: Failed to create backup of $ORIGINAL_FILE. Halting."
    exit 1
  fi
else
  echo "ERROR: Target file $ORIGINAL_FILE not found. Halting."
  exit 1
fi

# --- Step 2: Apply Fix ---
# This sed command attempts to find the line where token validation occurs
# and insert the conditional logic. The exact pattern might need manual verification
# depending on the exact structure of the original file.
# ASSUMPTION: The token validation line looks something like `payload = jwt.decode(...)`
# and is preceded by logic fetching the token.

# A more robust way is to read the file, modify the logic in a controlled way, and write it back.
# Here's a Python scriptlet to perform the modification:

FIX_SCRIPT=$(cat << 'PYTHON_SCRIPT'
import re

file_path = "backend/app/api/chat_websocket_router.py"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the new logic block for token handling
new_token_logic = '''    # --- Token Validation Logic (Dev-Friendly) ---
    if token == "test":
        # For development, accept 'test' token and assign default user ID
        user_id = "1"
        print(f"WebSocket: Accepted dev token 'test' for user_id: {user_id}")
    else:
        # For production, validate the JWT token
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id = payload.get("sub")
            if user_id is None:
                await websocket.close(code=1008, reason="Invalid token: no subject (sub) found")
                return
        except jwt.JWTError as e:
            print(f"WebSocket: JWT Error - {e}")
            await websocket.close(code=1008, reason="Invalid token")
            return
    # --- End Token Validation Logic ---'''

# Find the function definition for the websocket endpoint
# Look for the function signature that takes token and websocket
pattern = r'async def websocket_endpoint\(websocket: WebSocket,\s*chat_id: str,\s*token: str\s*=\s*Query\(.*?\)\):\s*\n(\s*.*?\n)*?(?=\s*await websocket\.accept\(\)|\s*try:|\s*if|\s*#)'
match = re.search(pattern, content, re.MULTILINE)

if match:
    # Replace the token validation part within the matched function
    # This is a simplified replacement. It assumes the old validation block can be identified.
    # A more precise way is to find the specific lines around token validation.
    # For now, let's assume we replace the lines immediately before websocket.accept.
    start, end = match.span()
    function_body = content[start:end]

    # Find the line before websocket.accept or the first major logic block after token is fetched
    # This is a heuristic; adjust if the structure is different.
    # Let's find a line that likely contains old validation, e.g., `payload = jwt.decode(...)`
    old_validation_pattern = r'(.*?)(payload = jwt\.decode\(.*\)\n\s*user_id = payload\.get\(.*\)\n\s*if user_id is None:.*?return\n\s*except.*?return\n\s*)(.*)'
    old_match = re.search(old_validation_pattern, function_body, re.DOTALL)

    if old_match:
        prefix = old_match.group(1)
        suffix = old_match.group(3)
        new_function_body = prefix + new_token_logic + '\n' + suffix
        updated_content = content[:start] + new_function_body + content[end:]
        print("Pattern for old validation found and replaced.")
    else:
        # If the specific old validation block isn't found, append the new logic after the signature
        # This is less ideal but safer than failing.
        print("WARNING: Specific old validation block not found. Appending new logic after function signature.")
        lines = function_body.split('\n')
        insert_index = 1 # After the def line
        for i, line in enumerate(lines):
            if 'await websocket.accept(' in line or 'try:' in line:
                insert_index = i
                break
        new_lines = lines[:insert_index] + [''] + new_token_logic.split('\n') + [''] + lines[insert_index:]
        new_function_body = '\n'.join(new_lines)
        updated_content = content[:start] + new_function_body + content[end:]
        print("Appended new token logic.")

    # Write the updated content back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    print("File updated successfully with new token validation logic.")
else:
    print("ERROR: Could not find the websocket endpoint function signature in the file. Manual intervention required.")
    print("Expected pattern: 'async def websocket_endpoint(websocket: WebSocket, chat_id: str, token: str = Query(...)):")
    exit 1

PYTHON_SCRIPT
)

# Execute the Python scriptlet to perform the modification
echo "Applying token validation logic..."
python3 -c "$FIX_SCRIPT"

if [ $? -ne 0 ]; then
  echo "ERROR: Python script for applying fix failed. The file might be in an inconsistent state."
  echo "Please review $ORIGINAL_FILE and the backup $BACKUP_FILE."
  exit 1
fi

# --- Step 3: Verification (Optional but recommended) ---
echo "Verifying changes in $ORIGINAL_FILE..."
# Check if the new logic block is present
if grep -q "For development, accept 'test' token" "$ORIGINAL_FILE"; then
  echo "Verification PASSED: New token validation logic found."
else
  echo "Verification FAILED: New token validation logic NOT found."
  echo "Manual check of $ORIGINAL_FILE is required."
  exit 1
fi

echo "Fix applied successfully to $ORIGINAL_FILE."
echo "The WebSocket endpoint now supports the 'test' token for development."
echo "Remember to restart the backend server for changes to take effect."
echo "For production, ensure real JWT tokens are used by the frontend."