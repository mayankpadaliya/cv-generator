import json
import os
from openai import OpenAI
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from datetime import datetime
import httpx
import PyPDF2
import tempfile
from reportlab.lib.enums import TA_LEFT

class CVEnhancer:
    def __init__(self, api_key):
        self.client = OpenAI(
            api_key=api_key,
            http_client=httpx.Client(trust_env=False)  # Disable environment-based proxy settings
        )
        
    def enhance_cv(self, cv_data):
        # First identify which sections have content
        filled_sections = {
            "personalInfo": any(cv_data["personalInfo"].values()),
            "education": len(cv_data.get("education", [])) > 0,
            "experience": len(cv_data.get("experience", [])) > 0,
            "skills": len(cv_data.get("skills", [])) > 0,
            "certifications": len(cv_data.get("certifications", [])) > 0
        }

        # Prepare the prompt for OpenAI
        prompt = f"""
        - Please enhance this CV data to make it more professional and personalized.
        - Add more detailed descriptions and improve the content while maintaining truthfulness.
        - Respond ONLY with the enhanced CV as a valid JSON object. Do not include any commentary, explanation, or markdown. The output must be a single valid JSON object matching the original structure.
        
        Original CV data: {json.dumps(cv_data, indent=2)}
        """
        
        try:
            print("Calling OpenAI API...")
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": """
You are an expert CV enhancement agent. Your job is to make the provided CV content more impressive, modern, and recruiter-friendly. Respond ONLY with a valid JSON object matching the input structure. Do not include any commentary, explanation, or markdown.
"""
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            
            print("Received response from OpenAI")
            response_content = response.choices[0].message.content.strip()
            print(f"Response content: {response_content}")
            
            try:
                enhanced_cv = json.loads(response_content)
                print("Successfully parsed enhanced CV JSON")
                
                # Validate the structure and content
                required_keys = ["personalInfo", "education", "experience", "skills", "certifications"]
                for key in required_keys:
                    if key not in enhanced_cv:
                        raise ValueError(f"Missing required key in enhanced CV: {key}")
                    # Verify that empty sections remain empty
                    if not filled_sections[key]:
                        if isinstance(cv_data[key], list):
                            if len(enhanced_cv[key]) > 0:
                                enhanced_cv[key] = []
                        elif isinstance(cv_data[key], dict):
                            for field in enhanced_cv[key]:
                                if cv_data[key][field] == "":
                                    enhanced_cv[key][field] = ""
                return enhanced_cv
            except json.JSONDecodeError as json_err:
                print(f"JSON parsing error: {str(json_err)}")
                print(f"Attempted to parse: {response_content}")
                # Save the failed response for debugging
                from datetime import datetime
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                fail_path = os.path.join('cv_data', f'failed_response_{timestamp}.txt')
                os.makedirs(os.path.dirname(fail_path), exist_ok=True)
                with open(fail_path, 'w', encoding='utf-8') as f:
                    f.write(response_content)
                print(f"Saved failed response to {fail_path}")
                return None
            except ValueError as val_err:
                print(f"Validation error: {str(val_err)}")
                print(f"Attempted to parse: {response_content}")
                # Save the failed response for debugging
                from datetime import datetime
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                fail_path = os.path.join('cv_data', f'failed_response_{timestamp}.txt')
                os.makedirs(os.path.dirname(fail_path), exist_ok=True)
                with open(fail_path, 'w', encoding='utf-8') as f:
                    f.write(response_content)
                print(f"Saved failed response to {fail_path}")
                return None
        except Exception as e:
            print(f"Error in enhancing CV: {str(e)}")
            print(f"Error type: {type(e).__name__}")
            import traceback
            print(f"Full traceback: {traceback.format_exc()}")
            return None

    def generate_pdf(self, cv_data, output_path):
        try:
            print("Starting PDF generation with ReportLab...")
            doc = SimpleDocTemplate(
                output_path,
                pagesize=letter,
                rightMargin=50,
                leftMargin=50,
                topMargin=50,
                bottomMargin=50
            )
            styles = getSampleStyleSheet()
            # Styles
            name_style = ParagraphStyle('Name', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=18, spaceAfter=6, textColor=colors.HexColor('#222'))
            contact_style = ParagraphStyle('Contact', parent=styles['Normal'], fontName='Helvetica', fontSize=10, textColor=colors.HexColor('#444'), spaceAfter=10)
            section_style = ParagraphStyle('Section', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=13, spaceAfter=8, spaceBefore=18, textColor=colors.HexColor('#333'))
            entry_title_style = ParagraphStyle('EntryTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, textColor=colors.HexColor('#222'), spaceAfter=2)
            entry_sub_style = ParagraphStyle('EntrySub', parent=styles['Normal'], fontName='Helvetica', fontSize=10, textColor=colors.HexColor('#555'), spaceAfter=2)
            bullet_style = ParagraphStyle('Bullet', parent=styles['Normal'], fontName='Helvetica', fontSize=10, leftIndent=12, bulletIndent=6, spaceAfter=1)
            story = []

            # --- Header ---
            pi = cv_data.get("personalInfo", {})
            name = f"{pi.get('firstName', '')} {pi.get('lastName', '')}".strip()
            contact = []
            if pi.get('location'): contact.append(pi['location'])
            if pi.get('email'): contact.append(pi['email'])
            if pi.get('phone'): contact.append(pi['phone'])
            if name:
                story.append(Paragraph(name, name_style))
            if contact:
                story.append(Paragraph(" • ".join(contact), contact_style))
            story.append(Spacer(1, 8))

            # --- Education ---
            if cv_data.get("education"):
                story.append(Paragraph("Education", section_style))
                for edu in cv_data["education"]:
                    # Institution and Location
                    inst = edu.get('institution', '')
                    loc = edu.get('location', '') if 'location' in edu else ''
                    if not loc and 'Column2' in edu: loc = edu['Column2']
                    if inst or loc:
                        t = Table([[Paragraph(inst, entry_title_style), Paragraph(loc, entry_sub_style)]], colWidths=[270, 200])
                        t.setStyle(TableStyle([
                            ('VALIGN', (0,0), (-1,-1), 'TOP'),
                            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
                            ('TOPPADDING', (0,0), (-1,-1), 0),
                        ]))
                        story.append(t)
                    # Degree and Date
                    degree = edu.get('degree', '')
                    field = edu.get('field', '')
                    date = edu.get('endDate', '')
                    if not date and 'Column2' in edu: date = edu['Column2']
                    deg_line = f"{degree}{' in ' + field if field else ''}".strip()
                    if deg_line or date:
                        t = Table([[Paragraph(deg_line, entry_sub_style), Paragraph(date, entry_sub_style)]], colWidths=[270, 200])
                        t.setStyle(TableStyle([
                            ('VALIGN', (0,0), (-1,-1), 'TOP'),
                            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
                            ('TOPPADDING', (0,0), (-1,-1), 0),
                        ]))
                        story.append(t)
                    # Description, Thesis, Coursework
                    if edu.get('description'):
                        story.append(Paragraph(edu['description'], entry_sub_style))
                    if edu.get('thesis'):
                        story.append(Paragraph(f"Thesis: {edu['thesis']}", entry_sub_style))
                    if edu.get('coursework'):
                        story.append(Paragraph(f"Relevant Coursework: {edu['coursework']}", entry_sub_style))
                    story.append(Spacer(1, 6))
                story.append(Spacer(1, 10))

            # --- Experience ---
            if cv_data.get("experience"):
                story.append(Paragraph("Experience", section_style))
                for exp in cv_data["experience"]:
                    # Company and Location
                    comp = exp.get('company', '')
                    loc = exp.get('location', '') if 'location' in exp else ''
                    if not loc and 'Column2' in exp: loc = exp['Column2']
                    if comp or loc:
                        t = Table([[Paragraph(comp, entry_title_style), Paragraph(loc, entry_sub_style)]], colWidths=[270, 200])
                        t.setStyle(TableStyle([
                            ('VALIGN', (0,0), (-1,-1), 'TOP'),
                            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
                            ('TOPPADDING', (0,0), (-1,-1), 0),
                        ]))
                        story.append(t)
                    # Position and Date
                    pos = exp.get('position', '')
                    date = exp.get('endDate', '')
                    if not date and 'Column2' in exp: date = exp['Column2']
                    if pos or date:
                        t = Table([[Paragraph(pos, entry_sub_style), Paragraph(date, entry_sub_style)]], colWidths=[270, 200])
                        t.setStyle(TableStyle([
                            ('VALIGN', (0,0), (-1,-1), 'TOP'),
                            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
                            ('TOPPADDING', (0,0), (-1,-1), 0),
                        ]))
                        story.append(t)
                    # Achievements/Description
                    if exp.get('description'):
                        story.append(Paragraph(exp['description'], entry_sub_style))
                    if exp.get('achievements'):
                        for ach in exp['achievements']:
                            story.append(Paragraph(f"· {ach}", bullet_style))
                    story.append(Spacer(1, 6))
                story.append(Spacer(1, 10))

            # --- Skills & Interests ---
            if cv_data.get("skills") or cv_data.get("certifications"):
                story.append(Paragraph("Skills & Interests", section_style))
                if cv_data.get("skills"):
                    for skill in cv_data["skills"]:
                        story.append(Paragraph(f"· {skill}", bullet_style))
                if cv_data.get("certifications"):
                    for cert in cv_data["certifications"]:
                        line = cert if isinstance(cert, str) else cert.get('name', '')
                        if isinstance(cert, dict):
                            if cert.get('issuer'):
                                line += f", {cert['issuer']}"
                            if cert.get('date'):
                                line += f" ({cert['date']})"
                        story.append(Paragraph(f"· {line}", bullet_style))
                story.append(Spacer(1, 10))

            # --- Enhanced Content (fallback) ---
            if cv_data.get('enhancedContent') and not (cv_data.get('education') or cv_data.get('experience') or cv_data.get('skills') or cv_data.get('certifications')):
                story.append(Paragraph("Enhanced CV", section_style))
                paragraphs = cv_data['enhancedContent'].split('\n')
                for para in paragraphs:
                    if para.strip():
                        story.append(Paragraph(para, entry_sub_style))
                        story.append(Spacer(1, 8))

            print(f"Building PDF at: {output_path}")
            doc.build(story)
            print("PDF generated successfully")
            return output_path
        except Exception as e:
            print(f"Detailed error in generate_pdf: {str(e)}")
            print(f"Error type: {type(e).__name__}")
            import traceback
            print(f"Full traceback: {traceback.format_exc()}")
            return None

def process_cv(cv_json_path, api_key):
    """
    Main function to process CV: enhance it and generate PDF
    """
    try:
        print("[DEBUG] Starting CV processing...")
        # Read the original CV data
        with open(cv_json_path, 'r') as file:
            cv_data = json.load(file)
        print("[DEBUG] Successfully loaded CV data")
        
        # Initialize the enhancer
        print("[DEBUG] Initializing CV Enhancer with API key...")
        enhancer = CVEnhancer(api_key)
        
        # Check if we have parsed PDF text
        parsed_pdf_text = cv_data.get('parsedPDFText', '')
        print(f"[DEBUG] Parsed PDF text present: {bool(parsed_pdf_text)}")
        print(f"[DEBUG] Parsed PDF text length: {len(parsed_pdf_text)}")
        
        # Enhance the CV
        print("[DEBUG] Starting CV enhancement with OpenAI...")
        if parsed_pdf_text:
            print("[DEBUG] Using parsed PDF text for enhancement...")
            # If we have parsed PDF text, use it for enhancement
            response = enhancer.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an expert CV writer and career coach. Your job is to transform the following CV content into a highly professional, modern, and impactful version suitable for top recruiters and hiring managers.\n"
                            "Guidelines:\n"
                            "- Use strong action verbs, industry keywords, and concise, achievement-oriented language.\n"
                            "- Quantify achievements and results where possible, but do NOT invent new facts.\n"
                            "- Make the language clear, impactful, and professional.\n"
                            "- Keep the structure and facts the same, but maximize the appeal to recruiters.\n"
                            "- Respond ONLY with the enhanced CV content. No extra commentary, no markdown, no explanation."
                        )
                    },
                    {
                        "role": "user",
                        "content": f"Here is the CV content to enhance:\n\n{parsed_pdf_text}"
                    }
                ],
                temperature=0.7
            )
            print("[DEBUG] Received response from OpenAI")
            enhanced_text = response.choices[0].message.content
            print(f"[DEBUG] Enhanced text length: {len(enhanced_text)}")
            # Update the CV data with enhanced content
            cv_data = {
                **cv_data,
                'enhancedContent': enhanced_text
            }
            print("[DEBUG] Updated CV data with enhanced content")
        else:
            print("[DEBUG] No PDF text found, enhancing structured data...")
            # If no parsed PDF text, enhance the structured data
            enhanced_cv = enhancer.enhance_cv(cv_data)
            if enhanced_cv:
                cv_data = enhanced_cv
                print("[DEBUG] Successfully enhanced structured CV data")
            else:
                print("[ERROR] Failed to enhance CV data")
                raise ValueError("Failed to enhance CV data")
        print("[DEBUG] CV enhancement successful")
        # Generate timestamp for unique filenames
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        # Save enhanced CV as JSON
        enhanced_json_path = os.path.join('cv_data', f'enhanced_cv_{timestamp}.json')
        os.makedirs(os.path.dirname(enhanced_json_path), exist_ok=True)
        with open(enhanced_json_path, 'w') as file:
            json.dump(cv_data, file, indent=2)
        print(f"[DEBUG] Enhanced CV saved to {enhanced_json_path}")
        # Generate PDF using the class method for consistency
        print("[DEBUG] Starting PDF generation...")
        pdf_path = os.path.join('cv_data', f'enhanced_cv_{timestamp}.pdf')
        pdf_result = enhancer.generate_pdf(cv_data, pdf_path)
        if not pdf_result:
            print("[ERROR] PDF generation failed.")
            raise ValueError("PDF generation failed.")
        print(f"[DEBUG] PDF generated successfully at {pdf_path}")
        return pdf_path, None
    except Exception as e:
        print(f"[ERROR] Error in process_cv: {str(e)}")
        print(f"[ERROR] Error type: {type(e).__name__}")
        import traceback
        print(f"[ERROR] Full traceback: {traceback.format_exc()}")
        return None, str(e)

def process_pdf_cv(pdf_path, api_key):
    """
    Process a PDF CV: extract text, enhance with OpenAI, and generate enhanced PDF
    """
    try:
        print("Starting PDF CV processing...")
        
        # Extract text from PDF
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
        
        print("Successfully extracted text from PDF")
        
        # Initialize OpenAI client
        client = OpenAI(api_key=api_key)
        
        # Enhance CV content with OpenAI
        print("Starting CV enhancement with OpenAI...")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """
