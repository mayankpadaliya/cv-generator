from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
import httpx
from openai import OpenAI
import os
from dotenv import load_dotenv
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

router = APIRouter()

class LinkedInRequest(BaseModel):
    linkedinUrl: HttpUrl

@router.post("/fetch-linkedin")
async def fetch_linkedin_data(request: LinkedInRequest):
    try:
        # Check if OpenAI API key is configured
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.error("OpenAI API key not found")
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key not configured. Please add it to your .env file"
            )

        logger.info(f"Processing LinkedIn URL: {request.linkedinUrl}")
        
        client = OpenAI(api_key=api_key)
        
        # Simulate LinkedIn data (in production, this would come from LinkedIn API)
        linkedin_data = {
            "profile_url": str(request.linkedinUrl),
            "raw_text": f"Profile data extracted from {request.linkedinUrl}"
        }
        
        logger.info("Sending request to OpenAI for CV enhancement")
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",  # Using GPT-3.5 for faster response and lower cost
                messages=[
                    {
                        "role": "system",
                        "content": """You are a professional CV writer. Your task is to convert LinkedIn profile data into a structured CV format.
                        You MUST return ONLY a valid JSON object with the following structure, and no other text:
                        {
                            "personalInfo": {
                                "firstName": "string",
                                "lastName": "string",
                                "email": "string",
                                "phone": "string",
                                "location": "string",
                                "linkedIn": "string"
                            },
                            "education": [
                                {
                                    "institution": "string",
                                    "degree": "string",
                                    "field": "string",
                                    "startDate": "string",
                                    "endDate": "string",
                                    "description": "string"
                                }
                            ],
                            "experience": [
                                {
                                    "company": "string",
                                    "position": "string",
                                    "startDate": "string",
                                    "endDate": "string",
                                    "description": "string",
                                    "achievements": ["string"]
                                }
                            ],
                            "skills": ["string"],
                            "certifications": [
                                {
                                    "name": "string",
                                    "issuer": "string",
                                    "date": "string",
                                    "url": "string"
                                }
                            ]
                        }"""
                    },
                    {
                        "role": "user",
                        "content": """Please convert this LinkedIn profile data into a CV format. Return ONLY the JSON object, no other text:
                        
                        Profile URL: {url}
                        
                        For this demo, please generate sample professional data that would make sense for a software developer.""".format(url=linkedin_data['profile_url'])
                    }
                ],
                temperature=0.7,
                max_tokens=2000,
                response_format={ "type": "json_object" }  # Ensure JSON response
            )
            
            # Log the raw response for debugging
            enhanced_cv = response.choices[0].message.content
            logger.info(f"Raw OpenAI response: {enhanced_cv}")
            
            try:
                # Parse the response to ensure it's valid JSON
                cv_data = json.loads(enhanced_cv)
                
                # Validate required fields
                required_fields = ["personalInfo", "education", "experience", "skills", "certifications"]
                for field in required_fields:
                    if field not in cv_data:
                        raise ValueError(f"Missing required field: {field}")
                
                # Ensure the LinkedIn URL is included
                cv_data["personalInfo"]["linkedIn"] = str(request.linkedinUrl)
                
                return cv_data
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse OpenAI response: {e}")
                logger.error(f"Response content: {enhanced_cv}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to parse the enhanced CV data: {str(e)}"
                )
            except ValueError as e:
                logger.error(f"Invalid CV data structure: {e}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Invalid CV data structure: {str(e)}"
                )
                
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Error while enhancing CV with OpenAI: {str(e)}"
            )
        
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        ) 