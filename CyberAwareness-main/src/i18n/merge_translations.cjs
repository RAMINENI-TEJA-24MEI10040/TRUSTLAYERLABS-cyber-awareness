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
      bodyIntroTemplate: "I, {{victimName}}, respectfully submit this formal complaint to report a cybercrime incident that has occurred against me.",
      declarationTemplate: "I, {{victimName}}, hereby declare that the information provided in this complaint is true and accurate to the best of my knowledge and belief. I understand that submitting false information is a punishable offense under law.\n\nDate: {{dateStr}}\nPlace: _________________",
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
          title: "சமர்ப்பித்தல் சரிபார்ப்பு பட்டியல்",
          allSet: "அனைத்தும் தயார்.",
          required: "தேவைப்படும்",
          recommended: "பரிந்துரைக்கப்படும்"
        },
        authority: { title: "பரிந்துரைக்கப்படும் அதிகாரிகள்" },
        engines: {
          timeline: {
            suggestions: {
              instagram: { title: "இன்ஸ்டாகிராம் தொடர்பு நிறுவப்பட்டது", description: "சந்தேக நபர் முதலில் இன்ஸ்டாகிராம் மூலம் தொடர்பு கொண்டார்.", reason: "சமூக ஊடக தளம் விவரிக்கப்பட்டுள்ளது." },
              videoCall: { title: "காணொளி அழைப்பு உரையாடல் நிகழ்ந்தது", description: "காணொளி அழைப்பு பரிமாற்றம் நடைபெற்றது.", reason: "காணொளி அழைப்பு விவரிக்கப்பட்டுள்ளது." },
              recording: { title: "பதிவு அல்லது காட்சிகள் கைப்பற்றப்பட்டன", description: "பதிவு செய்யப்பட்ட காட்சிகள் குறிப்பிடப்பட்டுள்ளன.", reason: "பதிவு மிரட்டல் காலவரிசையை நிறுவுகிறது." },
              threat: { title: "மிரட்டல் விடுக்கப்பட்டது", description: "நேரடி மிரட்டல் அல்லது பணம் கோரப்பட்டது.", reason: "மிரட்டல் மொழி கண்டறியப்பட்டது." },
              paymentDemand: { title: "கட்டண கோரிக்கை விடுக்கப்பட்டது", description: "பணம் கோரப்பட்ட விவரம் குறிப்பிடப்பட்டுள்ளது.", reason: "நிதி கோரிக்கைகள் காலவரிசைக்கு முக்கியம்." },
              narrative: { title: "சம்பவம் விவரிக்கப்பட்டது", reason: "சம்பவத்தின் விவரங்கள் விவரிக்கப்பட்டுள்ளன." },
              evidence: { title: "{{type}} சான்று உள்ளது", description: "{{name}}: {{desc}}", defaultDescription: "சான்று சேர்க்கப்பட்டது.", reason: "சான்றுக்கு நேர முத்திரை உள்ளது." }
            },
            entityGroups: {
              utr: { title: "UTR/RRN கண்டறியப்பட்டது" },
              upi: { title: "UPI ஐடி கண்டறியப்பட்டது" },
              url: { title: "சந்தேகத்திற்குரிய URL கண்டறியப்பட்டது" },
              contact: { title: "சந்தேக நபரின் தொடர்பு கண்டறியப்பட்டது" },
              wallet: { title: "வாலட் ஐடி கண்டறியப்பட்டது" },
              reason: "காலவரிசைக்கு தேவையான விவரங்களை கண்டறிந்துள்ளது."
            }
          },
          emergency: {
            preserveEvidence: { title: "ஆதாரங்களைப் பாதுகாக்கவும்", detail: "திரைக்காட்சிகளை எடுத்து செய்திகளைச் சேமிக்கவும்." },
            contactHelpline: { title: "1930 ஐ அழைக்கவும்", detail: "உடனடி உதவிக்கு 1930 என்ற எண்ணைத் தொடர்பு கொள்ளவும்." },
            call1930: { title: "1930 ஐ அழைக்கவும்", detail: "தேசிய சைபர் கிரைம் உதவி எண்ணை அழைக்கவும்." },
            contactBank: { title: "உங்கள் வங்கியைத் தொடர்பு கொள்ளவும்", detail: "கணக்கை முடக்க வங்கியைத் தொடர்பு கொள்ளவும்." },
            otpCall: { title: "1930 ஐ அழைக்கவும்", detail: "உடனடியாக உதவி எண்ணை அழைக்கவும்." },
            notifyBank: { title: "வங்கிக்குத் தெரிவிக்கவும்", detail: "கணக்கை முடக்கக் கோரவும், கடவுச்சொற்களை மாற்றவும்." },
            preservePhishing: { title: " மாதிரியைப் பாதுகாக்கவும்", detail: "மின்னஞ்சல் மற்றும் URL ஐ சேமிக்கவும்." },
            doNotClick: { title: "இணைப்புகளைக் கிளிக் செய்ய வேண்டாம்", detail: "சந்தேகத்திற்குரிய இணைப்பை கிளிக் செய்ய வேண்டாம்." },
            reportPlatform: { title: "தளத்திற்குப் புகாரளிக்கவும்", detail: "மோசடி பக்கத்தை புகாரளிக்கவும்." },
            doNotPay: { title: "பணம் செலுத்த வேண்டாம்", detail: "மிரட்டுபவர்களுக்குப் பணம் செலுத்த வேண்டாம்." },
            contactPolice: { title: "சைபர் போலீஸைத் தொடர்பு கொள்ளவும்", detail: "உள்ளூர் சைபர் பிரிவு மற்றும் தேசிய போர்ட்டலில் புகார் செய்யவும்." },
            blockReport: { title: "தடுத்துப் புகாரளிக்கவும்", detail: "மோசடியாளரைத் தடுத்து தகுந்த அதிகாரிகளுக்குப் புகாரளிக்கவும்." },
            freezeAccounts: { title: "பாதிக்கப்பட்ட கணக்குகளை முடக்கவும்", detail: "கணக்குகளைப் பாதுகாக்க வங்கிகளைத் தொடர்பு கொள்ளவும்." },
            collectProof: { title: "ஆதாரங்களைச் சேகரிக்கவும்", detail: "போலி கணக்குகள் மற்றும் பரிவர்த்தனை ஆதாரங்களைச் சேகரிக்கவும்." },
            changeCredentials: { title: "கடவுச்சொற்களை மாற்றவும்", detail: "உடனடியாக கடவுச்சொற்களை மாற்றி MFA ஐ இயக்கவும்." },
            notifyPlatforms: { title: "தளங்களுக்குத் தெரிவிக்கவும்", detail: "சேவை வழங்குநர்களுக்குத் தெரிவித்து வழிகாட்டுதலைப் பின்பற்றவும்." },
            reportCert: { title: "CERT-In க்குப் புகாரளிக்கவும்", detail: "தொழில்நுட்ப உதவிக்கு CERT-In க்குப் புகாரளிக்கவும்." },
            isolateSystems: { title: "சிஸ்டம்களைத் தனிமைப்படுத்தவும்", detail: "சம்பந்தப்பட்ட சாதனங்களை நெட்வொர்க்கிலிருந்து துண்டிக்கவும்." },
            preserveLogs: { title: "பதிவுகளைப் பாதுகாக்கவும்", detail: "ஆய்வுக்காக சிஸ்டம் பதிவுகள் மற்றும் நேர முத்திரைகளைப் பாதுகாக்கவும்." }
          },
          evidence: {
            recommendations: {
              "upi-transaction-screenshot": { title: "பரிவர்த்தனை திரைக்காட்சி", description: "பரிவர்த்தனை விவரங்களைக் காட்டும் திரைக்காட்சி.", reason: "பரிவர்த்தனை விவரங்களை நிரூபிக்கிறது." },
              "upi-bank-statement": { title: "வங்கி கணக்கு அறிக்கை", description: "பணம் எடுக்கப்பட்ட வங்கி அறிக்கை.", reason: "நிதி இழப்பை உறுதிப்படுத்துகிறது." },
              "phishing-page-record": { title: "பிஷிங் பக்கம் அல்லது செய்திப் பதிவு", description: "பிஷிங் பக்கத்தை அல்லது செய்தியைப் பதிவேற்றவும்.", reason: "மோசடி பாதையைப் பாதுகாக்கிறது." },
              "sextortion-threat-record": { title: "மிரட்டல் செய்திகள் அல்லது பதிவுகள்", description: "மிரட்டல்களைக் காட்டும் அரட்டை அல்லது கோப்புகள்.", reason: "மிரட்டல் குற்றச்சாட்டுகளுக்கு முக்கியம்." },
              "profile-impersonation-proof": { title: "ஆள்மாறாட்ட ஆதாரம்", description: "போலி சுயவிவரங்களின் திரைக்காட்சிகள்.", reason: "குற்றம் சாட்டப்பட்டவரின் அடையாளத்தை இணைக்கிறது." },
              "crypto-wallet-transaction": { title: "வாலட் அல்லது பரிவர்த்தனை பதிவு", description: "வாலட் பரிமாற்ற ஆதாரங்கள்.", reason: "வாலட் முகவரிகளைப் புகாரோடு இணைக்கிறது." },
              "communication-history": { title: "தொடர்பு வரலாறு", description: "சந்தேக நபர் தொடர்பு கொண்ட அரட்டைகள்.", reason: "தொடர்பு முறைகளை விளக்குகிறது." }
            }
          },
          authority: {
            nationalPortal: { name: "தேசிய சைபர் கிரைம் போர்டல்", notes: "சைபர் குற்றப் புகார்களுக்கான அதிகாரப்பூர்வ அரசு போர்ட்டல்" },
            cyberPolice: { name: "சைபர் போலீஸ் (உள்ளூர் சைபர் பிரிவு)", notes: "அருகிலுள்ள சைபர் காவல் நிலையத்தை அணுகவும்" },
            nationalHelpline: { name: "தேசிய சைபர் கிரைம் உதவி எண்", notes: "அவசர உதவிக்கு அழைக்கவும்" },
            cert: { name: "CERT-In", notes: "இந்திய கணினி அவசரக்கால பதிலளிப்புக் குழு" },
            phishing: { notes: "பிஷிங் சம்பவங்களைப் புகாரளிக்கவும்", localNotes: "உள்ளூர் பிரிவில் எஃப்ஐஆர் பதிவு செய்யவும்", certNotes: "அறிக்கைகளை CERT-In ஏற்றுக்கொள்கிறது" },
            dataBreach: { certNotes: "தரவு கசிவுகளைப் புகாரளிக்கவும்", localNotes: "உள்ளூர் பிரிவைத் தொடர்பு கொள்ளவும்" },
            hacking: { certNotes: "ஹேக்கிங் சம்பவங்களைப் புகாரளிக்கவும்", localNotes: "உள்ளூர் பிரிவைத் தொடர்பு கொள்ளவும்" }
          },
          law: {
            evidenceNeeds: {
              financial: { label: "பரிவர்த்தனை மற்றும் வங்கி ஆதாரம்", description: "பரிவர்த்தனை திரைக்காட்சி அல்லது வங்கி அறிக்கை." },
              communication: { label: "சந்தேக நபரின் தொடர்பு", description: "மிரட்டல் அல்லது ஏமாற்றுதலைக் காட்டும் அரட்டைகள்." },
              identity: { label: "ஆள்மாறாட்டம் அல்லது கணக்கு ஆதாரம்", description: "போலி சுயவிவரங்கள்." },
              platform: { label: "தளப் பதிவு", description: "சுயவிவர URL அல்லது செய்தி ஏற்றுமதி." }
            },
            whyMapped: "{{category}}க்காக மேப் செய்யப்பட்டுள்ளது."
          },
          questions: {
            reasons: {
              "upi-utr": "பரிவர்த்தனை எண்கள் Tracing செய்ய உதவுகின்றன.",
              "upi-amount": "புகாருக்கு இழப்புத் தொகை தேவைப்படுகிறது.",
              "phishing-url": "பிஷிங் விசாரணைக்கு URL முக்கியமானது.",
              "phishing-email": "மின்னஞ்சல் முகவரிகள் கண்டறிய உதவுகின்றன.",
              "sextortion-platform": "கணக்குகளை முடக்க தளம் தேவை.",
              "suspect-phone": "தொலைபேசி எண்கள் முக்கியமானவை.",
              "bank-name": "வங்கி விவரங்கள் தேவை.",
              "evidence-refs": "சான்றுகள் தேவை.",
              "general-narrative": "சம்பவ விவரிப்பு முதலில் தேவை."
            }
          },
          adapters: {
            packetHeader: "அதிகாரப்பூர்வ சைபர் கிரைம் புகார் தொகுப்பு",
            packetNumber: "தொகுப்பு எண்",
            generatedAt: "உருவாக்கப்பட்ட நேரம்",
            subject: "பொருள்",
            annexureIndex: "இணைப்பு அட்டவணை",
            item: "பொருள்",
            items: "பொருட்கள்",
            signatureBlock: "கையெழுத்து பிரிவு",
            complainantSignature: "புகார்தாரர் கையெழுத்து",
            name: "பெயர்",
            date: "தேதி",
            financialLossHeading: "விரிவாக்கப்பட்ட நிதி இழப்பு விவரங்கள்"
          },
          store: {
            userMentioned: "பயனர் {{keyword}} ஐக் குறிப்பிட்டுள்ளார்"
          }
        }
      }
    }
  }
};

