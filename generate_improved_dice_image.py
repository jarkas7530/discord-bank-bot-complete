#!/usr/bin/env python3
"""
Command-line wrapper for the improved dice generator.
This script provides a simple interface for the Discord bot to generate dice battle images.

Usage:
    python generate_improved_dice_image.py <player_roll> <bot_roll> <player_avatar_url> <bot_avatar_url> <player_name> <bot_name>

Example:
    python generate_improved_dice_image.py 4 6 "https://cdn.discordapp.com/avatars/123.png" "https://cdn.discordapp.com/avatars/456.png" "Player1" "BotName"
"""

import sys
import os
import subprocess

def main():
    """Main wrapper function"""
    if len(sys.argv) < 7:
        print("Usage: python generate_improved_dice_image.py <player_roll> <bot_roll> <player_avatar_url> <bot_avatar_url> <player_name> <bot_name>")
        print("Example: python generate_improved_dice_image.py 4 6 'avatar1.png' 'avatar2.png' 'Player1' 'BotName'")
        sys.exit(1)
    
    # Get the script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    generator_script = os.path.join(script_dir, 'improved_dice_generator.py')
    
    # Check if the main generator script exists
    if not os.path.exists(generator_script):
        print(f"ERROR: Could not find improved_dice_generator.py at {generator_script}")
        sys.exit(1)
    
    try:
        # Pass all arguments to the main generator script
        result = subprocess.run(
            [sys.executable, generator_script] + sys.argv[1:],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        # Print stdout (contains the result)
        if result.stdout:
            print(result.stdout.strip())
        
        # Print stderr if there were errors
        if result.stderr:
            print(result.stderr.strip(), file=sys.stderr)
        
        # Exit with the same code as the subprocess
        sys.exit(result.returncode)
        
    except subprocess.TimeoutExpired:
        print("ERROR: Image generation timed out")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: Failed to execute image generator: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
