import sys
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import requests
from io import BytesIO
import os
import time
import hashlib

# Configuration
DICE_ASSETS_DIR = 'dice_assets'
TEMP_DIR = 'temp_dice_images'
IMAGE_WIDTH = 700
IMAGE_HEIGHT = 250
AVATAR_SIZE = 80

def download_image(url):
    """Download image from URL with error handling"""
    try:
        if url == 'null' or not url:
            return None
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return Image.open(BytesIO(response.content))
    except Exception as e:
        print(f"Error downloading image: {e}")
        return None

def resize_avatar(image, size=AVATAR_SIZE):
    """Resize and create circular avatar"""
    try:
        # Resize image
        image = image.resize((size, size), Image.Resampling.LANCZOS)
        
        # Create circular mask
        mask = Image.new('L', (size, size), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size, size), fill=255)
        
        # Apply mask to create circular image
        output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        output.paste(image, (0, 0))
        output.putalpha(mask)
        
        return output
    except Exception as e:
        print(f"Error processing avatar: {e}")
        return create_default_avatar(size)

def create_default_avatar(size=AVATAR_SIZE):
    """Create a default avatar with a solid color"""
    avatar = Image.new('RGBA', (size, size), (100, 100, 100, 255))
    draw = ImageDraw.Draw(avatar)
    
    # Draw a simple circle
    draw.ellipse([10, 10, size-10, size-10], fill=(150, 150, 150, 255))
    
    return avatar

def create_dice_image(number):
    """Create or load dice image for given number"""
    try:
        dice_image_path = os.path.join(DICE_ASSETS_DIR, f'{number}.jpg')
        if os.path.exists(dice_image_path):
            dice_img = Image.open(dice_image_path)
            dice_img = dice_img.resize((60, 60), Image.Resampling.LANCZOS)
            return dice_img
    except Exception as e:
        print(f"Error loading dice image: {e}")
    
    # Create a simple dice image if file doesn't exist
    dice_img = Image.new('RGB', (60, 60), color='white')
    draw = ImageDraw.Draw(dice_img)
    
    # Draw dice border
    draw.rectangle([0, 0, 59, 59], outline='black', width=2)
    
    # Draw dots based on number
    dot_positions = {
        1: [(30, 30)],
        2: [(15, 15), (45, 45)],
        3: [(15, 15), (30, 30), (45, 45)],
        4: [(15, 15), (45, 15), (15, 45), (45, 45)],
        5: [(15, 15), (45, 15), (30, 30), (15, 45), (45, 45)],
        6: [(15, 15), (45, 15), (15, 30), (45, 30), (15, 45), (45, 45)]
    }
    
    for pos in dot_positions.get(number, []):
        draw.ellipse([pos[0]-4, pos[1]-4, pos[0]+4, pos[1]+4], fill='black')
    
    return dice_img

def get_default_font(size=36):
    """Get default font or fallback to PIL default"""
    try:
        return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", size)
    except:
        try:
            return ImageFont.truetype("arial.ttf", size)
        except:
            return ImageFont.load_default()

