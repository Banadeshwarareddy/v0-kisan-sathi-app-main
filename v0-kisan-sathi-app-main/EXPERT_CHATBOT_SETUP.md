# 🌾 Kisan Sathi Expert AI Chatbot - Complete Setup Guide

## Overview
This is a comprehensive, expert-level AI farming assistant specifically designed for Karnataka farmers. It provides detailed, safe, and actionable agricultural guidance with advanced features including:

- **26 Advanced Intelligence Modules** (A-Z)
- **Differential diagnosis** for crop diseases
- **Cost-benefit analysis** for every recommendation
- **Organic-first approach** with IPM integration
- **Safety protocols** and mental health support
- **Government schemes** integration
- **Post-harvest management** guidance
- **Economic viability** analysis

## 🎯 Key Features

### Core Capabilities
✅ Crop disease/pest diagnosis with differential approach
✅ Precise fertilizer dosages with split application schedules
✅ Irrigation optimization (drip vs flood efficiency)
✅ Weather-based farming guidance
✅ Government schemes (PM-KISAN, Fasal Bima, subsidies)
✅ Market intelligence and mandi prices
✅ Seasonal crop planning
✅ Organic farming methods priority
✅ Soil health assessment
✅ Seed variety recommendations
✅ Post-harvest management
✅ Biological control integration
✅ Economic viability analysis
✅ Mental health and farmer wellbeing support

### Advanced Modules
- **Diagnostic Engine**: Differential diagnosis, severity assessment
- **Precision Agriculture**: Soil-specific, micro-nutrient management
- **Weather Integration**: Rain-based spraying, temperature alerts
- **Pest Lifecycle Awareness**: Target vulnerable stages
- **Water Optimization**: Growth-stage requirements, drip efficiency
- **Nutrient Management**: NPK ratios, split applications
- **Resistance Management**: MoA rotation, tank mix strategies
- **Biocontrol Priority**: Trichogramma, NPV, Trichoderma
- **Economic Calculator**: ROI, cost-benefit for every solution
- **Market Intelligence**: Price trends, demand forecasting
- **Post-Harvest Management**: Storage, grading, timing
- **Safety & First Aid**: Pesticide poisoning protocols
- **Mental Health Awareness**: Farmer distress support
- **Crop Diversification**: Intercropping, rotation strategies
- **And 12 more advanced modules...**

## 📋 Setup Instructions

### Step 1: Install Dependencies (1 minute)

```bash
cd kisan_sathi_backend
pip install openai
```

### Step 2: Add OpenAI API Key (1 minute)

1. Get your API key from: https://platform.openai.com/api-keys
2. Edit `kisan_sathi_backend/.env`:

```env
OPENAI_API_KEY=sk-your-key-here
```

**Note**: This system uses GPT-4 for expert-level responses. Ensure your API key has GPT-4 access.

### Step 3: Update Main URLs (30 seconds)

Edit `kisan_sathi_backend/kisan_sathi/urls.py` and add:

```python
from django.urls import path, include

urlpatterns = [
    # ... existing patterns ...
    path('api/chatbot/', include('chatbot.urls')),
]
```

### Step 4: Run Migrations (1 minute)

```bash
cd kisan_sathi_backend
python manage.py makemigrations chatbot
python manage.py migrate
```

### Step 5: Start Servers (1 minute)

**Terminal 1 - Backend:**
```bash
cd kisan_sathi_backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd v0-kisan-sathi-app
npm run dev
```

### Step 6: Test the Expert System! (2 minutes)

1. Open browser: `http://localhost:3000/chatbot`
2. Login with your credentials
3. Try these expert-level questions:

**Disease Diagnosis:**
```
"My tomato leaves have yellow spots with brown borders, 
starting from lower leaves. Plants are 45 days old. 
Weather has been humid for past week."
```

**Fertilizer Advice:**
```
"I have 2 acres of paddy at tillering stage. 
Red sandy soil. What fertilizer should I apply now?"
```

**Pest Management:**
```
"Pink bollworm in my Bt cotton. Already sprayed 
Emamectin twice but not working. What should I do?"
```

**Economic Analysis:**
```
"Should I invest in drip irrigation for my 5 acre 
tomato farm? What will be the cost and benefit?"
```

## 🎨 Response Structure

Every response follows this comprehensive format:

```
🔍 Problem Identified:
[Differential diagnosis with reasoning]

👨‍🌾 What's Happening:
[Simple explanation with "why" reasoning]

💡 Solution:
Primary (Organic): [Natural remedy + IPM]
Alternative (Chemical): [Product + MoA + dose]
Biological Control: [Biocontrol agents]

⚖️ How to Apply:
- Quantity: [Precise measurement]
- Timing: [Best time + crop stage]
- Method: [Application method]
- Frequency: [How often]
- Water: [Volume needed]
- Equipment: [Sprayer type]

💰 Cost-Benefit Analysis:
- Investment: ₹[X] per acre
- Expected yield gain: [Y] kg
- Market value: ₹[A]
- Net benefit: ₹[B]
- Compare: Organic vs Chemical costs

🌱 Prevent Future Issues:
[5 actionable prevention tips]

🏛️ Government Support:
[Schemes + helplines + application process]

⚠️ SAFETY (if chemicals):
[Comprehensive safety warnings]

📱 Next Steps:
1. [Immediate action]
2. [Follow-up action]
3. [Long-term practice]
4. [Monitoring schedule]

📊 Post-Harvest Guidance:
[Storage, grading, market timing]

ಕನ್ನಡದಲ್ಲಿ: [Supportive closing]
```

## 🔒 Safety Protocols

The system follows 14 critical safety protocols:

1. ✅ Verifies all chemical dosages
2. ✅ ALWAYS suggests organic/IPM first
3. ✅ NEVER recommends banned pesticides
4. ✅ Includes comprehensive safety warnings
5. ✅ Considers crop type, growth stage, weather
6. ✅ Mentions PHI (Pre-Harvest Interval)
7. ✅ Warns about incompatible chemical mixing
8. ✅ Checks for pesticide resistance
9. ✅ Recommends IPM approaches
10. ✅ Verifies CIB&RC registration
11. ✅ Considers pollinator safety
12. ✅ Protects beneficial insects
13. ✅ Prevents groundwater contamination
14. ✅ Proper disposal methods

## 📊 API Endpoints

### Conversation Management
- `POST /api/chatbot/conversations/` - Create conversation
- `GET /api/chatbot/conversations/` - List conversations
- `GET /api/chatbot/conversations/{id}/` - Get details
- `POST /api/chatbot/conversations/{id}/send_message/` - Send message
- `DELETE /api/chatbot/conversations/{id}/archive/` - Archive
- `GET /api/chatbot/conversations/active_conversations/` - Get active chats

### Quick Chat
- `POST /api/chatbot/quick-chat/` - One-off expert consultation

### Statistics
- `GET /api/chatbot/statistics/` - User's chat statistics

### Feedback
- `POST /api/chatbot/feedback/` - Submit feedback
- `GET /api/chatbot/feedback/` - View feedback history

## 💰 Cost Considerations

### Model: GPT-4 (Expert Level)
- Input: $0.03 per 1K tokens
- Output: $0.06 per 1K tokens
- Average conversation: 3,000-4,000 tokens
- **Cost per conversation: ~$0.15-0.25**

### Cost Optimization Tips:
1. Use conversation history (already implemented)
2. Cache common questions (future enhancement)
3. Use quick-chat for simple queries
4. Monitor token usage in admin panel
5. Consider GPT-4o-mini for cost savings ($0.15 vs $0.60 per 1M tokens)

### To Switch to GPT-4o-mini (More Affordable):
Edit `chatbot/views.py`, change:
```python
model="gpt-4o"  # Current
```
to:
```python
model="gpt-4o-mini"  # More affordable, still excellent
```

## 🌾 Karnataka-Specific Knowledge

### Crops Covered:
- **Paddy**: BPT-5204, Jaya, IR-64 varieties
- **Cotton**: Bt cotton, RCH-2, Bunny Bt
- **Tomato**: Arka Vikas, Abhinav, Naveen
- **Sugarcane**: Co-86032, Co-94012
- **Ragi**: GPU-28, MR-6, KMR-204
- And 20+ more crops...

### Government Schemes:
- **PM-KISAN**: ₹6,000/year (155261)
- **PM Fasal Bima**: Crop insurance (1800-180-1551)
- **Drip Subsidy**: 60-75% subsidy (080-22259143)
- **Soil Health Card**: Free testing (080-22212000)
- **Karnataka Farmer Helpline**: 080-22217800 (24x7)

### Regional Coverage:
- North Karnataka (dry zone)
- South Karnataka (wet zone)
- Coastal Karnataka (humid)
- Hill regions (cool climate)

## 🎓 Advanced Features

### 1. Differential Diagnosis
System asks clarifying questions before diagnosis:
- Crop type and variety
- Affected plant parts
- Symptom progression
- Weather conditions
- Previous treatments

### 2. Economic Calculator
Every recommendation includes:
- Investment required
- Expected yield gain
- Market value
- Net benefit
- ROI percentage
- Organic vs Chemical cost comparison

### 3. Resistance Management
- MoA (Mode of Action) rotation
- Tank mix strategies
- Refuge strategy for Bt crops
- Early resistance detection

### 4. Mental Health Support
- Recognizes farmer distress signs
- Provides emotional support
- Karnataka Farmer Helpline: 080-22217800
- Debt counseling resources

### 5. Post-Harvest Management
- Optimal harvest timing
- Grading for 20-30% price premium
- Storage conditions
- Market timing strategies
- Value addition opportunities

## 🚨 Emergency Protocols

### Pesticide Poisoning:
```
"IMMEDIATELY call 108 ambulance!
While waiting:
1. Remove contaminated clothes
2. Wash with soap and water
3. Induce vomiting if conscious
4. Keep person in fresh air"
```

### Farmer Distress:
```
"Karnataka Farmer Helpline: 080-22217800 (24x7)
Kisan Call Centre: 1800-180-1551
You're not alone. Many farmers face this.
Please talk to family/friends too."
```

### Crop Failure:
```
"Apply for PM Fasal Bima Yojana claim
Contact insurance company within 72 hours
Keep photos and panchanama
Helpline: 1800-180-1551"
```

## 📱 Admin Panel

Access at: `http://localhost:8000/admin/chatbot/`

### Monitor:
- Total conversations and messages
- Token usage per user
- Response times
- User feedback ratings
- Popular questions
- Cost analytics

## 🔧 Troubleshooting

### "OpenAI API Error"
- Check API key in `.env`
- Verify GPT-4 access on your account
- Check billing/credits on OpenAI dashboard

### "Slow responses"
- Normal for GPT-4 (2-5 seconds)
- Check internet connection
- Consider GPT-4o-mini for faster responses

### "Kannada text not displaying"
- Ensure UTF-8 encoding
- Check browser font support
- Use Unicode-compatible fonts

### "High costs"
- Switch to GPT-4o-mini
- Implement response caching
- Use quick-chat for simple queries
- Monitor token usage

## 🎯 Testing Scenarios

### Test 1: Disease Diagnosis
```
User: "My tomato leaves turning yellow from bottom"
Expected: Asks clarifying questions about spots, 
weather, irrigation before diagnosing
```

### Test 2: Organic Priority
```
User: "Aphids on my chilli plants"
Expected: Recommends neem oil first, then 
chemical alternatives if severe
```

### Test 3: Cost-Benefit
```
User: "Should I use drip irrigation?"
Expected: Provides investment cost, water savings %, 
yield gain, ROI calculation
```

### Test 4: Safety Warnings
```
User: "How to spray pesticide?"
Expected: Comprehensive PPE, timing, PHI, 
pollinator safety warnings
```

### Test 5: Mental Health
```
User: "I'm very stressed about crop failure"
Expected: Empathetic response, helpline numbers,
emotional support
```

## 🚀 Future Enhancements

### Planned Features:
- [ ] Image analysis for crop disease detection (GPT-4 Vision)
- [ ] Voice input/output (Kannada TTS)
- [ ] RAG with local agriculture database
- [ ] Real-time weather API integration
- [ ] Live mandi price integration
- [ ] SMS integration for feature phones
- [ ] Multi-language support (Hindi, Telugu, Tamil)
- [ ] Crop calendar reminders
- [ ] Community forum integration
- [ ] Fine-tuned model on Karnataka data

## 📞 Support Resources

### Helplines:
- **Kisan Call Centre**: 1800-180-1551 (24x7, free)
- **Karnataka Farmer Helpline**: 080-22217800 (24x7)
- **PM-KISAN**: 155261 / 011-24300606
- **Crop Insurance**: 1800-180-1551
- **Raitha Samparka Kendra**: 080-22212000

### Websites:
- Karnataka Agriculture: https://raitamitra.karnataka.gov.in/
- Soil Health Card: https://soilhealth.dac.gov.in/
- PM-KISAN: https://pmkisan.gov.in/
- e-NAM: https://enam.gov.in/

## ⚠️ Important Disclaimer

This AI assistant provides general guidance only. Always:
- Verify critical decisions with local agriculture officers
- Follow product labels for chemical applications
- Consider your specific soil, climate, and crop conditions
- Consult KVK experts for severe pest/disease outbreaks
- Get soil tested before major fertilizer applications
- Check current market prices before selling

## 📄 License

Built with ❤️ for Karnataka Farmers

---

**ಯಾವ ಸಹಾಯ ಬೇಕಾದರೂ ಕೇಳಿ, ನಾನು ಇಲ್ಲಿದ್ದೇನೆ ರೈತರಿಗಾಗಿ!** 🌾

(Ask for any help you need, I am here for farmers!)
