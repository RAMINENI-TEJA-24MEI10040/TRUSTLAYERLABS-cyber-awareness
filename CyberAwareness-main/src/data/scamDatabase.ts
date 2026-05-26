export type ScamCategory = 
  | 'Financial-Fraud'
  | 'Phishing-Social-Engineering'
  | 'Technical-Attacks'
  | 'Crypto-Fraud'
  | 'Identity-Crimes';

export interface ScamType {
  id: string;
  name: string;
  category: ScamCategory;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  commonIndicators: string[];
  preventionTips: string[];
  examples?: string[];
}

export const scamCategories: Record<ScamCategory, { name: string; icon: string; color: string; description: string }> = {
  'Financial-Fraud': {
    name: 'Financial Fraud',
    icon: '💰',
    color: '#f97316',
    description: 'Scams targeting money, investments, and financial transactions'
  },
  'Phishing-Social-Engineering': {
    name: 'Phishing & Social Engineering',
    icon: '🎣',
    color: '#ef4444',
    description: 'Deceptive tactics to manipulate victims into revealing sensitive information'
  },
  'Technical-Attacks': {
    name: 'Technical Attacks',
    icon: '🖥️',
    color: '#8b5cf6',
    description: 'Exploits and malware targeting systems, networks, and devices'
  },
  'Crypto-Fraud': {
    name: 'Crypto Fraud',
    icon: '₿',
    color: '#22d3ee',
    description: 'Scams and attacks targeting cryptocurrency and blockchain assets'
  },
  'Identity-Crimes': {
    name: 'Identity Crimes',
    icon: '🪪',
    color: '#f472b6',
    description: 'Crimes involving identity theft, impersonation, and personal data misuse'
  }
};

