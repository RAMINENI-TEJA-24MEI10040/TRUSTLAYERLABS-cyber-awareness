import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface ThreatAnalysis {
  url: string;
  verdict: 'safe' | 'suspicious' | 'malicious';
  confidenceScore: number;
  phishingProbability: number;
  threatLevel: number;
  ssl: {
    valid: boolean;
    issuer: string;
    expiry: string;
  };
  domain: {
    age: string;
    registrar: string;
    reputation: number;
  };
  redirectChain: string[];
  suspiciousKeywords: string[];
  socialEngineering: {
    urgency: boolean;
    reward: boolean;
    authority: boolean;
    fear: boolean;
    verification: boolean;
  };
  aiExplanation: string;
  attackFlow: string[];
  urlBreakdown: {
    protocol: string;
    subdomain: string;
    domain: string;
    path: string;
    parameters: string;
    suspicious: string[];
  };
}

const TrustLayerLabs = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [analysis, setAnalysis] = useState<ThreatAnalysis | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Cyber facts ticker
  const cyberFacts = [
    "78% of phishing attacks now use HTTPS encryption",
    "Shortened URLs are weaponized in 64% of WhatsApp scams",
    "Fake courier delivery scams increased 340% this quarter",
    "43% of breaches started with a phishing email",
    "QR code phishing attacks grew 587% in 2024",
    "Visual similarity attacks bypass 82% of users",
    "Credential theft takes average 16 seconds after click",
    "Mobile users are 3x more likely to fall for phishing"
  ];

  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % cyberFacts.length);
    }, 5000);
    return () => clearInterval(factInterval);
  }, []);

  // Particle system
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  const scanStages = [
    { name: 'SSL Verification', duration: 800 },
    { name: 'Redirect Mapping', duration: 1000 },
    { name: 'Domain Reputation', duration: 900 },
    { name: 'Script Inspection', duration: 1100 },
    { name: 'Threat Intelligence', duration: 1000 },
    { name: 'AI Risk Analysis', duration: 1200 },
  ];

  const simulateUrlAnalysis = (inputUrl: string): ThreatAnalysis => {
    const lowerUrl = inputUrl.toLowerCase();
    
    // Determine threat level based on URL characteristics
    let threatScore = 0;
    const suspiciousKeywords = [];
    const socialEngineering = {
      urgency: false,
      reward: false,
      authority: false,
      fear: false,
      verification: false,
    };

    // Check for suspicious patterns
    if (lowerUrl.includes('verify') || lowerUrl.includes('confirm') || lowerUrl.includes('update')) {
      threatScore += 25;
      suspiciousKeywords.push('verification-trigger');
      socialEngineering.verification = true;
    }
    if (lowerUrl.includes('urgent') || lowerUrl.includes('immediate') || lowerUrl.includes('expire')) {
      threatScore += 20;
      suspiciousKeywords.push('urgency-manipulation');
      socialEngineering.urgency = true;
    }
    if (lowerUrl.includes('prize') || lowerUrl.includes('winner') || lowerUrl.includes('reward')) {
      threatScore += 20;
      suspiciousKeywords.push('reward-baiting');
      socialEngineering.reward = true;
    }
    if (lowerUrl.includes('account') || lowerUrl.includes('login') || lowerUrl.includes('signin')) {
      threatScore += 15;
      suspiciousKeywords.push('credential-harvesting');
    }
    if (lowerUrl.includes('security') || lowerUrl.includes('alert') || lowerUrl.includes('warning')) {
      threatScore += 18;
      suspiciousKeywords.push('fear-tactics');
      socialEngineering.fear = true;
    }
    if (lowerUrl.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
      threatScore += 30;
      suspiciousKeywords.push('IP-obfuscation');
    }
    if (lowerUrl.includes('bit.ly') || lowerUrl.includes('tinyurl') || lowerUrl.includes('short')) {
      threatScore += 15;
      suspiciousKeywords.push('url-shortener');
    }

    // Parse URL
    let urlObj;
    try {
      urlObj = new URL(inputUrl.startsWith('http') ? inputUrl : 'https://' + inputUrl);
    } catch {
      urlObj = { protocol: 'https:', hostname: inputUrl, pathname: '', search: '' } as any;
    }

    const protocol = urlObj.protocol.replace(':', '');
    const hostParts = (urlObj.hostname || '').split('.');
    const subdomain = hostParts.length > 2 ? hostParts.slice(0, -2).join('.') : '';
    const domain = hostParts.slice(-2).join('.');
    const path = urlObj.pathname || '';
    const parameters = urlObj.search || '';

    const suspicious = [];
    if (protocol !== 'https') suspicious.push('protocol');
    if (subdomain.includes('-') || subdomain.length > 20) suspicious.push('subdomain');
    if (parameters.includes('redirect') || parameters.includes('url=')) suspicious.push('parameters');

    // Determine verdict
    let verdict: 'safe' | 'suspicious' | 'malicious';
    if (threatScore >= 50) verdict = 'malicious';
    else if (threatScore >= 25) verdict = 'suspicious';
    else verdict = 'safe';

    // Generate AI explanation
    const explanations = {
      malicious: `This domain exhibits multiple high-risk indicators consistent with advanced phishing infrastructure. The URL contains ${suspiciousKeywords.length} suspicious patterns including credential harvesting triggers and urgency manipulation tactics. Visual similarity techniques and masked redirects are commonly employed in such campaigns to bypass user awareness and security filters.`,
      suspicious: `This link displays characteristics commonly associated with social engineering attacks. The presence of ${suspiciousKeywords.length > 0 ? suspiciousKeywords[0] : 'suspicious keywords'} suggests potential phishing intent. While not definitively malicious, the domain architecture and keyword usage patterns warrant careful verification before interaction.`,
      safe: `Initial analysis indicates standard domain infrastructure with no immediate red flags. However, always verify the sender's authenticity and the URL's intended destination. Even legitimate-looking domains can be compromised or spoofed.`,
    };

    const attackFlows = {
      malicious: [
        'User clicks link',
        'Redirects to fake portal',
        'Credential input captured',
        'OTP interception',
        'Account compromise',
        'Data exfiltration'
      ],
      suspicious: [
        'User clicks link',
        'Mimics legitimate site',
        'Credential harvesting',
        'Session hijacking',
        'Account takeover'
      ],
      safe: [
        'User clicks link',
        'Standard page load',
        'Secure connection',
        'No malicious activity'
      ]
    };

    return {
      url: inputUrl,
      verdict,
      confidenceScore: Math.min(95, 60 + threatScore),
      phishingProbability: Math.min(98, threatScore + Math.random() * 20),
      threatLevel: threatScore,
      ssl: {
        valid: verdict !== 'malicious',
        issuer: verdict === 'malicious' ? 'Self-Signed' : 'DigiCert Inc.',
        expiry: verdict === 'malicious' ? '2 days' : '387 days',
      },
      domain: {
        age: verdict === 'malicious' ? '3 days' : verdict === 'suspicious' ? '45 days' : '5 years',
        registrar: 'Namecheap',
        reputation: Math.max(0, 100 - threatScore),
      },
      redirectChain: verdict === 'malicious' 
        ? [inputUrl, 'https://short-link.xyz/r3d1r', 'https://fake-portal.com/login']
        : [inputUrl],
      suspiciousKeywords,
      socialEngineering,
      aiExplanation: explanations[verdict],
      attackFlow: attackFlows[verdict],
      urlBreakdown: {
        protocol,
        subdomain: subdomain || 'none',
        domain,
        path: path || '/',
        parameters: parameters || 'none',
        suspicious,
      },
    };
  };

  const handleScan = async () => {
    if (!url.trim()) return;

    setIsScanning(true);
    setScanProgress(0);
    setAnalysis(null);

    for (let i = 0; i < scanStages.length; i++) {
      setCurrentStage(scanStages[i].name);
      await new Promise((resolve) => setTimeout(resolve, scanStages[i].duration));
      setScanProgress(((i + 1) / scanStages.length) * 100);
    }

    const result = simulateUrlAnalysis(url);
    setAnalysis(result);
    setIsScanning(false);
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'safe': return 'from-cyan-400 to-[#22d3ee]';
      case 'suspicious': return 'from-[#f97316] to-orange-400';
      case 'malicious': return 'from-[#ef4444] to-red-400';
      default: return 'from-cyan-500 to-[#06b6d4]';
    }
  };

  const getVerdictGlow = (verdict: string) => {
    switch (verdict) {
      case 'safe': return 'shadow-[0_0_28px_rgba(34,211,238,0.28)]';
      case 'suspicious': return 'shadow-[0_0_28px_rgba(249,115,22,0.28)]';
      case 'malicious': return 'shadow-[0_0_28px_rgba(239,68,68,0.28)]';
      default: return '';
    }
  };

  /** Unified glass panel — TrustLayerLabs cyber theme (styling only) */
  const glassCard = 'bg-[#070b1a]/85 backdrop-blur-xl border border-cyan-500/15';
  const glassCardLg = 'bg-[#070b1a]/90 backdrop-blur-xl border border-cyan-500/15';

  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.04),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.05),transparent_50%)]" />
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
            initial={{ x: `${particle.x}%`, y: `${particle.y}%` }}
            animate={{
              x: `${particle.x + (Math.random() - 0.5) * 20}%`,
              y: `${particle.y + (Math.random() - 0.5) * 20}%`,
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="border-b border-cyan-500/15 backdrop-blur-md bg-[#070b1a]/60"
        >
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 border-2 border-cyan-400 rounded-lg"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-1 border-2 border-[#8b5cf6]/25 rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] via-cyan-400 to-[#06b6d4]">
                  TRUSTLAYERLABS
                </h1>
                <p className="text-xs text-cyan-300/50 tracking-widest">THREAT INTELLIGENCE DIVISION</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-cyan-300/70">SYSTEM ACTIVE</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Cyber Facts Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-b border-cyan-500/10 bg-[#070b1a]/70 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2 text-cyan-400 shrink-0">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-cyan-400 rounded-full"
              />
              <span className="text-xs font-bold tracking-wider">THREAT INTEL</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentFact}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-sm text-cyan-100/70"
              >
                {cyberFacts[currentFact]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="inline-block mb-6"
            >
              <h2 className="text-6xl md:text-7xl font-black tracking-tight mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] via-cyan-300 to-[#06b6d4]">
                  INVESTIGATE LINKS
                </span>
              </h2>
              <h2 className="text-5xl md:text-6xl font-black tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-[#22d3ee] to-[#06b6d4]">
                  BEFORE THEY INVESTIGATE YOU
                </span>
              </h2>
            </motion.div>
            <p className="text-lg text-cyan-100/60 max-w-2xl mx-auto">
              Advanced AI-powered threat intelligence system for analyzing suspicious URLs, 
              detecting phishing attacks, and understanding social engineering tactics
            </p>
          </motion.div>

          {/* Main Scanner Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative"
          >
            {/* Radar Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="w-96 h-96 border border-cyan-500/10 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute w-80 h-80 border border-cyan-500/8 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute w-64 h-64 border border-cyan-400/6 rounded-full"
              />
            </div>

            {/* Scanner Card */}
            <div className={`relative ${glassCardLg} rounded-3xl p-8 md:p-12 shadow-[0_0_70px_rgba(0,229,255,0.07)]`}>
              <div className="relative z-10">
                <div className="mb-8">
                  <label className="block text-sm font-bold tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                    />
                    TARGET URL INPUT
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                      placeholder="https://suspicious-link.example.com"
                      className="w-full bg-[#050816]/80 border-2 border-cyan-500/25 rounded-xl px-6 py-5 text-lg text-white placeholder-cyan-300/25 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_14px_rgba(0,229,255,0.2)] transition-all"
                      disabled={isScanning}
                    />
                    {url && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                      </motion.div>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleScan}
                  disabled={isScanning || !url}
                  className="w-full bg-gradient-to-r from-cyan-600 to-[#06b6d4] hover:from-cyan-500 hover:to-[#22d3ee] text-white font-bold py-5 px-8 rounded-xl shadow-[0_0_21px_rgba(0,229,255,0.28)] hover:shadow-[0_0_35px_rgba(0,229,255,0.42)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg tracking-wider relative overflow-hidden"
                >
                  <motion.div
                    animate={isScanning ? { x: ['0%', '100%'] } : {}}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                  <span className="relative z-10">
                    {isScanning ? 'SCANNING...' : 'INITIATE THREAT SCAN'}
                  </span>
                </motion.button>

                {/* Scan Progress */}
                <AnimatePresence>
                  {isScanning && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-8 space-y-4"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-cyan-400 font-bold tracking-wider">{currentStage}</span>
                        <span className="text-cyan-300/60">{Math.round(scanProgress)}%</span>
                      </div>
                      <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-cyan-500/30">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${scanProgress}%` }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-[#22d3ee] shadow-[0_0_7px_rgba(0,229,255,0.45)]"
                        />
                      </div>

                      {/* Scanning Animation */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                        {scanStages.map((stage, idx) => (
                          <motion.div
                            key={stage.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-4 rounded-lg border backdrop-blur-sm ${
                              scanStages.indexOf(scanStages.find(s => s.name === currentStage)!) >= idx
                                ? 'border-cyan-400/50 bg-cyan-500/10'
                                : 'border-cyan-500/20 bg-black/20'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {scanStages.indexOf(scanStages.find(s => s.name === currentStage)!) >= idx && (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full"
                                />
                              )}
                              <span className="text-xs text-cyan-100/80">{stage.name}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Analysis Results */}
          <AnimatePresence>
            {analysis && !isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
                className="mt-12 space-y-8"
              >
                {/* Verdict Card */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={`${glassCardLg} border-2 rounded-3xl p-8 ${
                    analysis.verdict === 'safe'
                      ? 'border-cyan-500/25'
                      : analysis.verdict === 'suspicious'
                      ? 'border-[#f97316]/30'
                      : 'border-[#ef4444]/30'
                  } ${getVerdictGlow(analysis.verdict)}`}
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`w-4 h-4 rounded-full ${
                            analysis.verdict === 'safe'
                              ? 'bg-cyan-400'
                              : analysis.verdict === 'suspicious'
                              ? 'bg-[#f97316]'
                              : 'bg-[#ef4444]'
                          }`}
                        />
                        <span className="text-sm font-bold tracking-widest text-white/60">THREAT VERDICT</span>
                      </div>
                      <h3 className={`text-5xl font-black tracking-tight uppercase bg-gradient-to-r ${getVerdictColor(analysis.verdict)} text-transparent bg-clip-text`}>
                        {analysis.verdict}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">{analysis.confidenceScore}%</div>
                        <div className="text-xs text-white/60 tracking-wider">CONFIDENCE</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">{Math.round(analysis.phishingProbability)}%</div>
                        <div className="text-xs text-white/60 tracking-wider">PHISHING RISK</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* AI Explanation */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`${glassCard} border-[#8b5cf6]/20 rounded-2xl p-8`}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="w-8 h-8 border-2 border-[#8b5cf6]/50 rounded-lg shrink-0"
                    />
                    <div>
                      <h4 className="text-lg font-bold text-[#a78bfa] mb-3 tracking-wide">AI THREAT ANALYSIS</h4>
                      <p className="text-cyan-100/80 leading-relaxed">{analysis.aiExplanation}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* SSL Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`${glassCard} rounded-2xl p-6`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-3 h-3 rounded-full ${analysis.ssl.valid ? 'bg-cyan-400' : 'bg-[#ef4444]'} animate-pulse`} />
                      <h5 className="text-sm font-bold text-cyan-300 tracking-wider">SSL CERTIFICATE</h5>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-cyan-100/60">Status:</span>
                        <span className={analysis.ssl.valid ? 'text-cyan-400' : 'text-[#ef4444]'}>{analysis.ssl.valid ? 'Valid' : 'Invalid'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-100/60">Issuer:</span>
                        <span className="text-white">{analysis.ssl.issuer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-100/60">Expires:</span>
                        <span className="text-white">{analysis.ssl.expiry}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Domain Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`${glassCard} rounded-2xl p-6`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 bg-cyan-400 rounded-full"
                      />
                      <h5 className="text-sm font-bold text-cyan-300 tracking-wider">DOMAIN INTEL</h5>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-cyan-100/60">Age:</span>
                        <span className="text-white">{analysis.domain.age}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-100/60">Registrar:</span>
                        <span className="text-white">{analysis.domain.registrar}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-100/60">Reputation:</span>
                        <span className="text-white">{analysis.domain.reputation}/100</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Threat Level */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`${glassCard} border-cyan-500/15 rounded-2xl p-6`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`w-3 h-3 rounded-full ${
                          analysis.verdict === 'malicious' ? 'bg-[#ef4444]' : analysis.verdict === 'suspicious' ? 'bg-[#f97316]' : 'bg-cyan-400'
                        }`}
                      />
                      <h5 className="text-sm font-bold text-cyan-300 tracking-wider">THREAT LEVEL</h5>
                    </div>
                    <div className="mb-3">
                      <div className="text-4xl font-black text-white">{analysis.threatLevel}<span className="text-xl text-white/60">/100</span></div>
                    </div>
                    <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis.threatLevel}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full bg-gradient-to-r ${getVerdictColor(analysis.verdict)}`}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* URL Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className={`${glassCard} rounded-2xl p-8`}
                >
                  <h4 className="text-lg font-bold text-cyan-300 mb-6 tracking-wide flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    URL STRUCTURE ANALYSIS
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(analysis.urlBreakdown).filter(([key]) => key !== 'suspicious').map(([key, value]) => (
                      <div
                        key={key}
                        className={`p-4 rounded-lg border backdrop-blur-sm ${
                          analysis.urlBreakdown.suspicious.includes(key)
                            ? 'border-[#ef4444]/40 bg-[#ef4444]/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                            : 'border-cyan-500/15 bg-cyan-500/5'
                        }`}
                      >
                        <div className="text-xs text-cyan-400/50 mb-1 uppercase tracking-wider">{key}</div>
                        <div className="text-sm text-white font-mono break-all">{value as string}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Social Engineering Detection */}
                {Object.values(analysis.socialEngineering).some(v => v) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className={`${glassCard} border-[#f97316]/20 rounded-2xl p-8`}
                  >
                    <h4 className="text-lg font-bold text-[#f97316] mb-6 tracking-wide flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-[#f97316] rounded-full"
                      />
                      SOCIAL ENGINEERING INDICATORS
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {Object.entries(analysis.socialEngineering).map(([tactic, detected]) => (
                        detected && (
                          <motion.div
                            key={tactic}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#f97316]/10 border border-[#f97316]/30 rounded-xl p-4 text-center"
                          >
                            <div className="text-2xl mb-2">
                              {tactic === 'urgency' && '⚡'}
                              {tactic === 'reward' && '🎁'}
                              {tactic === 'authority' && '👮'}
                              {tactic === 'fear' && '⚠️'}
                              {tactic === 'verification' && '✓'}
                            </div>
                            <div className="text-xs text-orange-200/90 uppercase tracking-wider">{tactic}</div>
                          </motion.div>
                        )
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Suspicious Keywords */}
                {analysis.suspiciousKeywords.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className={`${glassCard} border-[#f97316]/20 rounded-2xl p-8`}
                  >
                    <h4 className="text-lg font-bold text-[#f97316] mb-6 tracking-wide">SUSPICIOUS PATTERNS DETECTED</h4>
                    <div className="flex flex-wrap gap-3">
                      {analysis.suspiciousKeywords.map((keyword, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 + idx * 0.1 }}
                          className="px-4 py-2 bg-[#f97316]/10 border border-[#f97316]/30 rounded-lg text-orange-100 text-sm font-mono"
                        >
                          {keyword}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Redirect Chain */}
                {analysis.redirectChain.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className={`${glassCard} border-[#ef4444]/25 rounded-2xl p-8`}
                  >
                    <h4 className="text-lg font-bold text-[#ef4444] mb-6 tracking-wide">REDIRECT CHAIN DETECTED</h4>
                    <div className="space-y-3">
                      {analysis.redirectChain.map((redirect, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.9 + idx * 0.1 }}
                          className="flex items-center gap-4"
                        >
                          <div className="flex items-center justify-center w-8 h-8 bg-[#ef4444]/15 border border-[#ef4444]/35 rounded-full text-red-300 text-sm font-bold">
                            {idx + 1}
                          </div>
                          <div className="flex-1 p-3 bg-[#ef4444]/10 border border-[#ef4444]/25 rounded-lg text-sm font-mono text-red-100/90 break-all">
                            {redirect}
                          </div>
                          {idx < analysis.redirectChain.length - 1 && (
                            <div className="text-[#ef4444]">→</div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Attack Flow Visualization */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className={`${glassCard} border-[#8b5cf6]/20 rounded-2xl p-8`}
                >
                  <h4 className="text-lg font-bold text-[#a78bfa] mb-8 tracking-wide">ATTACK FLOW PATTERN</h4>
                  <div className="relative">
                    {analysis.attackFlow.map((step, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.0 + idx * 0.15 }}
                        className="relative mb-6 last:mb-0"
                      >
                        <div className="flex items-center gap-6">
                          <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#8b5cf6]/80 to-[#6d28d9]/80 rounded-full shadow-[0_0_14px_rgba(139,92,246,0.35)]">
                            <motion.div
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                              className="absolute inset-0 bg-[#8b5cf6]/20 rounded-full"
                            />
                            <span className="relative z-10 text-white font-bold">{idx + 1}</span>
                          </div>
                          <div className="flex-1 p-4 bg-[#8b5cf6]/8 border border-[#8b5cf6]/25 rounded-xl">
                            <p className="text-cyan-100/90">{step}</p>
                          </div>
                        </div>
                        {idx < analysis.attackFlow.length - 1 && (
                          <motion.div
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: 1.1 + idx * 0.15, duration: 0.3 }}
                            className="absolute left-6 top-12 w-0.5 h-6 bg-gradient-to-b from-[#8b5cf6]/60 to-cyan-500/40 origin-top"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex flex-col md:flex-row gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setUrl('');
                      setAnalysis(null);
                    }}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-[#06b6d4] hover:from-cyan-500 hover:to-[#22d3ee] text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_14px_rgba(0,229,255,0.22)] transition-all"
                  >
                    SCAN ANOTHER URL
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      document.getElementById('awareness')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 bg-[#070b1a]/80 border border-cyan-500/25 hover:border-cyan-400/40 hover:bg-cyan-500/10 text-cyan-100 font-bold py-4 px-6 rounded-xl shadow-[0_0_10px_rgba(0,229,255,0.12)] transition-all"
                  >
                    EXPLORE CYBER AWARENESS
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cyber Awareness Section */}
          <motion.div
            id="awareness"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-32 space-y-12"
          >
            <div className="text-center mb-16">
              <motion.h3
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black tracking-tight mb-4"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] via-cyan-300 to-[#06b6d4]">
                  CYBER AWARENESS INTELLIGENCE
                </span>
              </motion.h3>
              <p className="text-lg text-cyan-100/60">
                Understanding threats is your first line of defense
              </p>
            </div>

            {/* Awareness Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`${glassCard} rounded-2xl p-8`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center text-2xl">🔒</div>
                  <h4 className="text-xl font-bold text-cyan-300">How Phishing Links Work</h4>
                </div>
                <p className="text-slate-300/80 leading-relaxed mb-4">
                  Phishing links disguise themselves as legitimate URLs to steal credentials. Attackers use visual similarity, 
                  shortened URLs, and redirect chains to bypass detection and trick users into entering sensitive information.
                </p>
                <ul className="space-y-2 text-sm text-cyan-100/60">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400/80 mt-1">•</span>
                    <span>Typosquatting: paypa1.com instead of paypal.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400/80 mt-1">•</span>
                    <span>Subdomain tricks: paypal.secure-login.phisher.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400/80 mt-1">•</span>
                    <span>Homograph attacks: using similar-looking characters</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={`${glassCard} rounded-2xl p-8`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center text-2xl">🎭</div>
                  <h4 className="text-xl font-bold text-cyan-300">Domain Hiding Techniques</h4>
                </div>
                <p className="text-slate-300/80 leading-relaxed mb-4">
                  Cybercriminals use sophisticated methods to conceal malicious domains and make them appear legitimate. 
                  Understanding these tactics helps you identify suspicious links before clicking.
                </p>
                <ul className="space-y-2 text-sm text-cyan-100/60">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400/80 mt-1">•</span>
                    <span>URL shorteners hiding the real destination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400/80 mt-1">•</span>
                    <span>Multiple redirects to obscure the final target</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400/80 mt-1">•</span>
                    <span>Encoding techniques and obfuscated parameters</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className={`${glassCard} rounded-2xl p-8`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center text-2xl">🛡️</div>
                  <h4 className="text-xl font-bold text-cyan-300">HTTPS Alone Isn&apos;t Enough</h4>
                </div>
                <p className="text-slate-300/80 leading-relaxed mb-4">
                  The presence of HTTPS and a padlock icon does NOT guarantee a site is safe. 78% of phishing sites now use 
                  SSL certificates to appear trustworthy. Always verify the domain itself.
                </p>
                <ul className="space-y-2 text-sm text-cyan-100/60">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400/80 mt-1">•</span>
                    <span>Free SSL certificates are available to anyone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400/80 mt-1">•</span>
                    <span>Attackers use HTTPS to build false credibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400/80 mt-1">•</span>
                    <span>Check the domain name, not just the lock icon</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className={`${glassCard} rounded-2xl p-8`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center text-2xl">📱</div>
                  <h4 className="text-xl font-bold text-cyan-300">QR & Shortened URL Dangers</h4>
                </div>
                <p className="text-slate-300/80 leading-relaxed mb-4">
                  QR codes and shortened URLs completely hide the destination, making them perfect vectors for phishing. 
                  QR phishing (quishing) attacks increased 587% in 2024.
                </p>
                <ul className="space-y-2 text-sm text-cyan-100/60">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400/80 mt-1">•</span>
                    <span>Can&apos;t preview destination before scanning/clicking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400/80 mt-1">•</span>
                    <span>Commonly used in parking, delivery, and payment scams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400/80 mt-1">•</span>
                    <span>Always verify the source before scanning QR codes</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block"
            >
              <h3 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] via-cyan-300 to-[#06b6d4]">
                  THINK BEFORE YOU CLICK
                </span>
              </h3>
            </motion.div>
            <p className="text-xl text-cyan-100/60 mb-8 max-w-2xl mx-auto">
              Every link is a potential threat vector. Stay vigilant, verify sources, and trust your instincts.
            </p>
            <div className="text-sm text-cyan-100/40 mt-8">
              <p>Educational awareness platform • Not affiliated with security vendors</p>
              <p className="mt-2">For demonstration and learning purposes only</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrustLayerLabs;