from fpdf import FPDF

def generate_pdf(data: dict) -> bytes:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Title (Name)
    pdf.set_font("Helvetica", "B", 24)
    pdf.cell(0, 10, str(data.get("name", "")), align="C", new_x="LMARGIN", new_y="NEXT")
    
    # Contact
    pdf.set_font("Helvetica", "", 12)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 10, str(data.get("contact", "")), align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_text_color(0, 0, 0)
    
    pdf.ln(5)

    # Summary
    if data.get("summary"):
        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 10, "Summary", border="B", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)
        pdf.set_font("Helvetica", "", 12)
        pdf.multi_cell(0, 6, str(data.get("summary", "")))
        pdf.ln(5)

    # Skills
    if data.get("skills"):
        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 10, "Skills", border="B", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)
        pdf.set_font("Helvetica", "", 12)
        skills_str = ", ".join([str(s) for s in data.get("skills", [])])
        pdf.multi_cell(0, 6, skills_str)
        pdf.ln(5)

    # Experience
    if data.get("experience"):
        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 10, "Experience", border="B", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)
        for exp in data.get("experience", []):
            pdf.set_font("Helvetica", "B", 14)
            pdf.cell(0, 8, str(exp.get("role", "")), new_x="LMARGIN", new_y="NEXT")
            
            pdf.set_font("Helvetica", "I", 12)
            pdf.set_text_color(80, 80, 80)
            comp_dur = f"{exp.get('company', '')} | {exp.get('duration', '')}"
            pdf.cell(0, 6, comp_dur, new_x="LMARGIN", new_y="NEXT")
            pdf.set_text_color(0, 0, 0)
            
            pdf.set_font("Helvetica", "", 12)
            for pt in exp.get("points", []):
                # Using a dash for bullet point
                pdf.multi_cell(0, 6, f"- {pt}")
            pdf.ln(4)

    # Projects
    if data.get("projects"):
        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 10, "Projects", border="B", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)
        for proj in data.get("projects", []):
            pdf.set_font("Helvetica", "B", 14)
            pdf.cell(0, 8, str(proj.get("name", "")), new_x="LMARGIN", new_y="NEXT")
            
            pdf.set_font("Helvetica", "", 12)
            for pt in proj.get("points", []):
                pdf.multi_cell(0, 6, f"- {pt}")
            pdf.ln(4)

    # Education
    if data.get("education"):
        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 10, "Education", border="B", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)
        for edu in data.get("education", []):
            pdf.set_font("Helvetica", "B", 14)
            pdf.cell(0, 8, str(edu.get("degree", "")), new_x="LMARGIN", new_y="NEXT")
            
            pdf.set_font("Helvetica", "", 12)
            inst_yr = f"{edu.get('institution', '')} | {edu.get('year', '')}"
            pdf.cell(0, 6, inst_yr, new_x="LMARGIN", new_y="NEXT")
            pdf.ln(3)

    # Learning
    if data.get("learning"):
        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 10, "Learning & Development", border="B", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)
        pdf.set_font("Helvetica", "", 12)
        for learn in data.get("learning", []):
            pdf.multi_cell(0, 6, f"- {learn}")
        pdf.ln(5)

    # Additional
    if data.get("additional"):
        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 10, "Additional Information", border="B", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)
        pdf.set_font("Helvetica", "", 12)
        for add in data.get("additional", []):
            pdf.multi_cell(0, 6, f"- {add}")
        pdf.ln(5)

    # Return as bytes
    return bytes(pdf.output())