def create_dice_battle_image(player_roll, bot_roll, player_avatar_url=None, bot_avatar_url=None, player_name="Player", bot_name="Bot"):
    """Create the complete dice battle image"""
    try:
        # Ensure temp directory exists
        os.makedirs(TEMP_DIR, exist_ok=True)
        os.makedirs(DICE_ASSETS_DIR, exist_ok=True)
        
        # Create background
        background_path = os.path.join(DICE_ASSETS_DIR, 'red_background_700x250.png')
        if os.path.exists(background_path):
            image = Image.open(background_path).convert('RGBA')
            image = image.resize((IMAGE_WIDTH, IMAGE_HEIGHT), Image.Resampling.LANCZOS)
        else:
            # Create gradient background
            image = Image.new('RGBA', (IMAGE_WIDTH, IMAGE_HEIGHT), (139, 69, 19, 255))
            draw = ImageDraw.Draw(image)
            for i in range(IMAGE_HEIGHT):
                alpha = int(255 * (1 - i / IMAGE_HEIGHT * 0.3))
                color = (139, 69, 19, alpha)
                draw.line([(0, i), (IMAGE_WIDTH, i)], fill=color)
        
        draw = ImageDraw.Draw(image)
        
        # Fonts
        title_font = get_default_font(32)
        name_font = get_default_font(24)
        number_font = get_default_font(28)
        
        # Title
        title_text = "🎲 معركة النرد 🎲"
        title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
        title_width = title_bbox[2] - title_bbox[0]
        title_x = (IMAGE_WIDTH - title_width) // 2
        
        # Draw title with shadow effect
        draw.text((title_x + 2, 12), title_text, font=title_font, fill=(0, 0, 0, 180))
        draw.text((title_x, 10), title_text, font=title_font, fill=(255, 255, 255, 255))
        
        # Player section (left)
        player_x = 100
        player_y = 80
        
        # Player avatar
        if player_avatar_url and player_avatar_url != 'null':
            player_avatar = download_image(player_avatar_url)
            if player_avatar:
                player_avatar = resize_avatar(player_avatar)
            else:
                player_avatar = create_default_avatar()
        else:
            player_avatar = create_default_avatar()
        
        image.paste(player_avatar, (player_x - AVATAR_SIZE // 2, player_y), player_avatar)
        
        # Player name
        player_name = player_name[:12]  # Limit name length
        name_bbox = draw.textbbox((0, 0), player_name, font=name_font)
        name_width = name_bbox[2] - name_bbox[0]
        name_x = player_x - name_width // 2
        draw.text((name_x + 1, player_y + 85), player_name, font=name_font, fill=(0, 0, 0, 180))
        draw.text((name_x, player_y + 84), player_name, font=name_font, fill=(255, 255, 255, 255))
        
        # Player dice
        player_dice = create_dice_image(player_roll)
        dice_x = player_x - 30
        dice_y = player_y + 110
        image.paste(player_dice, (dice_x, dice_y))
        
        # Player dice number
        number_text = str(player_roll)
        number_bbox = draw.textbbox((0, 0), number_text, font=number_font)
        number_width = number_bbox[2] - number_bbox[0]
        number_x = player_x - number_width // 2
        draw.text((number_x + 1, dice_y + 66), number_text, font=number_font, fill=(0, 0, 0, 180))
        draw.text((number_x, dice_y + 65), number_text, font=number_font, fill=(255, 215, 0, 255))
        
        # Bot section (right)
        bot_x = 600
        bot_y = 80
        
        # Bot avatar
        if bot_avatar_url and bot_avatar_url != 'null':
            bot_avatar = download_image(bot_avatar_url)
            if bot_avatar:
                bot_avatar = resize_avatar(bot_avatar)
            else:
                bot_avatar = create_default_avatar()
        else:
            bot_avatar = create_default_avatar()
        
        image.paste(bot_avatar, (bot_x - AVATAR_SIZE // 2, bot_y), bot_avatar)
        
        # Bot name
        bot_name = bot_name[:12]  # Limit name length
        name_bbox = draw.textbbox((0, 0), bot_name, font=name_font)
        name_width = name_bbox[2] - name_bbox[0]
        name_x = bot_x - name_width // 2
        draw.text((name_x + 1, bot_y + 85), bot_name, font=name_font, fill=(0, 0, 0, 180))
        draw.text((name_x, bot_y + 84), bot_name, font=name_font, fill=(255, 255, 255, 255))
        
        # Bot dice
        bot_dice = create_dice_image(bot_roll)
        dice_x = bot_x - 30
        dice_y = bot_y + 110
        image.paste(bot_dice, (dice_x, dice_y))
        
        # Bot dice number
        number_text = str(bot_roll)
        number_bbox = draw.textbbox((0, 0), number_text, font=number_font)
        number_width = number_bbox[2] - number_bbox[0]
        number_x = bot_x - number_width // 2
        draw.text((number_x + 1, dice_y + 66), number_text, font=number_font, fill=(0, 0, 0, 180))
        draw.text((number_x, dice_y + 65), number_text, font=number_font, fill=(255, 215, 0, 255))
        
        # VS text in the middle
        vs_text = "VS"
        vs_font = get_default_font(40)
        vs_bbox = draw.textbbox((0, 0), vs_text, font=vs_font)
        vs_width = vs_bbox[2] - vs_bbox[0]
        vs_x = (IMAGE_WIDTH - vs_width) // 2
        vs_y = 130
        
        # VS with glow effect
        for offset in [(2, 2), (1, 1), (0, 0)]:
            color = (0, 0, 0, 200) if offset != (0, 0) else (255, 0, 0, 255)
            draw.text((vs_x + offset[0], vs_y + offset[1]), vs_text, font=vs_font, fill=color)
        
        # Determine winner and add effect
        if player_roll > bot_roll:
            winner = 'player'
            # Add winner glow around player
            for i in range(3):
                draw.ellipse([player_x - AVATAR_SIZE//2 - i*2, player_y - i*2, 
                            player_x + AVATAR_SIZE//2 + i*2, player_y + AVATAR_SIZE + i*2], 
                           outline=(255, 215, 0, 100 - i*30), width=2)
        elif bot_roll > player_roll:
            winner = 'bot'
            # Add winner glow around bot
            for i in range(3):
                draw.ellipse([bot_x - AVATAR_SIZE//2 - i*2, bot_y - i*2, 
                            bot_x + AVATAR_SIZE//2 + i*2, bot_y + AVATAR_SIZE + i*2], 
                           outline=(255, 215, 0, 100 - i*30), width=2)
        else:
            winner = 'tie'
        
        # Save image
        timestamp = int(time.time())
        random_id = random.randint(10000000, 99999999)
        image_filename = f'dice_result_{random_id}.png'
        image_path = os.path.join(TEMP_DIR, image_filename)
        
        # Convert to RGB for saving as PNG
        if image.mode == 'RGBA':
            background = Image.new('RGB', image.size, (139, 69, 19))
            background.paste(image, mask=image.split()[-1])
            image = background
        
        image.save(image_path, 'PNG', quality=95, optimize=True)
        
        return image_path, winner
        
    except Exception as e:
        print(f"Error creating dice battle image: {e}")
        import traceback
        traceback.print_exc()
        return None, None

def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) < 7:
        print("Usage: python improved_dice_generator.py <player_roll> <bot_roll> <player_avatar_url> <bot_avatar_url> <player_name> <bot_name>")
        sys.exit(1)
    
    try:
        player_roll = int(sys.argv[1])
        bot_roll = int(sys.argv[2])
        player_avatar_url = sys.argv[3] if sys.argv[3] != 'null' else None
        bot_avatar_url = sys.argv[4] if sys.argv[4] != 'null' else None
        player_name = sys.argv[5]
        bot_name = sys.argv[6]
        
        print(f"Generating dice battle image: {player_name}({player_roll}) vs {bot_name}({bot_roll})")
        
        image_path, winner = create_dice_battle_image(
            player_roll, bot_roll, player_avatar_url, bot_avatar_url, player_name, bot_name
        )
        
        if image_path and os.path.exists(image_path):
            print(f"SUCCESS:{image_path}:{winner}")
        else:
            print("ERROR: Failed to create image")
            sys.exit(1)
            
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
