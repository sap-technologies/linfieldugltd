#!/usr/bin/env python3
"""Compress all images in the images folder."""

import os
from PIL import Image
import glob

images_dir = "images"
compression_quality = 85  # High quality, good compression

# Get all PNG and JPG files
image_files = glob.glob(os.path.join(images_dir, "*.png")) + glob.glob(os.path.join(images_dir, "*.jpg"))

print(f"Found {len(image_files)} images to compress\n")

total_original = 0
total_compressed = 0

for img_path in sorted(image_files):
    try:
        # Get original file size
        original_size = os.path.getsize(img_path)
        total_original += original_size
        
        # Open and optimize image
        img = Image.open(img_path)
        
        # Convert RGBA to RGB if needed (for JPEG compatibility)
        if img.mode in ('RGBA', 'LA', 'P'):
            # Keep PNG as is for transparency, only convert if saving as JPG
            if img_path.lower().endswith('.jpg'):
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                rgb_img.save(img_path, quality=compression_quality, optimize=True)
            else:
                img.save(img_path, optimize=True)
        else:
            img.save(img_path, quality=compression_quality, optimize=True)
        
        # Get compressed file size
        compressed_size = os.path.getsize(img_path)
        total_compressed += compressed_size
        
        reduction = ((original_size - compressed_size) / original_size) * 100
        print(f"✓ {os.path.basename(img_path)}")
        print(f"  Before: {original_size:,} bytes → After: {compressed_size:,} bytes")
        print(f"  Reduction: {reduction:.1f}%\n")
        
    except Exception as e:
        print(f"✗ Error processing {img_path}: {e}\n")

# Summary
if total_original > 0:
    overall_reduction = ((total_original - total_compressed) / total_original) * 100
    print("=" * 50)
    print(f"Total Original Size: {total_original:,} bytes ({total_original/1024/1024:.2f} MB)")
    print(f"Total Compressed Size: {total_compressed:,} bytes ({total_compressed/1024/1024:.2f} MB)")
    print(f"Overall Reduction: {overall_reduction:.1f}%")
    print(f"Saved: {(total_original - total_compressed):,} bytes ({(total_original - total_compressed)/1024:.1f} KB)")