// Auto-fill fallback English keys to prevent missing keys on other target languages (te, gu, ur, bn, sd, ml)
const en = JSON.parse(fs.readFileSync(path.join(__dirname, 'locales', 'en', 'translation.json'), 'utf8'));
const targetCodes = ['te', 'gu', 'ur', 'bn', 'sd', 'ml'];

targetCodes.forEach(code => {
  TRANSLATIONS[code] = {
    complaint: {},
    cyberJustice: {}
  };
  
  // Clone structures from English as fallback baseline
  TRANSLATIONS[code].complaint = JSON.parse(JSON.stringify(en.complaint));
  TRANSLATIONS[code].cyberJustice = JSON.parse(JSON.stringify(en.cyberJustice));
  
  // Add localized translations for core/button/step levels to keep it friendly, while long engines fallback cleanly to English (or simple versions)
  if (code === 'te') {
    TRANSLATIONS[code].cyberJustice.title = "సైబర్ జస్టిస్ AI";
    TRANSLATIONS[code].cyberJustice.greeting = "ఏం జరిగిందో సాధారణ పదాలలో చెప్పండి. సైబర్ క్రైమ్‌ను వర్గీకరించడంలో సహాయం చేస్తాను.";
    TRANSLATIONS[code].cyberJustice.greetingShort = "ఏం జరిగిందో సాధారణ పదాలలో చెప్పండి.";
    TRANSLATIONS[code].cyberJustice.captured = "నేను ఆ వివరాలను నమోదు చేసాను. ధృవీకరించండి.";
  } else if (code === 'bn') {
    TRANSLATIONS[code].cyberJustice.title = "সাইবার জাস্টিস এআই";
    TRANSLATIONS[code].cyberJustice.greeting = "সহজ ভাষায় বলুন কী ঘটেছিল। আমি সাইবার অপরাধের শ্রেণীবিভাগ করতে সাহায্য করব।";
    TRANSLATIONS[code].cyberJustice.greetingShort = "সহজ ভাষায় বলুন কী ঘটেছিল।";
    TRANSLATIONS[code].cyberJustice.captured = "আমি সেই বিবরণগুলি নথিভুক্ত করেছি।";
  } else if (code === 'gu') {
    TRANSLATIONS[code].cyberJustice.title = "સાયબર જસ્ટિસ AI";
    TRANSLATIONS[code].cyberJustice.greeting = "શું થયું તે સરળ શબ્દોમાં કહો. હું સાયબર ક્રાઈમનું વર્ગીકરણ કરવા મદદ કરીશ.";
    TRANSLATIONS[code].cyberJustice.greetingShort = "શું થયું તે સરળ શબ્દોમાં કહો.";
  } else if (code === 'ur') {
    TRANSLATIONS[code].cyberJustice.title = "سائبر جسٹس AI";
    TRANSLATIONS[code].cyberJustice.greeting = "سادہ الفاظ میں بتائیں کہ کیا ہوا تھا۔ میں سائبر کرائم کی درجہ بندی کروں گا۔";
  } else if (code === 'ml') {
    TRANSLATIONS[code].cyberJustice.title = "സൈബർ ജസ്റ്റിസ് AI";
    TRANSLATIONS[code].cyberJustice.greeting = "എന്താണ് സംഭവിച്ചതെന്ന് ലളിതമായ വാക്കുകളിൽ പറയുക. ഞാൻ സഹായിക്കാം.";
  }
});

const allTargets = ['ta', 'te', 'gu', 'ur', 'bn', 'sd', 'ml'];

allTargets.forEach(lng => {
  const filePath = path.join(__dirname, 'locales', lng, 'translation.json');
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
