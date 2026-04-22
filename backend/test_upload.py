import requests
from fpdf import FPDF

# Create a valid PDF with text
pdf = FPDF()
pdf.add_page()
pdf.set_font("Helvetica", size=12)
pdf.cell(200, 10, txt="John Doe Resume\nSkills: Python, Next.js", new_x="LMARGIN", new_y="NEXT")
pdf.output("dummy_real.pdf")

try:
    res = requests.post(
        'http://localhost:8000/api/optimize',
        files={'file': ('dummy_real.pdf', open('dummy_real.pdf', 'rb'), 'application/pdf')},
        data={'job_description': 'Software Engineer', 'country': 'India', 'mode': 'FRESHER'}
    )
    print(res.status_code)
    print(res.text)
except Exception as e:
    print(f"Connection error: {e}")