export const scamDatabase: ScamType[] = [
  // CRYPTO FRAUD
  {
    id: 'fake-airdrop',
    name: 'Fake Airdrop Scam',
    category: 'Crypto-Fraud',
    description: 'Scammers promise free cryptocurrency tokens (airdrops) to lure victims into connecting their wallets or revealing private keys.',
    severity: 'high',
    commonIndicators: [
      'Unsolicited messages about free tokens',
      'Requests to connect wallet to unknown websites',
      'Urgency to claim before deadline',
      'Too-good-to-be-true token amounts'
    ],
    preventionTips: [
      'Never connect wallet to unverified airdrop sites',
      'Verify airdrop announcements on official project channels',
      'Use a separate wallet for testing airdrops',
      'Be skeptical of free token offers'
    ],
    examples: ['"Claim your 1000 free tokens now!"', 'Exclusive airdrop for early adopters']
  },
  {
    id: 'fake-crypto-exchange',
    name: 'Fake Crypto Exchange',
    category: 'Crypto-Fraud',
    description: 'Fraudulent cryptocurrency exchanges that appear legitimate but steal deposits or prevent withdrawals.',
    severity: 'critical',
    commonIndicators: [
      'Unrealistically high returns or bonuses',
      'Poor website security (no HTTPS)',
      'No proper regulatory licenses',
      'Difficulty withdrawing funds'
    ],
    preventionTips: [
      'Use only well-known, regulated exchanges',
      'Check for proper licensing and regulation',
      'Read reviews from trusted sources',
      'Start with small test deposits'
    ],
    examples: ['Exchange offering 50% deposit bonus', 'No-KYC exchange with guaranteed profits']
  },
  {
    id: 'seed-phrase-theft',
    name: 'Seed Phrase Theft',
    category: 'Crypto-Fraud',
    description: 'Scammers trick victims into revealing their wallet seed phrase, giving them full access to all crypto assets.',
    severity: 'critical',
    commonIndicators: [
      'Anyone asking for your seed phrase',
      'Fake support requests for wallet issues',
      'Phishing sites mimicking wallet interfaces',
      'Social media offers to "help" with crypto'
    ],
    preventionTips: [
      'NEVER share your seed phrase with anyone',
      'Legitimate support will never ask for seed phrases',
      'Store seed phrases offline and securely',
      'Be wary of unsolicited help offers'
    ],
    examples: ['Support agent asking for seed phrase to "fix" wallet', 'Twitter DM offering to recover lost crypto']
  },
  {
    id: 'sim-swap-attack',
    name: 'SIM Swap Attack',
    category: 'Crypto-Fraud',
    description: 'Attackers transfer a victim\'s phone number to their own SIM to intercept 2FA codes and access crypto accounts.',
    severity: 'critical',
    commonIndicators: [
      'Sudden loss of cellular service',
      'Unusual notifications from mobile carrier',
      'Unable to make calls or send texts',
      'Unexpected 2FA codes received'
    ],
    preventionTips: [
      'Use hardware security keys for 2FA',
      'Enable SIM lock with your carrier',
      'Use authenticator apps instead of SMS 2FA',
      'Contact carrier immediately if service is lost'
    ],
    examples: ['Phone suddenly shows "No Service"', 'Carrier notification about SIM change']
  },
  {
    id: 'crypto-giveaway-fraud',
    name: 'Crypto Giveaway Fraud',
    category: 'Crypto-Fraud',
    description: 'Fake giveaways promising to multiply cryptocurrency if victims send a small amount first.',
    severity: 'high',
    commonIndicators: [
      'Promises to send back 2x or more of what you send',
      'Fake celebrity or influencer endorsements',
      'Urgency and limited-time offers',
      'Requests to send crypto to "verify" address'
    ],
    preventionTips: [
      'Never send crypto to receive more crypto',
      'Verify giveaway claims on official channels',
      'Legitimate giveaways never require sending funds',
      'Be skeptical of celebrity endorsements'
    ],
    examples: ['"Send 0.1 BTC, get 0.5 BTC back"', 'Elon Musk crypto giveaway scam']
  },
  {
    id: 'defi-liquidity-scam',
    name: 'DeFi Liquidity Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent DeFi platforms that promise high yields for providing liquidity but steal the deposited funds.',
    severity: 'high',
    commonIndicators: [
      'Unrealistically high APY returns',
      'New or unaudited smart contracts',
      'Anonymous team with no track record',
      'Pressure to deposit quickly'
    ],
    preventionTips: [
      'Verify smart contracts have been audited',
      'Research the team and project thoroughly',
      'Start with small amounts to test',
      'Use established DeFi platforms'
    ],
    examples: ['500% APY liquidity pool', 'New yield farm with no audit']
  },
  {
    id: 'nft-minting-scam',
    name: 'NFT Minting Scam',
    category: 'Crypto-Fraud',
    description: 'Fake NFT projects that collect minting fees but never deliver the promised NFTs or deliver worthless ones.',
    severity: 'medium',
    commonIndicators: [
      'Copied artwork from other projects',
      'Anonymous or fake team members',
      'No roadmap or whitepaper',
      'Urgency to mint before "sold out"'
    ],
    preventionTips: [
      'Verify the official website and social media',
      'Check if artwork is original or stolen',
      'Research the team and their previous work',
      'Be cautious of minting during hype cycles'
    ],
    examples: ['Fake Bored Ape derivative', 'Celebrity-endorsed NFT with no official confirmation']
  },
  {
    id: 'flash-loan-attack',
    name: 'Flash Loan Attack',
    category: 'Crypto-Fraud',
    description: 'Exploits using flash loans to manipulate DeFi protocol prices and drain funds from liquidity pools.',
    severity: 'critical',
    commonIndicators: [
      'Sudden, unusual price movements',
      'Large transactions in short timeframes',
      'Exploits of known protocol vulnerabilities',
      'Draining of liquidity pools'
    ],
    preventionTips: [
      'Use protocols with proper oracle implementations',
      'Avoid protocols with low liquidity',
      'Stay informed about common exploit patterns',
      'Use reputable, audited DeFi platforms'
    ],
    examples: ['Price manipulation on DEX', 'Liquidity pool drain exploit']
  },
  {
    id: 'fake-staking-platform',
    name: 'Fake Staking Platform',
    category: 'Crypto-Fraud',
    description: 'Fraudulent platforms that promise staking rewards but steal the deposited cryptocurrency.',
    severity: 'high',
    commonIndicators: [
      'Unrealistically high staking rewards',
      'No transparency about how rewards are generated',
      'Difficulty withdrawing staked funds',
      'New or unknown platform'
    ],
    preventionTips: [
      'Use established staking platforms',
      'Verify the staking mechanism is legitimate',
      'Start with small test stakes',
      'Research the platform thoroughly'
    ],
    examples: ['100% APY staking platform', 'New staking service with no track record']
  },
  {
    id: 'telegram-signal-group',
    name: 'Telegram Signal Group Scam',
    category: 'Crypto-Fraud',
    description: 'Fake trading signal groups that provide false information to manipulate markets or steal funds.',
    severity: 'medium',
    commonIndicators: [
      'Guaranteed profit claims',
      'Requests to join specific exchanges',
      'Paid membership for "exclusive" signals',
      'Pump and dump coordination'
    ],
    preventionTips: [
      'Be skeptical of guaranteed profits',
      'Never share wallet keys with signal groups',
      'Research signal providers thoroughly',
      'Understand that no signals are 100% accurate'
    ],
    examples: ['"100% accurate crypto signals"', 'Paid VIP signal group']
  },
  {
    id: 'crypto-recovery-scam',
    name: 'Crypto Recovery Scam',
    category: 'Crypto-Fraud',
    description: 'Services claiming to recover lost or stolen cryptocurrency that charge upfront fees without delivering results.',
    severity: 'high',
    commonIndicators: [
      'Upfront fees for recovery services',
      'Guarantees of recovering lost funds',
      'Requests for wallet credentials',
      'No verifiable success stories'
    ],
    preventionTips: [
      'Legitimate recovery services don\'t charge upfront',
      'Be skeptical of recovery guarantees',
      'Never share wallet credentials',
      'Report scams to authorities instead'
    ],
    examples: ['"We can recover your lost crypto for a fee"', 'Recovery service asking for wallet access']
  },
  {
    id: 'celebrity-impersonation',
    name: 'Celebrity Impersonation Scam',
    category: 'Crypto-Fraud',
    description: 'Fake accounts impersonating celebrities to promote crypto scams or giveaways.',
    severity: 'medium',
    commonIndicators: [
      'Unverified social media accounts',
      'Celebrity promoting unknown crypto projects',
      'Too-good-to-be-true investment opportunities',
      'Requests to send crypto to "verified" addresses'
    ],
    preventionTips: [
      'Verify account authenticity on social media',
      'Check official celebrity channels for announcements',
      'Be skeptical of celebrity crypto endorsements',
      'Never send crypto based on celebrity recommendations'
    ],
    examples: ['Fake Elon Musk account promoting giveaway', 'Celebrity impersonator on Telegram']
  },
  {
    id: 'malware-crypto-clipper',
    name: 'Malware Crypto Clipper',
    category: 'Crypto-Fraud',
    description: 'Malware that replaces cryptocurrency wallet addresses in clipboard with attacker\'s addresses during transactions.',
    severity: 'high',
    commonIndicators: [
      'Unexpected changes to copied addresses',
      'Antivirus detecting clipboard monitoring',
      'Funds sent to wrong addresses',
      'Suspicious software installations'
    ],
    preventionTips: [
      'Always verify wallet addresses before sending',
      'Use reputable antivirus software',
      'Double-check addresses character by character',
      'Avoid downloading suspicious software'
    ],
    examples: ['Clipboard address changed during copy-paste', 'Funds sent to unknown address']
  },
  {
    id: 'cross-chain-bridge-scam',
    name: 'Cross-Chain Bridge Scam',
    category: 'Crypto-Fraud',
    description: 'Fake or compromised cross-chain bridges that steal cryptocurrency during transfers between blockchains.',
    severity: 'critical',
    commonIndicators: [
      'New or unverified bridge protocols',
      'Unusually high bridge fees',
      'Delayed or failed transactions',
      'Smart contract vulnerabilities'
    ],
    preventionTips: [
      'Use established, audited bridge protocols',
      'Verify bridge contract addresses',
      'Start with small test transfers',
      'Research bridge security measures'
    ],
    examples: ['Fake bridge between Ethereum and BSC', 'Compromised bridge draining user funds']
  },
  {
    id: 'fake-ico',
    name: 'Fake ICO Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent Initial Coin Offerings that collect funds but never deliver the promised tokens or platform.',
    severity: 'high',
    commonIndicators: [
      'No working product or prototype',
      'Anonymous or fake team',
      'Unrealistic promises and roadmap',
      'Pressure to invest before deadline'
    ],
    preventionTips: [
      'Research the team and their background',
      'Look for a working product or MVP',
      'Read the whitepaper thoroughly',
      'Check for community reviews and feedback'
    ],
    examples: ['ICO with no product', 'Anonymous team promising revolutionary technology']
  },
  {
    id: 'dusting-attack',
    name: 'Dusting Attack',
    category: 'Crypto-Fraud',
    description: 'Sending tiny amounts of cryptocurrency to many wallets to deanonymize owners and track their transactions.',
    severity: 'low',
    commonIndicators: [
      'Unexpected tiny deposits in wallet',
      'Same small amount sent to many addresses',
      'Attempts to link wallet to identity',
      'Phishing follow-up messages'
    ],
    preventionTips: [
      'Don\'t spend dust from unknown sources',
      'Use privacy-enhancing tools when needed',
      'Be cautious of follow-up communications',
      'Consider using privacy-focused wallets'
    ],
    examples: ['Receiving 0.00001 BTC from unknown address', 'Dust followed by phishing message']
  },
  {
    id: 'crypto-mining-malware',
    name: 'Crypto Mining Malware',
    category: 'Crypto-Fraud',
    description: 'Malware that uses victim\'s computing resources to mine cryptocurrency without consent.',
    severity: 'medium',
    commonIndicators: [
      'Slow computer performance',
      'High CPU/GPU usage when idle',
      'Increased electricity bills',
      'Fan running constantly'
    ],
    preventionTips: [
      'Use reputable antivirus software',
      'Avoid downloading suspicious software',
      'Monitor system resource usage',
      'Keep software updated'
    ],
    examples: ['Browser mining script', 'Hidden mining malware in downloads']
  },
  {
    id: 'fake-wallet-update',
    name: 'Fake Wallet Update Scam',
    category: 'Crypto-Fraud',
    description: 'Phishing attacks disguised as wallet software updates to steal credentials or install malware.',
    severity: 'critical',
    commonIndicators: [
      'Unsolicited wallet update notifications',
      'Download links from unofficial sources',
      'Requests to enter seed phrase during "update"',
      'Poor grammar or spelling in update messages'
    ],
    preventionTips: [
      'Only download updates from official wallet websites',
      'Verify update notifications through official channels',
      'Never enter seed phrase during updates',
      'Use wallet software\'s built-in update mechanism'
    ],
    examples: ['Fake MetaMask update email', 'Phishing site mimicking wallet update']
  },
  {
    id: 'ai-trading-bot',
    name: 'AI Trading Bot Scam',
    category: 'Crypto-Fraud',
    description: 'Fake AI-powered trading bots that promise automated profits but steal funds or provide poor performance.',
    severity: 'high',
    commonIndicators: [
      'Guaranteed profit claims',
      'Requests for API keys with withdrawal permissions',
      'Lack of transparent performance history',
      'High upfront or subscription fees'
    ],
    preventionTips: [
      'Be skeptical of guaranteed profits',
      'Never grant withdrawal permissions to trading bots',
      'Verify performance claims independently',
      'Use reputable, established trading platforms'
    ],
    examples: ['"AI bot with 99% win rate"', 'Trading bot requiring full API access']
  },
  {
    id: 'metaverse-investment',
    name: 'Metaverse Investment Scam',
    category: 'Crypto-Fraud',
    description: 'Fake metaverse projects or virtual real estate investments that collect funds without delivering value.',
    severity: 'medium',
    commonIndicators: [
      'No working metaverse platform',
      'Promises of huge returns on virtual land',
      'Anonymous development team',
      'Hype-driven marketing with no substance'
    ],
    preventionTips: [
      'Verify the metaverse platform exists and works',
      'Research the development team',
      'Be skeptical of virtual land investment promises',
      'Start with small investments to test'
    ],
    examples: ['Virtual land with no platform', 'Metaverse project with only a whitepaper']
  },
  {
    id: 'nft-rug-pull',
    name: 'NFT Rug Pull Scam',
    category: 'Crypto-Fraud',
    description: 'NFT projects where developers abandon the project after collecting funds, leaving holders with worthless tokens.',
    severity: 'high',
    commonIndicators: [
      'Developers stop communicating',
      'Promised features never delivered',
      'Floor price crashes suddenly',
      'Social media accounts go silent'
    ],
    preventionTips: [
      'Research the team\'s track record',
      'Look for locked liquidity and roadmap',
      'Be cautious of projects with anonymous teams',
      'Join community to monitor project activity'
    ],
    examples: ['NFT project abandoned after mint', 'Developers disappear with funds']
  },
  {
    id: 'fake-web3-job',
    name: 'Fake Web3 Job Scam',
    category: 'Crypto-Fraud',
    description: 'Fake job postings in Web3/crypto that trick applicants into paying fees or revealing sensitive information.',
    severity: 'medium',
    commonIndicators: [
      'Requests for payment for "training" or "equipment"',
      'Job offers without proper interviews',
      'Requests for wallet addresses or private keys',
      'Too-good-to-be-true salary offers'
    ],
    preventionTips: [
      'Never pay for job opportunities',
      'Verify company legitimacy through official channels',
      'Be cautious sharing personal information',
      'Research the company and hiring manager'
    ],
    examples: ['Pay $500 for Web3 training kit', 'Job offer requiring wallet address']
  },
  {
    id: 'smart-contract-exploit',
    name: 'Smart Contract Exploit',
    category: 'Crypto-Fraud',
    description: 'Attackers exploiting vulnerabilities in smart contracts to steal funds or manipulate protocol behavior.',
    severity: 'critical',
    commonIndicators: [
      'Unusual transaction patterns',
      'Sudden drainage of protocol funds',
      'Exploitation of known vulnerabilities',
      'Flash loan attacks'
    ],
    preventionTips: [
      'Only use audited smart contracts',
      'Stay informed about common vulnerabilities',
      'Use protocols with bug bounties',
      'Diversify holdings across protocols'
    ],
    examples: ['Reentrancy attack', 'Oracle manipulation exploit']
  },
  {
    id: 'crypto-tax-scam',
    name: 'Crypto Tax Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent crypto tax services that steal funds or provide incorrect tax advice leading to legal issues.',
    severity: 'medium',
    commonIndicators: [
      'Requests for wallet access to "calculate taxes"',
      'Guarantees of tax avoidance',
      'Unlicensed tax advisors',
      'Upfront fees with no deliverables'
    ],
    preventionTips: [
      'Use licensed tax professionals',
      'Never grant wallet access for tax purposes',
      'Verify tax service credentials',
      'Be skeptical of tax avoidance guarantees'
    ],
    examples: ['Tax service requiring wallet access', 'Guaranteed crypto tax avoidance']
  },
  {
    id: 'qr-code-crypto',
    name: 'QR Code Crypto Scam',
    category: 'Crypto-Fraud',
    description: 'Malicious QR codes that direct users to fake cryptocurrency websites or initiate unauthorized transactions.',
    severity: 'high',
    commonIndicators: [
      'QR codes in unsolicited messages',
      'QR codes promising free crypto',
      'QR codes from unknown sources',
      'Unexpected wallet connection requests'
    ],
    preventionTips: [
      'Never scan unknown QR codes',
      'Verify QR code source before scanning',
      'Check URL after scanning before connecting wallet',
      'Use QR codes only from trusted sources'
    ],
    examples: ['QR code in spam email', 'Physical QR code sticker promising free crypto']
  },
  {
    id: 'clipboard-hijacking',
    name: 'Clipboard Hijacking Malware',
    category: 'Crypto-Fraud',
    description: 'Malware that monitors and replaces cryptocurrency addresses in clipboard to redirect funds to attackers.',
    severity: 'high',
    commonIndicators: [
      'Clipboard content changing unexpectedly',
      'Different address when pasting',
      'Antivirus detecting clipboard monitoring',
      'Funds sent to wrong address'
    ],
    preventionTips: [
      'Always verify addresses before sending',
      'Use hardware wallets when possible',
      'Run regular antivirus scans',
      'Double-check addresses character by character'
    ],
    examples: ['Address changed after copying', 'Funds sent to attacker instead of intended recipient']
  },
  {
    id: 'crypto-romance',
    name: 'Crypto Romance Scam',
    category: 'Crypto-Fraud',
    description: 'Romance scams where attackers build fake relationships to convince victims to invest in fake crypto platforms.',
    severity: 'high',
    commonIndicators: [
      'Online relationships moving quickly to investment topics',
      'Pressure to invest on specific platforms',
      'Refusal to video call or meet in person',
      'Promises of shared wealth through crypto'
    ],
    preventionTips: [
      'Be skeptical of online relationships involving money',
      'Never invest based on online relationship advice',
      'Verify identity through video calls',
      'Research investment platforms independently'
    ],
    examples: ['Online partner urging crypto investment', 'Romance scam with fake trading platform']
  },
  {
    id: 'fake-blockchain-project',
    name: 'Fake Blockchain Project Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent blockchain projects that collect investments but never deliver promised technology or products.',
    severity: 'high',
    commonIndicators: [
      'No working product or code',
      'Anonymous or fake development team',
      'Vague technical explanations',
      'Focus on marketing over technology'
    ],
    preventionTips: [
      'Look for open-source code on GitHub',
      'Research the development team',
      'Verify technical claims independently',
      'Be cautious of hype-driven projects'
    ],
    examples: ['Blockchain project with no code', 'Fake team members on website']
  },
  {
    id: 'insider-trading',
    name: 'Insider Trading Manipulation',
    category: 'Crypto-Fraud',
    description: 'Market manipulation using insider information to profit at the expense of other traders.',
    severity: 'high',
    commonIndicators: [
      'Unusual trading before announcements',
      'Sudden price movements before news',
      'Whales accumulating before announcements',
      'Suspicious trading patterns'
    ],
    preventionTips: [
      'Be cautious trading before major announcements',
      'Diversify your portfolio',
      'Use stop-loss orders',
      'Research thoroughly before trading'
    ],
    examples: ['Price pump before token listing', 'Insider selling before bad news']
  },
  {
    id: 'stablecoin-collapse',
    name: 'Stablecoin Collapse Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent or mismanaged stablecoins that lose their peg, causing investors to lose funds.',
    severity: 'critical',
    commonIndicators: [
      'Lack of transparent reserves',
      'No third-party audits',
      'Deviating from peg value',
      'Vague backing mechanisms'
    ],
    preventionTips: [
      'Use stablecoins with transparent reserves',
      'Check for regular third-party audits',
      'Diversify stablecoin holdings',
      'Monitor peg stability regularly'
    ],
    examples: ['Algorithmic stablecoin collapse', 'Stablecoin without proper backing']
  },

  // PHISHING & SOCIAL ENGINEERING
  {
    id: 'phishing',
    name: 'Phishing',
    category: 'Phishing-Social-Engineering',
    description: 'Fraudulent attempts to obtain sensitive information by disguising as trustworthy entities via electronic communication.',
    severity: 'high',
    commonIndicators: [
      'Urgent or threatening language',
      'Generic greetings instead of personal names',
      'Mismatched URLs or slight misspellings',
      'Requests for sensitive information'
    ],
    preventionTips: [
      'Verify sender identity before responding',
      'Check URLs carefully before clicking',
      'Enable two-factor authentication',
      'Never share sensitive info via email'
    ],
    examples: ['Fake bank email requesting login', 'Spear phishing targeting executives']
  },
  {
    id: 'spear-phishing',
    name: 'Spear Phishing',
    category: 'Phishing-Social-Engineering',
    description: 'Targeted phishing attacks personalized for specific individuals or organizations using gathered information.',
    severity: 'high',
    commonIndicators: [
      'Personalized information in messages',
      'Knowledge of recent activities or relationships',
      'Context-aware timing of attacks',
      'Specific role-based targeting'
    ],
    preventionTips: [
      'Be skeptical of unexpected personalized messages',
      'Verify requests through alternate channels',
      'Limit personal information shared online',
      'Report suspicious communications'
    ],
    examples: ['CEO fraud targeting finance department', 'Custom phishing using LinkedIn data']
  },
  {
    id: 'whaling',
    name: 'Whaling Attack',
    category: 'Phishing-Social-Engineering',
    description: 'Spear phishing targeting high-profile individuals like executives to steal sensitive data or authorize transfers.',
    severity: 'critical',
    commonIndicators: [
      'Urgent requests from "executives"',
      'Requests for large transfers or sensitive data',
      'Timing during busy periods or travel',
      'Bypassing normal procedures'
    ],
    preventionTips: [
      'Verify executive requests through multiple channels',
      'Establish strict approval workflows',
      'Implement executive protection protocols',
      'Train staff on whaling indicators'
    ],
    examples: ['Fake CEO email requesting wire transfer', 'CFO impersonation for data access']
  },
  {
    id: 'smishing',
    name: 'Smishing (SMS Phishing)',
    category: 'Phishing-Social-Engineering',
    description: 'Phishing attacks via SMS messages attempting to trick recipients into revealing personal information.',
    severity: 'medium',
    commonIndicators: [
      'Urgent messages about account issues',
      'Links shortened or masked',
      'Requests for personal information',
      'Messages from unknown numbers'
    ],
    preventionTips: [
      'Don\'t click links in unsolicited SMS',
      'Verify with official sources directly',
      'Block suspicious numbers',
      'Report smishing attempts'
    ],
    examples: ['Fake bank SMS with phishing link', 'Delivery scam via text message']
  },
  {
    id: 'vishing',
    name: 'Vishing (Voice Phishing)',
    category: 'Phishing-Social-Engineering',
    description: 'Phone scams where attackers use voice calls to manipulate victims into revealing information or making payments.',
    severity: 'medium',
    commonIndicators: [
      'Unsolicited calls from "official" numbers',
      'Urgent threats about legal or financial issues',
      'Requests for immediate payments',
      'Caller ID spoofing'
    ],
    preventionTips: [
      'Hang up and call official numbers',
      'Never share personal info over unsolicited calls',
      'Verify caller identity independently',
      'Use call screening features'
    ],
    examples: ['Fake IRS call demanding payment', 'Tech support scam via phone']
  },
  {
    id: 'email-spoofing',
    name: 'Email Spoofing',
    category: 'Phishing-Social-Engineering',
    description: 'Forging email sender addresses to make messages appear from trusted sources.',
    severity: 'medium',
    commonIndicators: [
      'Slight misspellings in sender addresses',
      'Mismatched display names and email addresses',
      'Unusual sending patterns',
      'Requests for sensitive actions'
    ],
    preventionTips: [
      'Check email headers for authenticity',
      'Verify sender through other channels',
      'Use email authentication protocols',
      'Enable SPF, DKIM, and DMARC'
    ],
    examples: ['Fake email from company CEO', 'Spoofed vendor email requesting payment']
  },
  {
    id: 'website-spoofing',
    name: 'Website Spoofing',
    category: 'Phishing-Social-Engineering',
    description: 'Creating fake websites that mimic legitimate sites to steal credentials or personal information.',
    severity: 'high',
    commonIndicators: [
      'Slightly misspelled URLs',
      'Poor website quality or design',
      'Missing security indicators',
      'Unusual login prompts'
    ],
    preventionTips: [
      'Verify URLs carefully before entering data',
      'Look for HTTPS and valid certificates',
      'Use bookmarks for important sites',
      'Enable browser security features'
    ],
    examples: ['Fake banking login page', 'Phishing site mimicking popular service']
  },
  {
    id: 'bec',
    name: 'Business Email Compromise (BEC)',
    category: 'Phishing-Social-Engineering',
    description: 'Sophisticated scams targeting businesses by compromising legitimate email accounts to conduct fraudulent transfers.',
    severity: 'critical',
    commonIndicators: [
      'Unexpected changes in payment instructions',
      'Urgency and confidentiality requests',
      'Requests to bypass normal procedures',
      'Compromised executive or vendor accounts'
    ],
    preventionTips: [
      'Verify payment changes through multiple channels',
      'Implement multi-factor authentication',
      'Establish secondary verification procedures',
      'Train staff on BEC indicators'
    ],
    examples: ['Fake vendor requesting payment to new account', 'Compromised CEO email authorizing transfer']
  },
  {
    id: 'social-engineering',
    name: 'Social Engineering Attack',
    category: 'Phishing-Social-Engineering',
    description: 'Psychological manipulation to trick people into giving up confidential information or access.',
    severity: 'high',
    commonIndicators: [
      'Creating false sense of urgency',
      'Exploiting emotions (fear, curiosity, greed)',
      'Building false trust or authority',
      'Bypassing security through human interaction'
    ],
    preventionTips: [
      'Be skeptical of unsolicited requests',
      'Verify identities through multiple channels',
      'Follow security procedures regardless of pressure',
      'Report suspicious interactions'
    ],
    examples: ['Tailgating into secure areas', 'Pretexting to gain information']
  },
  {
    id: 'tech-support-scam',
    name: 'Tech Support Scam',
    category: 'Phishing-Social-Engineering',
    description: 'Fraudsters claiming to be tech support to gain access to devices or steal information.',
    severity: 'medium',
    commonIndicators: [
      'Unsolicited calls about computer problems',
      'Requests for remote access',
      'Demands for payment for "services"',
      'Threats if payment is refused'
    ],
    preventionTips: [
      'Hang up on unsolicited tech support calls',
      'Never grant remote access to unknown callers',
      'Contact official support directly',
      'Use legitimate security software'
    ],
    examples: ['Fake Microsoft support call', 'Pop-up claiming virus infection']
  },
  {
    id: 'fake-customer-care',
    name: 'Fake Customer Care Scam',
    category: 'Phishing-Social-Engineering',
    description: 'Impersonating customer service representatives to steal information or money from victims.',
    severity: 'medium',
    commonIndicators: [
      'Unsolicited contact from "customer service"',
      'Requests for account information or passwords',
      'Demands for payment to resolve "issues"',
      'Unofficial communication channels'
    ],
    preventionTips: [
      'Contact customer service through official channels',
      'Never share passwords with support',
      'Verify representative identity',
      'Be suspicious of urgency tactics'
    ],
    examples: ['Fake bank customer service call', 'Impersonated utility company support']
  },
  {
    id: 'courier-parcel',
    name: 'Courier/Parcel Scam',
    category: 'Phishing-Social-Engineering',
    description: 'Fake delivery notifications designed to steal personal information or payments.',
    severity: 'medium',
    commonIndicators: [
      'Unexpected delivery notifications',
      'Requests for payment to release packages',
      'Links to fake tracking websites',
      'Threats of package destruction'
    ],
    preventionTips: [
      'Track packages through official carrier websites',
      'Never pay for unexpected deliveries',
      'Verify with sender directly',
      'Report fake delivery messages'
    ],
    examples: ['Fake FedEx delivery SMS', 'Phishing email about customs fees']
  },
  {
    id: 'electricity-bill',
    name: 'Electricity Bill Scam',
    category: 'Phishing-Social-Engineering',
    description: 'Fake electricity bill notifications demanding immediate payment to avoid service disconnection.',
    severity: 'medium',
    commonIndicators: [
      'Urgent threats of power disconnection',
      'Unusual payment methods requested',
      'Fake utility company branding',
      'Requests for immediate action'
    ],
    preventionTips: [
      'Verify bills through official utility portals',
      'Contact utility company directly',
      'Never pay via links in messages',
      'Check bill history for consistency'
    ],
    examples: ['Fake power company email', 'SMS threatening electricity disconnection']
  },
  {
    id: 'aadhaar-scam',
    name: 'Aadhaar Scam',
    category: 'Phishing-Social-Engineering',
    description: 'Scams targeting Aadhaar card holders to steal personal information or commit identity fraud.',
    severity: 'high',
    commonIndicators: [
      'Requests for Aadhaar details via phone/email',
      'Threats of Aadhaar cancellation',
      'Fake government-looking communications',
      'Requests for OTP sharing'
    ],
    preventionTips: [
      'Never share Aadhaar details via phone/email',
      'Verify through official UIDAI channels',
      'Government never asks for sensitive info via phone',
      'Report Aadhaar fraud immediately'
    ],
    examples: ['Fake UIDAI email requesting details', 'Call threatening Aadhaar cancellation']
  },
  {
    id: 'kyc-fraud',
    name: 'KYC Fraud',
    category: 'Phishing-Social-Engineering',
    description: 'Fake KYC verification processes designed to steal personal documents and information.',
    severity: 'high',
    commonIndicators: [
      'Unsolicited KYC verification requests',
      'Requests for document uploads via unofficial channels',
      'Urgency to complete KYC',
      'Fake banking or service branding'
    ],
    preventionTips: [
      'Only complete KYC through official channels',
      'Verify organization legitimacy',
      'Never share documents via unofficial methods',
      'Report fake KYC requests'
    ],
    examples: ['Fake bank KYC verification email', 'WhatsApp message requesting document upload']
  },
  {
    id: 'fake-government-scheme',
    name: 'Fake Government Scheme Scam',
    category: 'Phishing-Social-Engineering',
    description: 'Fraudulent schemes claiming to be government programs to collect personal information or payments.',
    severity: 'high',
    commonIndicators: [
      'Promises of government benefits or subsidies',
      'Requests for personal information or payments',
      'Urgency to register before deadline',
      'Fake government branding and language'
    ],
    preventionTips: [
      'Verify schemes through official government websites',
      'Government never asks for payments for benefits',
      'Be skeptical of unsolicited scheme offers',
      'Report fake government communications'
    ],
    examples: ['Fake subsidy registration portal', 'Fake government benefit scheme']
  },
  {
    id: 'insurance-fraud',
    name: 'Insurance Fraud',
    category: 'Phishing-Social-Engineering',
    description: 'Scams targeting insurance policyholders to steal premiums or personal information.',
    severity: 'medium',
    commonIndicators: [
      'Unsolicited insurance offers',
      'Requests for policy details via unofficial channels',
      'Fake insurance company branding',
      'Promises of unrealistic coverage'
    ],
    preventionTips: [
      'Verify insurance companies through official channels',
      'Contact insurers directly for policy matters',
      'Be skeptical of unsolicited offers',
      'Check insurance regulator databases'
    ],
    examples: ['Fake health insurance offer', 'Phishing call about policy renewal']
  },
  {
    id: 'lottery-scam',
    name: 'Lottery Scam',
    category: 'Phishing-Social-Engineering',
    description: 'Fake lottery winnings requiring victims to pay fees or provide personal information to claim prizes.',
    severity: 'medium',
    commonIndicators: [
      'Notifications of winning lotteries never entered',
      'Requests for payment to claim prizes',
      'Urgency to claim before deadline',
      'Requests for personal information'
    ],
    preventionTips: [
      'You can\'t win lotteries you didn\'t enter',
      'Never pay to claim lottery prizes',
      'Verify through official lottery organizations',
      'Report lottery scams'
    ],
    examples: ['"You won $1 million!" email', 'WhatsApp message about lottery prize']
  },
  {
    id: 'charity-donation',
    name: 'Charity Donation Scam',
    category: 'Phishing-Social-Engineering',
    description: 'Fake charity solicitations that collect money or personal information under pretense of helping causes.',
    severity: 'medium',
    commonIndicators: [
      'Unsolicited charity requests',
      'Pressure to donate immediately',
      'Vague details about charity mission',
      'Unusual payment methods requested'
    ],
    preventionTips: [
      'Research charities before donating',
      'Donate through official charity websites',
      'Be skeptical of emotional appeals',
      'Verify charity registration status'
    ],
    examples: ['Fake disaster relief fund', 'Charity scam using current events']
  },
  {
    id: 'fake-giveaway',
    name: 'Fake Giveaway Scam',
    category: 'Phishing-Social-Engineering',
    description: 'Fake giveaways promising prizes to collect personal information or payments.',
    severity: 'medium',
    commonIndicators: [
      'Prizes for actions that seem too easy',
      'Requests for payment or shipping fees',
      'Urgency to claim limited offers',
      'Requests for personal information'
    ],
    preventionTips: [
      'Be skeptical of easy prize offers',
      'Legitimate giveaways don\'t require payments',
      'Verify through official brand channels',
      'Never share personal info for giveaways'
    ],
    examples: ['Fake iPhone giveaway', 'Social media prize scam']
  },
  {
    id: 'fake-antivirus',
    name: 'Fake Antivirus Scam',
    category: 'Phishing-Social-Engineering',
    description: 'Fake antivirus warnings designed to trick users into paying for unnecessary software or malware.',
    severity: 'medium',
    commonIndicators: [
      'Pop-up warnings about virus infections',
      'Demands for immediate payment',
      'Unusual antivirus software names',
      'Requests for remote access'
    ],
    preventionTips: [
      'Use legitimate antivirus software',
      'Ignore unsolicited virus warnings',
      'Scan with trusted security software',
      'Never pay for fake antivirus'
    ],
    examples: ['Fake virus alert pop-up', 'Browser hijacker claiming infection']
  },
  {
    id: 'fake-job',
    name: 'Fake Job Scam',
    category: 'Phishing-Social-Engineering',
    description: 'Fake job postings designed to steal personal information, money, or commit identity theft.',
    severity: 'medium',
    commonIndicators: [
      'Job offers without interviews',
      'Requests for payment for training/equipment',
      'Too-good-to-be-true salary offers',
      'Requests for personal information early in process'
    ],
    preventionTips: [
      'Research companies thoroughly',
      'Never pay for job opportunities',
      'Be skeptical of offers without proper interviews',
      'Verify job postings through official company channels'
    ],
    examples: ['Work from home scam requiring payment', 'Fake job offer requesting bank details']
  },
  {
    id: 'work-from-home',
    name: 'Work From Home Scam',
    category: 'Phishing-Social-Engineering',
    description: 'Fake work-from-home opportunities that collect fees or personal information without providing real work.',
    severity: 'medium',
    commonIndicators: [
      'High pay for minimal work',
      'Upfront fees for training or materials',
      'Vague job descriptions',
      'Requests for personal information'
    ],
    preventionTips: [
      'Research companies and opportunities',
      'Never pay upfront for work opportunities',
      'Be skeptical of unrealistic earnings claims',
      'Verify job legitimacy through multiple sources'
    ],
    examples: ['Data entry job requiring payment', 'Fake remote work opportunity']
  },
  {
    id: 'deepfake-scam',
    name: 'Deepfake Scam',
    category: 'Phishing-Social-Engineering',
    description: 'Using AI-generated fake videos or audio to impersonate people and manipulate victims.',
    severity: 'high',
    commonIndicators: [
      'Unusual behavior from known contacts',
      'Poor quality video or audio anomalies',
      'Requests for money or sensitive information',
      'Inability to verify identity through other means'
    ],
    preventionTips: [
      'Verify identity through multiple channels',
      'Be skeptical of unusual requests from contacts',
      'Look for visual/audio anomalies in videos',
      'Establish verification protocols with important contacts'
    ],
    examples: ['Deepfake CEO requesting transfer', 'AI-generated voice for fraud']
  },
  {
    id: 'ai-voice-cloning',
    name: 'AI Voice Cloning Scam',
    category: 'Phishing-Social-Engineering',
    description: 'Using AI to clone voices and impersonate family members or authorities to manipulate victims.',
    severity: 'high',
    commonIndicators: [
      'Urgent requests from "family members"',
      'Unusual requests for money or information',
      'Inability to verify through video call',
      'Voice that sounds slightly off'
    ],
    preventionTips: [
      'Verify identity through video calls',
      'Ask questions only real family would know',
      'Be skeptical of urgent money requests',
      'Establish family verification codes'
    ],
    examples: ['AI-cloned child voice claiming emergency', 'Fake family member requesting money']
  },

  // IDENTITY CRIMES
  {
    id: 'identity-theft',
    name: 'Identity Theft',
    category: 'Identity-Crimes',
    description: 'Stealing personal information to commit fraud or other crimes in someone else\'s name.',
    severity: 'critical',
    commonIndicators: [
      'Unexplained charges on accounts',
      'Receiving bills for services not used',
      'Denied credit unexpectedly',
      'Missing mail or statements'
    ],
    preventionTips: [
      'Monitor financial accounts regularly',
      'Shred sensitive documents',
      'Use strong, unique passwords',
      'Enable credit freezes if needed'
    ],
    examples: ['Someone opening credit cards in your name', 'Tax fraud using stolen SSN']
  },
  {
    id: 'data-breach',
    name: 'Data Breach',
    category: 'Identity-Crimes',
    description: 'Unauthorized access to confidential information, potentially exposing personal data to criminals.',
    severity: 'critical',
    commonIndicators: [
      'Notification from company about breach',
      'Unusual account activity',
      'Password reset emails you didn\'t request',
      'New accounts opened in your name'
    ],
    preventionTips: [
      'Change passwords after breach notifications',
      'Use unique passwords for each account',
      'Enable two-factor authentication',
      'Monitor accounts for suspicious activity'
    ],
    examples: ['Company database hacked', 'Password dump from breached site']
  },
  {
    id: 'data-theft',
    name: 'Data Theft',
    category: 'Identity-Crimes',
    description: 'Stealing digital information, including personal, financial, or corporate data.',
    severity: 'high',
    commonIndicators: [
      'Missing files or documents',
      'Unusual network activity',
      'Access logs showing unknown users',
      'Ransom demands for stolen data'
    ],
    preventionTips: [
      'Implement access controls',
      'Encrypt sensitive data',
      'Monitor network activity',
      'Regular security audits'
    ],
    examples: ['Stolen customer database', 'Trade secret theft']
  },
  {
    id: 'credential-theft',
    name: 'Credential Theft',
    category: 'Identity-Crimes',
    description: 'Stealing login credentials to access accounts and systems unauthorized.',
    severity: 'high',
    commonIndicators: [
      'Unsuccessful login attempts',
      'Login from unusual locations',
      'Password changes you didn\'t make',
      'Account takeover notifications'
    ],
    preventionTips: [
      'Use unique, strong passwords',
      'Enable multi-factor authentication',
      'Monitor login activity',
      'Use password managers'
    ],
    examples: ['Stolen password from phishing', 'Credential stuffing attack']
  },
  {
    id: 'sim-swap-fraud',
    name: 'SIM Swap Fraud',
    category: 'Identity-Crimes',
    description: 'Fraudulently transferring a victim\'s phone number to attacker\'s SIM to intercept calls and messages.',
    severity: 'critical',
    commonIndicators: [
      'Sudden loss of cellular service',
      'Unable to make or receive calls',
      'Notifications about SIM changes',
      'Unexpected 2FA codes'
    ],
    preventionTips: [
      'Enable SIM lock with carrier',
      'Use authenticator apps instead of SMS 2FA',
      'Contact carrier immediately if service lost',
      'Use hardware security keys'
    ],
    examples: ['Phone showing "No Service"', 'Carrier notification about unauthorized SIM change']
  },
  {
    id: 'otp-fraud',
    name: 'OTP Fraud',
    category: 'Identity-Crimes',
    description: 'Tricking victims into sharing One-Time Passwords to gain unauthorized access to accounts.',
    severity: 'high',
    commonIndicators: [
      'Requests to share OTP via phone/SMS',
      'Claims of "system verification" requiring OTP',
      'Urgency around OTP sharing',
      'Multiple OTP requests you didn\'t initiate'
    ],
    preventionTips: [
      'Never share OTPs with anyone',
      'Legitimate services never ask for OTP sharing',
      'Report OTP fraud immediately',
      'Use app-based 2FA when possible'
    ],
    examples: ['Call requesting OTP for "verification"', 'SMS asking to share OTP']
  },
  {
    id: 'insider-threat',
    name: 'Insider Threat Attack',
    category: 'Identity-Crimes',
    description: 'Security risks from employees, contractors, or business partners with inside access.',
    severity: 'high',
    commonIndicators: [
      'Unusual access patterns',
      'Data access outside normal duties',
      'Excessive file transfers',
      'Behavioral changes in employees'
    ],
    preventionTips: [
      'Implement access controls and monitoring',
      'Conduct background checks',
      'Implement least privilege access',
      'Monitor for unusual activity'
    ],
    examples: ['Employee stealing customer data', 'Contractor exfiltrating trade secrets']
  },

  // FINANCIAL FRAUD
  {
    id: 'qr-scam',
    name: 'QR Code Scam',
    category: 'Financial-Fraud',
    description: 'Malicious QR codes that direct victims to fake payment sites or initiate unauthorized transactions.',
    severity: 'high',
    commonIndicators: [
      'QR codes in unexpected locations',
      'QR codes promising discounts or free items',
      'QR codes covering legitimate codes',
      'Unsolicited QR codes via messages'
    ],
    preventionTips: [
      'Only scan QR codes from trusted sources',
      'Verify QR code destination before scanning',
      'Check URLs after scanning',
      'Use secure QR scanning apps'
    ],
    examples: ['Fake payment QR code', 'QR code sticker over legitimate code']
  },
  {
    id: 'upi-fraud',
    name: 'UPI Fraud',
    category: 'Financial-Fraud',
    description: 'Fraudulent transactions using UPI (Unified Payments Interface) to steal money from victims.',
    severity: 'high',
    commonIndicators: [
      'Requests to scan unknown QR codes',
      'Requests for UPI PIN',
      'Fake payment confirmations',
      'Screen sharing requests during transactions'
    ],
    preventionTips: [
      'Never share UPI PIN',
      'Verify recipient details before paying',
      'Don\'t allow screen sharing during transactions',
      'Report suspicious UPI activity immediately'
    ],
    examples: ['Fake collect request', 'UPI PIN theft via social engineering']
  },
  {
    id: 'internet-banking-fraud',
    name: 'Internet Banking Fraud',
    category: 'Financial-Fraud',
    description: 'Unauthorized access to bank accounts through online banking channels to steal funds.',
    severity: 'critical',
    commonIndicators: [
      'Unusual login locations/times',
      'Unauthorized transactions',
      'Password reset notifications',
      'Phishing emails from "bank"'
    ],
    preventionTips: [
      'Use strong, unique banking passwords',
      'Enable transaction notifications',
      'Never share banking credentials',
      'Verify bank communications through official channels'
    ],
    examples: ['Phishing site stealing bank credentials', 'Unauthorized wire transfers']
  },
  {
    id: 'atm-skimming',
    name: 'ATM Skimming',
    category: 'Financial-Fraud',
    description: 'Installing devices on ATMs to capture card data and PINs to clone cards and steal funds.',
    severity: 'high',
    commonIndicators: [
      'Loose or unusual card slot',
      'Hidden cameras near PIN pad',
      'Unusual ATM appearance',
      'Difficulty inserting card'
    ],
    preventionTips: [
      'Inspect ATMs before use',
      'Cover PIN pad when entering',
      'Use ATMs in secure locations',
      'Monitor accounts for unauthorized transactions'
    ],
    examples: ['Skimmer device on card slot', 'Hidden camera recording PIN entry']
  },
  {
    id: 'card-cloning',
    name: 'Card Cloning',
    category: 'Financial-Fraud',
    description: 'Creating duplicate cards using stolen card data to make unauthorized transactions.',
    severity: 'high',
    commonIndicators: [
      'Card used in locations you haven\'t visited',
      'Small unauthorized charges',
      'Card data breach notifications',
      'Physical card still in possession'
    ],
    preventionTips: [
      'Use chip cards instead of magnetic stripe',
      'Monitor account activity regularly',
      'Report lost cards immediately',
      'Use virtual cards for online purchases'
    ],
    examples: ['Cloned card used at different location', 'Skimmer data used to create duplicate card']
  },
  {
    id: 'online-shopping-fraud',
    name: 'Online Shopping Fraud',
    category: 'Financial-Fraud',
    description: 'Fake online stores or sellers that collect payments without delivering goods.',
    severity: 'medium',
    commonIndicators: [
      'Prices too good to be true',
      'Poor website design or grammar',
      'Limited payment options',
      'No contact information or reviews'
    ],
    preventionTips: [
      'Research sellers before purchasing',
      'Use secure payment methods with buyer protection',
      'Check reviews and ratings',
      'Be skeptical of unrealistic prices'
    ],
    examples: ['Fake online store', 'Seller who never ships item']
  },
  {
    id: 'auction-fraud',
    name: 'Auction Fraud',
    category: 'Financial-Fraud',
    description: 'Fake auction listings or bidding schemes that collect payments without delivering items.',
    severity: 'medium',
    commonIndicators: [
      'Sellers refusing to use platform protection',
      'Requests for payment outside platform',
      'Fake bidding to drive up prices',
      'Item descriptions that don\'t match photos'
    ],
    preventionTips: [
      'Use platform\'s secure payment systems',
      'Research seller reputation',
      'Be skeptical of deals that seem too good',
      'Report suspicious auctions'
    ],
    examples: ['Fake auction listing', 'Shill bidding to inflate prices']
  },
  {
    id: 'fake-loan-app',
    name: 'Fake Loan App Scam',
    category: 'Financial-Fraud',
    description: 'Fraudulent lending apps that charge excessive fees, harass borrowers, or steal personal information.',
    severity: 'high',
    commonIndicators: [
      'Requests for upfront fees',
      'Excessive interest rates',
      'Access to contacts and photos',
      'Harassment for repayment'
    ],
    preventionTips: [
      'Use only licensed lending apps',
      'Read terms and conditions carefully',
      'Never pay upfront fees for loans',
      'Check app reviews and ratings'
    ],
    examples: ['Predatory lending app', 'Loan app requiring excessive permissions']
  },
  {
    id: 'investment-scam',
    name: 'Investment Scam',
    category: 'Financial-Fraud',
    description: 'Fraudulent investment schemes promising high returns with little or no risk.',
    severity: 'high',
    commonIndicators: [
      'Guaranteed high returns',
      'Pressure to invest quickly',
      'Complex or vague investment strategies',
      'Unregistered investment opportunities'
    ],
    preventionTips: [
      'Verify investment registration',
      'Be skeptical of guaranteed returns',
      'Research investment opportunities thoroughly',
      'Consult licensed financial advisors'
    ],
    examples: ['Ponzi scheme', 'Fake investment platform']
  },
  {
    id: 'ponzi-scheme',
    name: 'Ponzi Scheme',
    category: 'Financial-Fraud',
    description: 'Fraudulent investment operation that pays returns to earlier investors using funds from newer investors.',
    severity: 'critical',
    commonIndicators: [
      'Consistent high returns regardless of market',
      'Focus on recruiting new investors',
      'Complex or secretive investment strategies',
      'Difficulty withdrawing funds'
    ],
    preventionTips: [
      'Be skeptical of consistent high returns',
      'Understand the investment strategy',
      'Verify registration and compliance',
      'Diversify investments'
    ],
    examples: ['Classic Ponzi scheme', 'Multi-level marketing investment fraud']
  },
  {
    id: 'pyramid-scheme',
    name: 'Pyramid Scheme',
    category: 'Financial-Fraud',
    description: 'Fraudulent business model that recruits members with promise of payments for enrolling others.',
    severity: 'high',
    commonIndicators: [
      'Focus on recruitment over product sales',
      'Required payments to join',
      'Promises of easy income',
      'Complex commission structures'
    ],
    preventionTips: [
      'Focus on product value, not recruitment',
      'Be skeptical of recruitment-focused opportunities',
      'Research company business model',
      'Check for regulatory warnings'
    ],
    examples: ['MLM pyramid scheme', 'Recruitment-based income scam']
  },
  {
    id: 'rug-pull',
    name: 'Rug Pull Scam',
    category: 'Financial-Fraud',
    description: 'Developers abandon projects after collecting funds, leaving investors with worthless tokens.',
    severity: 'high',
    commonIndicators: [
      'Developers stop communicating',
      'Liquidity suddenly removed',
      'Token price crashes to zero',
      'Social media accounts abandoned'
    ],
    preventionTips: [
      'Research development team',
      'Look for locked liquidity',
      'Be cautious of anonymous teams',
      'Monitor project activity closely'
    ],
    examples: ['DeFi rug pull', 'NFT project abandonment']
  },
  {
    id: 'honeypot-scam',
    name: 'Honeypot Scam',
    category: 'Financial-Fraud',
    description: 'Smart contracts or trading pairs that appear legitimate but prevent selling or withdrawing funds.',
    severity: 'high',
    commonIndicators: [
      'Unable to sell tokens',
      'High trading volume but no sellers',
      'Unusual contract restrictions',
      'Token price only goes up'
    ],
    preventionTips: [
      'Research smart contract code',
      'Test with small amounts first',
      'Look for contract audits',
      'Be cautious of too-good-to-be-true returns'
    ],
    examples: ['Token that cannot be sold', 'Trading pair with sell restrictions']
  },
  {
    id: 'pump-and-dump',
    name: 'Pump and Dump Scam',
    category: 'Financial-Fraud',
    description: 'Inflating asset prices through false statements, then selling at the peak to cause losses for other investors.',
    severity: 'high',
    commonIndicators: [
      'Sudden, unexplained price increases',
      'Aggressive promotion by unknown groups',
      'Insiders selling during the pump',
      'No fundamental reason for price increase'
    ],
    preventionTips: [
      'Research before investing',
      'Be skeptical of hot tips',
      'Don\'t invest based on hype alone',
      'Take profits when targets are met'
    ],
    examples: ['Crypto pump and dump', 'Stock manipulation scheme']
  },
  {
    id: 'wallet-drainer',
    name: 'Wallet Drainer Scam',
    category: 'Financial-Fraud',
    description: 'Malicious smart contracts or websites that drain cryptocurrency wallets when connected.',
    severity: 'critical',
    commonIndicators: [
      'Requests to connect wallet to unknown sites',
      'Unexpected transaction approvals',
      'Wallet balance decreasing without action',
      'Suspicious browser extensions'
    ],
    preventionTips: [
      'Only connect wallets to verified sites',
      'Review transaction details before approving',
      'Use hardware wallets for large holdings',
      'Be cautious of browser extensions'
    ],
    examples: ['Fake NFT mint draining wallet', 'Malicious dApp stealing funds']
  },
  {
    id: 'nft-scam',
    name: 'NFT Scam',
    category: 'Financial-Fraud',
    description: 'Various fraudulent schemes involving NFTs including fake projects, wash trading, and theft.',
    severity: 'medium',
    commonIndicators: [
      'Copied artwork from other projects',
      'Anonymous teams with no track record',
      'Unrealistic promises of returns',
      'Pressure to buy quickly'
    ],
    preventionTips: [
      'Verify artwork originality',
      'Research project team',
      'Use established marketplaces',
      'Be cautious of hype-driven purchases'
    ],
    examples: ['Fake NFT project', 'Wash trading to inflate prices']
  },
  {
    id: 'romance-scam',
    name: 'Romance Scam',
    category: 'Financial-Fraud',
    description: 'Building fake romantic relationships to manipulate victims into sending money or sharing financial information.',
    severity: 'high',
    commonIndicators: [
      'Quick declarations of love',
      'Refusal to meet in person or video call',
      'Requests for money or financial help',
      'Complicated stories requiring financial assistance'
    ],
    preventionTips: [
      'Be skeptical of online relationships',
      'Never send money to someone you haven\'t met',
      'Verify identity through video calls',
      'Report suspicious behavior'
    ],
    examples: ['Online partner requesting money', 'Fake profile on dating site']
  },
  {
    id: 'sextortion',
    name: 'Sextortion',
    category: 'Financial-Fraud',
    description: 'Blackmail using explicit content or threats to expose sexual information to extort money.',
    severity: 'critical',
    commonIndicators: [
      'Threats to expose explicit content',
      'Demands for payment to prevent exposure',
      'Claims of having compromising material',
      'Urgency and emotional manipulation'
    ],
    preventionTips: [
      'Never share explicit content online',
      'Don\'t pay extortion demands',
      'Report to authorities immediately',
      'Preserve evidence for investigation'
    ],
    examples: ['Blackmail using intimate photos', 'Threats to expose online activity']
  },

  // TECHNICAL ATTACKS
  {
    id: 'password-attack',
    name: 'Password Attack',
    category: 'Technical-Attacks',
    description: 'Various methods to crack or steal passwords to gain unauthorized access to accounts.',
    severity: 'high',
    commonIndicators: [
      'Multiple failed login attempts',
      'Account lockout notifications',
      'Password reset emails you didn\'t request',
      'Login from unusual locations'
    ],
    preventionTips: [
      'Use strong, unique passwords',
      'Enable multi-factor authentication',
      'Use password managers',
      'Monitor account activity'
    ],
    examples: ['Brute force attack', 'Credential stuffing']
  },
  {
    id: 'brute-force',
    name: 'Brute Force Attack',
    category: 'Technical-Attacks',
    description: 'Systematically trying all possible password combinations until the correct one is found.',
    severity: 'medium',
    commonIndicators: [
      'Multiple failed login attempts',
      'Account lockouts',
      'Unusual login patterns',
      'High CPU usage on authentication servers'
    ],
    preventionTips: [
      'Use strong, complex passwords',
      'Implement account lockout policies',
      'Use multi-factor authentication',
      'Monitor for suspicious login attempts'
    ],
    examples: ['Automated password guessing', 'Dictionary attack']
  },
  {
    id: 'dictionary-attack',
    name: 'Dictionary Attack',
    category: 'Technical-Attacks',
    description: 'Using lists of common passwords and words to guess passwords, more efficient than pure brute force.',
    severity: 'medium',
    commonIndicators: [
      'Failed login attempts with common passwords',
      'Patterns in login attempts',
      'Targeted attacks on weak passwords',
      'Automated guessing patterns'
    ],
    preventionTips: [
      'Avoid common words in passwords',
      'Use passphrases instead of passwords',
      'Enable multi-factor authentication',
      'Use unique passwords for each account'
    ],
    examples: ['Using common password lists', 'Word combination attacks']
  },
  {
    id: 'keylogging',
    name: 'Keylogging',
    category: 'Technical-Attacks',
    description: 'Malware that records keystrokes to capture passwords, credit card numbers, and other sensitive information.',
    severity: 'high',
    commonIndicators: [
      'Slow computer performance',
      'Unusual processes running',
      'Antivirus detecting keyloggers',
      'Strange behavior when typing passwords'
    ],
    preventionTips: [
      'Use reputable antivirus software',
      'Avoid suspicious downloads',
      'Use virtual keyboards for sensitive input',
      'Keep software updated'
    ],
    examples: ['Hardware keylogger', 'Software keylogger']
  },
  {
    id: 'spyware',
    name: 'Spyware Attack',
    category: 'Technical-Attacks',
    description: 'Malicious software that gathers information about a person or organization without their knowledge.',
    severity: 'high',
    commonIndicators: [
      'Slow computer performance',
      'Unusual pop-up advertisements',
      'Changed browser settings',
      'Unexplained data usage'
    ],
    preventionTips: [
      'Use reputable antivirus software',
      'Be cautious of downloads',
      'Keep software updated',
      'Use firewall protection'
    ],
    examples: ['Tracking cookies', 'Monitoring software']
  },
  {
    id: 'malware',
    name: 'Malware Attack',
    category: 'Technical-Attacks',
    description: 'Malicious software designed to damage, disrupt, or gain unauthorized access to computer systems.',
    severity: 'high',
    commonIndicators: [
      'Slow system performance',
      'Unusual system behavior',
      'Unexpected pop-ups or crashes',
      'Files appearing or disappearing'
    ],
    preventionTips: [
      'Use reputable antivirus software',
      'Keep software and systems updated',
      'Be cautious of email attachments',
      'Use firewall protection'
    ],
    examples: ['Virus infection', 'Trojan horse']
  },
  {
    id: 'ransomware',
    name: 'Ransomware Attack',
    category: 'Technical-Attacks',
    description: 'Malware that encrypts files and demands payment for the decryption key.',
    severity: 'critical',
    commonIndicators: [
      'Files suddenly encrypted',
      'Ransom demand messages',
      'Unable to access files',
      'Unusual file extensions'
    ],
    preventionTips: [
      'Regular backups of important files',
      'Keep software updated',
      'Be cautious of email attachments',
      'Use reputable antivirus software'
    ],
    examples: ['WannaCry ransomware', 'File-encrypting malware']
  },
  {
    id: 'trojan',
    name: 'Trojan Horse Attack',
    category: 'Technical-Attacks',
    description: 'Malware disguised as legitimate software that tricks users into installing it.',
    severity: 'high',
    commonIndicators: [
      'Programs you didn\'t install',
      'Unusual system behavior',
      'Slow performance',
      'Unexpected network activity'
    ],
    preventionTips: [
      'Only download from trusted sources',
      'Verify software authenticity',
      'Use reputable antivirus software',
      'Be cautious of email attachments'
    ],
    examples: ['Fake antivirus program', 'Malicious game download']
  },
  {
    id: 'worm',
    name: 'Worm Attack',
    category: 'Technical-Attacks',
    description: 'Self-replicating malware that spreads across networks without user interaction.',
    severity: 'high',
    commonIndicators: [
      'Slow network performance',
      'Unusual network traffic',
      'Multiple systems infected',
      'High bandwidth usage'
    ],
    preventionTips: [
      'Keep systems updated with security patches',
      'Use firewall protection',
      'Segment networks to limit spread',
      'Educate users about security'
    ],
    examples: ['Network worm', 'Email worm']
  },
  {
    id: 'virus',
    name: 'Virus Attack',
    category: 'Technical-Attacks',
    description: 'Malicious code that attaches itself to legitimate programs and replicates when executed.',
    severity: 'medium',
    commonIndicators: [
      'Files becoming corrupted',
      'Unusual program behavior',
      'Slow system performance',
      'Unexpected error messages'
    ],
    preventionTips: [
      'Use reputable antivirus software',
      'Scan downloaded files',
      'Keep software updated',
      'Be cautious of email attachments'
    ],
    examples: ['File-infector virus', 'Boot sector virus']
  },
  {
    id: 'botnet',
    name: 'Botnet Attack',
    category: 'Technical-Attacks',
    description: 'Network of compromised computers controlled by attackers to perform malicious activities.',
    severity: 'high',
    commonIndicators: [
      'Slow computer performance',
      'Unusual network activity',
      'High CPU usage when idle',
      'Outgoing traffic to unknown destinations'
    ],
    preventionTips: [
      'Use reputable antivirus software',
      'Keep systems updated',
      'Monitor network traffic',
      'Be cautious of suspicious downloads'
    ],
    examples: ['DDoS botnet', 'Spam botnet']
  },
  {
    id: 'rootkit',
    name: 'Rootkit Attack',
    category: 'Technical-Attacks',
    description: 'Stealthy malware that provides privileged access while hiding its presence.',
    severity: 'critical',
    commonIndicators: [
      'Antivirus unable to detect threats',
      'Unusual system behavior',
      'Changes to system files',
      'Disabled security software'
    ],
    preventionTips: [
      'Use reputable security software',
      'Keep systems updated',
      'Monitor system integrity',
      'Use bootable antivirus for scanning'
    ],
    examples: ['Kernel-mode rootkit', 'Bootkit']
  },
  {
    id: 'adware',
    name: 'Adware Attack',
    category: 'Technical-Attacks',
    description: 'Software that displays unwanted advertisements and may collect user data.',
    severity: 'low',
    commonIndicators: [
      'Excessive pop-up advertisements',
      'Changed browser homepage',
      'Slow browser performance',
      'Unwanted toolbars or extensions'
    ],
    preventionTips: [
      'Be cautious of free software downloads',
      'Read installation agreements carefully',
      'Use ad-blocking software',
      'Regularly scan for adware'
    ],
    examples: ['Browser hijacker', 'Pop-up ad generator']
  },
  {
    id: 'cryptojacking',
    name: 'Cryptojacking',
    category: 'Technical-Attacks',
    description: 'Unauthorized use of computing resources to mine cryptocurrency.',
    severity: 'medium',
    commonIndicators: [
      'Slow computer performance',
      'High CPU usage when idle',
      'Increased electricity bills',
      'Fan running constantly'
    ],
    preventionTips: [
      'Use reputable antivirus software',
      'Install browser extensions to block mining scripts',
      'Monitor system resource usage',
      'Keep software updated'
    ],
    examples: ['Browser-based mining', 'Malware mining in background']
  },
  {
    id: 'zero-day',
    name: 'Zero-Day Exploit',
    category: 'Technical-Attacks',
    description: 'Attacks targeting unknown vulnerabilities before software developers can create patches.',
    severity: 'critical',
    commonIndicators: [
      'Unexplained system compromises',
      'Attacks on fully updated systems',
      'Unusual malware behavior',
      'No available patches for exploited vulnerability'
    ],
    preventionTips: [
      'Keep systems updated as soon as patches are available',
      'Use defense-in-depth security strategies',
      'Monitor for unusual activity',
      'Implement network segmentation'
    ],
    examples: ['Unknown vulnerability exploit', 'Zero-day in popular software']
  },
  {
    id: 'sql-injection',
    name: 'SQL Injection',
    category: 'Technical-Attacks',
    description: 'Injecting malicious SQL code into input fields to manipulate databases.',
    severity: 'critical',
    commonIndicators: [
      'Unusual database errors',
      'Unexpected data in database',
      'Strange query patterns in logs',
      'Data appearing or disappearing'
    ],
    preventionTips: [
      'Use parameterized queries',
      'Validate and sanitize all inputs',
      'Implement least privilege database access',
      'Use web application firewalls'
    ],
    examples: ['Login bypass via SQL injection', 'Database exfiltration']
  },
  {
    id: 'xss',
    name: 'Cross-Site Scripting (XSS)',
    category: 'Technical-Attacks',
    description: 'Injecting malicious scripts into web pages viewed by other users.',
    severity: 'high',
    commonIndicators: [
      'Strange scripts in page source',
      'Unexpected pop-ups or redirects',
      'Cookie theft attempts',
      'Unusual JavaScript execution'
    ],
    preventionTips: [
      'Validate and sanitize all inputs',
      'Implement Content Security Policy',
      'Encode output data',
      'Use HTTP-only cookies'
    ],
    examples: ['Reflected XSS', 'Stored XSS']
  },
  {
    id: 'csrf',
    name: 'Cross-Site Request Forgery (CSRF)',
    category: 'Technical-Attacks',
    description: 'Tricking users into executing unwanted actions on websites where they\'re authenticated.',
    severity: 'high',
    commonIndicators: [
      'Unwanted actions on authenticated sites',
      'Unexpected transactions or changes',
      'Links that trigger actions without consent',
      'State-changing requests from suspicious sources'
    ],
    preventionTips: [
      'Implement anti-CSRF tokens',
      'Use same-site cookie attributes',
      'Verify request origins',
      'Require re-authentication for sensitive actions'
    ],
    examples: ['Unwanted password change', 'Unauthorized fund transfer']
  },
  {
    id: 'rce',
    name: 'Remote Code Execution (RCE)',
    category: 'Technical-Attacks',
    description: 'Attackers executing arbitrary code on a target system from a remote location.',
    severity: 'critical',
    commonIndicators: [
      'Unusual processes running',
      'Unexpected system changes',
      'Remote connections to system',
      'Files appearing or being modified'
    ],
    preventionTips: [
      'Keep systems updated',
      'Validate and sanitize all inputs',
      'Implement least privilege access',
      'Use network segmentation'
    ],
    examples: 'RCE via vulnerability in web application',
  },
  {
    id: 'dos',
    name: 'Denial of Service (DoS)',
    category: 'Technical-Attacks',
    description: 'Making a service unavailable to legitimate users by overwhelming it with traffic or requests.',
    severity: 'high',
    commonIndicators: [
      'Service slow or unavailable',
      'High resource usage',
      'Unusual traffic patterns',
      'Multiple connection attempts'
    ],
    preventionTips: [
      'Implement rate limiting',
      'Use DDoS protection services',
      'Scale infrastructure to handle traffic',
      'Monitor for attack patterns'
    ],
    examples: ['Resource exhaustion attack', 'Protocol attack']
  },
  {
    id: 'ddos',
    name: 'Distributed Denial of Service (DDoS)',
    category: 'Technical-Attacks',
    description: 'Using multiple compromised systems to attack a target, making it unavailable.',
    severity: 'critical',
    commonIndicators: [
      'Service completely unavailable',
      'Massive traffic from multiple sources',
      'Overwhelmed infrastructure',
      'Legitimate users unable to access'
    ],
    preventionTips: [
      'Use DDoS protection services',
      'Implement traffic filtering',
      'Have incident response plans',
      'Use content delivery networks'
    ],
    examples: ['Volumetric DDoS attack', 'Application layer DDoS']
  },
  {
    id: 'mitm',
    name: 'Man-in-the-Middle Attack (MITM)',
    category: 'Technical-Attacks',
    description: 'Intercepting communication between two parties to steal or manipulate data.',
    severity: 'high',
    commonIndicators: [
      'Unusual SSL certificate warnings',
      'Unexpected network delays',
      'Strange network behavior',
      'Data appearing modified'
    ],
    preventionTips: [
      'Use HTTPS for all communications',
      'Verify SSL certificates',
      'Use VPNs on public networks',
      'Implement certificate pinning'
    ],
    examples: ['Wi-Fi interception', 'SSL stripping']
  },
  {
    id: 'session-hijacking',
    name: 'Session Hijacking',
    category: 'Technical-Attacks',
    description: 'Taking over a legitimate user session to gain unauthorized access.',
    severity: 'high',
    commonIndicators: [
      'Logged out unexpectedly',
      'Session ID in URLs',
      'Unusual session activity',
      'Multiple sessions from different locations'
    ],
    preventionTips: [
      'Use secure session management',
      'Implement session timeouts',
      'Use HTTP-only and secure cookies',
      'Regenerate session IDs after login'
    ],
    examples: ['Session fixation', 'Session side-jacking']
  },
  {
    id: 'dns-spoofing',
    name: 'DNS Spoofing',
    category: 'Technical-Attacks',
    description: 'Corrupting DNS cache to redirect users to malicious websites.',
    severity: 'high',
    commonIndicators: [
      'Redirected to unexpected websites',
      'Certificate warnings',
      'Different website appearance',
      'Unusual DNS resolution'
    ],
    preventionTips: [
      'Use DNSSEC',
      'Configure DNS servers carefully',
      'Use HTTPS and verify certificates',
      'Monitor DNS traffic'
    ],
    examples: ['DNS cache poisoning', 'Fake website redirection']
  },
  {
    id: 'arp-spoofing',
    name: 'ARP Spoofing',
    category: 'Technical-Attacks',
    description: 'Sending fake ARP messages to associate attacker\'s MAC with legitimate IP address.',
    severity: 'medium',
    commonIndicators: [
      'Duplicate IP address warnings',
      'Slow network performance',
      'Unusual ARP table entries',
      'Intermittent connectivity issues'
    ],
    preventionTips: [
      'Use static ARP entries',
      'Implement port security',
      'Use VPNs',
      'Monitor ARP traffic'
    ],
    examples: ['LAN traffic interception', 'Man-in-the-middle on local network']
  },
  {
    id: 'ip-spoofing',
    name: 'IP Spoofing',
    category: 'Technical-Attacks',
    description: 'Forging source IP addresses to hide attacker identity or impersonate trusted systems.',
    severity: 'medium',
    commonIndicators: [
      'Traffic from unexpected IP ranges',
      'Authentication failures',
      'Unusual routing patterns',
      'Log entries showing impossible source IPs'
    ],
    preventionTips: [
      'Implement ingress filtering',
      'Use authentication mechanisms',
      'Monitor for spoofed traffic',
      'Use encryption and authentication'
    ],
    examples: ['DDoS with spoofed IPs', 'Bypassing IP-based access controls']
  },
  {
    id: 'packet-sniffing',
    name: 'Packet Sniffing',
    category: 'Technical-Attacks',
    description: 'Capturing network traffic to steal sensitive information transmitted over the network.',
    severity: 'medium',
    commonIndicators: [
      'Unusual network monitoring tools',
      'High network utilization',
      'Suspicious network traffic patterns',
      'Data leakage indicators'
    ],
    preventionTips: [
      'Use encryption for sensitive data',
      'Implement network segmentation',
      'Monitor for sniffing tools',
      'Use secure protocols (HTTPS, SSH)'
    ],
    examples: ['Wireshark capture of unencrypted traffic', 'Password capture on open Wi-Fi']
  },
  {
    id: 'wifi-hacking',
    name: 'Wi-Fi Hacking',
    category: 'Technical-Attacks',
    description: 'Unauthorized access to Wi-Fi networks to intercept data or gain network access.',
    severity: 'medium',
    commonIndicators: [
      'Unknown devices on network',
      'Slow Wi-Fi performance',
      'Unusual network activity',
      'Changed router settings'
    ],
    preventionTips: [
      'Use strong Wi-Fi passwords',
      'Enable WPA3 encryption',
      'Change default router credentials',
      'Use separate guest networks'
    ],
    examples: ['Wi-Fi password cracking', 'Evil twin attack']
  },
  {
    id: 'evil-twin',
    name: 'Evil Twin Attack',
    category: 'Technical-Attacks',
    description: 'Creating fake Wi-Fi access points to trick users into connecting and intercepting their traffic.',
    severity: 'high',
    commonIndicators: [
      'Multiple Wi-Fi networks with similar names',
      'Connection issues with legitimate network',
      'Certificate warnings on websites',
      'Slow internet after connecting'
    ],
    preventionTips: [
      'Verify Wi-Fi network names',
      'Use VPNs on public Wi-Fi',
      'Disable auto-connect to Wi-Fi',
      'Check with venue for official network name'
    ],
    examples: ['Fake coffee shop Wi-Fi', 'Airport Wi-Fi impersonation']
  },
  {
    id: 'browser-hijacking',
    name: 'Browser Hijacking',
    category: 'Technical-Attacks',
    description: 'Malicious software modifying browser settings to redirect users or display unwanted content.',
    severity: 'medium',
    commonIndicators: [
      'Changed browser homepage',
      'Unwanted toolbars or extensions',
      'Redirected search results',
      'Excessive pop-up advertisements'
    ],
    preventionTips: [
      'Be cautious of browser extensions',
      'Keep browser updated',
      'Use reputable security software',
      'Reset browser if hijacked'
    ],
    examples: ['Homepage hijacker', 'Search engine redirect']
  },
  {
    id: 'usb-malware',
    name: 'USB Malware Attack',
    category: 'Technical-Attacks',
    description: 'Spreading malware through infected USB drives that execute when connected.',
    severity: 'medium',
    commonIndicators: [
      'Auto-running programs from USB',
      'Antivirus detecting threats on USB',
      'Unusual files on USB drives',
      'System infection after USB connection'
    ],
    preventionTips: [
      'Disable autorun on USB devices',
      'Scan USB drives before use',
      'Don\'t use unknown USB drives',
      'Keep antivirus updated'
    ],
    examples: ['USB drive with malware', 'BadUSB attack']
  },
  {
    id: 'iot-hacking',
    name: 'IoT Device Hacking',
    category: 'Technical-Attacks',
    description: 'Compromising Internet of Things devices to steal data, launch attacks, or gain network access.',
    severity: 'high',
    commonIndicators: [
      'Unusual device behavior',
      'High network usage from IoT devices',
      'Device settings changed unexpectedly',
      'Unknown devices on network'
    ],
    preventionTips: [
      'Change default IoT device passwords',
      'Keep IoT firmware updated',
      'Segment IoT networks',
      'Disable unnecessary features'
    ],
    examples: ['Smart camera hack', 'IoT botnet recruitment']
  },
  {
    id: 'cloud-hacking',
    name: 'Cloud Hacking',
    category: 'Technical-Attacks',
    description: 'Unauthorized access to cloud services and data through misconfigurations or vulnerabilities.',
    severity: 'critical',
    commonIndicators: [
      'Unusual cloud access patterns',
      'Data exfiltration from cloud storage',
      'Unauthorized cloud resource creation',
      'Misconfigured security settings'
    ],
    preventionTips: [
      'Implement proper cloud security configurations',
      'Use multi-factor authentication',
      'Monitor cloud access logs',
      'Encrypt sensitive cloud data'
    ],
    examples: ['S3 bucket misconfiguration', 'Cloud credential theft']
  },
  {
    id: 'database-hacking',
    name: 'Database Hacking',
    category: 'Technical-Attacks',
    description: 'Unauthorized access to databases to steal, modify, or delete data.',
    severity: 'critical',
    commonIndicators: [
      'Unusual database access patterns',
      'Data appearing or disappearing',
      'Unexpected query patterns',
      'Performance degradation'
    ],
    preventionTips: [
      'Implement strong database authentication',
      'Use parameterized queries',
      'Encrypt sensitive data',
      'Regularly audit database access'
    ],
    examples: ['SQL injection attack', 'Credential theft for database access']
  },
  {
    id: 'mobile-banking-malware',
    name: 'Mobile Banking Malware',
    category: 'Technical-Attacks',
    description: 'Malicious software targeting mobile devices to steal banking credentials or intercept transactions.',
    severity: 'high',
    commonIndicators: [
      'Unusual app behavior',
      'Battery draining quickly',
    ],
    preventionTips: [
      'Only download apps from official stores',
      'Keep mobile OS updated',
      'Use mobile security software',
      'Enable app verification'
    ],
    examples: ['Fake banking app', 'SMS interception malware']
  },

  // OTHER CYBER CRIMES
  {
    id: 'cyber-stalking',
    name: 'Cyber Stalking',
    category: 'Identity-Crimes',
    description: 'Using internet, email, or other electronic communications to stalk or harass someone.',
    severity: 'high',
    commonIndicators: [
      'Unwanted persistent online contact',
      'Threatening or harassing messages',
      'Monitoring of online activity',
      'Location tracking without consent'
    ],
    preventionTips: [
      'Document all stalking incidents',
      'Block and report stalkers',
      'Adjust privacy settings on social media',
      'Report to law enforcement'
    ],
    examples: ['Persistent unwanted messages', 'Online harassment campaign']
  },
  {
    id: 'cyber-bullying',
    name: 'Cyber Bullying',
    category: 'Identity-Crimes',
    description: 'Using digital communication to bully, threaten, or harass individuals.',
    severity: 'medium',
    commonIndicators: [
      'Hurtful messages or posts',
      'Sharing embarrassing information',
      'Exclusion from online groups',
      'Threatening or intimidating behavior'
    ],
    preventionTips: [
      'Don\'t respond to bullies',
      'Save evidence of bullying',
      'Block and report bullies',
      'Seek help from trusted adults or authorities'
    ],
    examples: ['Harassing social media posts', 'Threatening messages']
  },
  {
    id: 'online-harassment',
    name: 'Online Harassment',
    category: 'Identity-Crimes',
    description: 'Repeated unwanted digital communication intended to disturb or upset.',
    severity: 'medium',
    commonIndicators: [
      'Repeated unwanted messages',
      'Threatening or abusive language',
      'Targeted harassment across platforms',
      'Coordinated attacks'
    ],
    preventionTips: [
      'Document all harassment',
      'Block and report harassers',
      'Adjust privacy settings',
      'Report to platform and authorities'
    ],
    examples: ['Coordinated harassment campaign', 'Targeted abuse online']
  },
  {
    id: 'revenge-porn',
    name: 'Revenge Porn',
    category: 'Identity-Crimes',
    description: 'Distributing intimate images or videos without consent to harm or embarrass someone.',
    severity: 'critical',
    commonIndicators: [
      'Intimate images shared without consent',
      'Threats to share intimate content',
      'Blackmail using intimate material',
      'Non-consensual distribution online'
    ],
    preventionTips: [
      'Never share intimate images online',
      'Report non-consensual sharing immediately',
      'Document and preserve evidence',
      'Seek legal assistance'
    ],
    examples: ['Ex-partner sharing intimate photos', 'Non-consensual image distribution']
  },
  {
    id: 'child-exploitation',
    name: 'Child Exploitation Crime',
    category: 'Identity-Crimes',
    description: 'Crimes involving the sexual exploitation or abuse of children online.',
    severity: 'critical',
    commonIndicators: [
      'Inappropriate communication with minors',
      'Requests for intimate images from minors',
      'Grooming behavior',
      'Sharing of child exploitation material'
    ],
    preventionTips: [
      'Monitor children\'s online activity',
      'Educate children about online safety',
      'Report suspicious activity immediately',
      'Use parental controls appropriately'
    ],
    examples: ['Online grooming of minors', 'Child exploitation material distribution']
  },
  {
    id: 'human-trafficking',
    name: 'Human Trafficking via Internet',
    category: 'Identity-Crimes',
    description: 'Using online platforms to recruit, advertise, or facilitate human trafficking.',
    severity: 'critical',
    commonIndicators: [
      'Suspicious job offers',
      'Recruitment for exploitative situations',
      'Online advertisements for trafficking',
      'Grooming for exploitation'
    ],
    preventionTips: [
      'Be cautious of online job offers',
      'Verify organizations and opportunities',
      'Report suspicious recruitment',
      'Educate about trafficking indicators'
    ],
    examples: ['Fake job offers for exploitation', 'Online recruitment for trafficking']
  },
  {
    id: 'dark-web-crime',
    name: 'Dark Web Crime',
    category: 'Identity-Crimes',
    description: 'Illegal activities conducted on the dark web including drug sales, weapons trafficking, and hitman services.',
    severity: 'critical',
    commonIndicators: [
      'Access to illegal marketplaces',
      'Purchase of illegal goods/services',
      'Participation in criminal forums',
      'Use of anonymizing services for crime'
    ],
    preventionTips: [
      'Avoid accessing dark web marketplaces',
      'Report illegal activities',
      'Educate about dark web risks',
      'Monitor for compromised credentials'
    ],
    examples: ['Illegal marketplace transactions', 'Criminal forum participation']
  },
  {
    id: 'cyber-terrorism',
    name: 'Cyber Terrorism',
    category: 'Identity-Crimes',
    description: 'Using cyber attacks to intimidate or coerce governments or societies for political or ideological goals.',
    severity: 'critical',
    commonIndicators: [
      'Attacks on critical infrastructure',
      'Politically motivated hacking',
      'Coordinated cyber campaigns',
      'Threats of cyber attacks for political goals'
    ],
    preventionTips: [
      'Implement robust security measures',
      'Monitor for threat intelligence',
      'Have incident response plans',
      'Report suspicious activities'
    ],
    examples: ['Attack on power grid', 'Government website defacement for political message']
  },
  {
    id: 'cyber-espionage',
    name: 'Cyber Espionage',
    category: 'Identity-Crimes',
    description: 'Using cyber techniques to spy on organizations, governments, or individuals to steal sensitive information.',
    severity: 'critical',
    commonIndicators: [
      'Targeted attacks on specific organizations',
      'Data exfiltration of sensitive information',
      'Advanced persistent threats',
      'State-sponsored hacking'
    ],
    preventionTips: [
      'Implement strong security controls',
      'Monitor for advanced threats',
      'Protect sensitive data',
      'Conduct regular security assessments'
    ],
    examples: ['State-sponsored data theft', 'Corporate espionage via hacking']
  },
  {
    id: 'hacktivism',
    name: 'Hacktivism',
    category: 'Identity-Crimes',
    description: 'Using hacking techniques to promote political or social agendas, often through website defacements or data leaks.',
    severity: 'medium',
    commonIndicators: [
      'Website defacements with political messages',
      'Data leaks for political reasons',
      'DDoS attacks for political causes',
      'Social media hacking for activism'
    ],
    preventionTips: [
      'Implement strong security measures',
      'Monitor for hacktivist threats',
      'Have incident response plans',
      'Keep systems updated'
    ],
    examples: ['Website defacement for political message', 'Data leak for activist cause']
  },
  {
    id: 'supply-chain-attack',
    name: 'Supply Chain Attack',
    category: 'Technical-Attacks',
    description: 'Attacking software or hardware supply chains to compromise multiple organizations through trusted vendors.',
    severity: 'critical',
    commonIndicators: [
      'Compromised software updates',
      'Malicious code in legitimate software',
      'Multiple organizations affected similarly',
      'Suspicious vendor activity'
    ],
    preventionTips: [
      'Verify software integrity',
      'Monitor vendor security',
      'Implement software composition analysis',
      'Have supply chain incident response plans'
    ],
    examples: ['Malicious software update', 'Compromised hardware component']
  },
  {
    id: 'fake-mobile-app',
    name: 'Fake Mobile App Scam',
    category: 'Technical-Attacks',
    description: 'Malicious or fake mobile applications designed to steal data or money from users.',
    severity: 'high',
    commonIndicators: [
      'Apps requesting excessive permissions',
      'Poor reviews or few downloads',
      'Apps not from official stores',
      'Similar names to legitimate apps'
    ],
    preventionTips: [
      'Only download from official app stores',
      'Check app reviews and developer info',
      'Review app permissions carefully',
      'Use mobile security software'
    ],
    examples: ['Fake banking app', 'Malicious game with hidden data theft']
  },
  {
    id: 'crypto-scam-general',
    name: 'Crypto Scam',
    category: 'Financial-Fraud',
    description: 'General fraudulent schemes targeting cryptocurrency investors and users through various deceptive tactics.',
    severity: 'high',
    commonIndicators: [
      'Promises of guaranteed high returns',
      'Unverified investment platforms',
      'Pressure to act quickly',
      'Requests for wallet access or private keys'
    ],
    preventionTips: [
      'Research projects thoroughly before investing',
      'Never share private keys or wallet access',
      'Use only reputable exchanges',
      'Be skeptical of guaranteed returns'
    ],
    examples: ['Fake crypto investment platform', 'Ponzi scheme using cryptocurrency']
  },
  {
    id: 'romance-scam-cyber',
    name: 'Romance Scam',
    category: 'Identity-Crimes',
    description: 'Online fraud where criminals build fake romantic relationships to manipulate victims into sending money.',
    severity: 'high',
    commonIndicators: [
      'Quick declarations of love',
      'Refusal to video call or meet in person',
      'Requests for money for emergencies',
      'Complicated stories requiring financial help'
    ],
    preventionTips: [
      'Never send money to someone you haven\'t met',
      'Verify identity through video calls',
      'Be skeptical of online relationships moving too fast',
      'Research profile photos for authenticity'
    ],
    examples: ['Fake military romance scam', 'Online partner with sudden emergency']
  },
  {
    id: 'sextortion-cyber',
    name: 'Sextortion',
    category: 'Identity-Crimes',
    description: 'Blackmail where attackers threaten to release intimate images or videos unless the victim pays money.',
    severity: 'critical',
    commonIndicators: [
      'Threats to release compromising photos or videos',
      'Demands for payment in cryptocurrency or gift cards',
      'Claims of having hacked your device or webcam',
      'Urgency and emotional manipulation tactics'
    ],
    preventionTips: [
      'Never share intimate images online',
      'Don\'t pay extortion demands - it won\'t stop them',
      'Report to authorities immediately',
      'Preserve evidence for investigation'
    ],
    examples: ['Blackmail using fake intimate photos', 'Threats to expose online activity to family']
  }
];

export const getScamsByCategory = (category: ScamCategory): ScamType[] => {
  return scamDatabase.filter(scam => scam.category === category);
};

export const getScamById = (id: string): ScamType | undefined => {
  return scamDatabase.find(scam => scam.id === id);
};

export const searchScams = (query: string): ScamType[] => {
  const lowerQuery = query.toLowerCase();
  return scamDatabase.filter(scam => 
    scam.name.toLowerCase().includes(lowerQuery) ||
    scam.description.toLowerCase().includes(lowerQuery) ||
    scam.commonIndicators.some(indicator => indicator.toLowerCase().includes(lowerQuery))
  );
};
