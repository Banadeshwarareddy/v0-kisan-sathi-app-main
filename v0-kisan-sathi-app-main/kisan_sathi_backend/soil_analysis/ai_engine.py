"""
SoilSense - AI Analysis Engine
Rule-based + ML model integration for soil analysis
"""
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)


class SoilAnalysisEngine:
    """
    AI Engine for soil analysis and recommendations
    Phase 1: Rule-based logic
    Phase 2: ML model integration (TensorFlow + LightGBM)
    """
    
    def __init__(self):
        self.model_version = "1.0-rule-based"
    
    def analyze_soil(self, soil_data):
        """
        Main analysis function
        Returns: dict with all predictions and recommendations
        """
        try:
            # Extract parameters
            ph = float(soil_data.get('ph', 7.0))
            nitrogen = float(soil_data.get('nitrogen', 0))
            phosphorus = float(soil_data.get('phosphorus', 0))
            potassium = float(soil_data.get('potassium', 0))
            organic_carbon = float(soil_data.get('organic_carbon', 0))
            moisture = float(soil_data.get('moisture', 0))
            texture = soil_data.get('texture', 'loamy')
            season = soil_data.get('season', 'kharif')
            
            # Analyze soil type
            soil_type = self._determine_soil_type(ph, organic_carbon, texture)
            
            # Analyze fertility
            fertility_level, fertility_score = self._calculate_fertility(
                nitrogen, phosphorus, potassium, organic_carbon
            )
            
            # Analyze nutrients
            n_status = self._analyze_nutrient(nitrogen, 'nitrogen')
            p_status = self._analyze_nutrient(phosphorus, 'phosphorus')
            k_status = self._analyze_nutrient(potassium, 'potassium')
            
            # Generate recommendations
            recommended_crops = self._recommend_crops(soil_type, ph, season)
            organic_fert = self._recommend_organic_fertilizers(n_status, p_status, k_status)
            chemical_fert = self._recommend_chemical_fertilizers(n_status, p_status, k_status)
            irrigation_tips = self._generate_irrigation_tips(moisture, texture)
            soil_health_tips = self._generate_health_tips(ph, organic_carbon, fertility_level)
            
            # Generate explanation
            explanation = self._generate_explanation(
                soil_type, fertility_level, n_status, p_status, k_status
            )
            
            # Calculate confidence (rule-based = 75-85%)
            confidence = self._calculate_confidence(soil_data)
            
            return {
                'soil_type': soil_type,
                'fertility_level': fertility_level,
                'fertility_score': fertility_score,
                'nitrogen_status': n_status,
                'phosphorus_status': p_status,
                'potassium_status': k_status,
                'recommended_crops': recommended_crops,
                'organic_fertilizers': organic_fert,
                'chemical_fertilizers': chemical_fert,
                'irrigation_tips': irrigation_tips,
                'soil_health_tips': soil_health_tips,
                'confidence_score': confidence,
                'explanation_text': explanation,
                'model_version': self.model_version
            }
        
        except Exception as e:
            logger.error(f"Error in soil analysis: {str(e)}")
            raise
    
    def _determine_soil_type(self, ph, organic_carbon, texture):
        """Determine soil type based on parameters"""
        if ph < 6.5 and organic_carbon > 1.5:
            return 'black'
        elif ph < 7.0 and 'sandy' in texture:
            return 'red'
        elif 'clay' in texture and ph > 7.0:
            return 'black'
        elif 'loamy' in texture:
            return 'alluvial'
        elif ph < 6.0:
            return 'laterite'
        else:
            return 'alluvial'
    
    def _calculate_fertility(self, n, p, k, oc):
        """Calculate fertility level and score"""
        # Weighted scoring
        n_score = min((n / 280) * 100, 100)  # 280 kg/ha is optimal
        p_score = min((p / 25) * 100, 100)   # 25 kg/ha is optimal
        k_score = min((k / 280) * 100, 100)  # 280 kg/ha is optimal
        oc_score = min((oc / 1.5) * 100, 100)  # 1.5% is optimal
        
        # Weighted average
        total_score = (n_score * 0.3 + p_score * 0.3 + k_score * 0.3 + oc_score * 0.1)
        
        if total_score >= 70:
            level = 'high'
        elif total_score >= 40:
            level = 'medium'
        else:
            level = 'low'
        
        return level, round(total_score, 2)
    
    def _analyze_nutrient(self, value, nutrient_type):
        """Analyze individual nutrient status"""
        thresholds = {
            'nitrogen': {'low': 200, 'high': 350},
            'phosphorus': {'low': 15, 'high': 35},
            'potassium': {'low': 200, 'high': 350}
        }
        
        thresh = thresholds.get(nutrient_type, {'low': 0, 'high': 1000})
        
        if value < thresh['low']:
            return 'low'
        elif value > thresh['high']:
            return 'high'
        else:
            return 'adequate'
    
    def _recommend_crops(self, soil_type, ph, season):
        """Recommend suitable crops"""
        crop_db = {
            'black': {
                'kharif': ['Cotton', 'Soybean', 'Sorghum', 'Sunflower'],
                'rabi': ['Wheat', 'Chickpea', 'Safflower'],
                'zaid': ['Watermelon', 'Cucumber'],
            },
            'red': {
                'kharif': ['Groundnut', 'Millets', 'Pulses', 'Maize'],
                'rabi': ['Ragi', 'Horsegram', 'Sunflower'],
                'zaid': ['Vegetables', 'Fodder crops'],
            },
            'alluvial': {
                'kharif': ['Rice', 'Sugarcane', 'Maize', 'Cotton'],
                'rabi': ['Wheat', 'Barley', 'Mustard', 'Potato'],
                'zaid': ['Vegetables', 'Melons'],
            },
            'laterite': {
                'kharif': ['Cashew', 'Coconut', 'Arecanut', 'Tapioca'],
                'rabi': ['Vegetables', 'Pulses'],
                'zaid': ['Vegetables'],
            }
        }
        
        crops = crop_db.get(soil_type, {}).get(season, ['Consult agronomist'])
        
        # pH adjustments
        if ph < 5.5:
            crops = [c for c in crops if c not in ['Wheat', 'Barley']]
            crops.append('(Add lime to increase pH)')
        elif ph > 8.5:
            crops.append('(Add gypsum to decrease pH)')
        
        return crops[:5]  # Top 5 recommendations
    
    def _recommend_organic_fertilizers(self, n_status, p_status, k_status):
        """Recommend organic fertilizers"""
        recommendations = {}
        
        if n_status == 'low':
            recommendations['nitrogen'] = {
                'sources': ['Farmyard Manure (FYM)', 'Vermicompost', 'Green Manure'],
                'quantity': '10-15 tons/hectare',
                'application': 'Apply 2-3 weeks before sowing'
            }
        
        if p_status == 'low':
            recommendations['phosphorus'] = {
                'sources': ['Rock Phosphate', 'Bone Meal', 'Compost'],
                'quantity': '200-300 kg/hectare',
                'application': 'Mix with soil during land preparation'
            }
        
        if k_status == 'low':
            recommendations['potassium'] = {
                'sources': ['Wood Ash', 'Banana Peel Compost', 'Seaweed'],
                'quantity': '100-150 kg/hectare',
                'application': 'Apply as top dressing'
            }
        
        if not recommendations:
            recommendations['maintenance'] = {
                'sources': ['Vermicompost', 'FYM'],
                'quantity': '5-7 tons/hectare',
                'application': 'Apply annually for soil health'
            }
        
        return recommendations
    
    def _recommend_chemical_fertilizers(self, n_status, p_status, k_status):
        """Recommend chemical fertilizers"""
        recommendations = {}
        
        if n_status == 'low':
            recommendations['nitrogen'] = {
                'fertilizer': 'Urea (46% N)',
                'quantity': '100-150 kg/hectare',
                'application': 'Split application: 50% basal, 25% at 30 days, 25% at 60 days'
            }
        
        if p_status == 'low':
            recommendations['phosphorus'] = {
                'fertilizer': 'Single Super Phosphate (SSP)',
                'quantity': '150-200 kg/hectare',
                'application': 'Full dose as basal application'
            }
        
        if k_status == 'low':
            recommendations['potassium'] = {
                'fertilizer': 'Muriate of Potash (MOP)',
                'quantity': '50-75 kg/hectare',
                'application': 'Apply as basal or split with nitrogen'
            }
        
        if not recommendations:
            recommendations['balanced'] = {
                'fertilizer': 'NPK 19:19:19',
                'quantity': '50 kg/hectare',
                'application': 'Maintenance dose for balanced nutrition'
            }
        
        return recommendations
    
    def _generate_irrigation_tips(self, moisture, texture):
        """Generate irrigation recommendations"""
        tips = []
        
        if moisture < 20:
            tips.append("⚠️ Soil moisture is low. Immediate irrigation required.")
        elif moisture > 80:
            tips.append("⚠️ Soil is waterlogged. Improve drainage.")
        else:
            tips.append("✓ Soil moisture is adequate.")
        
        if 'sandy' in texture:
            tips.append("🌊 Sandy soil: Irrigate frequently with less water (light & frequent).")
        elif 'clay' in texture:
            tips.append("🌊 Clay soil: Irrigate less frequently with more water (heavy & infrequent).")
        else:
            tips.append("🌊 Loamy soil: Moderate irrigation schedule.")
        
        tips.append("💡 Use drip irrigation for water efficiency.")
        tips.append("💡 Mulching helps retain soil moisture.")
        
        return "\n".join(tips)
    
    def _generate_health_tips(self, ph, organic_carbon, fertility_level):
        """Generate soil health improvement tips"""
        tips = []
        
        if ph < 5.5:
            tips.append("🔬 Soil is acidic. Apply lime (2-3 tons/hectare) to increase pH.")
        elif ph > 8.5:
            tips.append("🔬 Soil is alkaline. Apply gypsum (1-2 tons/hectare) to decrease pH.")
        else:
            tips.append("✓ Soil pH is in optimal range.")
        
        if organic_carbon < 0.5:
            tips.append("🌱 Organic carbon is very low. Add compost/FYM regularly.")
        elif organic_carbon < 1.0:
            tips.append("🌱 Increase organic matter through green manuring and crop residue incorporation.")
        else:
            tips.append("✓ Good organic carbon content. Maintain with regular organic inputs.")
        
        if fertility_level == 'low':
            tips.append("⚠️ Soil fertility is low. Follow fertilizer recommendations strictly.")
        
        tips.append("💡 Practice crop rotation to maintain soil health.")
        tips.append("💡 Avoid excessive tillage to preserve soil structure.")
        tips.append("💡 Use cover crops during off-season.")
        
        return "\n".join(tips)
    
    def _generate_explanation(self, soil_type, fertility_level, n_status, p_status, k_status):
        """Generate explanation for recommendations"""
        explanation = f"Your soil is classified as {soil_type.upper()} soil with {fertility_level.upper()} fertility. "
        
        deficiencies = []
        if n_status == 'low':
            deficiencies.append('Nitrogen')
        if p_status == 'low':
            deficiencies.append('Phosphorus')
        if k_status == 'low':
            deficiencies.append('Potassium')
        
        if deficiencies:
            explanation += f"Deficient nutrients: {', '.join(deficiencies)}. "
            explanation += "Follow the fertilizer recommendations to improve soil fertility. "
        else:
            explanation += "All major nutrients are in adequate range. "
        
        explanation += "The recommended crops are suitable for your soil type and will give good yields with proper management."
        
        return explanation
    
    def _calculate_confidence(self, soil_data):
        """Calculate confidence score for rule-based analysis"""
        # Rule-based confidence: 75-85%
        base_confidence = 75.0
        
        # Increase confidence if more data is provided
        if soil_data.get('soil_image'):
            base_confidence += 5
        if soil_data.get('texture'):
            base_confidence += 3
        if soil_data.get('season'):
            base_confidence += 2
        
        return min(base_confidence, 85.0)


# Create global instance for easy import
soil_engine = SoilAnalysisEngine()
