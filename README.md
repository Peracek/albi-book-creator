# Albi Book Creator

A web application for creating custom interactive books compatible with the Albi pen (Kouzelné čtení), a popular educational toy for children in Czech Republic and Slovakia.

## What is the Albi Pen?

The Albi pen is an electronic reading pen that plays sounds when touched to special books. It works using **OID (Optical Identification) codes** - tiny dot patterns printed as an invisible overprint on book pages. When the pen's optical sensor reads these dot patterns, it identifies which area was touched and plays the corresponding audio file.

## How It Works

### The Technology

1. **OID Codes**: Unique dot patterns encoded in base-4 with checksums, printed at 1200 DPI
2. **Book Pages**: Regular printed pages with an OID overprint (typically invisible or barely visible)
3. **BNL Files**: Binary files containing audio (MP3) and OID-to-sound mappings
4. **The Pen**: Reads OIDs optically and plays corresponding sounds from the BNL file on its SD card

### The Traditional Manual Process

Creating a custom Albi book manually requires:
1. Designing your book page
2. Manually calculating and generating OID dot patterns for each interactive area
3. Creating a separate 1200 DPI overprint layer with the OID patterns
4. Recording audio files for each area
5. Manually creating a BNL specification file mapping OIDs to audio files
6. Compiling the BNL file using command-line tools
7. Printing the page with OID overprint alignment
8. Loading the BNL file onto the pen's SD card

## What This App Does

This application simplifies the entire process into a visual workflow:

### Features

- **Visual Area Editor**: Draw interactive areas directly on your book page image
- **Automatic OID Assignment**: Each area gets a unique OID code automatically
- **Audio Recording**: Record or upload audio for each interactive area
- **One-Click Export**:
  - **OID Overprint PNG**: Ready-to-print 1200 DPI image with OID patterns
  - **BNL File**: Complete audio package ready for the Albi pen's SD card
- **Project Persistence**: All work saved locally in browser (IndexedDB)
- **Backup & Restore**: Export and import your entire project

### Workflow

1. Upload your book page image (or create a drawing)
2. Draw areas where you want interactivity
3. Record or upload audio for each area
4. Export:
   - Print the OID overprint on your page
   - Copy the BNL file to your Albi pen's SD card
5. Done! Tap the areas with your pen to hear the sounds

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Development

Start the development server:

```sh
npx nx serve albi-book-creator
```

The app will open at `http://localhost:4200`

### Build for Production

```sh
npx nx build albi-book-creator
```

### View All Available Commands

```sh
npx nx show project albi-book-creator
```

## Project Structure

This is an Nx monorepo with the following libraries:

- **`apps/albi-book-creator`**: Main React application
- **`libs/oid-generator`**: Generates OID dot patterns from numeric IDs
- **`libs/bnl-creator`**: Creates BNL binary files from audio and OID mappings
- **`libs/storage`**: IndexedDB persistence layer (Dexie)
- **`libs/shared`**: Shared types and utilities

## Technical Details

### OID Code Format

- Base-4 encoding of numeric IDs (e.g., `11015` → `oid_x11015`)
- 64x64 pixel raster pattern (32x2 grid)
- Includes checksum and frame dots for alignment
- Repeated across the interactive area to ensure reliable detection

### BNL File Structure

The BNL file contains:
- Header with book metadata and pen button behaviors
- Quiz data (optional, not currently used in this app)
- OID mappings with mode support (mode_0, mode_1, mode_2 for different pen modes)
- Embedded MP3 audio files

### Export Specifications

- **OID PNG**: 1200 DPI, black dots on white background, ready for transparent overprint
- **BNL**: Binary format compatible with Albi pen firmware

## Resources

- [Original Czech tutorial](https://tatageek.blog/2022/03/28/jak-vytvorit-vlastni-knizku-pro-albi-tuzku/) - Manual book creation process
