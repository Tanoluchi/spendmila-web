import os
import uuid
import shutil
from typing import Optional
from pathlib import Path

from fastapi import APIRouter, UploadFile, HTTPException, Request
from fastapi.responses import FileResponse

from app.api.deps import CurrentUser, SessionDep
from app.core.config import settings
from app.schemas.user import Message

router = APIRouter(prefix="/file-upload", tags=["file-upload"])

# Create upload directory if it doesn't exist
UPLOAD_DIR = Path(settings.UPLOAD_DIRECTORY) / "profile_pictures"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/profile-picture", response_model=Message)
async def upload_profile_picture(
    file: UploadFile, 
    current_user: CurrentUser,
    session: SessionDep,
    request: Request,
) -> Message:
    """
    Upload a profile picture for the current user.
    """
    # Validate file size (2MB limit)
    file_size = 0
    contents = await file.read()
    file_size = len(contents)
    
    if file_size > 2 * 1024 * 1024:  # 2MB in bytes
        raise HTTPException(
            status_code=400, 
            detail="File size exceeds the 2MB limit"
        )
    
    # Reset file pointer to beginning
    await file.seek(0)
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"File type not supported. Must be one of: {', '.join(allowed_types)}"
        )
    
    # Create unique filename
    file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
    if not file_extension:
        # Guess extension from content type
        if file.content_type == "image/jpeg":
            file_extension = ".jpg"
        elif file.content_type == "image/png":
            file_extension = ".png"
        elif file.content_type == "image/gif":
            file_extension = ".gif"
        else:
            file_extension = ".bin"
    
    unique_filename = f"{current_user.id}_{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Generate relative URL path using the filename we already created
    relative_url = f"/api/v1/file-upload/profile-pictures/{unique_filename}"
    # Construct the complete URL including the base URL
    base_url = str(request.base_url).rstrip('/')
    public_url = f"{base_url}{relative_url}"
    
    # Update the user's profile_picture field
    # Save the relative URL in the database to maintain consistency
    current_user.profile_picture = relative_url
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    
    # Return the full URL to the frontend
    return Message(message="Profile picture uploaded successfully", data={"url": public_url})

@router.get("/profile-pictures/{filename}")
async def get_profile_picture(filename: str):
    """
    Retrieve a profile picture by filename.
    """
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Profile picture not found")
    
    return FileResponse(str(file_path))
