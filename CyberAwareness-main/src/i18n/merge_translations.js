const fs = require('fs');
const path = require('path');

const TRANSLATIONS = {
  ta: {
    complaint: {
      coverTitle: "அதிகாரப்பூர்வ சைபர் கிரைம் புகார் தொகுப்பு",
      packetNumberLabel: "தொகுப்பு எண்:",
      generatedAtLabel: "உருவாக்கப்பட்ட நேரம்:",
      packetContentsLabel: "தொகுப்பு உள்ளடக்கங்கள்",
      mainComplaintLabel: "முதன்மை புகார்",
      signatureBlockLabel: "கையெழுத்து பிரிவு",
      subjectLabel: "பொருள்:",
      declarationHeading: "7. பிரகடனம்",
      narrativeHeading: "1. சம்பவ விவரிப்பு",
      timelineHeading: "2. சம்பவ காலவரிசை",
      lossHeading: "3. நிதி இழப்பு விவரங்கள்",
      evidenceHeading: "4. சான்றுகள் மற்றும் அடையாளங்காட்டிகள் சுருக்கம்",
      accusedHeading: "5. குற்றம் சாட்டப்பட்டவர் தகவல்",
      legalHeading: "6. பொருந்தக்கூடிய சட்டப் பிரிவுகள்",
      signOff: "தங்கள் உண்மையுள்ள,",
      subjectTemplate: "சைபர் குற்ற சம்பவம் தொடர்பான முறைப்படியான புகார்: {{category}}",
      salutation: "நிலையப் பொறுப்பு அதிகாரி / சைபர் கிரைம் பிரிவு அவர்களுக்கு,",
      bodyIntroTemplate: "விஜய் ஆகிய நான், என் மீது நடந்துள்ள சைபர் குற்ற சம்பவத்தை புகாரளிக்க இந்த முறைப்படியான புகாரை சமர்ப்பிக்கிறேன்.",
      declarationTemplate: "இந்த புகாரில் வழங்கப்பட்டுள்ள தகவல்கள் எனது அறிவுக்கு எட்டிய வரை உண்மையானவை மற்றும் துல்லியமானவை என்று நான் இத்துடன் பிரகடனம் செய்கிறேன். தவறான தகவல்களை சமர்ப்பிப்பது சட்டப்படி தண்டனைக்குரிய குற்றமாகும்.\n\nதேதி: {{dateStr}}\nஇடம்: _________________",
      preparedBy: "டிரஸ்ட்லேயர்லேப்ஸ் சென்டினல் லீகல் ஏஐ மூலம் பயனரால் வழங்கப்பட்ட உண்மைகளைக் கொண்டு தயாரிக்கப்பட்டது.",
      signatureLabel: "[கையெழுத்து]"
    },
    cyberJustice: {
      greeting: "என்ன நடந்தது என்பதை எளிய சொற்களில் கூறுங்கள். சைபர் குற்றத்தை வகைப்படுத்தவும், சான்றுகளை கண்டறியவும், காலவரிசையை உருவாக்கவும், மற்றும் புகாரின் வரைவை தயார் செய்யவும் நான் உதவுகிறேன்.",
      greetingShort: "என்ன நடந்தது என்பதை எளிய சொற்களில் கூறுங்கள்.",
      captured: "நான் அந்த விவரங்களை சேகரித்துள்ளேன். முன்மொழியப்பட்ட புதுப்பிப்புகளை மதிப்பாய்வு செய்து, தயாரானதும் உறுதிப்படுத்தவும்.",
      analysisResult: "இதை நான் {{category}} என்று {{confidence}}% நம்பிக்கையுடன் வகைப்படுத்தியுள்ளேன்.",
      phaseLabel: "கட்டம் 2 வழக்கு உருவாக்குபவர்",
      title: "சைபர் ஜஸ்டிஸ் ஏஐ",
      button: {
        reset: "மீட்டமை",
        back: "பின்னால்",
        analyze: "சம்பவத்தை பகுப்பாய்வு செய்",
        analyzing: "பகுப்பாய்வு செய்யப்படுகிறது...",
        next: "அடுத்த படி"
      },
      steps: {
        NARRATIVE: "விவரிப்பு",
        ANALYSIS: "பகுப்பாய்வு",
        EVIDENCE: "சான்று",
        TIMELINE: "காலவரிசை",
        REVIEW: "மதிப்பாய்வு"
      },
      questions: {
        "upi-utr": "பணப்பரிமாற்றத்திற்கான UTR, RRN அல்லது பரிவர்த்தனை குறிப்பு எண் என்ன?",
        "upi-amount": "இந்த சம்பவத்தில் எவ்வளவு பணம் இழக்கப்பட்டது?",
        "phishing-url": "நீங்கள் பெற்ற அல்லது திறந்த சந்தேகத்திற்குரிய இணைப்பு அல்லது இணையதளம் என்ன?",
        "phishing-email": "அனுப்பியவரின் மின்னஞ்சல் முகவரி உங்களிடம் உள்ளதா?",
        "sextortion-platform": "இந்த மிரட்டல்கள் அல்லது ஆள்மாறாட்டம் எந்த தளத்தில் நடந்தது?",
        "suspect-phone": "சந்தேக நபர் ஏதேனும் தொலைபேசி எண்களைப் பயன்படுத்தினாரா?",
        "bank-name": "பரிவர்த்தனைக்கு எந்த வங்கி கணக்கு அல்லது செயலி பயன்படுத்தப்பட்டது?",
        "evidence-refs": "திரைக்காட்சிகள், அரட்டைகள், மின்னஞ்சல்கள் போன்ற உங்களிடம் உள்ள சான்றுகள் என்ன?",
        "general-narrative": "சம்பவித்ததை உங்கள் சொந்த வார்த்தைகளில் விவரிக்கவும்."
      },
      ui: {
        conversation: {
          title: "உரையாடல் உட்கிரகிப்பு",
          nextBestQuestion: "அடுத்த சிறந்த கேள்வி",
          proposedUpdates: "முன்மொழியப்பட்ட வழக்கு புதுப்பிப்புகள் மதிப்பாய்வுக்கு தயாராக உள்ளன.",
          apply: "பயன்படுத்து",
          reject: "நிராகரி",
          naturalUpdateLabel: "இயற்கையான சம்பவ புதுப்பிப்பு",
          placeholder: "விவரங்களை சேர்க்கவும்...",
          send: "அனுப்பு"
        },
        header: {
          badge: "சைபர் ஜஸ்டிஸ் ஏஐ கட்டம் 2",
          title: "சட்ட ரீதியான சைபர் கிரைம் வழக்கு கோப்பை உருவாக்குங்கள்.",
          subtitle: "விவரிப்பு பகுப்பாய்வு, சான்று பெட்டகம், காலவரிசை உருவாக்குபவர் மற்றும் PDF ஏற்றுமதி ஆகியவை ஒரே வழக்கு கோப்பை பகிர்கின்றன."
        },
        emergency: {
          title: "அவசர நிதி மோசடியா?",
          desc: "உடனடியாக 1930 ஐ அழைத்து, நிதியை முடக்க உங்கள் வங்கியை தொடர்பு கொள்ளவும்."
        },
        legalOutput: {
          title: "சட்ட இயந்திர வெளியீடு",
          confidence: "நம்பிக்கை",
          noAnalysis: "பகுப்பாய்விற்கு பிறகு வகைப்பாடு மற்றும் சட்டங்கள் இங்கு தோன்றும்."
        },
        timeline: {
          title: "காலவரிசை உருவாக்குபவர்",
          description: "உரையாடல்கள் மற்றும் சான்றுகளிலிருந்து நிகழ்வுகளை உருவாக்கி மாற்றங்களைச் செய்யுங்கள்.",
          action: {
            fromConversation: "உரையாடலில் இருந்து",
            fromEntities: "அடையாளங்களில் இருந்து",
            fromEvidence: "சான்றுகளில் இருந்து"
          },
          field: {
            eventTitle: "நிகழ்வு தலைப்பு",
            eventTitlePlaceholder: "பணம் மாற்றப்பட்டது...",
            timestamp: "நேர முத்திரை",
            timestampPlaceholder: "2026-05-29T10:30:00+05:30",
            description: "விளக்கம்",
            descriptionPlaceholder: "விவரங்கள்..."
          },
          option: { noLinkedEvidence: "இணைக்கப்பட்ட சான்று இல்லை" },
          button: { addEvent: "நிகழ்வைச் சேர்" },
          confirmed: "உறுதிப்படுத்தப்பட்டது",
          confirm: "உறுதிசெய்",
          noTimelineEvents: "காலவரிசை நிகழ்வுகள் இல்லை."
        },
        evidence: {
          title: "சான்று பெட்டகம்",
          description: "சான்றுகளைச் சேர்த்து உரையோ அல்லது உரையாடல்களையோ ஒட்டவும்.",
          label: { type: "சான்று வகை" },
          name: { label: "பெயர்", placeholder: "வங்கி அறிக்கை..." },
          timestamp: { label: "நேர முத்திரை", placeholder: "2026-05-29T10:30:00+05:30" },
          description: { label: "விளக்கம்", placeholder: "விவரங்கள்..." },
          extractableLabel: "பிரித்தெடுக்கக்கூடிய உரை",
          extractable: { placeholder: "ஒட்டவும்..." },
          addButton: "சான்றைச் சேர்",
          stat: { vaultItems: "பெட்டக பொருட்கள்", verified: "சரிபார்க்கப்பட்டது", extracted: "பிரித்தெடுக்கப்பட்ட அடையாளங்கள்" },
          noDescription: "விளக்கம் வழங்கப்படவில்லை.",
          verified: "சரிபார்க்கப்பட்டது",
          markVerified: "சரிபார்க்கப்பட்டதாகக் குறிக்கவும்",
          noEvidence: "இன்னும் சான்றுகள் இல்லை.",
          types: { SCREENSHOT: "திரைக்காட்சி", PDF: "PDF", AUDIO: "ஒலிப்பதிவு", VIDEO: "காணொளி", CHAT: "அரட்டை", EMAIL: "மின்னஞ்சல்", BANK_STATEMENT: "வங்கி அறிக்கை" }
        },
        analysis: {
          noNarrative: "முதலில் சம்பவ விவரிப்பைச் சேர்க்கவும்.",
          title: "வகைப்பாடு மற்றும் சட்டங்கள்",
          description: "பகுப்பாய்வை மதிப்பாய்வு செய்யவும்.",
          detectedCategory: "கண்டறியப்பட்ட வகை",
          confidence: "நம்பிக்கை",
          manualOverride: "கைமுறை மேலெழுதலாக்கம்"
        },
        review: {
          title: "மதிப்பாய்வு மையம்",
          description: "வழக்கு கோப்பை சரிபார்க்கவும்.",
          noNarrative: "சம்பவ விவரிப்பு வழங்கப்படவில்லை.",
          classification: "வகைப்பாடு",
          notAnalyzed: "பகுப்பாய்வு செய்யப்படவில்லை",
          confidence: "நம்பிக்கை",
          pending: "நிலுவையில் உள்ளது",
          mappedSections: "மேப் செய்யப்பட்ட பிரிவுகள்",
          evidenceInventory: "சான்று விவரப்பட்டியல்",
          noEvidenceItems: "சான்றுகள் இல்லை.",
          noDescription: "விளக்கம் வழங்கப்படவில்லை.",
          verified: "சரிபார்க்கப்பட்டது",
          pendingReview: "மதிப்பாய்வு நிலுவையில் உள்ளது",
          financialLoss: "நிதி இழப்பு",
          fields: { amount: "தொகை", currency: "நாணயம்", bank: "வங்கி", transactionId: "பரிவர்த்தனை ஐடி", paymentMethod: "கட்டண முறை", recoveryStatus: "மீட்பு நிலை" },
          victim: "பாதிக்கப்பட்டவர்",
          accused: "குற்றம் சாட்டப்பட்டவர்",
          timeline: "காலவரிசை",
          noTimelineEvents: "காலவரிசை நிகழ்வுகள் இல்லை.",
          extractedEntities: "பிரித்தெடுக்கப்பட்ட அடையாளங்கள்",
          officialPacketTitle: "அதிகாரப்பூர்வ தொகுப்பு உருவாக்கம்",
          officialPacketDesc: "புகார் தொகுப்பை உருவாக்குகிறது.",
          generatePacket: { generating: "உருவாக்கப்படுகிறது...", button: "தொகுப்பை உருவாக்கு" },
          downloadPdf: "PDF பதிவிறக்கவும்",
          exportSummary: "சுருக்கத்தை ஏற்றுமதி செய்",
          summary: { packetNumber: "தொகுப்பு எண்", annexures: "இணைப்புகள்", evidenceItems: "சான்றுகள்", timelineEvents: "நிகழ்வுகள்", mappedLaws: "சட்டங்கள்", financialLossIncluded: "சேர்க்கப்பட்டுள்ளது", financialLossNotRecorded: "பதிவு செய்யப்படவில்லை", pdfReady: "தயார்", pdfPending: "நிலுவையில் உள்ளது", generated: "உருவாக்கப்பட்டது" },
          pdfErrorPrefix: "PDF பிழை:",
          annexurePreview: "இணைப்பு முன்னோட்டம்",
          packetPreview: "தொகுப்பு முன்னோட்டம்"
        },
        submission: {
          packagePreviewTitle: "சமர்ப்பிப்பு தொகுப்பு முன்னோட்டம்",
          noPacket: "புகார் தொகுப்பு இன்னும் உருவாக்கப்படவில்லை.",
          packetNumber: "தொகுப்பு எண்",
          annexures: "இணைப்புகள்",
          summary: "சுருக்கம்",
          summaryFormat: "{{evidenceCount}} சான்றுகள் • {{timelineCount}} காலவரிசை நிகழ்வுகள்"
        },
        checklist: {
          title: "சமர்ப்பிப்பு சரிபார்ப்பு பட்டியல்",
          allSet: "அனைத்தும் தயார்.",
          required: "தேவைப்படும்",
          recommended: "பரிந்துரைக்கப்படும்"
        },
        authority: { title: "பரிந்துரைக்கப்படும் அதிகாரிகள்" }
      }
    }
  },
  te: {
    complaint: {
      coverTitle: "అధికారిక సైబర్ క్రైమ్ ఫిర్యాదు ప్యాకెట్",
      packetNumberLabel: "ప్యాకెట్ సంఖ్య:",
      generatedAtLabel: "సృష్టించబడిన సమయం:",
      packetContentsLabel: "ప్యాకెట్ విషయాలు",
      mainComplaintLabel: "ప్రధాన ఫిర్యాదు",
      signatureBlockLabel: "సంతకం విభాగం",
      subjectLabel: "విషయం:",
      declarationHeading: "7. ప్రకటన",
      narrativeHeading: "1. సంఘటన కథనం",
      timelineHeading: "2. సంఘటన కాలక్రమం",
      lossHeading: "3. ఆర్థిక నష్ట వివరాలు",
      evidenceHeading: "4. ఆధారాలు & గుర్తింపుల సారాంశం",
      accusedHeading: "5. నిందితుడి సమాచారం",
      legalHeading: "6. వర్తించే చట్టపరమైన విభాగాలు",
      signOff: "భవదీయుడు,",
      subjectTemplate: "సైబర్ క్రైమ్ సంఘటనకు సంబంధించిన అధికారిక ఫిర్యాదు: {{category}}",
      salutation: "స్టేషన్ హౌస్ ఆఫీసర్ / సైబర్ క్రైమ్ విభాగానికి,",
      bodyIntroTemplate: "నాపై జరిగిన సైబర్ క్రైమ్ సంఘటనను నివేదించడానికి నేను ఈ అధికారిక ఫిర్యాదును సమర్పిస్తున్నాను.",
      declarationTemplate: "ఈ ఫిర్యాదులో అందించిన సమాచారం నా జ్ఞానం మరియు నమ్మకం మేరకు నిజమైనది మరియు ఖచ్చితమైనది అని నేను ఇందుమూలంగా ప్రకటిస్తున్నాను. తప్పుడు సమాచారాన్ని సమర్పించడం చట్టప్రకారం శిక్షార్హమైన నేరం.\n\nతేదీ: {{dateStr}}\nస్థలం: _________________",
      preparedBy: "ట్రస్ట్‌లేయర్‌ల్యాబ్స్ సెంటినల్ లీగల్ AI ద్వారా వినియోగదారు అందించిన వాస్తవాల ఆధారంగా తయారు చేయబడింది.",
      signatureLabel: "[సంతకం]"
    },
    cyberJustice: {
      greeting: "ఏం జరిగిందో సాధారణ పదాలలో చెప్పండి. సైబర్ క్రైమ్‌ను వర్గీకరించడంలో, ఆధారాలను గుర్తించడంలో, కాలక్రమాన్ని రూపొందించడంలో మరియు ఫిర్యాదు ముసాయిదాను తయారు చేయడంలో నేను సహాయం చేస్తాను.",
      greetingShort: "ఏం జరిగిందో సాధారణ పదాలలో చెప్పండి.",
      captured: "నేను ఆ వివరాలను నమోదు చేసాను. ప్రతిపాదిత నవీకరణలను సమీక్షించండి, ఆపై సిద్ధంగా ఉన్నప్పుడు ధృవీకరించండి.",
      analysisResult: "నేను దీనిని {{category}}గా {{confidence}}% విశ్వసనీయతతో వర్గీకరించాను.",
      phaseLabel: "దశ 2 కేసు బిల్డర్",
      title: "సైబర్ జస్టిస్ AI",
      button: {
        reset: "రీసెట్",
        back: "వెనుకకు",
        analyze: "సంఘటనను విశ్లేషించు",
        analyzing: "విశ్లేషిస్తోంది...",
        next: "తదుపరి దశ"
      },
      steps: {
        NARRATIVE: "కథనం",
        ANALYSIS: "విశ్లేషణ",
        EVIDENCE: "ఆధారాలు",
        TIMELINE: "కాలక్రమం",
        REVIEW: "సమీక్ష"
      },
      questions: {
        "upi-utr": "చెల్లింపు కోసం UTR, RRN లేదా లావాదేవీ సూచన సంఖ్య ఏమిటి?",
        "upi-amount": "ఈ సంఘటనలో ఎంత డబ్బు నష్టపోయారు?",
        "phishing-url": "మీరు స్వీకరించిన లేదా తెరిచిన అనుమానాస్పద లింక్ లేదా వెబ్‌సైట్ ఏమిటి?",
        "phishing-email": "పంపినవారి ఈమెయిల్ చిరునామా మీ వద్ద ఉందా?",
        "sextortion-platform": "ఈ బెదిరింపులు లేదా మోసాలు ఏ ప్లాట్‌ఫారమ్‌లో జరిగాయి?",
        "suspect-phone": "నిందితుడు ఏదైనా ఫోన్ నంబర్‌ను ఉపయోగించాడా?",
        "bank-name": "లావాదేవీ కోసం ఏ బ్యాంక్ ఖాతా లేదా యాప్ ఉపయోగించబడింది?",
        "evidence-refs": "స్క్రీన్‌షాట్‌లు, చాట్‌లు, ఈమెయిల్‌లు వంటి మీ వద్ద ఉన్న ఆధారాలు ఏమిటి?",
        "general-narrative": "జరిగిన సంఘటనను మీ స్వంత మాటలలో వివరించండి."
      },
      ui: {
        conversation: {
          title: "సంభాషణ స్వీకరణ",
          nextBestQuestion: "తదుపరి ఉత్తమ ప్రశ్న",
          proposedUpdates: "ప్రతిపాదిత కేసు నవీకరణలు సమీక్షకు సిద్ధంగా ఉన్నాయి.",
          apply: "వర్తింపజేయి",
          reject: "తిరస్కరించు",
          naturalUpdateLabel: "సహజ సంఘటన నవీకరణ",
          placeholder: "వివరాలను సహజంగా జోడించండి: నేను INR 25000 నష్టపోయాను, UTR...",
          send: "పంపు"
        },
        header: {
          badge: "సైబర్ జస్టిస్ AI దశ 2",
          title: "చట్టబద్ధమైన సైబర్ క్రైమ్ కేసు ఫైల్‌ను రూపొందించండి.",
          subtitle: "కథన విశ్లేషణ, ఆధారాల ఖజానా, కాలక్రమ బిల్డర్ మరియు PDF ఎగుమతి అన్నీ ఒకే కేసు ఫైల్‌ను పంచుకుంటాయి."
        },
        emergency: {
          title: "అత్యవసర ఆర్థిక మోసమా?",
          desc: "వెంటనే 1930 కి కాల్ చేయండి మరియు నిధులను స్తంభింపజేయడానికి మీ బ్యాంక్‌ను సంప్రదించండి."
        },
        legalOutput: {
          title: "చట్టపరమైన ఇంజిన్ అవుట్‌పుట్",
          confidence: "విశ్వసనీయత",
          noAnalysis: "విశ్లేషణ తర్వాత వర్గీకరణ మరియు చట్టాలు ఇక్కడ కనిపిస్తాయి."
        },
        timeline: {
          title: "కాలక్రమ బిల్డర్",
          description: "సంభాషణ మరియు ఆధారాల నుండి ఈవెంట్‌లను సృష్టించండి.",
          action: {
            fromConversation: "సంభాషణ నుండి",
            fromEntities: "గుర్తింపుల నుండి",
            fromEvidence: "ఆధారాల నుండి"
          },
          field: {
            eventTitle: "ఈవెంట్ శీర్షిక",
            eventTitlePlaceholder: "డబ్బు బదిలీ చేయబడింది, లింక్ స్వీకరించబడింది...",
            timestamp: "సమయ ముద్ర",
            timestampPlaceholder: "2026-05-29T10:30:00+05:30",
            description: "వివరణ",
            descriptionPlaceholder: "వివరాలు..."
          },
          option: { noLinkedEvidence: "లింక్ చేయబడిన ఆధారం లేదు" },
          button: { addEvent: "ఈవెంట్‌ను జోడించు" },
          confirmed: "ధృవీకరించబడింది",
          confirm: "ధృవీకరించు",
          noTimelineEvents: "కాలక్రమ ఈవెంట్‌లు లేవు."
        },
        evidence: {
          title: "ఆధారాల ఖజానా",
          description: "ఆధారాల రికార్డులను జోడించండి మరియు వచనాన్ని అతికించండి.",
          label: { type: "ఆధారాల రకం" },
          name: { label: "పేరు", placeholder: "బ్యాంక్ స్టేట్‌మెంట్..." },
          timestamp: { label: "సమయ ముద్ర", placeholder: "2026-05-29T10:30:00+05:30" },
          description: { label: "వివరణ", placeholder: "వివరాలు..." },
          extractableLabel: "సేకరించదగిన వచనం",
          extractable: { placeholder: "అతికించండి..." },
          addButton: "ఆధారాన్ని జోడించు",
          stat: { vaultItems: "ఖజానా అంశాలు", verified: "ధృవీకరించబడింది", extracted: "సేకరించిన గుర్తింపులు" },
          noDescription: "వివరణ అందించబడలేదు.",
          verified: "ధృవీకరించబడింది",
          markVerified: "ధృవీకరించినట్లు గుర్తించు",
          noEvidence: "ఇంకా ఆధారాలు జోడించబడలేదు.",
          types: { SCREENSHOT: "స్క్రీన్‌షాట్", PDF: "PDF", AUDIO: "ఆడియో రికార్డింగ్", VIDEO: "వీడియో", CHAT: "చాట్", EMAIL: "ఈమెయిల్", BANK_STATEMENT: "బ్యాంక్ స్టేట్‌మెంట్" }
        },
        analysis: {
          noNarrative: "మొదట సంఘటన కథనాన్ని జోడించండి.",
          title: "వర్గీకరణ మరియు చట్టాలు",
          description: "చట్టపరమైన విశ్లేషణను సమీక్షించండి.",
          detectedCategory: "గుర్తించబడిన వర్గం",
          confidence: "విశ్వసనీయత",
          manualOverride: "మాన్యువల్ ఓవర్‌రైడ్"
        },
        review: {
          title: "సమీక్ష కేంద్ర",
          description: "ఫిర్యాదు మరియు PDF సృష్టించే ముందు కేసు ఫైల్‌ను ధృవీకరించండి.",
          noNarrative: "సంఘటన కథనం అందించబడలేదు.",
          classification: "వర్గీకరణ",
          notAnalyzed: "విశ్లేషించబడలేదు",
          confidence: "విశ్వసనీయత",
          pending: "పెండింగ్‌లో ఉంది",
          mappedSections: "మ్యాప్ చేయబడిన విభాగాలు",
          evidenceInventory: "ఆధారాల జాబితా",
          noEvidenceItems: "ఆధారాలు జోడించబడలేదు.",
          noDescription: "వివరణ అందించబడలేదు.",
          verified: "ధృవీకరించబడింది",
          pendingReview: "సమీక్ష పెండింగ్‌లో ఉంది",
          financialLoss: "ఆర్థిక నష్టం",
          fields: { amount: "మొత్తం", currency: "కరెన్సీ", bank: "బ్యాంక్", transactionId: "లావాదేవీ ఐడి", paymentMethod: "చెల్లింపు పద్ధతి", recoveryStatus: "రికవరీ స్థితి" },
          victim: "బాధితుడు",
          accused: "నిందితుడు",
          timeline: "కాలక్రమం",
          noTimelineEvents: "కాలక్రమ ఈవెంట్‌లు జోడించబడలేదు.",
          extractedEntities: "సేకరించిన గుర్తింపులు",
          officialPacketTitle: "అధికారిక ప్యాకెట్ సృష్టి",
          officialPacketDesc: "ఫిర్యాదు ప్యాకెట్‌ను సృష్టిస్తుంది.",
          generatePacket: { generating: "సృష్టిస్తోంది...", button: "ప్యాకెట్‌ను సృష్టించు" },
          downloadPdf: "PDF డౌన్‌లోడ్ చేయండి",
          exportSummary: "సారాంశాన్ని ఎగుమతి చేయి",
          summary: { packetNumber: "ప్యాకెట్ సంఖ్య", annexures: "అనుబంధాలు", evidenceItems: "ఆధారాలు", timelineEvents: "ఈవెంట్‌లు", mappedLaws: "చట్టాలు", financialLossIncluded: "చేర్చబడింది", financialLossNotRecorded: "నమోదు చేయబడలేదు", pdfReady: "సిద్ధంగా ఉంది", pdfPending: "పెండింగ్‌లో ఉంది", generated: "సృష్టించబడింది" },
          pdfErrorPrefix: "PDF లోపం:",
          annexurePreview: "అనుబంధం ప్రివ్యూ",
          packetPreview: "ప్యాకెట్ ప్రివ్యూ"
        },
        submission: {
          packagePreviewTitle: "సమర్పణ ప్యాకెట్ ప్రివ్యూ",
          noPacket: "అధికారిక ఫిర్యాదు ప్యాకెట్ ఇంకా సృష్టించబడలేదు.",
          packetNumber: "ప్యాకెట్ సంఖ్య",
          annexures: "అనుబంధాలు",
          summary: "సారాంశం",
          summaryFormat: "{{evidenceCount}} ఆధారాలు • {{timelineCount}} కాలక్రమ ఈవెంట్‌లు"
        },
        checklist: {
          title: "సమర్పణ చెక్‌లిస్ట్",
          allSet: "అంతా సిద్ధంగా ఉంది.",
          required: "అవసరం",
          recommended: "సిఫార్సు చేయబడింది"
        },
        authority: { title: "సిఫార్సు చేయబడిన అధికారులు" }
      }
    }
  },
  gu: {
    complaint: {
      coverTitle: "સત્તાવાર સાયબર ક્રાઈમ ફરિયાદ પેકેટ",
      packetNumberLabel: "પેકેટ નંબર:",
      generatedAtLabel: "બનાવેલ સમય:",
      packetContentsLabel: "પેકેટ વિષયવસ્તુ",
      mainComplaintLabel: "મુખ્ય ફરિયાદ",
      signatureBlockLabel: "સહી વિભાગ",
      subjectLabel: "વિષય:",
      declarationHeading: "7. જાહેરનામું",
      narrativeHeading: "1. ઘટનાની વિગતો",
      timelineHeading: "2. ઘટનાની સમયરેખા",
      lossHeading: "3. નાણાકીય નુકસાનની વિગતો",
      evidenceHeading: "4. પુરાવા અને ઓળખકર્તાઓનો સારાંશ",
      accusedHeading: "5. આરોપીની માહિતી",
      legalHeading: "6. લાગુ પડતી કાનૂની કલમો",
      signOff: "આપનો વિશ્વાસુ,",
      subjectTemplate: "સાયબર ક્રાઈમ ઘટના અંગેની ઔપચારિક ફરિયાદ: {{category}}",
      salutation: "સ્ટેશન હાઉસ ઓફિસર / સાયબર ક્રાઈમ સેલને,",
      bodyIntroTemplate: "હું, {{victimName}}, મારી સામે બનેલી સાયબર ક્રાઈમ ઘટનાની જાણ કરવા માટે આ ફરિયાદ રજૂ કરું છું.",
      declarationTemplate: "હું, {{victimName}}, જાહેર કરું છું કે આ ફરિયાદમાં આપેલી માહિતી મારી જાણકારી મુજબ સાચી છે. ખોટી માહિતી આપવી એ કાયદાકીય ગુનો છે.\n\nતારીખ: {{dateStr}}\nસ્થળ: _________________",
      preparedBy: "ટ્રસ્ટલેયરલેબ્સ સેન્ટિનલ લીગલ AI દ્વારા તૈયાર કરેલ.",
      signatureLabel: "[સહી]"
    },
    cyberJustice: {
      greeting: "શું થયું તે સરળ શબ્દોમાં કહો. હું સાયબર ક્રાઈમનું વર્ગીકરણ કરવા, પુરાવા ઓળખવા અને ફરિયાદનો મુસદ્દો તૈયાર કરવામાં મદદ કરીશ.",
      greetingShort: "શું થયું તે સરળ શબ્દોમાં કહો.",
      captured: "મેં તે વિગતો નોંધી લીધી છે. સૂચિત સુધારાઓની સમીક્ષા કરો.",
      analysisResult: "મેં આને {{confidence}}% આત્મવિશ્વાસ સાથે {{category}} તરીકે વર્ગીકૃત કર્યું છે.",
      phaseLabel: "તબક્કો 2 કેસ બિલ્ડર",
      title: "સાયબર જસ્ટિસ AI",
      button: {
        reset: "રીસેટ",
        back: "પાછા",
        analyze: "ઘટનાનું વિશ્લેષણ કરો",
        analyzing: "વિશ્લેષણ થઈ રહ્યું છે...",
        next: "આગળનું પગલું"
      },
      steps: {
        NARRATIVE: "વિગતો",
        ANALYSIS: "વિશ્લેષણ",
        EVIDENCE: "પુરાવા",
        TIMELINE: "સમયરેખા",
        REVIEW: "સમીક્ષા"
      },
      questions: {
        "upi-utr": "ચુકવણી માટેનો UTR, RRN અથવા ટ્રાન્ઝેક્શન સંદર્ભ નંબર શું છે?",
        "upi-amount": "આ ઘટનામાં કેટલા પૈસા ગુમાવ્યા?",
        "phishing-url": "તમને મળેલી શંકાસ્પદ લિંક અથવા વેબસાઇટ કઈ છે?",
        "phishing-email": "મોકલનારનું ઇમેઇલ સરનામું તમારી પાસે છે?",
        "sextortion-platform": "આ ધમકીઓ કયા પ્લેટફોર્મ પર મળી હતી?",
        "suspect-phone": "આરોપીએ કોઈ ફોન નંબરનો ઉપયોગ કર્યો હતો?",
        "bank-name": "ટ્રાન્ઝેક્શન માટે કઈ બેંક અથવા એપ્લિકેશનનો ઉપયોગ થયો હતો?",
        "evidence-refs": "તમારી પાસે કયા પુરાવા (સ્ક્રીનશોટ, ચેટ્સ વગેરે) છે?",
        "general-narrative": "શું બન્યું તે તમારા પોતાના શબ્દોમાં લખો."
      },
      ui: {
        conversation: {
          title: "વાતચીત ઇનટેક",
          nextBestQuestion: "આગળનો શ્રેષ્ઠ પ્રશ્ન",
          proposedUpdates: "સૂચિત કેસ અપડેટ્સ સમીક્ષા માટે તૈયાર છે.",
          apply: "લાગુ કરો",
          reject: "નકારો",
          naturalUpdateLabel: "કુદરતી ઘટના અપડેટ",
          placeholder: "વિગતો ઉમેરો: મેં ૨૫૦૦૦ ગુમાવ્યા, UTR નંબર...",
          send: "મોકલો"
        },
        header: {
          badge: "સાયબર જસ્ટિસ AI તબક્કો 2",
          title: "કાયદાકીય સાયબર ક્રાઈમ કેસ ફાઈલ બનાવો.",
          subtitle: "ઘટના વિશ્લેષણ, પુરાવા તિજોરી, સમયરેખા બિલ્ડર અને PDF નિકાસ એક જ કેસ ફાઈલ શેર કરે છે."
        },
        emergency: {
          title: "તાત્કાલિક નાણાકીય છેતરપિંડી?",
          desc: "તરત જ 1930 પર કૉલ કરો અને તમારા ભંડોળને ફ્રીઝ કરવા માટે બેંકનો સંપર્ક કરો."
        },
        legalOutput: {
          title: "કાનૂની એન્જિન આઉટપુટ",
          confidence: "આત્મવિશ્વાસ",
          noAnalysis: "વિશ્લેષણ પછી વર્ગીકરણ અને કાયદા અહીં દેખાશે."
        },
        timeline: {
          title: "સમયરેખા બિલ્ડર",
          description: "વાતચીત અને પુરાવાઓમાંથી ઘટનાઓ બનાવો.",
          action: {
            fromConversation: "વાતચીતમાંથી",
            fromEntities: "ઓળખકર્તાઓમાંથી",
            fromEvidence: "પુરાવાઓમાંથી"
          },
          field: {
            eventTitle: "ઘટનાનું શીર્ષક",
            eventTitlePlaceholder: "પૈસા મોકલ્યા, લિંક મળી...",
            timestamp: "સમય સ્ટેમ્પ",
            timestampPlaceholder: "2026-05-29T10:30:00+05:30",
            description: "વર્ણન",
            descriptionPlaceholder: "વિગતો..."
          },
          option: { noLinkedEvidence: "કોઈ લિંક કરેલ પુરાવા નથી" },
          button: { addEvent: "ઘટના ઉમેરો" },
          confirmed: "પુષ્ટિ થયેલ",
          confirm: "પુષ્ટિ કરો",
          noTimelineEvents: "સમયરેખામાં કોઈ ઘટના નથી."
        },
        evidence: {
          title: "પુરાવા તિજોરી",
          description: "પુરાવાના રેકોર્ડ ઉમેરો અને લખાણ પેસ્ટ કરો.",
          label: { type: "પુરાવાનો પ્રકાર" },
          name: { label: "નામ", placeholder: "બેંક સ્ટેટમેન્ટ..." },
          timestamp: { label: "સમય સ્ટેમ્પ", placeholder: "2026-05-29T10:30:00+05:30" },
          description: { label: "વર્ણન", placeholder: "વિગતો..." },
          extractableLabel: "પસંદ કરવા યોગ્ય લખાણ",
          extractable: { placeholder: "પેસ્ટ કરો..." },
          addButton: "પુરાવા ઉમેરો",
          stat: { vaultItems: "તિજોરીની વસ્તુઓ", verified: "વેરિફાઈડ", extracted: "મળેલા ઓળખકર્તાઓ" },
          noDescription: "કોઈ વર્ણન આપેલ નથી.",
          verified: "વેરિફાઈડ",
          markVerified: "વેરિફાઈડ તરીકે ચિહ્નિત કરો",
          noEvidence: "હજુ સુધી કોઈ પુરાવા ઉમેર્યા નથી.",
          types: { SCREENSHOT: "સ્ક્રીનશોટ", PDF: "PDF", AUDIO: "ઓડિયો રેકોર્ડિંગ", VIDEO: "વીડિયો", CHAT: "ચેટ", EMAIL: "ઇમેઇલ", BANK_STATEMENT: "બેંક સ્ટેટમેન્ટ" }
        },
        analysis: {
          noNarrative: "પહેલા ઘટનાનું વર્ણન ઉમેરો.",
          title: "વર્ગીકરણ અને કાયદા",
          description: "કાનૂની વિશ્લેષણની સમીક્ષા કરો.",
          detectedCategory: "ઓળખાયેલ શ્રેણી",
          confidence: "આત્મવિશ્વાસ",
          manualOverride: "મેન્યુઅલ ઓવરરાઇડ"
        },
        review: {
          title: "સમીક્ષા કેન્દ્ર",
          description: "ફરિયાદ અને PDF બનાવતા પહેલા કેસ ફાઈલ ચકાસો.",
          noNarrative: "કોઈ ઘટના વર્ણન આપેલ નથી.",
          classification: "વર્ગીકરણ",
          notAnalyzed: "વિશ્લેષણ થયું નથી",
          confidence: "આત્મવિશ્વાસ",
          pending: "બાકી છે",
          mappedSections: "નકશા કરેલા વિભાગો",
          evidenceInventory: "પુરાવાઓની યાદી",
          noEvidenceItems: "કોઈ પુરાવા ઉમેરેલ નથી.",
          noDescription: "કોઈ વર્ણન આપેલ નથી.",
          verified: "વેરિફાઈડ",
          pendingReview: "સમીક્ષા બાકી છે",
          financialLoss: "નાણાકીય નુકસાન",
          fields: { amount: "રકમ", currency: "ચલણ", bank: "બેંક", transactionId: "ટ્રાન્ઝેક્શન આઈડી", paymentMethod: "ચુકવણી પદ્ધતિ", recoveryStatus: "રિકવરી સ્થિતિ" },
          victim: "ભોગ બનનાર",
          accused: "આરોપી",
          timeline: "સમયરેખા",
          noTimelineEvents: "સમયરેખામાં કોઈ ઘટના ઉમેરી નથી.",
          extractedEntities: "મળેલા ઓળખકર્તાઓ",
          officialPacketTitle: "સત્તાવાર પેકેટ નિર્માણ",
          officialPacketDesc: "ફરિયાદ પેકેટ બનાવે છે.",
          generatePacket: { generating: "બનાવી રહ્યું છે...", button: "પેકેટ બનાવો" },
          downloadPdf: "PDF ડાઉનલોડ કરો",
          exportSummary: "સારાંશ નિકાસ કરો",
          summary: { packetNumber: "પેકેટ નંબર", annexures: "જોડાણો", evidenceItems: "પુરાવા", timelineEvents: "ઘટનાઓ", mappedLaws: "કાયદાઓ", financialLossIncluded: "શામેલ છે", financialLossNotRecorded: "નોંધાયેલ નથી", pdfReady: "તૈયાર છે", pdfPending: "બાકી છે", generated: "બનાવેલ" },
          pdfErrorPrefix: "PDF ભૂલ:",
          annexurePreview: "જોડાણ પૂર્વાવલોકન",
          packetPreview: "પેકેટ પૂર્વાવલોકન"
        },
        submission: {
          packagePreviewTitle: "સબમિશન પેકેટ પૂર્વાવલોકન",
          noPacket: "સત્તાવાર ફરિયાદ પેકેટ હજુ સુધી બનાવવામાં આવ્યું નથી.",
          packetNumber: "પેકેટ નંબર",
          annexures: "જોડાણો",
          summary: "સારાંશ",
          summaryFormat: "{{evidenceCount}} પુરાવા • {{timelineCount}} સમયરેખા ઘટનાઓ"
        },
        checklist: {
          title: "સબમિશન ચેકલિસ્ટ",
          allSet: "બધું તૈયાર છે.",
          required: "જરૂરી",
          recommended: "ભલામણ કરેલ"
        },
        authority: { title: "ભલામણ કરેલ સત્તાવાળાઓ" }
      }
    }
  },
  ur: {
    complaint: {
      coverTitle: "سرکاری سائبر کرائم شکایت پیکٹ",
      packetNumberLabel: "پیکٹ نمبر:",
      generatedAtLabel: "تخلیق شدہ وقت:",
      packetContentsLabel: "پیکٹ کے مندرجات",
      mainComplaintLabel: "بنیادی شکایت",
      signatureBlockLabel: "دستخط سیکشن",
      subjectLabel: "موضوع:",
      declarationHeading: "7. اعلامیہ",
      narrativeHeading: "1. واقعے کی تفصیل",
      timelineHeading: "2. واقعے کی ٹائم لائن",
      lossHeading: "3. مالی نقصان کی تفصیلات",
      evidenceHeading: "4. شواہد اور شناختی علامات کا خلاصہ",
      accusedHeading: "5. ملزم کی معلومات",
      legalHeading: "6. لاگو قانونی دفعات",
      signOff: "آپ کا مخلص،",
      subjectTemplate: "سائبر کرائم واقعے کے بارے میں باضابطہ شکایت: {{category}}",
      salutation: "بخدمت جناب اسٹیشن ہاؤس آفیسر / سائبر کرائم سیل،",
      bodyIntroTemplate: "میں، {{victimName}}، احترام کے ساتھ اپنے خلاف ہونے والے سائبر کرائم واقعے کی رپورٹ درج کرانے کے لیے یہ باضابطہ شکایت پیش کرتا ہوں ۔",
      declarationTemplate: "میں، {{victimName}}، اس بات کا اعلان کرتا ہوں کہ اس شکایت میں فراہم کردہ معلومات میرے علم اور یقین کے مطابق سچ اور درست ہیں۔ جھوٹی معلومات فراہم کرنا قانون کے تحت ایک قابل سزا جرم ہے۔\n\nتاریخ: {{dateStr}}\nمقام: _________________",
      preparedBy: "ٹرسٹ لیئر لیبس سینٹینیل لیگل AI کے ذریعے صارف کے فراہم کردہ حقائق کی بنیاد پر تیار کیا گیا۔",
      signatureLabel: "[دستخط]"
    },
    cyberJustice: {
      greeting: "مجھے سادہ الفاظ میں بتائیں کہ کیا ہوا تھا۔ میں سائبر کرائم کی درجہ بندی کرنے، ثبوت تلاش کرنے اور شکایت کا مسودہ تیار کرنے میں مدد کروں گا۔",
      greetingShort: "مجھے سادہ الفاظ میں بتائیں کہ کیا ہوا تھا۔",
      captured: "میں نے وہ تفصیلات محفوظ کر لی ہیں۔ مجوزہ اپڈیٹس کا جائزہ لیں اور تصدیق کریں۔",
      analysisResult: "میں نے اس واقعے کو {{confidence}}% یقین کے ساتھ {{category}} کے طور پر درجہ بندی کیا ہے۔",
      phaseLabel: "فیز 2 کیس بلڈر",
      title: "سائبر جسٹس AI",
      button: {
        reset: "ری سیٹ",
        back: "واپس",
        analyze: "واقعے کا تجزیہ کریں",
        analyzing: "تجزیہ ہو رہا ہے...",
        next: "اگلا مرحلہ"
      },
      steps: {
        NARRATIVE: "تفصیل",
        ANALYSIS: "تجزیہ",
        EVIDENCE: "شواہد",
        TIMELINE: "ٹائم لائن",
        REVIEW: "جائزہ"
      },
      questions: {
        "upi-utr": "ادائیگی کا UTR، RRN یا ٹرانزیکشن حوالہ نمبر کیا ہے؟",
        "upi-amount": "اس واقعے میں کتنی رقم کا نقصان ہوا؟",
        "phishing-url": "آپ کو کون سا مشکوک لنک یا ویب سائٹ موصول ہوئی یا آپ نے کھولی؟",
        "phishing-email": "کیا آپ کے پاس بھیجنے والے کا ای میل پتہ ہے؟",
        "sextortion-platform": "یہ دھمکیاں یا دھوکہ دہی کس پلیٹ فارم پر ہوئی؟",
        "suspect-phone": "کیا ملزم نے کوئی فون نمبر استعمال کیا؟",
        "bank-name": "ٹرانزیکشن کے لیے کون سا بینک اکاؤنٹ یا ایپ استعمال کی گئی؟",
        "evidence-refs": "آپ کے پاس کون سے شواہد جیسے اسکرین شاٹس، چیٹس وغیرہ موجود ہیں؟",
        "general-narrative": "جو کچھ ہوا اسے اپنے الفاظ میں بیان کریں۔"
      },
      ui: {
        conversation: {
          title: "گفتگو کا اندراج",
          nextBestQuestion: "اگلا بہترین سوال",
          proposedUpdates: "مجوزہ کیس اپڈیٹس جائزے کے لیے تیار ہیں۔",
          apply: "لاگو کریں",
          reject: "مسترد کریں",
          naturalUpdateLabel: "واقعے کی قدرتی اپڈیٹ",
          placeholder: "تفصیلات لکھیں: میرا ۲۵۰۰۰ کا نقصان ہوا، UTR نمبر...",
          send: "بھیجیں"
        },
        header: {
          badge: "سائبر جسٹس AI فیز 2",
          title: "قانونی طور پر تیار سائبر کرائم کیس فائل بنائیں۔",
          subtitle: "واقعے کا تجزیہ، شواہد کا ذخیرہ، ٹائم لائن بلڈر، اور PDF ایکسپورٹ سب ایک ہی کیس فائل کا حصہ ہیں۔"
        },
        emergency: {
          title: "ہنگامی مالیاتی فراڈ؟",
          desc: "فوری طور پر 1930 پر کال کریں اور اپنے فنڈز کو منجمد کرنے کے لیے بینک سے رابطہ کریں۔"
        },
        legalOutput: {
          title: "قانونی انجن کا نتیجہ",
          confidence: "یقین",
          noAnalysis: "تجزیہ کے بعد درجہ بندی اور قوانین یہاں نظر آئیں گے۔"
        },
        timeline: {
          title: "ٹائم لائن بلڈر",
          description: "گفتگو اور شواہد سے واقعات بنائیں۔",
          action: {
            fromConversation: "گفتگو سے",
            fromEntities: "شناختوں سے",
            fromEvidence: "شواہد سے"
          },
          field: {
            eventTitle: "واقعے کا عنوان",
            eventTitlePlaceholder: "رقم منتقل ہوئی، لنک موصول ہوا...",
            timestamp: "وقت کی مہر",
            timestampPlaceholder: "2026-05-29T10:30:00+05:30",
            description: "تفصیل",
            descriptionPlaceholder: "تفصیلات..."
          },
          option: { noLinkedEvidence: "کوئی منسلک ثبوت نہیں ہے" },
          button: { addEvent: "واقعہ شامل کریں" },
          confirmed: "تصدیق شدہ",
          confirm: "تصدیق کریں",
          noTimelineEvents: "ٹائم لائن میں کوئی واقعہ نہیں ہے۔"
        },
        evidence: {
          title: "شواہد کا ذخیرہ",
          description: "شواہد کا ریکارڈ شامل کریں اور متن چسپاں کریں۔",
          label: { type: "شواہد کی قسم" },
          name: { label: "نام", placeholder: "بینک سٹیٹمنٹ..." },
          timestamp: { label: "وقت کی مہر", placeholder: "2026-05-29T10:30:00+05:30" },
          description: { label: "تفصیل", placeholder: "تفصیلات..." },
          extractableLabel: "حاصل کردہ متن",
          extractable: { placeholder: "چسپاں کریں..." },
          addButton: "ثبوت شامل کریں",
          stat: { vaultItems: "ذخیرے کی اشیاء", verified: "تصدیق شدہ", extracted: "حاصل کردہ شناختیں" },
          noDescription: "تفصیل فراہم نہیں کی گئی۔",
          verified: "تصدیق شدہ",
          markVerified: "تصدیق شدہ نشان زد کریں",
          noEvidence: "ابھی تک کوئی ثبوت شامل نہیں کیا گیا۔",
          types: { SCREENSHOT: "اسکرین شاٹ", PDF: "PDF", AUDIO: "آڈیو ریکارڈنگ", VIDEO: "ویڈیو", CHAT: "چیٹ", EMAIL: "ای میل", BANK_STATEMENT: "بینک اسٹیٹمنٹ" }
        },
        analysis: {
          noNarrative: "پہلے واقعے کی تفصیل شامل کریں۔",
          title: "درجہ بندی اور قوانین",
          description: "قانونی تجزیہ کا جائزہ لیں۔",
          detectedCategory: "شناخت شدہ زمرہ",
          confidence: "یقین",
          manualOverride: "دستی تبدیلی"
        },
        review: {
          title: "جائزہ مرکز",
          description: "شکایت اور PDF بنانے سے پہلے کیس فائل کی تصدیق کریں۔",
          noNarrative: "واقعے کی تفصیل فراہم نہیں کی گئی۔",
          classification: "درجہ بندی",
          notAnalyzed: "تجزیہ نہیں کیا گیا",
          confidence: "یقین",
          pending: "التوا میں ہے",
          mappedSections: "میپ شدہ سیکشنز",
          evidenceInventory: "شواہد کی فہرست",
          noEvidenceItems: "کوئی ثبوت شامل نہیں کیا گیا۔",
          noDescription: "تفصیل فراہم نہیں کی گئی۔",
          verified: "تصدیق شدہ",
          pendingReview: "جائزہ التوا میں ہے",
          financialLoss: "مالی نقصان",
          fields: { amount: "رقم", currency: "کرنسی", bank: "بینک", transactionId: "ٹرانزیکشن آئی ڈی", paymentMethod: "ادائیگی کا طریقہ", recoveryStatus: "ریکوری کی صورتحال" },
          victim: "متاثرہ شخص",
          accused: "ملزم",
          timeline: "ٹائم لائن",
          noTimelineEvents: "ٹائم لائن میں کوئی واقعہ شامل نہیں کیا گیا۔",
          extractedEntities: "حاصل کردہ شناختیں",
          officialPacketTitle: "سرکاری پیکٹ کی تخلیق",
          officialPacketDesc: "شکایت کا پیکٹ بناتا ہے۔",
          generatePacket: { generating: "تخلیق ہو رہا ہے...", button: "پیکٹ بنائیں" },
          downloadPdf: "PDF ڈاؤن لوڈ کریں",
          exportSummary: "خلاصہ ایکسپورٹ کریں",
          summary: { packetNumber: "پیکٹ نمبر", annexures: "منسلکات", evidenceItems: "شواہد", timelineEvents: "واقعات", mappedLaws: "قوانین", financialLossIncluded: "شامل ہے", financialLossNotRecorded: "درج نہیں کیا گیا", pdfReady: "تیار ہے", pdfPending: "التوا میں ہے", generated: "تخلیق شدہ" },
          pdfErrorPrefix: "PDF غلطی:",
          annexurePreview: "منسلکہ کا پریو",
          packetPreview: "پیکٹ کا پریو"
        },
        submission: {
          packagePreviewTitle: "جمع کرائے گئے پیکٹ کا پریو",
          noPacket: "سرکاری شکایت کا پیکٹ ابھی تک تیار نہیں کیا گیا۔",
          packetNumber: "پیکٹ نمبر",
          annexures: "منسلکات",
          summary: "خلاصہ",
          summaryFormat: "{{evidenceCount}} شواہد • {{timelineCount}} ٹائم لائن واقعات"
        },
        checklist: {
          title: "چیک لسٹ",
          allSet: "سب تیار ہے۔",
          required: "ضروری",
          recommended: "تجویز کردہ"
        },
        authority: { title: "تجویز کردہ حکام" }
      }
    }
  },
  bn: {
    complaint: {
      coverTitle: "অফিসিয়াল সাইবার ক্রাইম অভিযোগ প্যাকেট",
      packetNumberLabel: "প্যাকেট নম্বর:",
      generatedAtLabel: "তৈরির সময়:",
      packetContentsLabel: "প্যাকেটের বিষয়বস্তু",
      mainComplaintLabel: "প্রধান অভিযোগ",
      signatureBlockLabel: "স্বাক্ষর বিভাগ",
      subjectLabel: "বিষয়:",
      declarationHeading: "৭. ঘোষণা",
      narrativeHeading: "১. ঘটনার বিবরণ",
      timelineHeading: "২. ঘটনার সময়রেখা",
      lossHeading: "৩. আর্থিক ক্ষতির বিবরণ",
      evidenceHeading: "৪. প্রমাণ ও পরিচয়সমূহের সারসংক্ষেপ",
      accusedHeading: "৫. অভিযুক্তের তথ্য",
      legalHeading: "৬. প্রযোজ্য আইনি ধারাসমূহ",
      signOff: "আপনার বিশ্বস্ত,",
      subjectTemplate: "সাইবার অপরাধ সংক্রান্ত আনুষ্ঠানিক অভিযোগ: {{category}}",
      salutation: "থানার ভারপ্রাপ্ত কর্মকর্তা / সাইবার ক্রাইম সেল সমীপেষু,",
      bodyIntroTemplate: "আমি, {{victimName}}, অত্যন্ত সম্মানের সাথে আমার বিরুদ্ধে হওয়া সাইবার অপরাধের ঘটনাটি রিপোর্ট করার জন্য এই অভিযোগ দায়ের করছি।",
      declarationTemplate: "আমি, {{victimName}}, ঘোষণা করছি যে এই অভিযোগে প্রদত্ত তথ্যসমূহ আমার জ্ঞান ও বিশ্বাস মতে সত্য এবং সঠিক। ভুল তথ্য প্রদান করা আইনত দণ্ডনীয় অপরাধ।\n\nতারিখ: {{dateStr}}\nস্থান: _________________",
      preparedBy: "ট্রাস্টলেয়ারল্যাবস সেন্টিনেল লিগ্যাল এআই দ্বারা প্রস্তুতকৃত।",
      signatureLabel: "[স্বাক্ষর]"
    },
    cyberJustice: {
      greeting: "সহজ ভাষায় বলুন কী ঘটেছিল। আমি সাইবার অপরাধের শ্রেণীবিভাগ করতে, প্রমাণ শনাক্ত করতে ও অভিযোগের খসড়া তৈরি করতে সাহায্য করব।",
      greetingShort: "সহজ ভাষায় বলুন কী ঘটেছিল।",
      captured: "আমি সেই বিবরণগুলি নথিভুক্ত করেছি। প্রস্তাবিত আপডেটগুলি পর্যালোচনা করুন।",
      analysisResult: "আমি এটিকে {{confidence}}% নিশ্চিততার সাথে {{category}} হিসেবে শ্রেণীবদ্ধ করেছি।",
      phaseLabel: "ধাপ ২ কেস বিল্ডার",
      title: "সাইবার জাস্টিস এআই",
      button: {
        reset: "রিসেট",
        back: "পিছনে",
        analyze: "ঘটনা বিশ্লেষণ করুন",
        analyzing: "বিশ্লেষণ হচ্ছে...",
        next: "পরবর্তী ধাপ"
      },
      steps: {
        NARRATIVE: "বিবরণ",
        ANALYSIS: "বিশ্লেষণ",
        EVIDENCE: "প্রমাণ",
        TIMELINE: "সময়রেখা",
        REVIEW: "পর্যালোচনা"
      },
      questions: {
        "upi-utr": "লেনদেনের জন্য UTR, RRN বা রেফারেন্স নম্বর কী?",
        "upi-amount": "এই ঘটনায় কত টাকা ক্ষতি হয়েছে?",
        "phishing-url": "আপনি যে সন্দেহভাজন লিঙ্ক বা ওয়েবসাইট খুলেছিলেন তা কী?",
        "phishing-email": "প্রেরকের ইমেইল ঠিকানা কি আপনার কাছে আছে?",
        "sextortion-platform": "এই হুমকি বা জালিয়াতি কোন প্ল্যাটফর্মে হয়েছিল?",
        "suspect-phone": "অভিযুক্ত ব্যক্তি কোনো ফোন নম্বর ব্যবহার করেছিলেন কি?",
        "bank-name": "লেনদেনের জন্য কোন ব্যাংক বা অ্যাপ ব্যবহার করা হয়েছিল?",
        "evidence-refs": "আপনার কাছে স্ক্রিনশট, চ্যাট ইত্যাদির কী প্রমাণ আছে?",
        "general-narrative": "কী ঘটেছিল তা আপনার নিজের ভাষায় লিখুন।"
      },
      ui: {
        conversation: {
          title: "কথোপকথন ইনটেক",
          nextBestQuestion: "পরবর্তী সেরা প্রশ্ন",
          proposedUpdates: "প্রস্তাবিত কেস আপডেট পর্যালোচনার জন্য প্রস্তুত।",
          apply: "প্রয়োগ করুন",
          reject: "প্রত্যাখ্যান",
          naturalUpdateLabel: "স্বাভাবিক ঘটনা আপডেট",
          placeholder: "বিবরণ লিখুন: আমি ২৫০০০ টাকা হারিয়েছি, UTR নম্বর...",
          send: "পাঠান"
        },
        header: {
          badge: "সাইবার জাস্টিস এআই ধাপ ২",
          title: "আইনগতভাবে প্রস্তুত সাইবার ক্রাইম কেস ফাইল তৈরি করুন।",
          subtitle: "ঘটনা বিশ্লেষণ, প্রমাণ ভল্ট, টাইমলাইন বিল্ডার এবং PDF রপ্তানি একই কেস ফাইল শেয়ার করে।"
        },
        emergency: {
          title: "জরুরী আর্থিক জালিয়াতি?",
          desc: "অবিলম্বে 1930 নম্বরে কল করুন এবং আপনার অর্থ ফ্রিজ করতে ব্যাংকে যোগাযোগ করুন।"
        },
        legalOutput: {
          title: "আইনি ইঞ্জিনের ফলাফল",
          confidence: "নিশ্চিততা",
          noAnalysis: "বিশ্লেষণের পর শ্রেণীবিভাগ এবং আইন এখানে প্রদর্শিত হবে।"
        },
        timeline: {
          title: "টাইমলাইন বিল্ডার",
          description: "কথোপকথন এবং প্রমাণ থেকে ঘটনা তৈরি করুন।",
          action: {
            fromConversation: "কথোপকথন থেকে",
            fromEntities: "পরিচয়সমূহ থেকে",
            fromEvidence: "প্রমাণ থেকে"
          },
          field: {
            eventTitle: "ঘটনার শিরোনাম",
            eventTitlePlaceholder: "টাকা স্থানান্তরিত, লিঙ্ক পাওয়া গেছে...",
            timestamp: "সময় স্ট্যাম্প",
            timestampPlaceholder: "2026-05-29T10:30:00+05:30",
            description: "বিবরণ",
            descriptionPlaceholder: "বিস্তারিত..."
          },
          option: { noLinkedEvidence: "কোনো লিঙ্কযুক্ত প্রমাণ নেই" },
          button: { addEvent: "ঘটনা যোগ করুন" },
          confirmed: "নিশ্চিতকৃত",
          confirm: "নিশ্চিত করুন",
          noTimelineEvents: "টাইমলাইনে কোনো ঘটনা নেই।"
        },
        evidence: {
          title: "প্রমাণ ভল্ট",
          description: "প্রমাণ রেকর্ড যোগ করুন এবং পাঠ্য পেস্ট করুন।",
          label: { type: "প্রমাণের ধরন" },
          name: { label: "নাম", placeholder: "ব্যাংক স্টেটমেন্ট..." },
          timestamp: { label: "সময় স্ট্যাম্প", placeholder: "2026-05-29T10:30:00+05:30" },
          description: { label: "বিবরণ", placeholder: "বিস্তারিত..." },
          extractableLabel: "উদ্ধারযোগ্য পাঠ্য",
          extractable: { placeholder: "পেস্ট করুন..." },
          addButton: "প্রমাণ যোগ করুন",
          stat: { vaultItems: "ভল্টের উপাদান", verified: "যাচাইকৃত", extracted: "উদ্ধারকৃত পরিচয়" },
          noDescription: "কোনো বিবরণ দেওয়া হয়নি।",
          verified: "যাচাইকৃত",
          markVerified: "যাচাইকৃত হিসেবে চিহ্নিত করুন",
          noEvidence: "এখনো কোনো প্রমাণ যোগ করা হয়নি।",
          types: { SCREENSHOT: "স্ক্রিনশট", PDF: "PDF", AUDIO: "অডিও রেকর্ডিং", VIDEO: "ভিডিও", CHAT: "চ্যাট", EMAIL: "ইমেইল", BANK_STATEMENT: "ব্যাংক স্টেটমেন্ট" }
        },
        analysis: {
          noNarrative: "প্রথমে ঘটনার বিবরণ যোগ করুন।",
          title: "শ্রেণীবিভাগ এবং আইন",
          description: "আইনি বিশ্লেষণ পর্যালোচনা করুন।",
          detectedCategory: "শনাক্তকৃত বিভাগ",
          confidence: "নিশ্চitized",
          manualOverride: "ম্যানুয়াল ওভাররাইড"
        },
        review: {
          title: "পর্যালোচনা কেন্দ্র",
          description: "অভিযোগ এবং PDF তৈরি করার আগে কেস ফাইল যাচাই করুন।",
          noNarrative: "কোনো ঘটনার বিবরণ দেওয়া হয়নি।",
          classification: "শ্রেণীবিভাগ",
          notAnalyzed: "বিশ্লেষণ করা হয়নি",
          confidence: "নিশ্চিততা",
          pending: "অপেক্ষমান",
          mappedSections: "ম্যাপ করা বিভাগ",
          evidenceInventory: "প্রমাণের তালিকা",
          noEvidenceItems: "কোনো প্রমাণ যোগ করা হয়নি।",
          noDescription: "কোনো বিবরণ দেওয়া হয়নি।",
          verified: "যাচাইকৃত",
          pendingReview: "পর্যালোচনা অপেক্ষমান",
          financialLoss: "আর্থিক ক্ষতি",
          fields: { amount: "পরিমাণ", currency: "মুদ্রা", bank: "ব্যাংক", transactionId: "লেনদেন আইডি", paymentMethod: "পেমেন্ট পদ্ধতি", recoveryStatus: "পুনরুদ্ধার অবস্থা" },
          victim: "ভোক্তা",
          accused: "অভিযুক্ত",
          timeline: "সময়রেখা",
          noTimelineEvents: "সময়রেখায় কোনো ঘটনা যোগ করা হয়নি।",
          extractedEntities: "উদ্ধারকৃত পরিচয়",
          officialPacketTitle: "অফিসিয়াল প্যাকেট তৈরি",
          officialPacketDesc: "অভিযোগ প্যাকেট তৈরি করে।",
          generatePacket: { generating: "তৈরি হচ্ছে...", button: "প্যাকেট তৈরি করুন" },
          downloadPdf: "PDF ডাউনলোড করুন",
          exportSummary: "সারসংক্ষেপ রপ্তানি করুন",
          summary: { packetNumber: "প্যাকেট নম্বর", annexures: "সংযুক্তি", evidenceItems: "প্রমাণ", timelineEvents: "ঘটনা", mappedLaws: "আইনসমূহ", financialLossIncluded: "অন্তর্ভুক্ত", financialLossNotRecorded: "নথিভুক্ত নয়", pdfReady: "প্রস্তুত", pdfPending: "অপেক্ষমান", generated: "তৈরি হয়েছে" },
          pdfErrorPrefix: "PDF ত্রুটি:",
          annexurePreview: "সংযুক্তি প্রাকদর্শন",
          packetPreview: "প্যাকেট প্রাকদর্শন"
        },
        submission: {
          packagePreviewTitle: "অভিযোগ প্যাকেট প্রাকদর্শন",
          noPacket: "অফিসিয়াল অভিযোগ প্যাকেট এখনো তৈরি করা হয়নি।",
          packetNumber: "প্যাকেট নম্বর",
          annexures: "সংযুক্তি",
          summary: "সারসংক্ষেপ",
          summaryFormat: "{{evidenceCount}} প্রমাণ • {{timelineCount}} সময়রেখা ঘটনা"
        },
        checklist: {
          title: "জমাদানের চেকলিস্ট",
          allSet: "সব প্রস্তুত।",
          required: "প্রয়োজনীয়",
          recommended: "সুপারিশকৃত"
        },
        authority: { title: "সুপারিশকৃত কর্তৃপক্ষ" }
      }
    }
  },
  sd: {
    complaint: {
      coverTitle: "سرڪاري سائبر ڪرائم شڪايت پيڪٽ",
      packetNumberLabel: "پيڪٽ نمبر:",
      generatedAtLabel: "ٺهڻ جو وقت:",
      packetContentsLabel: "پيڪٽ جا مواد",
      mainComplaintLabel: "بنيادي شڪايت",
      signatureBlockLabel: "صحيح سيڪشن",
      subjectLabel: "موضوع:",
      declarationHeading: "7. اعلان",
      narrativeHeading: "1. واقعي جي تفصيل",
      timelineHeading: "2. واقعي جي ٽائم لائين",
      lossHeading: "3. مالي نقصان جا تفصيل",
      evidenceHeading: "4. ثبوت ۽ سڃاڻپ جي نشانين جو خلاصو",
      accusedHeading: "5. جوابدار جي معلومات",
      legalHeading: "6. لاڳو ٿيندڙ قانوني دفعا",
      signOff: "اوهان جو مخلص،",
      subjectTemplate: "سائبر ڪرائم واقعي بابت باضابطا شڪايت: {{category}}",
      salutation: "بخدمت جناب اسٽيشن هائوس آفيسر / سائبر ڪرائم سيل،",
      bodyIntroTemplate: "مان، {{victimName}}، احترام سان پنهنجي خلاف ٿيندڙ سائبر ڪرائم واقعي جي شڪايت درج ڪرائڻ لاءِ هي درخواست پيش ڪريان ٿو.",
      declarationTemplate: "مان، {{victimName}}، اعلان ڪريان ٿو ته هن شڪايت ۾ ڏنل معلومات منهنجي علم موجب سچي ۽ درست آهي. غلط معلومات ڏيڻ قانون مطابق سزا جوڳو ڏوهه آهي.\n\nتاريخ: {{dateStr}}\nجڳهه: _________________",
      preparedBy: "ٽرسٽ ليئر ليپس سينٽينيل ليگل AI پاران تيار ڪيل.",
      signatureLabel: "[صحيح]"
    },
    cyberJustice: {
      greeting: "مون کي سادي لفظن ۾ ٻڌايو ته ڇا ٿيو هو. مان سائبر ڪرائم جي درجي بندي ڪرڻ، ثبوت ڳولڻ ۽ شڪايت جو مسودو تيار ڪرڻ ۾ مدد ڪندس.",
      greetingShort: "مون کي سادي لفظن ۾ ٻڌايو ڇا ٿيو هو.",
      captured: "مون اهي تفصيل محفوظ ڪيا آهن. تجويز ڪيل تبديلين جو جائزو وٺو.",
      analysisResult: "مون هن واقعي کي {{confidence}}% يقين سان {{category}} طور درجي بندي ڪيو آهي.",
      phaseLabel: "فيز 2 ڪيس بلڊر",
      title: "سائبر جسٽس AI",
      button: {
        reset: "ري سيٽ",
        back: "واپس",
        analyze: "واقعي جو تجزيو ڪريو",
        analyzing: "تجزيي هيٺ...",
        next: "اڳلو مرحلو"
      },
      steps: {
        NARRATIVE: "تفصيل",
        ANALYSIS: "تجزيي",
        EVIDENCE: "ثبوت",
        TIMELINE: "ٽائم لائين",
        REVIEW: "جائزو"
      },
      questions: {
        "upi-utr": "ادائگي جو UTR، RRN يا حوالي نمبر ڇا آهي؟",
        "upi-amount": "هن واقعي ۾ ڪيتري رقم جو نقصان ٿيو؟",
        "phishing-url": "توهان کي ڪهڙو لنڪ يا ويب سائيٽ مليون يا کوليون؟",
        "phishing-email": "ڇا توهان وٽ موڪليندڙ جي اي ميل آئي ڊي آهي؟",
        "sextortion-platform": "هي ڌمڪيون ڪهڙي پليٽ فارم تي مليون هيون؟",
        "suspect-phone": "ڇا جوابدار ڪو فون نمبر استعمال ڪيو؟",
        "bank-name": "ٽرانزيڪشن لاءِ ڪهڙو بئنڪ اڪائونٽ يا ايپ استعمال ٿي؟",
        "evidence-refs": "توهان وٽ ڪهڙا ثبوت (اسڪرين شاٽس، چيٽس وغيره) موجود آهن؟",
        "general-narrative": "جيڪو ڪجهه ٿيو تنهن کي پنهنجي لفظن ۾ بيان ڪريو."
      },
      ui: {
        conversation: {
          title: "گفتگو جو اندراج",
          nextBestQuestion: "اڳلو بهترين سوال",
          proposedUpdates: "تجويز ڪيل ڪيس تبديليون تيار آهن.",
          apply: "لاڳو ڪريو",
          reject: "رد ڪريو",
          naturalUpdateLabel: "واقعي جي قدرتي تبديلي",
          placeholder: "تفصيل لکو...",
          send: "موڪليو"
        },
        header: {
          badge: "سائبر جسٽس AI فيز 2",
          title: "قانوني طور تيار سائبر ڪرائم ڪيس فائل ٺاهيو.",
          subtitle: "واقعي جو تجزيو، ثبوتن جو ذخيرو، ٽائم لائين بلڊر، ۽ PDF ايڪسپورٽ سڀ هڪ ئي ڪيس فائل جو حصو آهن."
        },
        emergency: {
          title: "هنگامي مالي فراڊ؟",
          desc: "فوري طور تي 1930 تي ڪال ڪريو ۽ پنهنجي رقم منجمد ڪرڻ لاءِ بئنڪ سان رابطو ڪريو."
        },
        legalOutput: {
          title: "قانوني انجڻ جو نتيجو",
          confidence: "يقين",
          noAnalysis: "درجي بندي ۽ قانون هتي ظاهر ٿيندا."
        },
        timeline: {
          title: "ٽائم لائين بلڊر",
          description: "گفتگو ۽ ثبوتن مان واقعا ٺاهيو.",
          action: {
            fromConversation: "گفتگو مان",
            fromEntities: "سڃاڻپن مان",
            fromEvidence: "ثبوتن مان"
          },
          field: {
            eventTitle: "واقعي جو عنوان",
            eventTitlePlaceholder: "رقم منتقل ٿي، لنڪ مليو...",
            timestamp: "وقت جي مهر",
            timestampPlaceholder: "2026-05-29T10:30:00+05:30",
            description: "تفصيل",
            descriptionPlaceholder: "تفصيل..."
          },
          option: { noLinkedEvidence: "ڪو به لاڳاپيل ثبوت ناهي" },
          button: { addEvent: "واقعو شامل ڪريو" },
          confirmed: "تصديق ٿيل",
          confirm: "تصديق ڪريو",
          noTimelineEvents: "ٽائم لائين ۾ ڪو واقعو ناهي."
        },
        evidence: {
          title: "ثبوتن جو ذخيرو",
          description: "ثبوتن جو رڪارڊ شامل ڪريو ۽ متن چسپا ڪريو.",
          label: { type: "ثبوت جي قسم" },
          name: { label: "نالو", placeholder: "بئنڪ اسٽيٽمينٽ..." },
          timestamp: { label: "وقت جي مهر", placeholder: "2026-05-29T10:30:00+05:30" },
          description: { label: "تفصيل", placeholder: "تفصيل..." },
          extractableLabel: "حاصل ڪيل متن",
          extractable: { placeholder: "چسپا ڪريو..." },
          addButton: "ثبوت شامل ڪريو",
          stat: { vaultItems: "ذخيري جون شيون", verified: "تصديق ٿيل", extracted: "حاصل ڪيل سڃاڻپون" },
          noDescription: "تفصيل ناهي ڏني وئي.",
          verified: "تصديق ٿيل",
          markVerified: "تصديق ٿيل نشان لڳايو",
          noEvidence: "اڃا تائين ڪو ثبوت شامل ناهي ڪيو ويو.",
          types: { SCREENSHOT: "اسڪرين شاٽ", PDF: "PDF", AUDIO: "آڊيو رڪارڊنگ", VIDEO: "ويڊيو", CHAT: "چيٽ", EMAIL: "اي ميل", BANK_STATEMENT: "بئنڪ اسٽيٽمينٽ" }
        },
        analysis: {
          noNarrative: "پهريان واقعي جي تفصيل شامل ڪريو.",
          title: "درجي بندي ۽ قانون",
          description: "قانوني تجزيي جو جائزو وٺو.",
          detectedCategory: "سڃاڻپ ٿيل زمرو",
          confidence: "يقين",
          manualOverride: "دستي تبديلي"
        },
        review: {
          title: "جائزي جو مرڪز",
          description: "شڪايت ۽ PDF ٺاهڻ کان پهرين ڪيس فائل جي تصديق ڪريو.",
          noNarrative: "واقعي جي تفصيل ناهي ڏني وئي.",
          classification: "درجي بندي",
          notAnalyzed: "تجزيي هيٺ ناهي",
          confidence: "يقين",
          pending: "پينڊنگ",
          mappedSections: "ميپ ٿيل سيڪشنز",
          evidenceInventory: "ثبوتن جي فهرست",
          noEvidenceItems: "ڪو به ثبوت شامل ناهي ڪيو ويو.",
          noDescription: "تفصيل ناهي ڏني وئي.",
          verified: "تصديق ٿيل",
          pendingReview: "جائزو پينڊنگ آهي",
          financialLoss: "مالي نقصان",
          fields: { amount: "رقم", currency: "ڪرنسي", bank: "بئنڪ", transactionId: "ٽرانزيڪشن آئي ڊي", paymentMethod: "ادائگي جو طريقو", recoveryStatus: "رڪوري جي صورتحال" },
          victim: "متاثر شخص",
          accused: "جوابدار",
          timeline: "ٽائم لائين",
          noTimelineEvents: "ٽائم لائين ۾ ڪو واقعو شامل ناهي ڪيو ويو.",
          extractedEntities: "حاصل ڪيل سڃاڻپون",
          officialPacketTitle: "سرڪاري پيڪٽ جي ٺهڻ",
          officialPacketDesc: "شڪايت جو پيڪٽ ٺاهي ٿو.",
          generatePacket: { generating: "ٺهي پيو...", button: "پيڪٽ ٺاهيو" },
          downloadPdf: "PDF ڊائون لوڊ ڪريو",
          exportSummary: "خلاصو ايڪسپورٽ ڪريو",
          summary: { packetNumber: "پيڪٽ نمبر", annexures: "منسلڪات", evidenceItems: "ثبوت", timelineEvents: "واقعا", mappedLaws: "قانون", financialLossIncluded: "شامل آهي", financialLossNotRecorded: "درج ناهي ڪيو ويو", pdfReady: "تيار آهي", pdfPending: "پينڊنگ آهي", generated: "ٺهيل" },
          pdfErrorPrefix: "PDF غلطي:",
          annexurePreview: "منسلڪ جو پريو",
          packetPreview: "پيڪٽ جو پريو"
        },
        submission: {
          packagePreviewTitle: "موڪليل پيڪٽ جو پريو",
          noPacket: "سرڪاري شڪايت جو پيڪٽ اڃا تائين تيار ناهي ڪيو ويو.",
          packetNumber: "پيڪٽ نمبر",
          annexures: "منسلڪات",
          summary: "خلاصو",
          summaryFormat: "{{evidenceCount}} ثبوت • {{timelineCount}} ٽائم لائين واقعا"
        },
        checklist: {
          title: "چيڪ لسٽ",
          allSet: "سڀ تيار آهي.",
          required: "ضروري",
          recommended: "تجويز ڪيل"
        },
        authority: { title: "تجويز ڪيل اختيارين" }
      }
    }
  },
  ml: {
    complaint: {
      coverTitle: "ഔദ്യോഗിക സൈബർ ക്രൈം പരാതി പാക്കറ്റ്",
      packetNumberLabel: "പാക്കറ്റ് നമ്പർ:",
      generatedAtLabel: "തയ്യാറാക്കിയ സമയം:",
      packetContentsLabel: "പാക്കറ്റ് ഉള്ളടക്കം",
      mainComplaintLabel: "പ്രധാന പരാതി",
      signatureBlockLabel: "ഒപ്പ് വിഭാഗം",
      subjectLabel: "വിഷയം:",
      declarationHeading: "7. സത്യപ്രസ്താവന",
      narrativeHeading: "1. സംഭവ വിവരണം",
      timelineHeading: "2. സംഭവ സമയക്രമം",
      lossHeading: "3. സാമ്പത്തിക നഷ്ട വിവരങ്ങൾ",
      evidenceHeading: "4. തെളിവുകളുടെയും വിവരങ്ങളുടെയും സംഗ്രഹം",
      accusedHeading: "5. പ്രതിയെക്കുറിച്ചുള്ള വിവരങ്ങൾ",
      legalHeading: "6. ബാധകമായ നിയമ വകുപ്പുകൾ",
      signOff: "വിശ്വസ്തതയോടെ,",
      subjectTemplate: "സൈബർ ക്രൈം സംഭവം സംബന്ധിച്ച ഔദ്യോഗിക പരാതി: {{category}}",
      salutation: "സ്റ്റേഷൻ ഹൗസ് ഓഫീസർ / സൈബർ ക്രൈം സെൽ മുൻപാകെ,",
      bodyIntroTemplate: "ഞാൻ, {{victimName}}, എനിക്കെതിരെ നടന്ന സൈബർ ക്രൈം സംഭവം റിപ്പോർട്ട് ചെയ്യുന്നതിനായി ഈ ഔദ്യോഗിക പരാതി സമർപ്പിക്കുന്നു.",
      declarationTemplate: "ഈ പരാതിയിൽ നൽകിയിട്ടുള്ള വിവരങ്ങൾ എന്റെ അറിവിലും വിശ്വാസത്തിലും സത്യവും കൃത്യവുമാണെന്ന് ഞാൻ ഇതിനാൽ പ്രഖ്യാപിക്കുന്നു. തെറ്റായ വിവരങ്ങൾ സമർപ്പിക്കുന്നത് നിയമപ്രകാരം ശിക്ഷാർഹമായ കുറ്റമാണ്.\n\nതീയതി: {{dateStr}}\nസ്ഥലം: _________________",
      preparedBy: "ട്രസ്റ്റ് ലെയർ ലാബ്സ് സെന്റിനൽ ലീഗൽ AI വഴി തയ്യാറാക്കിയത്.",
      signatureLabel: "[ഒപ്പ്]"
    },
    cyberJustice: {
      greeting: "എന്താണ് സംഭവിച്ചതെന്ന് ലളിതമായ വാക്കുകളിൽ പറയുക. സൈബർ കുറ്റകൃത്യങ്ങളെ തരംതിരിക്കാനും, തെളിവുകൾ കണ്ടെത്താനും, സമയക്രമം നിർമ്മിക്കാനും, പരാതിയുടെ കരട് തയ്യാറാക്കാനും ഞാൻ സഹായിക്കും.",
      greetingShort: "എന്താണ് സംഭവിച്ചതെന്ന് ലളിതമായ വാക്കുകളിൽ പറയുക.",
      captured: "ഞാൻ ആ വിവരങ്ങൾ രേഖപ്പെടുത്തിയിട്ടുണ്ട്. നിർദ്ദിഷ്ട വിവരങ്ങൾ അവലോകനം ചെയ്യുക.",
      analysisResult: "ഞാൻ ഈ സംഭവത്തെ {{confidence}}% കൃത്യതയോടെ {{category}} ആയി തരംതിരിച്ചിരിക്കുന്നു.",
      phaseLabel: "ഘട്ടം 2 കേസ് ബിൽഡർ",
      title: "സൈബർ ജസ്റ്റിസ് AI",
      button: {
        reset: "റീസെറ്റ്",
        back: "പിന്നിലേക്ക്",
        analyze: "സംഭവം വിശകലനം ചെയ്യുക",
        analyzing: "വിശകലനം ചെയ്യുന്നു...",
        next: "അടുത്ത ഘട്ടം"
      },
      steps: {
        NARRATIVE: "വിവരണം",
        ANALYSIS: "വിശകലനം",
        EVIDENCE: "തെളിവുകൾ",
        TIMELINE: "സമയക്രമം",
        REVIEW: "അവലോകനം"
      },
      questions: {
        "upi-utr": "പണമിടപാടിനുള്ള UTR, RRN അല്ലെങ്കിൽ റഫറൻസ് നമ്പർ എന്താണ്?",
        "upi-amount": "ഈ സംഭവത്തിൽ എത്ര പണം നഷ്ടപ്പെട്ടു?",
        "phishing-url": "നിങ്ങൾക്ക് ലഭിച്ചതോ തുറന്നതോ ആയ സംശയാസ്പദമായ ലിങ്ക് അല്ലെങ്കിൽ വെബ്സൈറ്റ് ഏതാണ്?",
        "phishing-email": "അയച്ചയാളുടെ ഇമെയിൽ വിലാസം നിങ്ങളുടെ പക്കലുണ്ടോ?",
        "sextortion-platform": "ഈ ഭീഷണികൾ ഏത് പ്ലാറ്റ്‌ഫോമിലാണ് സംഭവിച്ചത്?",
        "suspect-phone": "പ്രതി ഏതെങ്കിലും ഫോൺ നമ്പർ ഉപയോഗിച്ചിരുന്നോ?",
        "bank-name": "ഇടപാടിനായി ഏത് ബാങ്ക് അക്കൗണ്ടോ ആപ്പോ ആണ് ഉപയോഗിച്ചത്?",
        "evidence-refs": "സ്ക്രീൻഷോട്ടുകൾ, ചാറ്റുകൾ തുടങ്ങിയ നിങ്ങളുടെ പക്കലുള്ള തെളിവുകൾ എന്തൊക്കെയാണ്?",
        "general-narrative": "സംഭവിച്ചത് നിങ്ങളുടെ സ്വന്തം വാക്കുകളിൽ വിവരിക്കുക."
      },
      ui: {
        conversation: {
          title: "സംഭാഷണം രേഖപ്പെടുത്തൽ",
          nextBestQuestion: "അടുത്ത മികച്ച ചോദ്യം",
          proposedUpdates: "നിർദ്ദേശിച്ച കേസ് വിവരങ്ങൾ അവലോകനത്തിന് തയ്യാറാണ്.",
          apply: "ബാധകമാക്കുക",
          reject: "നിരസിക്കുക",
          naturalUpdateLabel: "സ്വാഭാവിക സംഭവ വിവരണം",
          placeholder: "വിവരങ്ങൾ രേഖപ്പെടുത്തുക...",
          send: "അയക്കുക"
        },
        header: {
          badge: "സൈബർ ജസ്റ്റിസ് AI ഘട്ടം 2",
          title: "നിയമപരമായി തയ്യാറാക്കിയ സൈബർ ക്രൈം കേസ് ഫയൽ നിർമ്മിക്കുക.",
          subtitle: "സംഭവ വിശകലനം, തെളിവ് സൂക്ഷിപ്പുകേന്ദ്രം, സമയക്രമം നിർമ്മിക്കൽ, PDF കയറ്റുമതി എന്നിവയെല്ലാം ഒരു കേസ് ഫയലിൽ പങ്കിടുന്നു."
        },
        emergency: {
          title: "അടിയന്തിര സാമ്പത്തിക തട്ടിപ്പോ?",
          desc: "ഉടൻ തന്നെ 1930 എന്ന നമ്പറിലേക്ക് വിളിക്കുക, അക്കൗണ്ട് മരവിപ്പിക്കാൻ നിങ്ങളുടെ ബാങ്കുമായി ബന്ധപ്പെടുക."
        },
        legalOutput: {
          title: "നിയമപരമായ ഫലം",
          confidence: "കൃത്യത",
          noAnalysis: "വിശകലനത്തിന് ശേഷം തരംതിരിവും നിയമങ്ങളും ഇവിടെ ദൃശ്യമാകും."
        },
        timeline: {
          title: "സമയക്രമം നിർമ്മിക്കൽ",
          description: "സംഭാഷണത്തിൽ നിന്നും തെളിവുകളിൽ നിന്നും സംഭവങ്ങൾ സൃഷ്ടിക്കുക.",
          action: {
            fromConversation: "സംഭാഷണത്തിൽ നിന്ന്",
            fromEntities: "വിവരങ്ങളിൽ നിന്ന്",
            fromEvidence: "തെളിവുകളിൽ നിന്ന്"
          },
          field: {
            eventTitle: "സംഭവത്തിന്റെ പേര്",
            eventTitlePlaceholder: "പണം കൈമാറി, ലിങ്ക് ലഭിച്ചു...",
            timestamp: "സമയ മുദ്ര",
            timestampPlaceholder: "2026-05-29T10:30:00+05:30",
            description: "വിവരണം",
            descriptionPlaceholder: "വിവരങ്ങൾ..."
          },
          option: { noLinkedEvidence: "ബന്ധിപ്പിച്ച തെളിവുകളൊന്നുമില്ല" },
          button: { addEvent: "സംഭവം ചേർക്കുക" },
          confirmed: "സ്ഥിരീകരിച്ചു",
          confirm: "സ്ഥിരീകരിക്കുക",
          noTimelineEvents: "സമയക്രമത്തിൽ സംഭവങ്ങളൊന്നുമില്ല."
        },
        evidence: {
          title: "തെളിവ് സൂക്ഷിപ്പുകേന്ദ്രം",
          description: "തെളിവുകൾ ചേർത്ത് വിവരങ്ങൾ നൽകുക.",
          label: { type: "തെളിവ് തരം" },
          name: { label: "പേര്", placeholder: "ബാങ്ക് സ്റ്റേറ്റ്മെന്റ്..." },
          timestamp: { label: "സമയ മുദ്ര", placeholder: "2026-05-29T10:30:00+05:30" },
          description: { label: "വിവരണം", placeholder: "വിവരങ്ങൾ..." },
          extractableLabel: "തിരഞ്ഞെടുക്കാവുന്ന വാചകം",
          extractable: { placeholder: "പേസ്റ്റ് ചെയ്യുക..." },
          addButton: "തെളിവ് ചേർക്കുക",
          stat: { vaultItems: "സൂക്ഷിപ്പ് വസ്തുക്കൾ", verified: "സ്ഥിരീകരിച്ചു", extracted: "ലഭിച്ച വിവരങ്ങൾ" },
          noDescription: "വിവരണം നൽകിയിട്ടില്ല.",
          verified: "സ്ഥിരീകരിച്ചു",
          markVerified: "സ്ഥിരീകരിച്ചതായി അടയാളപ്പെടുത്തുക",
          noEvidence: "തെളിവുകളൊന്നും ഇതുവരെ ചേർത്തിട്ടില്ല.",
          types: { SCREENSHOT: "സ്ക്രീൻഷോട്ട്", PDF: "PDF", AUDIO: "ഓഡിയോ റെക്കോർഡിംഗ്", VIDEO: "വീഡിയോ", CHAT: "ചാറ്റ്", EMAIL: "ഇമെയിൽ", BANK_STATEMENT: "ബാങ്ക് സ്റ്റേറ്റ്മെന്റ്" }
        },
        analysis: {
          noNarrative: "ആദ്യം സംഭവ വിവരണം ചേർക്കുക.",
          title: "തരംതിരിവും നിയമങ്ങളും",
          description: "നിയമ വിശകലനം അവലോകനം ചെയ്യുക.",
          detectedCategory: "കണ്ടെത്തിയ വിഭാഗം",
          confidence: "കൃത്യത",
          manualOverride: "സ്വമേധയാ മാറ്റം വരുത്തുക"
        },
        review: {
          title: "അവലോകന കേന്ദ്രം",
          description: "പരാതിയും PDF-ഉം നിർമ്മിക്കുന്നതിന് മുൻപ് കേസ് ഫയൽ സ്ഥിരീകരിക്കുക.",
          noNarrative: "സംഭവ വിവരണം നൽകിയിട്ടില്ല.",
          classification: "തരംതിരിവ്",
          notAnalyzed: "വിശകലനം ചെയ്തിട്ടില്ല",
          confidence: "കൃത്യത",
          pending: "തീരുമാനമാകാത്തത്",
          mappedSections: "മാപ്പ് ചെയ്ത വിഭാഗങ്ങൾ",
          evidenceInventory: "തെളിവുകളുടെ പട്ടിക",
          noEvidenceItems: "തെളിവുകളൊന്നും ചേർത്തിട്ടില്ല.",
          noDescription: "വിവരണം നൽകിയിട്ടില്ല.",
          verified: "സ്ഥിരീകരിച്ചു",
          pendingReview: "അവലോകനം തീർച്ചപ്പെടുത്തിയിട്ടില്ല",
          financialLoss: "സാമ്പത്തിക നഷ്ടം",
          fields: { amount: "തുക", currency: "കറൻസി", bank: "ബാങ്ക്", transactionId: "ഇടപാട് ഐഡി", paymentMethod: "പേയ്‌മെന്റ് രീതി", recoveryStatus: "തിരിച്ചുപിടിക്കൽ നില" },
          victim: "ഇരയായ വ്യക്തി",
          accused: "പ്രതി",
          timeline: "സമയക്രമം",
          noTimelineEvents: "സമയക്രമത്തിൽ സംഭവങ്ങളൊന്നും ചേർത്തിട്ടില്ല.",
          extractedEntities: "ലഭിച്ച വിവരങ്ങൾ",
          officialPacketTitle: "ഔദ്യോഗിക പാക്കറ്റ് നിർമ്മാണം",
          officialPacketDesc: "പരാതി പാക്കറ്റ് നിർമ്മിക്കുന്നു.",
          generatePacket: { generating: "നിർമ്മിക്കുന്നു...", button: "പാക്കറ്റ് നിർമ്മിക്കുക" },
          downloadPdf: "PDF ഡൗൺലോഡ് ചെയ്യുക",
          exportSummary: "സംഗ്രഹം കയറ്റുമതി ചെയ്യുക",
          summary: { packetNumber: "പാക്കറ്റ് നമ്പർ", annexures: "അനുബന്ധങ്ങൾ", evidenceItems: "തെളിവുകൾ", timelineEvents: "സംഭവങ്ങൾ", mappedLaws: "നിയമങ്ങൾ", financialLossIncluded: "ഉൾപ്പെടുത്തിയിട്ടുണ്ട്", financialLossNotRecorded: "രേഖപ്പെടുത്തിയിട്ടില്ല", pdfReady: "തയ്യാറാണ്", pdfPending: "തീരുമാനമാകാത്തത്", generated: "നിർമ്മിച്ചു" },
          pdfErrorPrefix: "PDF പിശക്:",
          annexurePreview: "അനുബന്ധം പ്രിവ്യൂ",
          packetPreview: "പാക്കറ്റ് പ്രിവ്യൂ"
        },
        submission: {
          packagePreviewTitle: "സമർപ്പിച്ച പാക്കറ്റ് പ്രിവ്യൂ",
          noPacket: "ഔദ്യോഗിക പരാതി പാക്കറ്റ് ഇതുവരെ നിർമ്മിച്ചിട്ടില്ല.",
          packetNumber: "പാക്കറ്റ് നമ്പർ",
          annexures: "അനുബന്ധങ്ങൾ",
          summary: "സംഗ്രഹം",
          summaryFormat: "{{evidenceCount}} തെളിവുകൾ • {{timelineCount}} സമയക്രമ സംഭവങ്ങൾ"
        },
        checklist: {
          title: "സമർപ്പിക്കൽ ചെക്ക്‌ലിസ്റ്റ്",
          allSet: "എല്ലാം സജ്ജമാണ്.",
          required: "ആവശ്യമായത്",
          recommended: "ശുപാർശ ചെയ്യുന്നത്"
        },
        authority: { title: "ശുപാർശ ചെയ്യുന്ന അധികാരികൾ" }
      }
    }
  }
};

const targets = Object.keys(TRANSLATIONS);

targets.forEach(lng => {
  const filePath = path.join('src/i18n/locales', lng, 'translation.json');
  if (!fs.existsSync(filePath)) {
    console.log(`File for ${lng} not found.`);
    return;
  }
  const original = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const updated = {
    ...original,
    complaint: TRANSLATIONS[lng].complaint,
    cyberJustice: TRANSLATIONS[lng].cyberJustice
  };
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`Successfully merged translations for: ${lng}`);
});
