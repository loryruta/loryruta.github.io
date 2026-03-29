import random
from PIL import Image, ImageDraw

random.seed(6)

def create_grid_image():
    # Configuration
    IMAGE_SIZE = 200
    GRID_RES = 8
    CELL_SIZE = 12
    # The grid is centered in the IMAGE_SIZE x IMAGE_SIZE image.
    GRID_PIXEL_SIZE = GRID_RES * CELL_SIZE
    OFFSET_X = (IMAGE_SIZE - GRID_PIXEL_SIZE) // 2
    OFFSET_Y = (IMAGE_SIZE - GRID_PIXEL_SIZE) // 2

    # Initialize the 16x16 grid with None
    # grid[x][y] as per user request
    grid = [[None for _ in range(GRID_RES)] for _ in range(GRID_RES)]

    # Add some sample tuples: (direction, span)
    # direction: 't' (up), 'b' (down), 'l' (left), 'r' (right)
    grid[0][0] = ('t', 3)    # Starts at bottom-left, goes up
    grid[1][0] = ('r', 3)
    #grid[15][15] = ('b', 6)  # Starts at top-right, goes down (into padding/overflow)
    #grid[7][6] = ('r', 4, True)   # OOB
    #grid[5][6] = ('b', 4)   # OK
    grid[3][6] = ('b', 4, True)   # OK
    
    grid[4][4] = ('l', 5)   # Starts top-ish left, goes left (into padding/overflow)
    grid[2][2] = ('t', 2)    # User's example: should fill [2][2], [2][3], [2][4]

    # Initialize the image (Transparent background)
    img = Image.new('RGBA', (IMAGE_SIZE, IMAGE_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Helper: Convert grid (x, y) to image (px_x, px_y)
    # Note: y increases UPWARDS, while PIL y increases DOWNWARDS.
    # Therefore, y=0 is at the bottom of the grid (OFFSET_Y + GRID_PIXEL_SIZE - CELL_SIZE).
    def grid_to_px(gx, gy):
        px = OFFSET_X + gx * CELL_SIZE
        # Image top is 0, Image bottom is 255
        # Grid bottom is OFFSET_Y + GRID_PIXEL_SIZE
        # Grid top is OFFSET_Y
        py = OFFSET_Y + (GRID_RES - 1 - gy) * CELL_SIZE
        return px, py

    # Draw the grid boundary (faint)
    draw.rectangle(
        [OFFSET_X, OFFSET_Y, OFFSET_X + GRID_PIXEL_SIZE, OFFSET_Y + GRID_PIXEL_SIZE],
        outline=(60, 60, 70),
        width=2
    )
    # Draw faint cell boundaries within the 16x16 grid
    for i in range(GRID_RES + 1):
        # Vertical lines
        x = OFFSET_X + i * CELL_SIZE
        draw.line([(x, OFFSET_Y), (x, OFFSET_Y + GRID_PIXEL_SIZE)], fill=(45, 45, 50))
        # Horizontal lines
        y = OFFSET_Y + i * CELL_SIZE
        draw.line([(OFFSET_X, y), (OFFSET_X + GRID_PIXEL_SIZE, y)], fill=(45, 45, 50))

    # Process each cell in the 16x16 grid
    for x in reversed(range(GRID_RES)):
        for y in range(GRID_RES):
            cell = grid[x][y]
            if cell is not None:
                if len(cell) == 2:
                    direction, span = cell
                    err = False
                else:
                    assert len(cell) == 3
                    direction, span, err = cell

                # Pick a random vibrant color for this tuple
                
                if not err:
                    random.seed(x * GRID_RES + y)
                    color = (
                        random.randint(100, 255),
                        random.randint(100, 255),
                        random.randint(100, 255)
                    )
                else:
                    color = (255, 0, 0)

                # Determine direction vectors
                dx, dy = 0, 0
                if direction == 't': dy = 1
                elif direction == 'b': dy = -1
                elif direction == 'l': dx = -1
                elif direction == 'r': dx = 1

                # Fill the span
                for i in range(span):
                    curr_x = x + dx * i
                    curr_y = y + dy * i
                    
                    # Calculate pixel position
                    px, py = grid_to_px(curr_x, curr_y)
                    
                    # Fill the cell square
                    # We only draw if it's within the IMAGE canvas (to prevent Pillow errors, although it clips anyway)
                    if -CELL_SIZE < px < IMAGE_SIZE and -CELL_SIZE < py < IMAGE_SIZE:
                        draw.rectangle(
                            [px + 1, py + 1, px + CELL_SIZE - 1, py + CELL_SIZE - 1],
                            fill=color
                        )

    # Save the image
    output_path = "grid_output.png"
    img.save(output_path)
    print(f"Exported image to {output_path}")

if __name__ == "__main__":
    create_grid_image()
