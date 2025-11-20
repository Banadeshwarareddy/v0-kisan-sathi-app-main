# PDF Report Generator for Soil Analysis

import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from django.core.files.base import ContentFile

class SoilAnalysisPDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom styles for the PDF report"""
        
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#2E7D32')
        )
        
        self.section_style = ParagraphStyle(
            'SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceBefore=20,
            spaceAfter=10,
            textColor=colors.HexColor('#1B5E20')
        )
        
        self.body_style = ParagraphStyle(
            'CustomBody',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            alignment=TA_LEFT
        )
    
    def generate_report(self, analysis_data, farmer_data, soil_image_path=None):
        """
        Generate comprehensive PDF report
        
        Args:
            analysis_data: Soil analysis results
            farmer_data: Farmer information
            soil_image_path: Path to soil image (optional)
            
        Returns:
            ContentFile: PDF file content
        """
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        # Build the PDF content
        story = []
        
        # Header
        story.extend(self._create_header())
        
        # Farmer information
        story.extend(self._create_farmer_info(farmer_data))
        
        # Analysis results
        story.extend(self._create_analysis_results(analysis_data))
        
        # Recommendations
        story.extend(self._create_recommendations(analysis_data))
        
        # Footer
        story.extend(self._create_footer())
        
        # Build PDF
        doc.build(story)
        
        # Get PDF content
        pdf_content = buffer.getvalue()
        buffer.close()
        
        # Create filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'soil_analysis_{farmer_data.get("id", "unknown")}_{timestamp}.pdf'
        
        return ContentFile(pdf_content, name=filename)
    
    def _create_header(self):
        """Create PDF header"""
        
        elements = []
        
        title = Paragraph('KISAN SATHI - AI Soil Analyzer Report', self.title_style)
        elements.append(title)
        elements.append(Spacer(1, 20))
        
        report_data = [
            ['Report Generated:', datetime.now().strftime('%d-%m-%Y %H:%M:%S')],
            ['Report Type:', 'Comprehensive Soil Analysis']
        ]
        
        report_table = Table(report_data, colWidths=[2*inch, 3*inch])
        report_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F1F8E9')),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey)
        ]))
        
        elements.append(report_table)
        elements.append(Spacer(1, 30))
        
        return elements
    
    def _create_farmer_info(self, farmer_data):
        """Create farmer information section"""
        
        elements = []
        
        header = Paragraph('FARMER INFORMATION', self.section_style)
        elements.append(header)
        
        farmer_info = [
            ['Farmer Name:', farmer_data.get('name', 'N/A')],
            ['Village:', farmer_data.get('village', 'N/A')],
            ['District:', farmer_data.get('district', 'N/A')],
            ['Phone:', farmer_data.get('phone', 'N/A')]
        ]
        
        farmer_table = Table(farmer_info, colWidths=[2*inch, 3*inch])
        farmer_table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 1, colors.grey)
        ]))
        
        elements.append(farmer_table)
        elements.append(Spacer(1, 20))
        
        return elements
    
    def _create_analysis_results(self, analysis_data):
        """Create soil analysis results section"""
        
        elements = []
        
        header = Paragraph('SOIL ANALYSIS RESULTS', self.section_style)
        elements.append(header)
        
        results_data = [
            ['Parameter', 'Result'],
            ['Soil Type', analysis_data.get('soil_type', 'N/A')],
            ['Fertility Level', analysis_data.get('fertility_level', 'N/A')],
            ['Moisture Level', analysis_data.get('moisture_level', 'N/A')],
            ['Confidence Score', f"{analysis_data.get('confidence_score', 0)}%"]
        ]
        
        results_table = Table(results_data, colWidths=[2*inch, 3*inch])
        results_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4CAF50')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(results_table)
        elements.append(Spacer(1, 20))
        
        return elements
    
    def _create_recommendations(self, analysis_data):
        """Create recommendations section"""
        
        elements = []
        
        # Crop recommendations
        crop_header = Paragraph('RECOMMENDED CROPS', self.section_style)
        elements.append(crop_header)
        
        crops = analysis_data.get('recommended_crops', [])
        if crops:
            crop_list = "\\n".join([f"• {crop}" for crop in crops])
            crop_para = Paragraph(crop_list, self.body_style)
            elements.append(crop_para)
        
        elements.append(Spacer(1, 15))
        
        # Fertilizer recommendations
        fert_header = Paragraph('FERTILIZER RECOMMENDATIONS', self.section_style)
        elements.append(fert_header)
        
        fertilizers = analysis_data.get('fertilizer_suggestions', [])
        if fertilizers:
            fert_list = "\\n".join([f"• {fert}" for fert in fertilizers])
            fert_para = Paragraph(fert_list, self.body_style)
            elements.append(fert_para)
        
        return elements
    
    def _create_footer(self):
        """Create PDF footer"""
        
        elements = []
        
        elements.append(Spacer(1, 30))
        
        disclaimer_text = (
            "<b>Disclaimer:</b> This analysis is generated using AI technology. "
            "For critical decisions, please consult with local agricultural experts."
        )
        disclaimer = Paragraph(disclaimer_text, self.body_style)
        elements.append(disclaimer)
        
        return elements
