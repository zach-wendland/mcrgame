# How to Save Your Sprite Sheets

You have sprite sheet images that need to be saved to this directory with specific filenames.

## Required Files

Save your images with these **exact** filenames:

1. **bassist-sheet.png** - The bassist character sprite (3 rows x 24 columns)
2. **guitarist-sheet.png** - Lead guitarist sprite (3 rows x 6 columns)
3. **patient-sheet.png** - Hospital patient sprite (6 rows x 6 columns)
4. **lead-singer-sheet.png** - Lead singer sprite (4 rows x 6 columns)
5. **drummer-sheet.png** - Skeleton drummer sprite (4 rows x 6 columns)

## How to Save

### Option 1: Drag and Drop (Easiest)
1. Open this folder in Windows Explorer: `C:\Users\lyyud\projects\mcrgame\public\sprites\`
2. Drag your sprite sheet images into this folder
3. Rename them to match the exact filenames above

### Option 2: Right-Click Save
1. Right-click each image
2. Select "Save Image As..."
3. Navigate to `C:\Users\lyyud\projects\mcrgame\public\sprites\`
4. Use the exact filename from the list above

### Option 3: Command Line
If you have the images elsewhere, use:
```bash
# From the directory containing your images:
copy bassist-sprite.png "C:\Users\lyyud\projects\mcrgame\public\sprites\bassist-sheet.png"
copy guitarist-sprite.png "C:\Users\lyyud\projects\mcrgame\public\sprites\guitarist-sheet.png"
copy patient-sprite.png "C:\Users\lyyud\projects\mcrgame\public\sprites\patient-sheet.png"
copy lead-singer-sprite.png "C:\Users\lyyud\projects\mcrgame\public\sprites\lead-singer-sheet.png"
copy drummer-sprite.png "C:\Users\lyyud\projects\mcrgame\public\sprites\drummer-sheet.png"
```

## Verification

After saving, run this command to verify:
```bash
cd C:\Users\lyyud\projects\mcrgame
dir public\sprites\*.png
```

You should see all 5 PNG files listed.

## Testing

Start the dev server to see the sprites in action:
```bash
npm run dev
```

The game will automatically use sprite sheets when available and fall back to procedural rendering for any missing sprites.
