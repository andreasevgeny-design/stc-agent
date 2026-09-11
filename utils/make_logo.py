"""Генератор логотипа AI СТК в формате PNG"""
from PIL import Image, ImageDraw, ImageFont
import os

SIZE = 512


def load_font(size, bold=True):
    """Загрузка шрифта с системными fallbacks"""
    candidates = []
    if bold:
        candidates = [
            "C:/Windows/Fonts/arialbd.ttf",
            "C:/Windows/Fonts/arial.ttf",
            "C:/Windows/Fonts/arialbi.ttf",
        ]
    else:
        candidates = [
            "C:/Windows/Fonts/arial.ttf",
            "C:/Windows/Fonts/arialbd.ttf",
        ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def create_logo():
    img = Image.new("RGBA", (SIZE, SIZE), (13, 27, 42, 255))  # #0d1b2a
    draw = ImageDraw.Draw(img)

    # Градиент для надписи СТК
    dark_blue = hex_to_rgb("#1a5276")
    mid_blue = hex_to_rgb("#2980b9")

    # Круговой узор на заднем плане
    circle_center = (256, 226)
    draw.ellipse(
        [circle_center[0]-160, circle_center[1]-160,
         circle_center[0]+160, circle_center[1]+160],
        outline=(255, 255, 255, 20), width=14,
    )
    draw.ellipse(
        [circle_center[0]-132, circle_center[1]-132,
         circle_center[0]+132, circle_center[1]+132],
        outline=(255, 255, 255, 30), width=10,
    )
    draw.ellipse(
        [circle_center[0]-72, circle_center[1]-72,
         circle_center[0]+72, circle_center[1]+72],
        outline=(41, 128, 185, 127), width=6,
    )

    # Полупрозрачный ромб (руки поддержки)
    draw.polygon(
        [(256, 300), (150, 240), (256, 160), (362, 240)],
        outline=(255, 255, 255, 18),
    )

    # Декоративные точки
    dot_color_red = (231, 76, 60, 178)
    dot_color_blue = (41, 128, 185, 178)
    for (x, y), color in [
        ((120, 180), dot_color_red),
        ((392, 180), dot_color_blue),
        ((120, 300), dot_color_blue),
        ((392, 300), dot_color_red),
    ]:
        draw.ellipse([x-3, y-3, x+3, y+3], fill=color)

    # Нейроны AI (сеть)
    neurons = [
        (196, 186, (255, 255, 255, 255)),
        (316, 186, (255, 255, 255, 255)),
        (256, 246, (255, 255, 255, 255)),
        (211, 281, (255, 255, 255, 255)),
        (301, 281, (255, 255, 255, 255)),
    ]
    links = [
        ((201, 191), (251, 241)),
        ((311, 191), (261, 241)),
        ((216, 276), (251, 251)),
        ((296, 276), (261, 251)),
    ]
    for (a, b) in links:
        draw.line([a, b], fill=(231, 76, 60, 178), width=3)
    for (x, y, c) in neurons:
        draw.ellipse([x-14, y-14, x+14, y+14], fill=c)

    # Надпись СТК
    font_stk = load_font(96, bold=True)
    draw.text((256, 275), "СТК", font=font_stk, fill=(255, 255, 255, 255), anchor="mm")

    # Скобка AI
    font_ai = load_font(56, bold=True)
    ai_color = (231, 76, 60, 255)
    draw.text((256, 345), "AI", font=font_ai, fill=ai_color, anchor="mm")

    # Подпись
    draw.rectangle([96, 380, 416, 382], fill=(255, 255, 255, 38))

    font_sub = load_font(28, bold=True)
    draw.text((256, 410), "Сибирская Торговая", font=font_sub,
              fill=(255, 255, 255, 230), anchor="mm")
    draw.text((256, 445), "Компания", font=font_sub,
              fill=(255, 255, 255, 230), anchor="mm")

    # Полоса снизу
    for i in range(320):
        t = i / 319
        r = int(hex_to_rgb("#f39c12")[0] + (hex_to_rgb("#e74c3c")[0] - hex_to_rgb("#f39c12")[0]) * t)
        g = int(hex_to_rgb("#f39c12")[1] + (hex_to_rgb("#e74c3c")[1] - hex_to_rgb("#f39c12")[1]) * t)
        b = int(hex_to_rgb("#f39c12")[2] + (hex_to_rgb("#e74c3c")[2] - hex_to_rgb("#f39c12")[2]) * t)
        draw.line([(96+i, 470), (96+i, 474)], fill=(r, g, b, 255), width=5)

    base = r"C:\Users\Admin\OneDrive\Документы\Default Project\stc-agent\assets"
    img.save(os.path.join(base, "logo_ai_stc.png"))
    print(f"Логотип создан: {os.path.join(base, 'logo_ai_stc.png')}")
    print(f"Размер: {img.size}")


if __name__ == "__main__":
    create_logo()