You are an expert CV writer and career coach. Your job is to transform the following CV content into a highly professional, modern, and impactful version suitable for top recruiters and hiring managers.
Guidelines:
- Use strong action verbs, industry keywords, and concise, achievement-oriented language.
- Quantify achievements and results where possible, but do NOT invent new facts.
- Make the language clear, impactful, and professional.
- Keep the structure and facts the same, but maximize the appeal to recruiters.
- Respond ONLY with the enhanced CV content. No extra commentary.
"""
                },
                {
                    "role": "user",
                    "content": f"Please enhance this CV content:\n\n{text}"
                }
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        enhanced_text = response.choices[0].message.content
        print("CV enhancement successful")
        
        # Generate timestamp for unique filenames
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Create enhanced PDF
        print("Starting enhanced PDF generation...")
        pdf_path = os.path.join('cv_data', f'enhanced_cv_{timestamp}.pdf')
        os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
        
        # Create PDF document
        doc = SimpleDocTemplate(
            pdf_path,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        # Get styles
        styles = getSampleStyleSheet()
        normal_style = styles['Normal']
        
        # Create the story (content)
        story = []
        
        # Add enhanced content
        paragraphs = enhanced_text.split('\n')
        for para in paragraphs:
            if para.strip():
                story.append(Paragraph(para, normal_style))
                story.append(Spacer(1, 12))
        
        # Build the PDF
        doc.build(story)
        print(f"Enhanced PDF generated at {pdf_path}")
        
        return pdf_path, None
        
    except Exception as e:
        print(f"Error in process_pdf_cv: {str(e)}")
        return None, str(e) 