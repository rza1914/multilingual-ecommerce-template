"""
Image processing endpoints for iShop E-commerce Platform
Provides image proxy, resizing, and optimization services
"""

import io
import asyncio
from datetime import datetime, timedelta
from typing import Optional
from urllib.parse import urlparse

import aiohttp
from fastapi import APIRouter, HTTPException, Query, Response, Depends
from PIL import Image

from ...core.auth import get_current_user
from ...models.user import User
from fastapi import UploadFile, File

router = APIRouter()

# Cache for processed images (in a real app, use Redis or similar)
image_cache = {}

@router.get("/image")
async def proxy_image(
    url: str = Query(..., description="The original image URL to proxy"),
    width: Optional[int] = Query(None, ge=1, le=5000, description="Width to resize image to"),
    height: Optional[int] = Query(None, ge=1, le=5000, description="Height to resize image to"),
    quality: int = Query(80, ge=1, le=100, description="JPEG quality percentage"),
    format: Optional[str] = Query(None, regex="^(jpeg|png|webp)$", description="Output format"),
    user: User = Depends(get_current_user)
):
    """
    Proxy external images through our server with optimization
    This helps with CORS issues and allows for image processing
    """
    # Validate the URL
    parsed = urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        raise HTTPException(status_code=400, detail="Invalid URL provided")
    
    # Validate URL is for an image domain (for security)
    allowed_domains = ["images.unsplash.com", "images.pexels.com", "picsum.photos"]
    if parsed.netloc not in allowed_domains:
        raise HTTPException(status_code=400, detail="Domain not allowed for proxying")
    
    # Check cache first
    cache_key = f"{url}_{width}_{height}_{quality}_{format}"
    if cache_key in image_cache:
        cached_data, cached_content_type = image_cache[cache_key]
        return Response(
            content=cached_data,
            media_type=cached_content_type,
            headers={
                "Cache-Control": "public, max-age=86400",  # Cache for 1 day
                "X-From-Cache": "true"
            }
        )
    
    try:
        # Download the original image
        timeout = aiohttp.ClientTimeout(total=10)  # 10 second timeout
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(url, headers={"User-Agent": "iShop Image Proxy 1.0"}) as resp:
                if resp.status != 200:
                    raise HTTPException(status_code=404, detail="Image not found at source URL")
                
                # Check content type to ensure it's an image
                content_type = resp.headers.get("Content-Type", "")
                if not content_type.startswith("image/"):
                    raise HTTPException(status_code=400, detail="URL does not point to an image")
                
                image_bytes = await resp.read()
                
                # If no processing needed, just return the original image
                if not width and not height and not format:
                    return Response(
                        content=image_bytes,
                        media_type=content_type,
                        headers={"Cache-Control": "public, max-age=86400"}
                    )
                
                # Process the image (resize, convert format, adjust quality)
                processed_image_bytes, output_format = await asyncio.get_event_loop().run_in_executor(
                    None, process_image, image_bytes, width, height, quality, format
                )
                
                # Determine content type based on format
                content_type_map = {
                    "jpeg": "image/jpeg",
                    "png": "image/png", 
                    "webp": "image/webp"
                }
                output_content_type = content_type_map.get(output_format, content_type)
                
                # Cache the processed image
                image_cache[cache_key] = (processed_image_bytes, output_content_type)
                
                return Response(
                    content=processed_image_bytes,
                    media_type=output_content_type,
                    headers={
                        "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400",  # Cache for 1 day, allow stale revalidation for 1 day
                        "ETag": f'"{hash(processed_image_bytes)}"',  # Add ETag for client-side caching
                        "Expires": (datetime.utcnow() + timedelta(days=1)).strftime('%a, %d %b %Y %H:%M:%S GMT'),  # Expires header
                        "X-Processed": "true",
                        "X-Content-Type-Options": "nosniff"  # Security header
                    }
                )
    
    except asyncio.TimeoutError:
        raise HTTPException(status_code=408, detail="Request timeout while fetching image")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


def process_image(image_bytes: bytes, width: Optional[int], height: Optional[int], 
                  quality: int, target_format: Optional[str]):
    """
    Process an image: resize, change format, adjust quality
    This runs in a separate thread to avoid blocking the event loop
    """
    try:
        # Open the image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert RGBA to RGB if needed for JPEG
        if image.mode in ("RGBA", "LA") and target_format in ("jpeg", "jpg"):
            background = Image.new("RGB", image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1] if image.mode == "RGBA" else None)
            image = background
        
        # Resize if dimensions provided
        if width or height:
            # Calculate dimensions maintaining aspect ratio if only one dimension provided
            original_width, original_height = image.size
            if width and height:
                # Resize to exact dimensions (may change aspect ratio)
                image = image.resize((width, height), Image.LANCZOS)
            elif width:
                # Resize based on width maintaining aspect ratio
                new_height = int((width / original_width) * original_height)
                image = image.resize((width, new_height), Image.LANCZOS)
            elif height:
                # Resize based on height maintaining aspect ratio
                new_width = int((height / original_height) * original_width)
                image = image.resize((new_width, height), Image.LANCZOS)
        
        # Determine output format
        output_format = target_format or image.format or "JPEG"
        if output_format.upper() not in ["JPEG", "PNG", "WEBP"]:
            output_format = "JPEG"  # Default to JPEG if format is not supported
        
        # Save to bytes with specified format and quality
        output_bytes = io.BytesIO()
        
        if output_format.upper() == "JPEG":
            image.save(output_bytes, format="JPEG", quality=quality, optimize=True)
        elif output_format.upper() == "PNG":
            image.save(output_bytes, format="PNG", optimize=True)
        elif output_format.upper() == "WEBP":
            image.save(output_bytes, format="WEBP", quality=quality, method=4, optimize=True)
        
        return output_bytes.getvalue(), output_format.lower()
    
    except Exception as e:
        raise e


@router.get("/health")
async def image_service_health():
    """Health check for the image service"""
    return {
        "status": "healthy",
        "cache_size": len(image_cache)
    }


@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    width: Optional[int] = Query(None, ge=1, le=5000),
    height: Optional[int] = Query(None, ge=1, le=5000),
    quality: int = Query(80, ge=1, le=100),
    format: Optional[str] = Query(None, regex="^(jpeg|png|webp)$"),
    user: User = Depends(get_current_user)
):
    """
    Upload an image file with optional processing
    """
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")
    
    # Read file content
    contents = await file.read()
    
    # Validate file size (max 10MB)
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large, maximum size is 10MB")
    
    try:
        # Process the image
        processed_image_bytes, output_format = await asyncio.get_event_loop().run_in_executor(
            None, process_image, contents, width, height, quality, format
        )
        
        # Determine content type based on format
        content_type_map = {
            "jpeg": "image/jpeg",
            "png": "image/png", 
            "webp": "image/webp"
        }
        output_content_type = content_type_map.get(output_format, file.content_type)
        
        # In a real implementation, you would save the processed image to storage
        # and return metadata about the saved file
        # For now, returning the processed image directly
        
        return Response(
            content=processed_image_bytes,
            media_type=output_content_type,
            headers={
                "Cache-Control": "public, max-age=86400",
                "X-Processed": "true"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing uploaded image: {str(e)}")