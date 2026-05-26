window.QRScamData = {
  scenarios: [
    {
      id: "metro-refund",
      title: "Metro refund QR",
      source: "Sticker on ticket counter",
      url: "https://paytm-refund-secure.in/upi/collect?pa=refund@upi&am=2499",
      verdict: "scam",
      risk: 92,
      amount: "INR 2,499",
      merchant: "Delhi Metro Refund Desk",
      indicators: [
        {
          type: "danger",
          title: "Look-alike payment domain",
          detail: "The URL imitates a trusted brand but uses an unrelated domain ending in .in."
        },
        {
          type: "danger",
          title: "Collect request disguised as refund",
          detail: "Refunds do not require you to approve a UPI collect request or enter a PIN."
        },
        {
          type: "danger",
          title: "Urgent amount prompt",
          detail: "The flow tries to rush a high-value approval before you inspect the payee."
        }
      ],
      lesson: "Never approve a UPI collect request to receive money. Check the payee VPA and app warning screen."
    },
    {
      id: "cafe-menu",
      title: "Cafe table menu",
      source: "Printed QR on restaurant table",
      url: "https://bluebean.example/menu",
      verdict: "safe",
      risk: 18,
      amount: "No payment requested",
      merchant: "Blue Bean Cafe",
      indicators: [
        {
          type: "safe",
          title: "Read-only destination",
          detail: "The QR opens a menu page and does not ask for payment, OTP, PIN, or login."
        },
        {
          type: "safe",
          title: "Matches visible business name",
          detail: "The destination and table branding match the venue context."
        }
      ],
      lesson: "A QR is safer when it opens information only. Still inspect the URL before entering data."
    },
    {
      id: "parking-fine",
      title: "Parking fine notice",
      source: "Loose paper on windshield",
      url: "http://m-parkingpay.co/fastpay?vehicle=DL01AB1234",
      verdict: "scam",
      risk: 87,
      amount: "INR 1,850",
      merchant: "Traffic Penalty Portal",
      indicators: [
        {
          type: "danger",
          title: "Unverified short domain",
          detail: "Government payment pages should use official domains, not random short payment sites."
        },
        {
          type: "danger",
          title: "Plain HTTP",
          detail: "The destination is not encrypted, so payment data could be exposed."
        },
        {
          type: "danger",
          title: "Unexpected physical sticker",
          detail: "Scammers often paste fake QR codes over real notices or place loose slips."
        }
      ],
      lesson: "Use the official city or traffic police portal typed manually, not a QR from a loose notice."
    },
    {
      id: "charity-drive",
      title: "Flood relief donation",
      source: "Forwarded WhatsApp poster",
      url: "upi://pay?pa=relief-help-2026@oksbi&pn=National%20Relief%20Fund&am=5000",
      verdict: "scam",
      risk: 76,
      amount: "INR 5,000",
      merchant: "National Relief Fund",
      indicators: [
        {
          type: "danger",
          title: "Impersonated charity name",
          detail: "The display name looks official but the VPA is a personal-looking alias."
        },
        {
          type: "danger",
          title: "Pre-filled amount",
          detail: "A large amount is already filled, a common pressure tactic in donation scams."
        }
      ],
      lesson: "Donate through official verified websites or VPAs published on trusted government channels."
    }
  ],
  challengeQuestions: [
    {
      title: "UPI collect after scanning a refund QR",
      context: "A QR at a railway kiosk says Scan to receive refund. Your UPI app opens a collect request for INR 1,999 and asks for PIN.",
      answer: "scam",
      clue: "Receiving money should not require your UPI PIN. PIN means money can leave your account."
    },
    {
      title: "Restaurant QR opens static menu",
      context: "A QR printed on the bill opens the restaurant website menu. No login, payment, OTP, or app install is requested.",
      answer: "safe",
      clue: "Information-only QR destinations are lower risk when the URL matches the venue."
    },
    {
      title: "KYC update QR from SMS",
      context: "An SMS says your wallet will be blocked in 20 minutes. The QR opens a page asking PAN, OTP, and card details.",
      answer: "scam",
      clue: "Urgency plus OTP or card data collection is a strong phishing signal."
    },
    {
      title: "Official invoice QR",
      context: "A known vendor invoice includes a QR that opens your banking app with the same merchant name and exact invoice amount.",
      answer: "safe",
      clue: "Known context, matching merchant, and expected amount reduce risk. Verify before approving."
    },
    {
      title: "Sticker over fuel pump QR",
      context: "The QR sticker is peeling and placed over another code. It opens a payment page with a different merchant name.",
      answer: "scam",
      clue: "Tampered stickers and merchant mismatch are classic QR payment fraud indicators."
    }
  ],
  lawTips: [
    "Report cyber fraud quickly at 1930 or cybercrime.gov.in. Faster reporting improves the chance of freezing funds.",
    "IT Act Section 66C covers identity theft involving passwords, digital signatures, or unique identification misuse.",
    "IT Act Section 66D covers cheating by personation using computer resources, often used for phishing and QR fraud.",
    "Keep screenshots, UTR numbers, phone numbers, VPAs, URLs, and timestamps before filing a complaint.",
    "Never share OTP, UPI PIN, screen-sharing access, or remote-control app permissions with a caller."
  ]
};
