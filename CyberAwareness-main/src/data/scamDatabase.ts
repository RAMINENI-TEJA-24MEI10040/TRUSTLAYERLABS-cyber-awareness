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
    examples: ['RCE via vulnerability in web application'],
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
  },
  {
    id: 'honeypot-token-scam',
    name: 'Honeypot Token Scam',
    category: 'Crypto-Fraud',
    description: 'Scammers create tokens with code that prevents selling after purchase, trapping investors\' funds.',
    severity: 'high',
    commonIndicators: [
      'Token cannot be sold after purchase',
      'Unusually high returns promised',
      'No liquidity pool access',
      'Hidden code in smart contract'
    ],
    preventionTips: [
      'Audit smart contracts before investing',
      'Check token liquidity and sellability',
      'Use contract analysis tools',
      'Research the development team'
    ],
    examples: ['Token that locks selling function', 'Contract with hidden withdrawal restrictions']
  },
  {
    id: 'pump-dump-scheme',
    name: 'Pump and Dump Scheme',
    category: 'Crypto-Fraud',
    description: 'Coordinated buying to inflate price followed by mass selling, leaving late investors with worthless tokens.',
    severity: 'high',
    commonIndicators: [
      'Sudden price spikes without news',
      'Coordinated social media promotion',
      'Anonymous groups promoting tokens',
      'Rapid price crashes after peak'
    ],
    preventionTips: [
      'Avoid tokens with artificial hype',
      'Research before investing',
      'Be skeptical of guaranteed profits',
      'Don\'t follow crowd blindly'
    ],
    examples: ['Telegram pump groups', 'Influencer-driven token pumps']
  },
  {
    id: 'rug-pull-exit-scam',
    name: 'Rug Pull Exit Scam',
    category: 'Crypto-Fraud',
    description: 'Developers abandon a project and take all investor funds after raising capital.',
    severity: 'critical',
    commonIndicators: [
      'Developers suddenly go silent',
      'Liquidity removed from pool',
      'Website and social media go offline',
      'Token price crashes to zero'
    ],
    preventionTips: [
      'Research team background thoroughly',
      'Check if liquidity is locked',
      'Monitor project activity regularly',
      'Invest only what you can afford to lose'
    ],
    examples: ['DeFi project developers draining liquidity pool']
  },
  {
    id: 'fake-crypto-mining-investment',
    name: 'Fake Crypto Mining Investment',
    category: 'Crypto-Fraud',
    description: 'Fraudulent schemes claiming to invest in crypto mining operations with guaranteed returns.',
    severity: 'high',
    commonIndicators: [
      'Guaranteed daily returns promised',
      'No proof of actual mining operations',
      'High-pressure sales tactics',
      'Complex fee structures'
    ],
    preventionTips: [
      'Verify mining operations exist',
      'Be skeptical of guaranteed returns',
      'Research company background',
      'Avoid high-pressure investment pitches'
    ],
    examples: ['Cloud mining scams', 'Fake mining rig investment schemes']
  },
  {
    id: 'ponzi-pyramid-crypto-scheme',
    name: 'Ponzi/Pyramid Crypto Scheme',
    category: 'Crypto-Fraud',
    description: 'Fraudulent investment scheme using new investor money to pay earlier investors, eventually collapsing.',
    severity: 'critical',
    commonIndicators: [
      'Returns paid from new investor funds',
      'Focus on recruiting new members',
      'No legitimate product or service',
      'Unsustainable promised returns'
    ],
    preventionTips: [
      'Understand the investment model',
      'Be wary of recruitment-focused schemes',
      'Verify legitimate revenue sources',
      'Research regulatory compliance'
    ],
    examples: ['Crypto MLM schemes', 'High-yield investment programs']
  },
  {
    id: 'phishing-website-scam',
    name: 'Phishing Website Scam',
    category: 'Crypto-Fraud',
    description: 'Fake websites mimicking legitimate crypto exchanges or wallets to steal login credentials.',
    severity: 'high',
    commonIndicators: [
      'Slightly misspelled domain names',
      'Poor website design or grammar',
      'Requests for private keys or seed phrases',
      'Unsecure HTTP connections'
    ],
    preventionTips: [
      'Double-check website URLs carefully',
      'Use bookmarked legitimate sites',
      'Never share private keys or seed phrases',
      'Enable 2FA on all accounts'
    ],
    examples: ['Fake exchange login pages', 'Phony wallet interfaces']
  },
  {
    id: 'fake-customer-support-scam',
    name: 'Fake Customer Support Scam',
    category: 'Crypto-Fraud',
    description: 'Scammers pose as customer support to trick users into revealing sensitive information.',
    severity: 'high',
    commonIndicators: [
      'Unsolicited contact claiming to be support',
      'Requests for remote access to device',
      'Demands for private keys or passwords',
      'Urgency and pressure tactics'
    ],
    preventionTips: [
      'Only contact support through official channels',
      'Never share sensitive information with unsolicited callers',
      'Verify support agent identity',
      'Use official support numbers from websites'
    ],
    examples: ['Fake exchange support calls', 'Impersonated wallet service representatives']
  },
  {
    id: 'wallet-drainer-smart-contract',
    name: 'Wallet Drainer Smart Contract Scam',
    category: 'Crypto-Fraud',
    description: 'Malicious smart contracts that drain wallet funds when users interact with them.',
    severity: 'critical',
    commonIndicators: [
      'Unexpected wallet approval requests',
      'Contracts requesting unlimited spending',
      'Suspicious transaction details',
      'Unknown contract interactions'
    ],
    preventionTips: [
      'Review all transaction details carefully',
      'Use wallet security features',
      'Verify contract addresses',
      'Only interact with trusted contracts'
    ],
    examples: ['Malicious NFT minting contracts', 'Fake airdrop claim contracts']
  },
  {
    id: 'fake-token-approval-scam',
    name: 'Fake Token Approval Scam',
    category: 'Crypto-Fraud',
    description: 'Scammers trick users into approving unlimited token spending through fake interfaces.',
    severity: 'high',
    commonIndicators: [
      'Requests for unlimited token approval',
      'Fake token swap interfaces',
      'Unexpected approval prompts',
      'Suspicious dApp URLs'
    ],
    preventionTips: [
      'Review approval amounts carefully',
      'Only approve necessary amounts',
      'Verify dApp authenticity',
      'Use trusted platforms only'
    ],
    examples: ['Fake token swap approvals', 'Malicious DeFi interface scams']
  },
  {
    id: 'crypto-atm-scam',
    name: 'Crypto ATM Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent schemes using cryptocurrency ATMs to steal funds or facilitate money laundering.',
    severity: 'high',
    commonIndicators: [
      'Unverified ATM locations',
      'Requests for unusual verification',
      'High transaction fees',
      'Poor machine maintenance'
    ],
    preventionTips: [
      'Use only verified ATM locations',
      'Check machine for tampering',
      'Verify transaction details',
      'Report suspicious machines'
    ],
    examples: ['Fake crypto kiosks', 'Compromised Bitcoin ATMs']
  },
  {
    id: 'social-media-verification-scam',
    name: 'Social Media Verification Scam',
    category: 'Crypto-Fraud',
    description: 'Scammers offer fake verification badges on social media in exchange for cryptocurrency payments.',
    severity: 'medium',
    commonIndicators: [
      'Requests payment for verification',
      'Unofficial verification process',
      'Impersonation of platform staff',
      'Guaranteed verification claims'
    ],
    preventionTips: [
      'Only use official verification processes',
      'Never pay for verification badges',
      'Report impersonation accounts',
      'Verify through official channels'
    ],
    examples: ['Fake Twitter verification offers', 'Instagram verification scams']
  },
  {
    id: 'deepfake-video-scam',
    name: 'Deepfake Video Scam',
    category: 'Crypto-Fraud',
    description: 'AI-generated fake videos of celebrities or executives promoting crypto investments.',
    severity: 'high',
    commonIndicators: [
      'Unusual lip-sync or movements',
      'Poor video quality or artifacts',
      'Celebrity promoting unexpected projects',
      'Urgent investment calls'
    ],
    preventionTips: [
      'Verify video authenticity',
      'Cross-check with official sources',
      'Be skeptical of celebrity endorsements',
      'Research before investing'
    ],
    examples: ['Fake CEO video promoting crypto', 'Deepfake influencer investment pitches']
  },
  {
    id: 'fake-trading-competition-scam',
    name: 'Fake Trading Competition Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent trading competitions requiring deposits that are never returned.',
    severity: 'high',
    commonIndicators: [
      'Entry fees or deposits required',
      'Unrealistic prize amounts',
      'No verifiable past competitions',
      'Pressure to deposit quickly'
    ],
    preventionTips: [
      'Research competition organizers',
      'Avoid competitions requiring deposits',
      'Verify with exchange officials',
      'Read terms and conditions carefully'
    ],
    examples: ['Fake trading contests', 'Deposit-required competitions']
  },
  {
    id: 'fake-arbitrage-bot-scam',
    name: 'Fake Arbitrage Bot Scam',
    category: 'Crypto-Fraud',
    description: 'Scammers sell or rent fake trading bots claiming to generate profits through arbitrage.',
    severity: 'high',
    commonIndicators: [
      'Guaranteed profit claims',
      'Upfront fees for bot access',
      'No verifiable trading history',
      'Complex fee structures'
    ],
    preventionTips: [
      'Test bots with small amounts first',
      'Verify trading performance',
      'Research bot developer reputation',
      'Be skeptical of guaranteed profits'
    ],
    examples: ['Paid arbitrage bot subscriptions', 'Fake trading bot software']
  },
  {
    id: 'crypto-lending-platform-scam',
    name: 'Crypto Lending Platform Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent platforms offering high-interest loans that disappear with deposited funds.',
    severity: 'critical',
    commonIndicators: [
      'Unrealistically high interest rates',
      'No proper lending documentation',
      'Lack of regulatory compliance',
      'Withdrawal restrictions'
    ],
    preventionTips: [
      'Research platform reputation',
      'Verify regulatory status',
      'Start with small test deposits',
      'Understand the lending model'
    ],
    examples: ['High-yield lending platforms', 'Fake crypto loan services']
  },
  {
    id: 'liquidity-pool-exit-scam',
    name: 'Liquidity Pool Exit Scam',
    category: 'Crypto-Fraud',
    description: 'Developers remove liquidity from pools after attracting investors, causing token prices to crash.',
    severity: 'critical',
    commonIndicators: [
      'Sudden liquidity removal',
      'Token price crashes',
      'Developers go silent',
      'No warning or announcement'
    ],
    preventionTips: [
      'Check if liquidity is locked',
      'Monitor pool activity regularly',
      'Research development team',
      'Use platforms with locked liquidity'
    ],
    examples: ['DeFi liquidity drain', 'AMM pool rug pulls']
  },
  {
    id: 'mlm-crypto-scam',
    name: 'Multi-Level Marketing (MLM) Crypto Scam',
    category: 'Crypto-Fraud',
    description: 'Pyramid schemes disguised as legitimate crypto businesses requiring recruitment for income.',
    severity: 'critical',
    commonIndicators: [
      'Focus on recruitment over product',
      'Commission-based earnings structure',
      'Pressure to recruit new members',
      'No legitimate business activity'
    ],
    preventionTips: [
      'Understand the business model',
      'Avoid recruitment-focused schemes',
      'Research company background',
      'Be wary of commission promises'
    ],
    examples: ['Crypto MLM networks', 'Recruitment-based crypto schemes']
  },
  {
    id: 'fake-hardware-wallet-scam',
    name: 'Fake Hardware Wallet Scam',
    category: 'Crypto-Fraud',
    description: 'Counterfeit hardware wallets designed to steal cryptocurrency during setup or use.',
    severity: 'critical',
    commonIndicators: [
      'Unusually low prices',
      'Poor build quality',
      'Unofficial sellers',
      'Modified firmware'
    ],
    preventionTips: [
      'Buy only from official sources',
      'Verify wallet authenticity',
      'Check firmware signatures',
      'Use reputable brands'
    ],
    examples: ['Counterfeit Ledger devices', 'Fake Trezor wallets']
  },
  {
    id: 'browser-extension-wallet-theft',
    name: 'Browser Extension Wallet Theft',
    category: 'Crypto-Fraud',
    description: 'Malicious browser extensions that steal cryptocurrency from wallet accounts.',
    severity: 'high',
    commonIndicators: [
      'Unusual extension permissions',
      'Poor reviews or few downloads',
      'Requests for wallet access',
      'Suspicious developer information'
    ],
    preventionTips: [
      'Only install trusted extensions',
      'Review extension permissions',
      'Check developer reputation',
      'Use hardware wallets for large amounts'
    ],
    examples: ['Malicious wallet extensions', 'Browser add-on crypto theft']
  },
  {
    id: 'crypto-gambling-rigged-platform',
    name: 'Crypto Gambling Rigged Platform',
    category: 'Crypto-Fraud',
    description: 'Online gambling platforms using cryptocurrency that are rigged against players.',
    severity: 'high',
    commonIndicators: [
      'Unrealistic win rates advertised',
      'No provably fair system',
      'Withdrawal difficulties',
      'Lack of licensing'
    ],
    preventionTips: [
      'Use licensed and regulated platforms',
      'Verify provably fair systems',
      'Start with small amounts',
      'Research platform reputation'
    ],
    examples: ['Rigged crypto casinos', 'Fixed gambling sites']
  },
  {
    id: 'wash-trading-manipulation',
    name: 'Wash Trading Manipulation',
    category: 'Crypto-Fraud',
    description: 'Artificially inflating trading volume by buying and selling the same asset to create false market activity.',
    severity: 'high',
    commonIndicators: [
      'Unusual trading patterns',
      'High volume with no price movement',
      'Same buyers and sellers',
      'Artificial market depth'
    ],
    preventionTips: [
      'Analyze trading patterns carefully',
      'Check for wash trading indicators',
      'Use volume analysis tools',
      'Research legitimate trading activity'
    ],
    examples: ['Self-trading to inflate volume', 'Coordinated wash trading schemes']
  },
  {
    id: 'front-running-bot-scam',
    name: 'Front Running Bot Scam',
    category: 'Crypto-Fraud',
    description: 'Bots that detect large pending transactions and execute trades ahead of them to profit from price impact.',
    severity: 'high',
    commonIndicators: [
      'Transactions consistently front-run',
      'Unusual gas price patterns',
      'Predictable trading behavior',
      'MEV extraction activities'
    ],
    preventionTips: [
      'Use private mempools',
      'Set appropriate gas prices',
      'Use front-running protection tools',
      'Consider using DEX aggregators'
    ],
    examples: ['MEV bot front-running', 'Transaction sandwich attacks']
  },
  {
    id: 'fake-dao-governance-scam',
    name: 'Fake DAO Governance Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent decentralized autonomous organizations designed to steal funds through governance manipulation.',
    severity: 'critical',
    commonIndicators: [
      'Complex governance structures',
      'Hidden backdoors in contracts',
      'Centralized control despite DAO claims',
      'Unusual voting patterns'
    ],
    preventionTips: [
      'Audit DAO smart contracts',
      'Research governance token distribution',
      'Check for centralization risks',
      'Understand voting mechanisms'
    ],
    examples: ['Rug pull DAOs', 'Governance token scams']
  },
  {
    id: 'typosquatting-exchange-scam',
    name: 'Typosquatting Exchange Scam',
    category: 'Crypto-Fraud',
    description: 'Fake exchange websites with domain names similar to legitimate exchanges to steal login credentials.',
    severity: 'high',
    commonIndicators: [
      'Slightly misspelled domain names',
      'Similar-looking characters in URLs',
      'Unsecure connections',
      'Requests for sensitive information'
    ],
    preventionTips: [
      'Double-check website URLs',
      'Use bookmarked legitimate sites',
      'Enable browser security features',
      'Verify SSL certificates'
    ],
    examples: ['Binance.com vs Blnance.com', 'Fake exchange typosquatting']
  },
  {
    id: 'qr-wallet-replacement-scam',
    name: 'QR Wallet Replacement Scam',
    category: 'Crypto-Fraud',
    description: 'Scammers replace legitimate QR codes with malicious ones to redirect payments to their wallets.',
    severity: 'high',
    commonIndicators: [
      'QR codes in public places tampered with',
      'Unusual payment destinations',
      'QR codes on unofficial materials',
      'Multiple QR codes for same purpose'
    ],
    preventionTips: [
      'Verify QR code authenticity',
      'Check payment destination before confirming',
      'Use official payment methods',
      'Report suspicious QR codes'
    ],
    examples: ['Replaced merchant QR codes', 'Fake donation QR codes']
  },
  {
    id: 'token-migration-scam',
    name: 'Token Migration Scam',
    category: 'Crypto-Fraud',
    description: 'Fake token migration announcements designed to trick users into sending tokens to scammers.',
    severity: 'critical',
    commonIndicators: [
      'Unofficial migration announcements',
      'Requests to send tokens to specific addresses',
      'Urgent migration deadlines',
      'No official project communication'
    ],
    preventionTips: [
      'Verify migration through official channels',
      'Never send tokens to unverified addresses',
      'Check project official announcements',
      'Be skeptical of urgent migration claims'
    ],
    examples: ['Fake token swap announcements', 'Phony migration requests']
  },
  {
    id: 'fake-crypto-payment-gateway',
    name: 'Fake Crypto Payment Gateway',
    category: 'Crypto-Fraud',
    description: 'Fraudulent payment processing services that steal cryptocurrency transactions.',
    severity: 'high',
    commonIndicators: [
      'Unverified payment gateway',
      'Unusual fee structures',
      'No proper documentation',
      'Poor customer support'
    ],
    preventionTips: [
      'Use established payment gateways',
      'Verify gateway legitimacy',
      'Check transaction records',
      'Research provider reputation'
    ],
    examples: ['Fake crypto payment processors', 'Fraudulent merchant services']
  },
  {
    id: 'airdrop-approval-drain-scam',
    name: 'Airdrop Approval Drain Scam',
    category: 'Crypto-Fraud',
    description: 'Fake airdrop claims that trick users into approving token transfers, draining their wallets.',
    severity: 'critical',
    commonIndicators: [
      'Unexpected approval requests',
      'Fake airdrop claim websites',
      'Requests for unlimited token approvals',
      'Suspicious contract interactions'
    ],
    preventionTips: [
      'Verify airdrop legitimacy',
      'Review approval requests carefully',
      'Only interact with trusted contracts',
      'Check contract addresses'
    ],
    examples: ['Malicious airdrop claim contracts', 'Token approval drain scams']
  },
  {
    id: 'fake-stablecoin-backing-scam',
    name: 'Fake Stablecoin Backing Scam',
    category: 'Crypto-Fraud',
    description: 'Stablecoins claiming to be backed by assets but having insufficient or no reserves.',
    severity: 'critical',
    commonIndicators: [
      'No transparent reserve audits',
      'Vague backing claims',
      'Unusual price deviations',
      'Lack of regulatory compliance'
    ],
    preventionTips: [
      'Verify reserve audits',
      'Check transparency reports',
      'Research stablecoin backing',
      'Use established stablecoins'
    ],
    examples: ['Unbacked stablecoin projects', 'Fake reserve claims']
  },
  {
    id: 'nft-bidding-scam',
    name: 'NFT Bidding Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent NFT auctions where bidders\' funds are stolen or items never delivered.',
    severity: 'high',
    commonIndicators: [
      'Unusual bidding patterns',
      'Requests for direct payments',
      'Fake auction platforms',
      'No escrow protection'
    ],
    preventionTips: [
      'Use reputable NFT marketplaces',
      'Verify auction authenticity',
      'Use escrow services',
      'Research seller reputation'
    ],
    examples: ['Fake NFT auctions', 'Bid rigging schemes']
  },
  {
    id: 'nft-copyright-theft-scam',
    name: 'NFT Copyright Theft Scam',
    category: 'Crypto-Fraud',
    description: 'Scammers mint NFTs of copyrighted artwork without permission, selling stolen intellectual property.',
    severity: 'medium',
    commonIndicators: [
      'Unverified artwork sources',
      'No artist attribution',
      'Suspiciously low prices',
      'Multiple copies of unique works'
    ],
    preventionTips: [
      'Verify artist and artwork authenticity',
      'Check for official minting',
      'Research NFT provenance',
      'Report copyright violations'
    ],
    examples: ['Stolen artwork NFTs', 'Unauthorized digital art sales']
  },
  {
    id: 'fake-play-to-earn-game-scam',
    name: 'Fake Play-to-Earn Game Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent games promising earnings that require upfront investments with no return.',
    severity: 'high',
    commonIndicators: [
      'Required upfront investments',
      'Unrealistic earning promises',
      'Poor game quality or mechanics',
      'Withdrawal restrictions'
    ],
    preventionTips: [
      'Research game developers',
      'Test games before investing',
      'Be skeptical of earning claims',
      'Check community reviews'
    ],
    examples: ['Fake crypto games', 'Pay-to-earn schemes']
  },
  {
    id: 'cloud-mining-fraud',
    name: 'Cloud Mining Fraud',
    category: 'Crypto-Fraud',
    description: 'Fake cloud mining services that take payments but don\'t actually mine cryptocurrency.',
    severity: 'high',
    commonIndicators: [
      'Guaranteed returns promised',
      'No proof of mining operations',
      'High fees for mining contracts',
      'Unrealistic profit projections'
    ],
    preventionTips: [
      'Verify mining operations exist',
      'Check for proof of work',
      'Research company background',
      'Avoid guaranteed return promises'
    ],
    examples: ['Fake cloud mining contracts', 'Non-existent mining farms']
  },
  {
    id: 'fake-crypto-insurance-scam',
    name: 'Fake Crypto Insurance Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent insurance policies claiming to protect against crypto losses that don\'t actually pay out.',
    severity: 'high',
    commonIndicators: [
      'Unrealistic coverage terms',
      'No proper licensing',
      'Vague payout conditions',
      'High premiums for basic coverage'
    ],
    preventionTips: [
      'Verify insurance provider licensing',
      'Read policy terms carefully',
      'Research provider reputation',
      'Check regulatory compliance'
    ],
    examples: ['Fake crypto insurance policies', 'Non-existent coverage']
  },
  {
    id: 'crypto-loan-collateral-scam',
    name: 'Crypto Loan Collateral Scam',
    category: 'Crypto-Fraud',
    description: 'Lending platforms that steal collateral through unfair terms or technical exploits.',
    severity: 'critical',
    commonIndicators: [
      'Unfair liquidation terms',
      'Hidden fees and charges',
      'Technical vulnerabilities exploited',
      'No collateral protection'
    ],
    preventionTips: [
      'Read loan terms carefully',
      'Research platform reputation',
      'Understand liquidation conditions',
      'Use reputable lending platforms'
    ],
    examples: ['Collateral theft through liquidation', 'Unfair lending terms']
  },
  {
    id: 'exchange-exit-scam',
    name: 'Exchange Exit Scam',
    category: 'Crypto-Fraud',
    description: 'Cryptocurrency exchanges that shut down and disappear with user funds.',
    severity: 'critical',
    commonIndicators: [
      'Withdrawal delays or restrictions',
      'Poor customer support',
      'Unusual fee changes',
      'Lack of regulatory compliance'
    ],
    preventionTips: [
      'Use regulated exchanges',
      'Keep funds in cold storage',
      'Monitor exchange health',
      'Diversify across exchanges'
    ],
    examples: ['Exchange shutdowns with funds', 'Fake exchange platforms']
  },
  {
    id: 'fake-kyc-verification-scam',
    name: 'Fake KYC Verification Scam',
    category: 'Crypto-Fraud',
    description: 'Scammers posing as KYC verification services to steal personal information and identity.',
    severity: 'high',
    commonIndicators: [
      'Unsolicited KYC requests',
      'Requests for sensitive documents',
      'Unofficial verification processes',
      'Poor website security'
    ],
    preventionTips: [
      'Only use official KYC processes',
      'Verify verification service authenticity',
      'Protect personal documents',
      'Report suspicious KYC requests'
    ],
    examples: ['Fake identity verification sites', 'Phony KYC services']
  },
  {
    id: 'trojanized-trading-app-scam',
    name: 'Trojanized Trading App Scam',
    category: 'Crypto-Fraud',
    description: 'Malicious trading applications that steal credentials or funds from users.',
    severity: 'critical',
    commonIndicators: [
      'Unofficial app sources',
      'Excessive app permissions',
      'Poor app reviews',
      'Suspicious app behavior'
    ],
    preventionTips: [
      'Download apps only from official stores',
      'Check app reviews and developer info',
      'Review app permissions',
      'Use security software'
    ],
    examples: ['Fake trading apps', 'Malicious wallet applications']
  },
  {
    id: 'crypto-cashback-scam',
    name: 'Crypto Cashback Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent cashback programs promising returns on crypto purchases that never materialize.',
    severity: 'medium',
    commonIndicators: [
      'Unrealistic cashback rates',
      'Upfront membership fees',
      'Complex withdrawal conditions',
      'No verifiable payouts'
    ],
    preventionTips: [
      'Research cashback program legitimacy',
      'Start with small amounts',
      'Read terms and conditions',
      'Check user reviews'
    ],
    examples: ['Fake crypto cashback programs', 'Non-existent rewards']
  },
  {
    id: 'fake-blockchain-certificate-scam',
    name: 'Fake Blockchain Certificate Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent certification programs claiming blockchain credentials that have no value.',
    severity: 'medium',
    commonIndicators: [
      'Unaccredited certification programs',
      'High fees for certificates',
      'No industry recognition',
      'Vague curriculum details'
    ],
    preventionTips: [
      'Verify accreditation status',
      'Research program reputation',
      'Check industry recognition',
      'Compare with established programs'
    ],
    examples: ['Fake blockchain certifications', 'Worthless credential programs']
  },
  {
    id: 'telegram-admin-impersonation-scam',
    name: 'Telegram Admin Impersonation Scam',
    category: 'Crypto-Fraud',
    description: 'Scammers pose as Telegram group admins to trick users into sending cryptocurrency.',
    severity: 'high',
    commonIndicators: [
      'Unsolicited messages from admins',
      'Requests for cryptocurrency payments',
      'Fake admin verification badges',
      'Urgent payment requests'
    ],
    preventionTips: [
      'Verify admin identity through official channels',
      'Never send crypto to unsolicited requests',
      'Check with other group members',
      'Report impersonation accounts'
    ],
    examples: ['Fake Telegram admin scams', 'Group admin impersonation']
  },
  {
    id: 'discord-verification-scam',
    name: 'Discord Verification Scam',
    category: 'Crypto-Fraud',
    description: 'Fake Discord verification processes that steal user credentials or cryptocurrency.',
    severity: 'high',
    commonIndicators: [
      'Unusual verification requests',
      'Requests for sensitive information',
      'Fake verification bots',
      'Phishing verification links'
    ],
    preventionTips: [
      'Only use official Discord verification',
      'Be skeptical of verification bots',
      'Check server verification methods',
      'Report suspicious verification requests'
    ],
    examples: ['Fake Discord verification bots', 'Phony verification processes']
  },
  {
    id: 'fake-node-validator-program',
    name: 'Fake Node Validator Program',
    category: 'Crypto-Fraud',
    description: 'Fraudulent validator programs requiring investments that never generate returns.',
    severity: 'high',
    commonIndicators: [
      'Upfront investment required',
      'Unrealistic staking rewards',
      'No verifiable validator operation',
      'Complex withdrawal conditions'
    ],
    preventionTips: [
      'Research validator program legitimacy',
      'Verify staking rewards are realistic',
      'Check for proof of operation',
      'Start with small test amounts'
    ],
    examples: ['Fake validator nodes', 'Phony staking programs']
  },
  {
    id: 'fake-crypto-charity-scam',
    name: 'Fake Crypto Charity Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent charity campaigns collecting cryptocurrency that never reaches intended beneficiaries.',
    severity: 'high',
    commonIndicators: [
      'Unverified charity organizations',
      'Pressure to donate quickly',
      'No transparency about fund usage',
      'Suspicious donation addresses'
    ],
    preventionTips: [
      'Verify charity legitimacy',
      'Research organization background',
      'Check for transparency reports',
      'Use established charity platforms'
    ],
    examples: ['Fake crypto donation drives', 'Phony charity campaigns']
  },
  {
    id: 'fake-presale-token-scam',
    name: 'Fake Presale Token Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent token presales that collect funds but never deliver tokens or list on exchanges.',
    severity: 'critical',
    commonIndicators: [
      'No verifiable project development',
      'Unrealistic presale bonuses',
      'Pressure to buy quickly',
      'No whitepaper or roadmap'
    ],
    preventionTips: [
      'Research project thoroughly',
      'Check development progress',
      'Verify team credentials',
      'Be skeptical of presale bonuses'
    ],
    examples: ['Fake token presales', 'Rug pull presale schemes']
  },
  {
    id: 'whale-manipulation-scam',
    name: 'Whale Manipulation Scam',
    category: 'Crypto-Fraud',
    description: 'Large holders manipulating token prices through coordinated buying and selling.',
    severity: 'high',
    commonIndicators: [
      'Sudden large transactions',
      'Coordinated price movements',
      'Unusual trading patterns',
      'Market manipulation tactics'
    ],
    preventionTips: [
      'Monitor whale activity',
      'Use trading volume analysis',
      'Be cautious of price spikes',
      'Diversify investments'
    ],
    examples: ['Whale pump and dump', 'Coordinated price manipulation']
  },
  {
    id: 'fake-smart-contract-audit-scam',
    name: 'Fake Smart Contract Audit Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent audit reports claiming contracts are secure when they contain vulnerabilities.',
    severity: 'critical',
    commonIndicators: [
      'Unverified audit firms',
      'Generic audit reports',
      'No detailed security analysis',
      'Suspicious audit certificates'
    ],
    preventionTips: [
      'Verify audit firm reputation',
      'Check audit methodology',
      'Request detailed reports',
      'Use established audit companies'
    ],
    examples: ['Fake security audits', 'Phony audit certificates']
  },
  {
    id: 'crypto-escrow-scam',
    name: 'Crypto Escrow Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent escrow services that steal funds held in trust for transactions.',
    severity: 'critical',
    commonIndicators: [
      'Unverified escrow services',
      'No proper licensing',
      'Unusual fee structures',
      'Poor customer support'
    ],
    preventionTips: [
      'Use reputable escrow services',
      'Verify service licensing',
      'Check user reviews',
      'Understand escrow terms'
    ],
    examples: ['Fake crypto escrow', 'Stolen escrowed funds']
  },
  {
    id: 'fake-otc-trading-scam',
    name: 'Fake OTC Trading Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent over-the-counter trading desks that steal cryptocurrency from large transactions.',
    severity: 'critical',
    commonIndicators: [
      'Unverified OTC desks',
      'Requests for direct transfers',
      'No proper documentation',
      'Unusual trading terms'
    ],
    preventionTips: [
      'Use established OTC desks',
      'Verify desk reputation',
      'Require proper documentation',
      'Use escrow for large trades'
    ],
    examples: ['Fake OTC trading', 'Stolen large transactions']
  },
  {
    id: 'meme-coin-hype-scam',
    name: 'Meme Coin Hype Scam',
    category: 'Crypto-Fraud',
    description: 'Pump and dump schemes using meme coins with no utility or value.',
    severity: 'high',
    commonIndicators: [
      'Pure hype with no utility',
      'Celebrity endorsements without substance',
      'Rapid price increases',
      'Anonymous development teams'
    ],
    preventionTips: [
      'Research coin utility and purpose',
      'Be skeptical of pure hype',
      'Check development team background',
      'Avoid FOMO investments'
    ],
    examples: ['Meme coin pump and dump', 'Hype-driven token scams']
  },
  {
    id: 'nft-wash-trading-scam',
    name: 'NFT Wash Trading Scam',
    category: 'Crypto-Fraud',
    description: 'Artificially inflating NFT prices through self-trading to create false market activity.',
    severity: 'medium',
    commonIndicators: [
      'Same buyers and sellers',
      'Rapid price increases with no new buyers',
      'Unusual trading patterns',
      'Artificial trading volume'
    ],
    preventionTips: [
      'Analyze trading patterns',
      'Check for wash trading indicators',
      'Research NFT value independently',
      'Be cautious of rapid price increases'
    ],
    examples: ['Self-trading NFTs', 'Artificial NFT price inflation']
  },
  {
    id: 'wallet-connect-phishing-scam',
    name: 'Wallet Connect Phishing Scam',
    category: 'Crypto-Fraud',
    description: 'Fake Wallet Connect requests that trick users into connecting to malicious dApps.',
    severity: 'critical',
    commonIndicators: [
      'Unexpected Wallet Connect requests',
      'Suspicious dApp URLs',
      'Requests for excessive permissions',
      'Unknown application connections'
    ],
    preventionTips: [
      'Verify dApp authenticity before connecting',
      'Check connection requests carefully',
      'Review permissions granted',
      'Disconnect suspicious connections'
    ],
    examples: ['Malicious Wallet Connect requests', 'Phishing dApp connections']
  },
  {
    id: 'crypto-portfolio-tracker-malware',
    name: 'Crypto Portfolio Tracker Malware',
    category: 'Crypto-Fraud',
    description: 'Malicious portfolio tracking applications that steal wallet credentials or funds.',
    severity: 'high',
    commonIndicators: [
      'Requests for wallet connections',
      'Unusual app permissions',
      'Poor reviews or few downloads',
      'Suspicious developer information'
    ],
    preventionTips: [
      'Use reputable portfolio trackers',
      'Review app permissions carefully',
      'Check developer reputation',
      'Avoid connecting wallets to unknown apps'
    ],
    examples: ['Malicious tracking apps', 'Wallet-stealing portfolio tools']
  },
  {
    id: 'fake-crypto-cashback-card-scam',
    name: 'Fake Crypto Cashback Card Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent crypto cashback card programs that steal deposits or personal information.',
    severity: 'high',
    commonIndicators: [
      'Upfront card fees required',
      'Unrealistic cashback rates',
      'No verifiable card issuer',
      'Poor customer support'
    ],
    preventionTips: [
      'Verify card issuer legitimacy',
      'Research card program reputation',
      'Check for regulatory compliance',
      'Be skeptical of high cashback rates'
    ],
    examples: ['Fake crypto debit cards', 'Phony cashback programs']
  },
  {
    id: 'exchange-api-key-theft-scam',
    name: 'Exchange API Key Theft Scam',
    category: 'Crypto-Fraud',
    description: 'Scammers steal exchange API keys to access and drain user accounts.',
    severity: 'critical',
    commonIndicators: [
      'Requests for API keys',
      'Phishing for exchange credentials',
      'Unusual account activity',
      'Unauthorized trading activity'
    ],
    preventionTips: [
      'Never share API keys',
      'Use IP whitelisting for API keys',
      'Limit API key permissions',
      'Monitor account activity regularly'
    ],
    examples: ['API key phishing', 'Stolen exchange credentials']
  },
  {
    id: 'gas-fee-refund-scam',
    name: 'Gas Fee Refund Scam',
    category: 'Crypto-Fraud',
    description: 'Fake gas fee refund schemes that trick users into revealing wallet information.',
    severity: 'medium',
    commonIndicators: [
      'Unsolicited refund offers',
      'Requests for wallet connections',
      'Fake refund processes',
      'Phishing websites'
    ],
    preventionTips: [
      'Be skeptical of unsolicited refunds',
      'Never connect wallet for refunds',
      'Verify through official channels',
      'Report phishing attempts'
    ],
    examples: ['Fake gas refund scams', 'Phishing refund offers']
  },
  {
    id: 'crypto-education-course-scam',
    name: 'Crypto Education Course Scam',
    category: 'Crypto-Fraud',
    description: 'Overpriced or fake crypto education courses with little to no value.',
    severity: 'medium',
    commonIndicators: [
      'Unrealistic profit promises',
      'High course fees with vague content',
      'No verifiable instructor credentials',
      'Pressure to buy quickly'
    ],
    preventionTips: [
      'Research instructor credentials',
      'Read course reviews carefully',
      'Be skeptical of guaranteed profits',
      'Compare with established courses'
    ],
    examples: ['Overpriced crypto courses', 'Fake education programs']
  },
  {
    id: 'fake-blockchain-job-recruitment-scam',
    name: 'Fake Blockchain Job Recruitment Scam',
    category: 'Crypto-Fraud',
    description: 'Fake job postings in blockchain sector designed to steal personal information or require payments.',
    severity: 'high',
    commonIndicators: [
      'Requests for payment for training',
      'Unverified company information',
      'Unrealistic salary offers',
      'Requests for sensitive personal information'
    ],
    preventionTips: [
      'Verify company legitimacy',
      'Research job posting authenticity',
      'Never pay for job opportunities',
      'Protect personal information'
    ],
    examples: ['Fake blockchain job scams', 'Recruitment fraud']
  },
  {
    id: 'fake-mining-pool-scam',
    name: 'Fake Mining Pool Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent mining pools that steal hashrate or mining rewards.',
    severity: 'high',
    commonIndicators: [
      'Unverified mining pool operations',
      'No transparent reward distribution',
      'Unusual fee structures',
      'Poor pool statistics'
    ],
    preventionTips: [
      'Use established mining pools',
      'Verify pool transparency',
      'Check reward distribution history',
      'Monitor pool performance'
    ],
    examples: ['Fake mining pools', 'Stolen mining rewards']
  },
  {
    id: 'ai-deepfake-voice-investment-scam',
    name: 'AI Deepfake Voice Investment Scam',
    category: 'Crypto-Fraud',
    description: 'AI-generated fake audio of executives or celebrities promoting crypto investments.',
    severity: 'high',
    commonIndicators: [
      'Unusual audio quality or artifacts',
      'Unexpected investment recommendations',
      'Urgent investment calls',
      'Verification difficulties'
    ],
    preventionTips: [
      'Verify through official channels',
      'Be skeptical of audio-only investment pitches',
      'Cross-check with official sources',
      'Research before investing'
    ],
    examples: ['Deepfake CEO calls', 'AI-generated investment pitches']
  },
  {
    id: 'malicious-browser-wallet-extension',
    name: 'Malicious Browser Wallet Extension',
    category: 'Crypto-Fraud',
    description: 'Fake browser wallet extensions that steal cryptocurrency when users connect their wallets.',
    severity: 'critical',
    commonIndicators: [
      'Unusual extension permissions',
      'Poor reviews or few downloads',
      'Requests for wallet connections',
      'Suspicious developer information'
    ],
    preventionTips: [
      'Only install from official extension stores',
      'Review extension permissions carefully',
      'Check developer reputation',
      'Use hardware wallets for large amounts'
    ],
    examples: ['Fake wallet extensions', 'Browser add-on crypto theft']
  },
  {
    id: 'crypto-drain-link-scam',
    name: 'Crypto Drain Link Scam',
    category: 'Crypto-Fraud',
    description: 'Malicious links that drain wallet funds when clicked or interacted with.',
    severity: 'critical',
    commonIndicators: [
      'Suspicious shortened URLs',
      'Unusual link destinations',
      'Requests for wallet connections',
      'Unexpected transaction prompts'
    ],
    preventionTips: [
      'Verify link destinations before clicking',
      'Use link preview tools',
      'Never connect wallet to suspicious links',
      'Check URL authenticity'
    ],
    examples: ['Malicious crypto links', 'Wallet-draining URLs']
  },
  {
    id: 'fake-bug-bounty-scam',
    name: 'Fake Bug Bounty Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent bug bounty programs that steal submitted vulnerabilities or require upfront payments.',
    severity: 'high',
    commonIndicators: [
      'Upfront payments required',
      'Unverified bounty programs',
      'No proper bounty terms',
      'Suspicious program administrators'
    ],
    preventionTips: [
      'Verify bounty program legitimacy',
      'Check program terms carefully',
      'Research platform reputation',
      'Never pay to participate in bounties'
    ],
    examples: ['Fake bug bounty programs', 'Vulnerability theft schemes']
  },
  {
    id: 'crypto-signal-subscription-fraud',
    name: 'Crypto Signal Subscription Fraud',
    category: 'Crypto-Fraud',
    description: 'Paid trading signal subscriptions that provide worthless or manipulated signals.',
    severity: 'medium',
    commonIndicators: [
      'Guaranteed profit claims',
      'High subscription fees',
      'No verifiable track record',
      'Pressure to subscribe quickly'
    ],
    preventionTips: [
      'Verify signal provider track record',
      'Test signals with small amounts',
      'Be skeptical of guaranteed profits',
      'Research provider reputation'
    ],
    examples: ['Fake trading signals', 'Worthless subscription services']
  },
  {
    id: 'fake-token-burn-announcement-scam',
    name: 'Fake Token Burn Announcement Scam',
    category: 'Crypto-Fraud',
    description: 'Fake token burn announcements used to manipulate prices and dump tokens.',
    severity: 'high',
    commonIndicators: [
      'Unofficial burn announcements',
      'No verifiable burn transactions',
      'Sudden price spikes',
      'Developers selling after announcement'
    ],
    preventionTips: [
      'Verify burn transactions on blockchain',
      'Check official project announcements',
      'Be skeptical of sudden price spikes',
      'Research before investing'
    ],
    examples: ['Fake token burns', 'Price manipulation schemes']
  },
  {
    id: 'fake-regulatory-notice-scam',
    name: 'Fake Regulatory Notice Scam',
    category: 'Crypto-Fraud',
    description: 'Fake regulatory notices designed to panic users into taking harmful actions.',
    severity: 'high',
    commonIndicators: [
      'Unofficial regulatory communications',
      'Urgent action required',
      'Requests for wallet connections',
      'Suspicious sender information'
    ],
    preventionTips: [
      'Verify through official regulatory channels',
      'Never connect wallet to regulatory notices',
      'Check sender authenticity',
      'Report fake regulatory communications'
    ],
    examples: ['Fake SEC notices', 'Phony regulatory warnings']
  },
  {
    id: 'layer-2-bridge-exploit-scam',
    name: 'Layer-2 Bridge Exploit Scam',
    category: 'Crypto-Fraud',
    description: 'Exploits targeting cross-chain bridges that steal funds during transfers.',
    severity: 'critical',
    commonIndicators: [
      'Unverified bridge contracts',
      'Unusual bridge fees',
      'Delayed transfers',
      'Suspicious contract interactions'
    ],
    preventionTips: [
      'Use established bridges',
      'Verify bridge contract addresses',
      'Check bridge security audits',
      'Start with small test transfers'
    ],
    examples: ['Bridge exploits', 'Cross-chain theft']
  },
  {
    id: 'stolen-nft-resale-scam',
    name: 'Stolen NFT Resale Scam',
    category: 'Crypto-Fraud',
    description: 'Reselling stolen NFTs on marketplaces to launder stolen assets.',
    severity: 'high',
    commonIndicators: [
      'NFTs with questionable provenance',
      'Rapid resales of valuable NFTs',
      'Suspicious seller accounts',
      'No verification of ownership'
    ],
    preventionTips: [
      'Verify NFT provenance before buying',
      'Check seller reputation',
      'Use marketplaces with verification',
      'Report suspicious NFT sales'
    ],
    examples: ['Stolen NFT laundering', 'Questionable NFT resales']
  },
  {
    id: 'fake-token-lock-scam',
    name: 'Fake Token Lock Scam',
    category: 'Crypto-Fraud',
    description: 'Fake token locking services that steal tokens instead of securely holding them.',
    severity: 'critical',
    commonIndicators: [
      'Unverified locking services',
      'No transparent lock contracts',
      'Unusual fee structures',
      'Poor customer support'
    ],
    preventionTips: [
      'Use established token lock services',
      'Verify lock contract addresses',
      'Check service reputation',
      'Understand lock terms'
    ],
    examples: ['Fake token locks', 'Stolen locked tokens']
  },
  {
    id: 'crypto-exit-liquidity-trap-scam',
    name: 'Crypto Exit Liquidity Trap Scam',
    category: 'Crypto-Fraud',
    description: 'Schemes that trap liquidity making it impossible to sell tokens.',
    severity: 'critical',
    commonIndicators: [
      'Unable to sell tokens',
      'No liquidity in markets',
      'Developers go silent',
      'Trading restrictions'
    ],
    preventionTips: [
      'Check liquidity before investing',
      'Verify liquidity is not locked',
      'Research development team',
      'Monitor trading activity'
    ],
    examples: ['Liquidity traps', 'Unsellable tokens']
  },
  {
    id: 'fake-dao-treasury-scam',
    name: 'Fake DAO Treasury Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent DAOs with fake treasuries designed to steal member contributions.',
    severity: 'critical',
    commonIndicators: [
      'No transparent treasury',
      'Hidden treasury management',
      'Centralized control despite DAO claims',
      'Unusual treasury movements'
    ],
    preventionTips: [
      'Verify treasury transparency',
      'Check treasury management processes',
      'Research DAO governance',
      'Understand treasury access controls'
    ],
    examples: ['Fake DAO treasuries', 'Treasury theft schemes']
  },
  {
    id: 'crypto-inheritance-scam',
    name: 'Crypto Inheritance Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent claims of cryptocurrency inheritance requiring upfront fees to access.',
    severity: 'high',
    commonIndicators: [
      'Unsolicited inheritance claims',
      'Requests for upfront fees',
      'Fake legal documents',
      'Pressure to act quickly'
    ],
    preventionTips: [
      'Verify inheritance claims legally',
      'Never pay upfront fees',
      'Consult with legitimate lawyers',
      'Report inheritance fraud'
    ],
    examples: ['Fake crypto inheritance', 'Inheritance fee scams']
  },
  {
    id: 'fake-yield-farming-scam',
    name: 'Fake Yield Farming Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent yield farming platforms that steal deposited funds.',
    severity: 'critical',
    commonIndicators: [
      'Unrealistic APY promises',
      'No verifiable farming strategy',
      'Hidden fees and charges',
      'Withdrawal restrictions'
    ],
    preventionTips: [
      'Verify farming platform legitimacy',
      'Be skeptical of unrealistic APY',
      'Check platform security audits',
      'Start with small test deposits'
    ],
    examples: ['Fake yield farms', 'Stolen farming deposits']
  },
  {
    id: 'impermanent-loss-manipulation-scam',
    name: 'Impermanent Loss Manipulation Scam',
    category: 'Crypto-Fraud',
    description: 'Schemes that exploit impermanent loss in liquidity pools to steal funds.',
    severity: 'high',
    commonIndicators: [
      'Unusual pool imbalances',
      'Coordinated trading patterns',
      'Artificial price movements',
      'Targeted liquidity providers'
    ],
    preventionTips: [
      'Monitor pool imbalances',
      'Understand impermanent loss risks',
      'Use established DEXs',
      'Diversify liquidity provision'
    ],
    examples: ['IL manipulation schemes', 'Targeted liquidity theft']
  },
  {
    id: 'token-sniping-bot-scam',
    name: 'Token Sniping Bot Scam',
    category: 'Crypto-Fraud',
    description: 'Bots that buy tokens immediately after launch to manipulate prices and dump on retail investors.',
    severity: 'high',
    commonIndicators: [
      'Instant token purchases after launch',
      'Rapid price spikes',
      'Coordinated bot activity',
      'Early sell-offs by bots'
    ],
    preventionTips: [
      'Avoid buying immediately after launch',
      'Wait for price stabilization',
      'Monitor trading patterns',
      'Be cautious of rapid price increases'
    ],
    examples: ['Token sniping bots', 'Launch manipulation']
  },
  {
    id: 'fake-blockchain-explorer-scam',
    name: 'Fake Blockchain Explorer Scam',
    category: 'Crypto-Fraud',
    description: 'Fake blockchain explorers that display false transaction information or steal data.',
    severity: 'high',
    commonIndicators: [
      'Unverified explorer URLs',
      'Inaccurate transaction data',
      'Requests for wallet connections',
      'Poor website security'
    ],
    preventionTips: [
      'Use established blockchain explorers',
      'Verify explorer authenticity',
      'Check URL carefully',
      'Never connect wallet to explorers'
    ],
    examples: ['Fake explorers', 'Data theft schemes']
  },
  {
    id: 'crypto-faucet-scam',
    name: 'Crypto Faucet Scam',
    category: 'Crypto-Fraud',
    description: 'Fake crypto faucets that collect user data or require payments without distributing crypto.',
    severity: 'medium',
    commonIndicators: [
      'Requests for payments',
      'Excessive data collection',
      'No actual crypto distribution',
      'High withdrawal thresholds'
    ],
    preventionTips: [
      'Use established faucet sites',
      'Be skeptical of payment requirements',
      'Protect personal information',
      'Check faucet reputation'
    ],
    examples: ['Fake faucets', 'Data collection schemes']
  },
  {
    id: 'malicious-airdrop-nft-scam',
    name: 'Malicious Airdrop NFT Scam',
    category: 'Crypto-Fraud',
    description: 'NFTs airdropped to wallets that contain malicious code or phishing links.',
    severity: 'high',
    commonIndicators: [
      'Unexpected NFT airdrops',
      'Suspicious NFT metadata',
      'Requests to interact with NFT',
      'Phishing links in NFT descriptions'
    ],
    preventionTips: [
      'Be cautious of unexpected airdrops',
      'Never interact with suspicious NFTs',
      'Check NFT metadata carefully',
      'Report malicious airdrops'
    ],
    examples: ['Malicious NFT airdrops', 'Phishing NFT schemes']
  },
  {
    id: 'fake-crypto-debit-card-scam',
    name: 'Fake Crypto Debit Card Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent crypto debit card programs that steal deposits or personal information.',
    severity: 'high',
    commonIndicators: [
      'Upfront card fees required',
      'Unverified card issuers',
      'Poor customer support',
      'No regulatory compliance'
    ],
    preventionTips: [
      'Verify card issuer legitimacy',
      'Check regulatory compliance',
      'Research card program reputation',
      'Be skeptical of high fees'
    ],
    examples: ['Fake crypto cards', 'Stolen card deposits']
  },
  {
    id: 'wallet-sync-scam',
    name: 'Wallet Sync Scam',
    category: 'Crypto-Fraud',
    description: 'Fake wallet synchronization processes that steal private keys or seed phrases.',
    severity: 'critical',
    commonIndicators: [
      'Unsolicited sync requests',
      'Requests for seed phrases',
      'Fake wallet interfaces',
      'Phishing websites'
    ],
    preventionTips: [
      'Never share seed phrases',
      'Only sync through official wallet apps',
      'Verify sync requests',
      'Use hardware wallets for large amounts'
    ],
    examples: ['Fake wallet syncs', 'Seed phrase theft']
  },
  {
    id: 'nft-verification-scam',
    name: 'NFT Verification Scam',
    category: 'Crypto-Fraud',
    description: 'Fake NFT verification processes that steal credentials or require payments.',
    severity: 'medium',
    commonIndicators: [
      'Unusual verification requests',
      'Payments required for verification',
      'Fake verification badges',
      'Phishing verification sites'
    ],
    preventionTips: [
      'Use official NFT marketplaces',
      'Be skeptical of verification fees',
      'Check marketplace verification processes',
      'Report suspicious verification requests'
    ],
    examples: ['Fake NFT verification', 'Phony verification badges']
  },
  {
    id: 'crypto-casino-exit-scam',
    name: 'Crypto Casino Exit Scam',
    category: 'Crypto-Fraud',
    description: 'Online crypto casinos that shut down with user funds.',
    severity: 'critical',
    commonIndicators: [
      'Withdrawal delays',
      'Poor customer support',
      'Unusual rule changes',
      'Platform shutdowns'
    ],
    preventionTips: [
      'Use licensed and regulated casinos',
      'Withdraw winnings regularly',
      'Research casino reputation',
      'Check regulatory compliance'
    ],
    examples: ['Casino shutdowns', 'Stolen gambling funds']
  },
  {
    id: 'fake-metamask-popup-scam',
    name: 'Fake Metamask Popup Scam',
    category: 'Crypto-Fraud',
    description: 'Fake Metamask popup windows that steal wallet credentials or approve malicious transactions.',
    severity: 'critical',
    commonIndicators: [
      'Unexpected popup requests',
      'Suspicious popup content',
      'Requests for private keys',
      'Unusual transaction approvals'
    ],
    preventionTips: [
      'Verify popup authenticity',
      'Never share private keys',
      'Check transaction details carefully',
      'Use official Metamask extension'
    ],
    examples: ['Fake Metamask popups', 'Wallet credential theft']
  },
  {
    id: 'blockchain-domain-scam',
    name: 'Blockchain Domain Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent blockchain domain registrations that steal payments or personal information.',
    severity: 'high',
    commonIndicators: [
      'Unverified domain registrars',
      'Unusual pricing structures',
      'No proper domain services',
      'Poor customer support'
    ],
    preventionTips: [
      'Use established domain registrars',
      'Verify registrar legitimacy',
      'Check domain services',
      'Research pricing structures'
    ],
    examples: ['Fake blockchain domains', 'Domain registration fraud']
  },
  {
    id: 'fake-governance-voting-scam',
    name: 'Fake Governance Voting Scam',
    category: 'Crypto-Fraud',
    description: 'Fake governance voting processes designed to manipulate token prices or steal funds.',
    severity: 'high',
    commonIndicators: [
      'Unusual voting proposals',
      'Manipulated voting outcomes',
      'Hidden voting mechanisms',
      'Suspicious governance changes'
    ],
    preventionTips: [
      'Research voting proposals carefully',
      'Understand governance mechanisms',
      'Check voting transparency',
      'Be skeptical of rushed votes'
    ],
    examples: ['Governance manipulation', 'Fake voting schemes']
  },
  {
    id: 'rebase-token-scam',
    name: 'Rebase Token Scam',
    category: 'Crypto-Fraud',
    description: 'Tokens with automatic supply adjustments that are manipulated to steal investor funds.',
    severity: 'high',
    commonIndicators: [
      'Unusual supply adjustments',
      'Hidden rebase mechanisms',
      'Manipulated price movements',
      'Complex token economics'
    ],
    preventionTips: [
      'Understand rebase mechanisms',
      'Research token economics',
      'Monitor supply changes',
      'Be cautious of complex tokenomics'
    ],
    examples: ['Rebase token manipulation', 'Supply adjustment scams']
  },
  {
    id: 'reflection-token-scam',
    name: 'Reflection Token Scam',
    category: 'Crypto-Fraud',
    description: 'Tokens claiming automatic rewards that are manipulated or never distributed.',
    severity: 'high',
    commonIndicators: [
      'Unrealistic reward claims',
      'No verifiable reward distribution',
      'Hidden reward mechanisms',
      'Complex reward calculations'
    ],
    preventionTips: [
      'Verify reward distribution',
      'Understand reward mechanisms',
      'Check reward calculations',
      'Be skeptical of high rewards'
    ],
    examples: ['Fake reflection tokens', 'Reward distribution scams']
  },
  {
    id: 'fake-crypto-merchandise-store-scam',
    name: 'Fake Crypto Merchandise Store Scam',
    category: 'Crypto-Fraud',
    description: 'Fake online stores selling crypto merchandise that steal payment information or never deliver products.',
    severity: 'medium',
    commonIndicators: [
      'Unverified store legitimacy',
      'Poor website security',
      'Unusual payment methods',
      'No customer reviews'
    ],
    preventionTips: [
      'Verify store authenticity',
      'Use secure payment methods',
      'Check customer reviews',
      'Research store reputation'
    ],
    examples: ['Fake crypto merch stores', 'Payment theft schemes']
  },
  {
    id: 'token-freeze-scam',
    name: 'Token Freeze Scam',
    category: 'Crypto-Fraud',
    description: 'Tokens that can be frozen by developers, preventing users from selling or transferring.',
    severity: 'critical',
    commonIndicators: [
      'Hidden freeze capabilities',
      'Unexpected token freezes',
      'Developer control over transfers',
      'No freeze disclosure'
    ],
    preventionTips: [
      'Check token contract for freeze functions',
      'Research developer control',
      'Avoid tokens with freeze capabilities',
      'Understand token mechanics'
    ],
    examples: ['Freezable tokens', 'Developer-controlled transfers']
  },
  {
    id: 'wallet-dust-trap-scam',
    name: 'Wallet Dust Trap Scam',
    category: 'Crypto-Fraud',
    description: 'Small amounts of tokens sent to wallets that enable further theft or tracking.',
    severity: 'medium',
    commonIndicators: [
      'Unexpected small token deposits',
      'Unknown token origins',
      'Dust from suspicious sources',
      'Tracking-enabled tokens'
    ],
    preventionTips: [
      'Monitor wallet for unexpected deposits',
      'Research unknown tokens',
      'Be cautious of dust attacks',
      'Use privacy-focused wallets'
    ],
    examples: ['Dust attacks', 'Tracking token deposits']
  },
  {
    id: 'crypto-escrow-release-scam',
    name: 'Crypto Escrow Release Scam',
    category: 'Crypto-Fraud',
    description: 'Fake escrow release processes that steal funds instead of releasing them to intended recipients.',
    severity: 'critical',
    commonIndicators: [
      'Unverified escrow services',
      'Delayed releases without reason',
      'Requests for additional payments',
      'Poor communication'
    ],
    preventionTips: [
      'Use reputable escrow services',
      'Verify escrow terms',
      'Check service reputation',
      'Understand release conditions'
    ],
    examples: ['Escrow fund theft', 'Fake release processes']
  },
  {
    id: 'fake-blockchain-partnership-scam',
    name: 'Fake Blockchain Partnership Scam',
    category: 'Crypto-Fraud',
    description: 'Fake partnership announcements used to manipulate token prices and dump on investors.',
    severity: 'high',
    commonIndicators: [
      'Unverified partnership claims',
      'No official confirmation from partners',
      'Sudden price spikes on news',
      'Developers selling after announcement'
    ],
    preventionTips: [
      'Verify partnerships with official sources',
      'Check partner company announcements',
      'Be skeptical of sudden price spikes',
      'Research before investing'
    ],
    examples: ['Fake partnerships', 'Partnership manipulation']
  },
  {
    id: 'fake-audit-certificate-scam',
    name: 'Fake Audit Certificate Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent security audit certificates claiming projects are secure when they are not.',
    severity: 'critical',
    commonIndicators: [
      'Unverified audit firms',
      'Generic audit certificates',
      'No detailed audit reports',
      'Suspicious audit claims'
    ],
    preventionTips: [
      'Verify audit firm reputation',
      'Request detailed audit reports',
      'Check audit methodology',
      'Use established audit companies'
    ],
    examples: ['Fake audit certificates', 'Security audit fraud']
  },
  {
    id: 'fake-token-liquidity-lock-scam',
    name: 'Fake Token Liquidity Lock Scam',
    category: 'Crypto-Fraud',
    description: 'Fake liquidity lock claims that allow developers to drain liquidity later.',
    severity: 'critical',
    commonIndicators: [
      'No verifiable lock contracts',
      'Hidden unlock mechanisms',
      'Suspicious lock terms',
      'Developers can unlock liquidity'
    ],
    preventionTips: [
      'Verify lock contract addresses',
      'Check lock transparency',
      'Understand lock terms',
      'Use established lock services'
    ],
    examples: ['Fake liquidity locks', 'Unlockable liquidity']
  },
  {
    id: 'ai-crypto-prediction-scam',
    name: 'AI Crypto Prediction Scam',
    category: 'Crypto-Fraud',
    description: 'Fake AI-powered crypto prediction services that steal funds or provide worthless predictions.',
    severity: 'high',
    commonIndicators: [
      'Guaranteed prediction accuracy',
      'Upfront subscription fees',
      'No verifiable track record',
      'Complex AI claims without proof'
    ],
    preventionTips: [
      'Verify prediction track record',
      'Test predictions with small amounts',
      'Be skeptical of guaranteed accuracy',
      'Research service reputation'
    ],
    examples: ['Fake AI predictions', 'Prediction service fraud']
  },
  {
    id: 'fake-smart-contract-upgrade-scam',
    name: 'Fake Smart Contract Upgrade Scam',
    category: 'Crypto-Fraud',
    description: 'Fake contract upgrades that introduce vulnerabilities or backdoors to steal funds.',
    severity: 'critical',
    commonIndicators: [
      'Unverified upgrade proposals',
      'Hidden code changes',
      'No community approval',
      'Suspicious upgrade timing'
    ],
    preventionTips: [
      'Verify upgrade authenticity',
      'Review code changes carefully',
      'Check community approval',
      'Understand upgrade implications'
    ],
    examples: ['Malicious upgrades', 'Contract backdoors']
  },
  {
    id: 'fake-nft-marketplace-scam',
    name: 'Fake NFT Marketplace Scam',
    category: 'Crypto-Fraud',
    description: 'Fake NFT marketplaces that steal NFTs or payment information.',
    severity: 'critical',
    commonIndicators: [
      'Unverified marketplace platforms',
      'Requests for wallet connections',
      'Poor website security',
      'No seller verification'
    ],
    preventionTips: [
      'Use established NFT marketplaces',
      'Verify marketplace authenticity',
      'Check platform security',
      'Research seller reputation'
    ],
    examples: ['Fake NFT marketplaces', 'NFT theft schemes']
  },
  {
    id: 'crypto-subscription-trap-scam',
    name: 'Crypto Subscription Trap Scam',
    category: 'Crypto-Fraud',
    description: 'Subscription services with hidden fees or impossible cancellation that drain funds.',
    severity: 'high',
    commonIndicators: [
      'Hidden subscription fees',
      'Impossible cancellation processes',
      'Unexpected charges',
      'Poor customer support'
    ],
    preventionTips: [
      'Read subscription terms carefully',
      'Check cancellation policies',
      'Monitor subscription charges',
      'Use reputable services'
    ],
    examples: ['Subscription traps', 'Hidden fee schemes']
  },
  {
    id: 'mining-rig-investment-scam',
    name: 'Mining Rig Investment Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent mining rig investments that promise returns but deliver nothing.',
    severity: 'high',
    commonIndicators: [
      'Guaranteed mining returns',
      'No verifiable mining operations',
      'High equipment costs',
      'Unrealistic profit projections'
    ],
    preventionTips: [
      'Verify mining operations exist',
      'Check equipment legitimacy',
      'Research company background',
      'Be skeptical of guaranteed returns'
    ],
    examples: ['Fake mining rigs', 'Mining investment fraud']
  },
  {
    id: 'fake-crypto-news-website-scam',
    name: 'Fake Crypto News Website Scam',
    category: 'Crypto-Fraud',
    description: 'Fake news websites spreading false information to manipulate crypto prices.',
    severity: 'medium',
    commonIndicators: [
      'Unverified news sources',
      'Sensationalized headlines',
      'No journalist credentials',
      'Biased or false reporting'
    ],
    preventionTips: [
      'Verify news source authenticity',
      'Cross-check with reputable sources',
      'Be skeptical of sensational headlines',
      'Research journalist credentials'
    ],
    examples: ['Fake crypto news', 'Price manipulation through news']
  },
  {
    id: 'fake-stablecoin-peg-recovery-scam',
    name: 'Fake Stablecoin Peg Recovery Scam',
    category: 'Crypto-Fraud',
    description: 'Fake stablecoin peg recovery schemes that steal funds claiming to restore token value.',
    severity: 'critical',
    commonIndicators: [
      'Unofficial peg recovery programs',
      'Requests for wallet connections',
      'No verifiable recovery mechanism',
      'Suspicious recovery processes'
    ],
    preventionTips: [
      'Verify through official stablecoin channels',
      'Never connect wallet for recovery',
      'Check official announcements',
      'Report fake recovery schemes'
    ],
    examples: ['Fake peg recovery', 'Wallet theft through recovery']
  },
  {
    id: 'exchange-liquidity-manipulation-scam',
    name: 'Exchange Liquidity Manipulation Scam',
    category: 'Crypto-Fraud',
    description: 'Exchanges manipulating liquidity to favor certain trades or steal funds.',
    severity: 'critical',
    commonIndicators: [
      'Unusual liquidity patterns',
      'Favorable treatment for specific traders',
      'Hidden liquidity manipulation',
      'Suspicious trading advantages'
    ],
    preventionTips: [
      'Use regulated exchanges',
      'Monitor trading patterns',
      'Diversify across exchanges',
      'Report suspicious activity'
    ],
    examples: ['Liquidity manipulation', 'Exchange favoritism']
  },
  {
    id: 'fake-web3-browser-scam',
    name: 'Fake Web3 Browser Scam',
    category: 'Crypto-Fraud',
    description: 'Fake Web3 browsers that steal wallet credentials or manipulate transactions.',
    severity: 'critical',
    commonIndicators: [
      'Unverified browser sources',
      'Requests for wallet connections',
      'Poor browser security',
      'Suspicious browser behavior'
    ],
    preventionTips: [
      'Use established Web3 browsers',
      'Verify browser authenticity',
      'Check security features',
      'Review browser permissions'
    ],
    examples: ['Fake Web3 browsers', 'Browser-based wallet theft']
  },
  {
    id: 'crypto-cashback-reward-scam',
    name: 'Crypto Cashback Reward Scam',
    category: 'Crypto-Fraud',
    description: 'Fake cashback reward programs that steal deposits or personal information.',
    severity: 'medium',
    commonIndicators: [
      'Unrealistic cashback rewards',
      'Upfront membership fees',
      'No verifiable payouts',
      'Complex reward structures'
    ],
    preventionTips: [
      'Research cashback program legitimacy',
      'Start with small amounts',
      'Read terms carefully',
      'Check user reviews'
    ],
    examples: ['Fake cashback rewards', 'Reward program fraud']
  },
  {
    id: 'nft-collateral-loan-scam',
    name: 'NFT Collateral Loan Scam',
    category: 'Crypto-Fraud',
    description: 'Fake NFT collateral lending platforms that steal NFTs or require unfair terms.',
    severity: 'high',
    commonIndicators: [
      'Unverified lending platforms',
      'Unfair liquidation terms',
      'Hidden fees and charges',
      'No proper NFT valuation'
    ],
    preventionTips: [
      'Use established NFT lending platforms',
      'Verify platform reputation',
      'Understand liquidation terms',
      'Check NFT valuation methods'
    ],
    examples: ['NFT lending fraud', 'Stolen NFT collateral']
  },
  {
    id: 'fake-crypto-payroll-scam',
    name: 'Fake Crypto Payroll Scam',
    category: 'Crypto-Fraud',
    description: 'Fake crypto payroll services that steal employee wages or company funds.',
    severity: 'high',
    commonIndicators: [
      'Unverified payroll services',
      'Requests for wallet connections',
      'No proper payroll documentation',
      'Suspicious payroll processes'
    ],
    preventionTips: [
      'Use established payroll providers',
      'Verify service legitimacy',
      'Check payroll documentation',
      'Monitor payroll transactions'
    ],
    examples: ['Fake crypto payroll', 'Payroll fund theft']
  },
  {
    id: 'defi-exit-liquidity-scam',
    name: 'DeFi Exit Liquidity Scam',
    category: 'Crypto-Fraud',
    description: 'DeFi protocols that drain liquidity and shut down with user funds.',
    severity: 'critical',
    commonIndicators: [
      'Sudden liquidity removal',
      'Protocol shutdowns',
      'Developers go silent',
      'No warning or announcement'
    ],
    preventionTips: [
      'Check if liquidity is locked',
      'Monitor protocol activity',
      'Research development team',
      'Use established DeFi protocols'
    ],
    examples: ['DeFi liquidity drain', 'Protocol exit scams']
  },
  {
    id: 'fake-validator-staking-node-scam',
    name: 'Fake Validator Staking Node Scam',
    category: 'Crypto-Fraud',
    description: 'Fake validator nodes that steal staked funds or provide no returns.',
    severity: 'critical',
    commonIndicators: [
      'Unverified validator operations',
      'No verifiable staking rewards',
      'Hidden withdrawal restrictions',
      'Poor node performance'
    ],
    preventionTips: [
      'Verify validator legitimacy',
      'Check staking rewards history',
      'Research validator reputation',
      'Monitor node performance'
    ],
    examples: ['Fake validator nodes', 'Staking fund theft']
  },
  {
    id: 'wallet-recovery-tool-malware',
    name: 'Wallet Recovery Tool Malware',
    category: 'Crypto-Fraud',
    description: 'Malicious wallet recovery tools that steal private keys or seed phrases.',
    severity: 'critical',
    commonIndicators: [
      'Unverified recovery tools',
      'Requests for seed phrases',
      'Fake recovery processes',
      'Phishing recovery sites'
    ],
    preventionTips: [
      'Never share seed phrases',
      'Use official wallet recovery methods',
      'Verify tool authenticity',
      'Report malicious recovery tools'
    ],
    examples: ['Fake recovery tools', 'Seed phrase theft']
  },
  {
    id: 'cross-chain-swap-scam',
    name: 'Cross-Chain Swap Scam',
    category: 'Crypto-Fraud',
    description: 'Fake cross-chain swap services that steal funds during token transfers.',
    severity: 'critical',
    commonIndicators: [
      'Unverified swap services',
      'Unusual swap fees',
      'Delayed transfers',
      'Suspicious contract interactions'
    ],
    preventionTips: [
      'Use established cross-chain bridges',
      'Verify swap contract addresses',
      'Check swap service reputation',
      'Start with small test swaps'
    ],
    examples: ['Cross-chain theft', 'Fake swap services']
  },
  {
    id: 'crypto-tax-refund-scam',
    name: 'Crypto Tax Refund Scam',
    category: 'Crypto-Fraud',
    description: 'Fake tax refund schemes that steal wallet credentials or require payments.',
    severity: 'high',
    commonIndicators: [
      'Unsolicited refund offers',
      'Requests for wallet connections',
      'Fake tax authority communications',
      'Phishing refund processes'
    ],
    preventionTips: [
      'Verify through official tax channels',
      'Never connect wallet for refunds',
      'Check tax authority authenticity',
      'Report phishing attempts'
    ],
    examples: ['Fake tax refunds', 'Wallet credential theft']
  },
  {
    id: 'fake-crypto-donation-scam',
    name: 'Fake Crypto Donation Scam',
    category: 'Crypto-Fraud',
    description: 'Fraudulent donation campaigns collecting cryptocurrency that never reaches intended causes.',
    severity: 'high',
    commonIndicators: [
      'Unverified donation campaigns',
      'Pressure to donate quickly',
      'No transparency about fund usage',
      'Suspicious donation addresses'
    ],
    preventionTips: [
      'Verify donation campaign legitimacy',
      'Research organization background',
      'Check for transparency reports',
      'Use established donation platforms'
    ],
    examples: ['Fake crypto donations', 'Charity fund theft']
  },
  {
    id: 'fake-blockchain-grant-scam',
    name: 'Fake Blockchain Grant Scam',
    category: 'Crypto-Fraud',
    description: 'Fake grant programs requiring payments or stealing personal information.',
    severity: 'high',
    commonIndicators: [
      'Upfront fees for grants',
      'Unverified grant programs',
      'Fake grant organizations',
      'Requests for sensitive information'
    ],
    preventionTips: [
      'Verify grant program legitimacy',
      'Never pay for grant applications',
      'Research organization background',
      'Protect personal information'
    ],
    examples: ['Fake blockchain grants', 'Grant application fraud']
  },
  {
    id: 'fake-venture-capital-investment-scam',
    name: 'Fake Venture Capital Investment Scam',
    category: 'Crypto-Fraud',
    description: 'Fake VC investment schemes requiring upfront fees or stealing project equity.',
    severity: 'critical',
    commonIndicators: [
      'Upfront investment fees',
      'Unverified VC firms',
      'Fake investment agreements',
      'Requests for project control'
    ],
    preventionTips: [
      'Verify VC firm legitimacy',
      'Never pay upfront investment fees',
      'Research firm background',
      'Consult legal advisors'
    ],
    examples: ['Fake VC investments', 'Investment fee scams']
  },
  {
    id: 'crypto-kyc-data-harvesting-scam',
    name: 'Crypto KYC Data Harvesting Scam',
    category: 'Crypto-Fraud',
    description: 'Fake KYC processes designed to steal personal information and identity data.',
    severity: 'high',
    commonIndicators: [
      'Unsolicited KYC requests',
      'Requests for sensitive documents',
      'Unofficial verification processes',
      'Poor website security'
    ],
    preventionTips: [
      'Only use official KYC processes',
      'Verify verification service authenticity',
      'Protect personal documents',
      'Report suspicious KYC requests'
    ],
    examples: ['Fake KYC processes', 'Identity data theft']
  },
  {
    id: 'fake-trading-volume-scam',
    name: 'Fake Trading Volume Scam',
    category: 'Crypto-Fraud',
    description: 'Artificially inflated trading volumes to create false market activity.',
    severity: 'high',
    commonIndicators: [
      'High volume with no price movement',
      'Self-trading patterns',
      'Artificial market depth',
      'Coordinated trading'
    ],
    preventionTips: [
      'Analyze trading patterns',
      'Check for wash trading',
      'Research legitimate trading activity',
      'Be cautious of artificial volume'
    ],
    examples: ['Volume manipulation', 'Artificial trading activity']
  },
  {
    id: 'nft-trait-manipulation-scam',
    name: 'NFT Trait Manipulation Scam',
    category: 'Crypto-Fraud',
    description: 'Manipulating NFT traits or metadata to deceive buyers about value.',
    severity: 'medium',
    commonIndicators: [
      'Altered NFT metadata',
      'Fake trait claims',
      'Suspicious NFT modifications',
      'No trait verification'
    ],
    preventionTips: [
      'Verify NFT metadata authenticity',
      'Check trait verification systems',
      'Research NFT provenance',
      'Use established marketplaces'
    ],
    examples: ['Trait manipulation', 'Metadata fraud']
  },
  {
    id: 'liquidity-mining-trap-scam',
    name: 'Liquidity Mining Trap Scam',
    category: 'Crypto-Fraud',
    description: 'Fake liquidity mining programs that steal provided liquidity.',
    severity: 'critical',
    commonIndicators: [
      'Unverified mining programs',
      'No transparent reward distribution',
      'Hidden withdrawal restrictions',
      'Suspicious mining mechanics'
    ],
    preventionTips: [
      'Verify mining program legitimacy',
      'Check reward distribution',
      'Understand mining mechanics',
      'Start with small test amounts'
    ],
    examples: ['Liquidity mining theft', 'Fake mining programs']
  },
  {
    id: 'honeypot-smart-contract-scam',
    name: 'Honeypot Smart Contract Scam',
    category: 'Crypto-Fraud',
    description: 'Smart contracts designed to trap funds and prevent withdrawals.',
    severity: 'critical',
    commonIndicators: [
      'Cannot withdraw funds',
      'Hidden contract restrictions',
      'No sell functionality',
      'Suspicious contract code'
    ],
    preventionTips: [
      'Audit smart contracts before interacting',
      'Check contract for restrictions',
      'Use contract analysis tools',
      'Test with small amounts first'
    ],
    examples: ['Honeypot contracts', 'Fund-trapping smart contracts']
  },
  {
    id: 'rugged-liquidity-pool-scam',
    name: 'Rugged Liquidity Pool Scam',
    category: 'Crypto-Fraud',
    description: 'Liquidity pools where developers drain all funds after attracting investors.',
    severity: 'critical',
    commonIndicators: [
      'Sudden liquidity removal',
      'Token price crashes',
      'Developers go silent',
      'No warning or announcement'
    ],
    preventionTips: [
      'Check if liquidity is locked',
      'Monitor pool activity',
      'Research development team',
      'Use platforms with locked liquidity'
    ],
    examples: ['Liquidity rug pulls', 'Pool drain schemes']
  },
  {
    id: 'fake-blockchain-gaming-token-scam',
    name: 'Fake Blockchain Gaming Token Scam',
    category: 'Crypto-Fraud',
    description: 'Fake gaming tokens for blockchain games that never materialize or have no value.',
    severity: 'high',
    commonIndicators: [
      'No actual game development',
      'Unrealistic token utility',
      'Anonymous development team',
      'No playable game'
    ],
    preventionTips: [
      'Verify game development progress',
      'Test playable game versions',
      'Research development team',
      'Be skeptical of pre-sale tokens'
    ],
    examples: ['Fake gaming tokens', 'Non-existent games']
  },
  {
    id: 'nft-airdrop-claim-scam',
    name: 'NFT AirDrop Claim Scam',
    category: 'Crypto-Fraud',
    description: 'Fake NFT airdrop claim processes that steal wallet credentials or funds.',
    severity: 'high',
    commonIndicators: [
      'Unexpected airdrop claims',
      'Requests for wallet connections',
      'Fake claim websites',
      'Phishing claim processes'
    ],
    preventionTips: [
      'Verify airdrop legitimacy',
      'Never connect wallet to suspicious sites',
      'Check official airdrop announcements',
      'Report phishing attempts'
    ],
    examples: ['Fake airdrop claims', 'Wallet credential theft']
  },
  {
    id: 'crypto-cold-wallet-replacement-scam',
    name: 'Crypto Cold Wallet Replacement Scam',
    category: 'Crypto-Fraud',
    description: 'Fake cold wallet replacement services that steal private keys or seed phrases.',
    severity: 'critical',
    commonIndicators: [
      'Unsolicited replacement offers',
      'Requests for seed phrases',
      'Fake replacement processes',
      'Phishing replacement sites'
    ],
    preventionTips: [
      'Never share seed phrases',
      'Use official wallet support',
      'Verify replacement authenticity',
      'Report phishing attempts'
    ],
    examples: ['Fake wallet replacements', 'Seed phrase theft']
  },
  {
    id: 'exchange-account-freeze-scam',
    name: 'Exchange Account Freeze Scam',
    category: 'Crypto-Fraud',
    description: 'Fake exchange account freeze notices designed to steal credentials or require payments.',
    severity: 'high',
    commonIndicators: [
      'Unsolicited freeze notices',
      'Requests for payments to unfreeze',
      'Fake exchange communications',
      'Phishing freeze processes'
    ],
    preventionTips: [
      'Verify through official exchange channels',
      'Never pay to unfreeze accounts',
      'Check exchange communications',
      'Report phishing attempts'
    ],
    examples: ['Fake account freezes', 'Payment to unfreeze scams']
  },
  {
    id: 'flash-crash-manipulation-scam',
    name: 'Flash Crash Manipulation Scam',
    category: 'Crypto-Fraud',
    description: 'Artificial market crashes designed to trigger stop losses and steal funds.',
    severity: 'high',
    commonIndicators: [
      'Sudden unexplained price crashes',
      'Coordinated selling patterns',
      'Stop loss triggering',
      'Rapid price recovery'
    ],
    preventionTips: [
      'Use wider stop losses',
      'Monitor market conditions',
      'Be cautious of sudden crashes',
      'Research crash causes'
    ],
    examples: ['Flash crash manipulation', 'Stop loss triggering']
  },
  {
    id: 'fake-blockchain-wallet-backup-scam',
    name: 'Fake Blockchain Wallet Backup Scam',
    category: 'Crypto-Fraud',
    description: 'Fake wallet backup services that steal private keys or seed phrases.',
    severity: 'critical',
    commonIndicators: [
      'Unsolicited backup offers',
      'Requests for seed phrases',
      'Fake backup processes',
      'Phishing backup sites'
    ],
    preventionTips: [
      'Never share seed phrases',
      'Use official wallet backup methods',
      'Verify backup authenticity',
      'Report phishing attempts'
    ],
    examples: ['Fake wallet backups', 'Seed phrase theft']
  },
  {
    id: 'smart-contract-approval-drain-scam',
    name: 'Smart Contract Approval Drain Scam',
    category: 'Crypto-Fraud',
    description: 'Fake contract approval requests that drain wallet funds when approved.',
    severity: 'critical',
    commonIndicators: [
      'Unexpected approval requests',
      'Requests for unlimited spending',
      'Suspicious contract addresses',
      'Urgent approval pressure'
    ],
    preventionTips: [
      'Review approval details carefully',
      'Check contract addresses',
      'Only approve necessary amounts',
      'Verify contract authenticity'
    ],
    examples: ['Approval drain scams', 'Malicious contract approvals']
  },
  {
    id: 'fake-crypto-crowdfunding-scam',
    name: 'Fake Crypto Crowdfunding Scam',
    category: 'Crypto-Fraud',
    description: 'Fake crowdfunding campaigns that collect funds without delivering promised products.',
    severity: 'high',
    commonIndicators: [
      'No verifiable project development',
      'Unrealistic campaign promises',
      'Anonymous project team',
      'No progress updates'
    ],
    preventionTips: [
      'Verify project development progress',
      'Research team background',
      'Check campaign legitimacy',
      'Be skeptical of unrealistic promises'
    ],
    examples: ['Fake crowdfunding', 'Campaign fund theft']
  },
  {
    id: 'web3-authentication-scam',
    name: 'Web3 Authentication Scam',
    category: 'Crypto-Fraud',
    description: 'Fake Web3 authentication processes that steal wallet credentials or private keys.',
    severity: 'critical',
    commonIndicators: [
      'Unexpected authentication requests',
      'Requests for private keys',
      'Fake authentication interfaces',
      'Phishing auth sites'
    ],
    preventionTips: [
      'Verify authentication authenticity',
      'Never share private keys',
      'Check authentication source',
      'Use official authentication methods'
    ],
    examples: ['Fake Web3 auth', 'Credential theft']
  },
  {
    id: 'fake-multi-chain-wallet-scam',
    name: 'Fake Multi-Chain Wallet Scam',
    category: 'Crypto-Fraud',
    description: 'Fake multi-chain wallets that steal funds across multiple blockchains.',
    severity: 'critical',
    commonIndicators: [
      'Unverified wallet sources',
      'Requests for seed phrases',
      'Poor wallet security',
      'Suspicious wallet behavior'
    ],
    preventionTips: [
      'Use established multi-chain wallets',
      'Verify wallet authenticity',
      'Check security features',
      'Never share seed phrases'
    ],
    examples: ['Fake multi-chain wallets', 'Cross-chain theft']
  },
  {
    id: 'token-spoofing-scam',
    name: 'Token Spoofing Scam',
    category: 'Crypto-Fraud',
    description: 'Fake tokens with similar names or symbols to legitimate tokens to deceive investors.',
    severity: 'high',
    commonIndicators: [
      'Similar token names or symbols',
      'No official project verification',
      'Suspicious token contracts',
      'Fake project websites'
    ],
    preventionTips: [
      'Verify token contract addresses',
      'Check official project sources',
      'Research token authenticity',
      'Be cautious of similar tokens'
    ],
    examples: ['Token spoofing', 'Fake token impersonation']
  },
  {
    id: 'blockchain-identity-theft-scam',
    name: 'Blockchain Identity Theft Scam',
    category: 'Crypto-Fraud',
    description: 'Stealing blockchain-based identities or credentials to access funds or services.',
    severity: 'critical',
    commonIndicators: [
      'Unusual identity verification requests',
      'Requests for private keys',
      'Fake identity services',
      'Phishing identity processes'
    ],
    preventionTips: [
      'Protect blockchain identities',
      'Never share private keys',
      'Verify identity service authenticity',
      'Use identity protection tools'
    ],
    examples: ['Identity theft', 'Blockchain credential theft']
  },
  {
    id: 'crypto-subscription-mining-scam',
    name: 'Crypto Subscription Mining Scam',
    category: 'Crypto-Fraud',
    description: 'Fake subscription mining services that charge fees without providing mining returns.',
    severity: 'high',
    commonIndicators: [
      'Subscription fees for mining',
      'No verifiable mining operations',
      'Unrealistic mining returns',
      'Hidden withdrawal restrictions'
    ],
    preventionTips: [
      'Verify mining operations exist',
      'Check mining return history',
      'Research service reputation',
      'Be skeptical of subscription mining'
    ],
    examples: ['Subscription mining fraud', 'Fake mining services']
  },
  {
    id: 'fake-defi-insurance-protocol-scam',
    name: 'Fake DeFi Insurance Protocol Scam',
    category: 'Crypto-Fraud',
    description: 'Fake DeFi insurance protocols that collect premiums but never pay claims.',
    severity: 'critical',
    commonIndicators: [
      'Unverified insurance protocols',
      'No proper claim processes',
      'Hidden coverage exclusions',
      'Poor claim payouts'
    ],
    preventionTips: [
      'Verify insurance protocol legitimacy',
      'Check claim process transparency',
      'Research protocol reputation',
      'Understand coverage terms'
    ],
    examples: ['Fake DeFi insurance', 'Insurance premium theft']
  },
  {
    id: 'trading-bot-rental-scam',
    name: 'Trading Bot Rental Scam',
    category: 'Crypto-Fraud',
    description: 'Fake trading bot rentals that charge fees without providing profitable trading.',
    severity: 'high',
    commonIndicators: [
      'Guaranteed profit claims',
      'High rental fees',
      'No verifiable trading history',
      'Hidden performance fees'
    ],
    preventionTips: [
      'Verify bot trading performance',
      'Test with small amounts first',
      'Research bot developer reputation',
      'Be skeptical of guaranteed profits'
    ],
    examples: ['Bot rental fraud', 'Fake trading bots']
  },
  {
    id: 'nft-fractional-ownership-scam',
    name: 'NFT Fractional Ownership Scam',
    category: 'Crypto-Fraud',
    description: 'Fake fractional NFT ownership schemes that steal funds or NFTs.',
    severity: 'high',
    commonIndicators: [
      'Unverified fractional platforms',
      'No proper NFT custody',
      'Hidden ownership restrictions',
      'Poor platform security'
    ],
    preventionTips: [
      'Use established fractional platforms',
      'Verify NFT custody arrangements',
      'Check platform reputation',
      'Understand ownership terms'
    ],
    examples: ['Fractional NFT fraud', 'Ownership scheme theft']
  },
  {
    id: 'crypto-charity-rug-pull-scam',
    name: 'Crypto Charity Rug Pull Scam',
    category: 'Crypto-Fraud',
    description: 'Fake charity projects that collect donations and disappear with funds.',
    severity: 'critical',
    commonIndicators: [
      'Unverified charity projects',
      'No transparency about fund usage',
      'Developers go silent',
      'No charitable activities'
    ],
    preventionTips: [
      'Verify charity project legitimacy',
      'Check for transparency reports',
      'Research organization background',
      'Use established charity platforms'
    ],
    examples: ['Charity rug pulls', 'Donation fund theft']
  },
  {
    id: 'fake-crypto-tax-consultant-scam',
    name: 'Fake Crypto Tax Consultant Scam',
    category: 'Crypto-Fraud',
    description: 'Fake tax consultants that steal personal information or charge for worthless services.',
    severity: 'high',
    commonIndicators: [
      'Unverified tax consultants',
      'Requests for sensitive financial information',
      'Unrealistic tax saving claims',
      'Poor service quality'
    ],
    preventionTips: [
      'Verify consultant credentials',
      'Check professional licensing',
      'Research consultant reputation',
      'Protect financial information'
    ],
    examples: ['Fake tax consultants', 'Financial information theft']
  },
  {
    id: 'wallet-verification-scam',
    name: 'Wallet Verification Scam',
    category: 'Crypto-Fraud',
    description: 'Fake wallet verification processes that steal private keys or seed phrases.',
    severity: 'critical',
    commonIndicators: [
      'Unsolicited verification requests',
      'Requests for seed phrases',
      'Fake verification processes',
      'Phishing verification sites'
    ],
    preventionTips: [
      'Never share seed phrases',
      'Use official wallet verification',
      'Verify verification authenticity',
      'Report phishing attempts'
    ],
    examples: ['Fake wallet verification', 'Seed phrase theft']
  },
  {
    id: 'fake-blockchain-security-alert-scam',
    name: 'Fake Blockchain Security Alert Scam',
    category: 'Crypto-Fraud',
    description: 'Fake security alerts designed to panic users into taking harmful actions.',
    severity: 'high',
    commonIndicators: [
      'Unofficial security communications',
      'Urgent action required',
      'Requests for wallet connections',
      'Suspicious alert sources'
    ],
    preventionTips: [
      'Verify through official security channels',
      'Never connect wallet to alerts',
      'Check alert source authenticity',
      'Report fake security alerts'
    ],
    examples: ['Fake security alerts', 'Panic-induced actions']
  },
  {
    id: 'crypto-portfolio-management-scam',
    name: 'Crypto Portfolio Management Scam',
    category: 'Crypto-Fraud',
    description: 'Fake portfolio management services that steal funds or charge excessive fees.',
    severity: 'high',
    commonIndicators: [
      'Unverified management services',
      'Guaranteed returns promised',
      'High management fees',
      'No verifiable track record'
    ],
    preventionTips: [
      'Verify management service legitimacy',
      'Check track record',
      'Research service reputation',
      'Be skeptical of guaranteed returns'
    ],
    examples: ['Fake portfolio management', 'Fund theft']
  },
  {
    id: 'fake-crypto-airdrop-checker-scam',
    name: 'Fake Crypto Airdrop Checker Scam',
    category: 'Crypto-Fraud',
    description: 'Fake airdrop checker tools that steal wallet credentials or seed phrases.',
    severity: 'high',
    commonIndicators: [
      'Unverified checker tools',
      'Requests for wallet connections',
      'Fake checker interfaces',
      'Phishing checker sites'
    ],
    preventionTips: [
      'Verify checker tool authenticity',
      'Never connect wallet to checkers',
      'Use official airdrop sources',
      'Report phishing attempts'
    ],
    examples: ['Fake airdrop checkers', 'Wallet credential theft']
  },
  {
    id: 'crypto-malware-apk-scam',
    name: 'Crypto Malware APK Scam',
    category: 'Crypto-Fraud',
    description: 'Malicious APK files that steal cryptocurrency from mobile devices.',
    severity: 'critical',
    commonIndicators: [
      'Unverified APK sources',
      'Requests for excessive permissions',
      'Poor app reviews',
      'Suspicious app behavior'
    ],
    preventionTips: [
      'Only download from official app stores',
      'Check app reviews and developer info',
      'Review app permissions',
      'Use security software'
    ],
    examples: ['Malicious APKs', 'Mobile crypto theft']
  },
  {
    id: 'fake-layer-2-scaling-project-scam',
    name: 'Fake Layer-2 Scaling Project Scam',
    category: 'Crypto-Fraud',
    description: 'Fake Layer-2 scaling projects that collect investments without delivering technology.',
    severity: 'critical',
    commonIndicators: [
      'No verifiable technology development',
      'Unrealistic scaling claims',
      'Anonymous development team',
      'No technical documentation'
    ],
    preventionTips: [
      'Verify technology development',
      'Check technical documentation',
      'Research development team',
      'Be skeptical of unrealistic claims'
    ],
    examples: ['Fake scaling projects', 'Technology investment fraud']
  },
  {
    id: 'blockchain-storage-scam',
    name: 'Blockchain Storage Scam',
    category: 'Crypto-Fraud',
    description: 'Fake blockchain storage services that steal data or charge for non-existent services.',
    severity: 'high',
    commonIndicators: [
      'Unverified storage services',
      'No actual storage infrastructure',
      'Hidden data access restrictions',
      'Poor service reliability'
    ],
    preventionTips: [
      'Verify storage service legitimacy',
      'Check storage infrastructure',
      'Research service reputation',
      'Test with small amounts first'
    ],
    examples: ['Fake storage services', 'Data theft schemes']
  },
  {
    id: 'fake-crypto-cloud-wallet-scam',
    name: 'Fake Crypto Cloud Wallet Scam',
    category: 'Crypto-Fraud',
    description: 'Fake cloud wallet services that steal cryptocurrency or private keys.',
    severity: 'critical',
    commonIndicators: [
      'Unverified cloud wallet services',
      'Requests for private keys',
      'Poor wallet security',
      'Suspicious wallet behavior'
    ],
    preventionTips: [
      'Use established cloud wallet services',
      'Verify wallet authenticity',
      'Never share private keys',
      'Check security features'
    ],
    examples: ['Fake cloud wallets', 'Cloud wallet theft']
  },
  {
    id: 'nft-reveal-manipulation-scam',
    name: 'NFT Reveal Manipulation Scam',
    category: 'Crypto-Fraud',
    description: 'Manipulating NFT reveal processes to deceive buyers about final NFT appearance.',
    severity: 'medium',
    commonIndicators: [
      'Altered reveal outcomes',
      'Fake reveal promises',
      'Suspicious reveal mechanics',
      'No reveal transparency'
    ],
    preventionTips: [
      'Verify reveal process transparency',
      'Check project reputation',
      'Research reveal mechanics',
      'Be cautious of pre-reveal purchases'
    ],
    examples: ['Reveal manipulation', 'Fake NFT reveals']
  },
  {
    id: 'fake-crypto-scholarship-scam',
    name: 'Fake Crypto Scholarship Scam',
    category: 'Crypto-Fraud',
    description: 'Fake scholarship programs requiring payments or stealing personal information.',
    severity: 'high',
    commonIndicators: [
      'Upfront fees for scholarships',
      'Unverified scholarship programs',
      'Fake scholarship organizations',
      'Requests for sensitive information'
    ],
    preventionTips: [
      'Verify scholarship program legitimacy',
      'Never pay for scholarship applications',
      'Research organization background',
      'Protect personal information'
    ],
    examples: ['Fake scholarships', 'Application fee scams']
  },
  {
    id: 'crypto-mlm-referral-trap',
    name: 'Crypto MLM Referral Trap',
    category: 'Crypto-Fraud',
    description: 'MLM schemes focusing on recruitment with crypto as the payment method.',
    severity: 'critical',
    commonIndicators: [
      'Focus on recruitment over product',
      'Commission-based earnings structure',
      'Pressure to recruit new members',
      'No legitimate business activity'
    ],
    preventionTips: [
      'Understand the business model',
      'Avoid recruitment-focused schemes',
      'Research company background',
      'Be wary of commission promises'
    ],
    examples: ['Crypto MLM schemes', 'Recruitment traps']
  },
  {
    id: 'decentralized-exchange-clone-scam',
    name: 'Decentralized Exchange Clone Scam',
    category: 'Crypto-Fraud',
    description: 'Fake DEX clones that steal funds or manipulate trading.',
    severity: 'critical',
    commonIndicators: [
      'Unverified DEX platforms',
      'Similar to legitimate DEXs but different URLs',
      'Requests for wallet connections',
      'Suspicious trading mechanics'
    ],
    preventionTips: [
      'Use established DEX platforms',
      'Verify DEX authenticity',
      'Check contract addresses',
      'Research platform reputation'
    ],
    examples: ['DEX clones', 'Fake decentralized exchanges']
  },
  {
    id: 'fake-burn-wallet-scam',
    name: 'Fake Burn Wallet Scam',
    category: 'Crypto-Fraud',
    description: 'Fake burn wallet addresses used to manipulate token prices or steal funds.',
    severity: 'high',
    commonIndicators: [
      'Unverified burn wallets',
      'No actual token burning',
      'Suspicious burn transactions',
      'Price manipulation tactics'
    ],
    preventionTips: [
      'Verify burn transactions on blockchain',
      'Check burn wallet authenticity',
      'Research burn legitimacy',
      'Be skeptical of price manipulation'
    ],
    examples: ['Fake burn wallets', 'Burn manipulation']
  },
  {
    id: 'rug-pull-memecoin-launch-scam',
    name: 'Rug Pull Memecoin Launch Scam',
    category: 'Crypto-Fraud',
    description: 'Memecoins launched specifically to rug pull investors after initial hype.',
    severity: 'critical',
    commonIndicators: [
      'No utility or purpose',
      'Anonymous development team',
      'Rapid price increases then crashes',
      'Developers sell immediately after launch'
    ],
    preventionTips: [
      'Research coin utility and purpose',
      'Check development team background',
      'Be cautious of anonymous teams',
      'Avoid FOMO investments'
    ],
    examples: ['Memecoin rug pulls', 'Launch scams']
  },
  {
    id: 'fake-crypto-influencer-promotion-scam',
    name: 'Fake Crypto Influencer Promotion Scam',
    category: 'Crypto-Fraud',
    description: 'Fake influencer promotions where influencers are paid to promote worthless tokens.',
    severity: 'high',
    commonIndicators: [
      'Paid influencer promotions',
      'No token utility or value',
      'Influencer dumps after promotion',
      'Suspicious promotion timing'
    ],
    preventionTips: [
      'Research token independently',
      'Be skeptical of influencer promotions',
      'Check token utility and value',
      'Monitor influencer selling patterns'
    ],
    examples: ['Influencer pump and dump', 'Paid promotions']
  },
  {
    id: 'nft-royalty-scam',
    name: 'NFT Royalty Scam',
    category: 'Crypto-Fraud',
    description: 'Fake NFT royalty schemes that steal creator earnings or manipulate royalty payments.',
    severity: 'medium',
    commonIndicators: [
      'Unverified royalty programs',
      'Hidden royalty deductions',
      'No transparent royalty tracking',
      'Suspicious royalty calculations'
    ],
    preventionTips: [
      'Verify royalty program legitimacy',
      'Check royalty tracking transparency',
      'Research platform reputation',
      'Understand royalty terms'
    ],
    examples: ['Royalty theft', 'Fake royalty schemes']
  },
  {
    id: 'fake-blockchain-voting-app-scam',
    name: 'Fake Blockchain Voting App Scam',
    category: 'Crypto-Fraud',
    description: 'Fake blockchain voting applications that steal credentials or manipulate votes.',
    severity: 'high',
    commonIndicators: [
      'Unverified voting apps',
      'Requests for wallet connections',
      'Fake voting processes',
      'Phishing voting sites'
    ],
    preventionTips: [
      'Use established voting platforms',
      'Verify voting app authenticity',
      'Check voting process transparency',
      'Report phishing attempts'
    ],
    examples: ['Fake voting apps', 'Credential theft']
  },
  {
    id: 'wallet-migration-phishing-scam',
    name: 'Wallet Migration Phishing Scam',
    category: 'Crypto-Fraud',
    description: 'Fake wallet migration processes that steal private keys or seed phrases.',
    severity: 'critical',
    commonIndicators: [
      'Unsolicited migration requests',
      'Requests for seed phrases',
      'Fake migration processes',
      'Phishing migration sites'
    ],
    preventionTips: [
      'Never share seed phrases',
      'Use official wallet migration',
      'Verify migration authenticity',
      'Report phishing attempts'
    ],
    examples: ['Fake wallet migrations', 'Seed phrase theft']
  },
  {
    id: 'crypto-fake-screenshot-scam',
    name: 'Crypto Fake Screenshot Scam',
    category: 'Crypto-Fraud',
    description: 'Fake screenshots of profits or balances used to deceive victims into investing.',
    severity: 'medium',
    commonIndicators: [
      'Unverified profit screenshots',
      'Fake balance displays',
      'Edited transaction histories',
      'Suspicious proof of earnings'
    ],
    preventionTips: [
      'Verify profits on blockchain',
      'Check transaction history independently',
      'Be skeptical of screenshot evidence',
      'Request verifiable proof'
    ],
    examples: ['Fake profit screenshots', 'Balance deception']
  },
  {
    id: 'fake-ai-crypto-coin-scam',
    name: 'Fake AI Crypto Coin Scam',
    category: 'Crypto-Fraud',
    description: 'Fake AI-themed crypto coins with no actual AI technology or utility.',
    severity: 'high',
    commonIndicators: [
      'AI buzzwords without technology',
      'No verifiable AI development',
      'Anonymous development team',
      'Unrealistic AI claims'
    ],
    preventionTips: [
      'Verify AI technology claims',
      'Check for actual AI development',
      'Research development team',
      'Be skeptical of AI buzzwords'
    ],
    examples: ['Fake AI coins', 'AI buzzword scams']
  },
  {
    id: 'token-vesting-scam',
    name: 'Token Vesting Scam',
    category: 'Crypto-Fraud',
    description: 'Fake token vesting schedules that prevent token releases or steal vested tokens.',
    severity: 'critical',
    commonIndicators: [
      'Unverifiable vesting contracts',
      'Hidden vesting restrictions',
      'No token releases on schedule',
      'Suspicious vesting terms'
    ],
    preventionTips: [
      'Verify vesting contract authenticity',
      'Check vesting schedule transparency',
      'Research project reputation',
      'Understand vesting terms'
    ],
    examples: ['Vesting scams', 'Token release theft']
  },
  {
    id: 'blockchain-ponzi-yield-scam',
    name: 'Blockchain Ponzi Yield Scam',
    category: 'Crypto-Fraud',
    description: 'Ponzi schemes disguised as blockchain yield farming or staking programs.',
    severity: 'critical',
    commonIndicators: [
      'Unrealistic yield promises',
      'Returns paid from new investors',
      'Focus on recruitment over yield',
      'Unsustainable yield models'
    ],
    preventionTips: [
      'Understand yield generation mechanism',
      'Verify yield sustainability',
      'Research platform reputation',
      'Be skeptical of unrealistic yields'
    ],
    examples: ['Yield Ponzi schemes', 'Fake staking programs']
  },
  {
    id: 'crypto-trading-license-scam',
    name: 'Crypto Trading License Scam',
    category: 'Crypto-Fraud',
    description: 'Fake trading license programs requiring payments for non-existent licenses.',
    severity: 'high',
    commonIndicators: [
      'Upfront license fees',
      'Unverified licensing authorities',
      'Fake license certificates',
      'No regulatory recognition'
    ],
    preventionTips: [
      'Verify licensing authority legitimacy',
      'Check regulatory recognition',
      'Research license requirements',
      'Never pay for licenses upfront'
    ],
    examples: ['Fake trading licenses', 'License fee scams']
  },
  {
    id: 'fake-decentralized-storage-project-scam',
    name: 'Fake Decentralized Storage Project Scam',
    category: 'Crypto-Fraud',
    description: 'Fake decentralized storage projects that collect investments without delivering technology.',
    severity: 'critical',
    commonIndicators: [
      'No verifiable storage technology',
      'Unrealistic storage claims',
      'Anonymous development team',
      'No technical documentation'
    ],
    preventionTips: [
      'Verify storage technology development',
      'Check technical documentation',
      'Research development team',
      'Be skeptical of unrealistic claims'
    ],
    examples: ['Fake storage projects', 'Technology investment fraud']
  },
  {
    id: 'nft-giveaway-bot-scam',
    name: 'NFT Giveaway Bot Scam',
    category: 'Crypto-Fraud',
    description: 'Fake NFT giveaway bots that steal wallet credentials or require payments.',
    severity: 'high',
    commonIndicators: [
      'Unverified giveaway bots',
      'Requests for wallet connections',
      'Payments required for giveaways',
      'Suspicious bot behavior'
    ],
    preventionTips: [
      'Verify giveaway authenticity',
      'Never connect wallet to bots',
      'Check official giveaway sources',
      'Report phishing attempts'
    ],
    examples: ['Fake giveaway bots', 'Wallet credential theft']
  },
  {
    id: 'blockchain-reward-point-scam',
    name: 'Blockchain Reward Point Scam',
    category: 'Crypto-Fraud',
    description: 'Fake reward point systems that never convert to actual cryptocurrency or value.',
    severity: 'medium',
    commonIndicators: [
      'Unverifiable point systems',
      'No actual conversion to crypto',
      'Hidden conversion restrictions',
      'Poor point value'
    ],
    preventionTips: [
      'Verify point system legitimacy',
      'Check conversion mechanisms',
      'Research platform reputation',
      'Be skeptical of point promises'
    ],
    examples: ['Fake reward points', 'Point system fraud']
  },
  {
    id: 'fake-crypto-cashback-airdrop-scam',
    name: 'Fake Crypto Cashback Airdrop Scam',
    category: 'Crypto-Fraud',
    description: 'Fake cashback airdrop schemes that steal wallet credentials or require payments.',
    severity: 'high',
    commonIndicators: [
      'Unverified airdrop programs',
      'Requests for wallet connections',
      'Payments required for airdrops',
      'Suspicious airdrop processes'
    ],
    preventionTips: [
      'Verify airdrop legitimacy',
      'Never connect wallet to suspicious sites',
      'Check official airdrop announcements',
      'Report phishing attempts'
    ],
    examples: ['Fake cashback airdrops', 'Wallet credential theft']
  },
  {
    id: 'defi-governance-attack-scam',
    name: 'DeFi Governance Attack Scam',
    category: 'Crypto-Fraud',
    description: 'Attacks on DeFi governance systems to manipulate protocols or steal funds.',
    severity: 'critical',
    commonIndicators: [
      'Unusual governance proposals',
      'Manipulated voting outcomes',
      'Hidden governance attacks',
      'Suspicious governance changes'
    ],
    preventionTips: [
      'Research governance proposals carefully',
      'Understand governance mechanisms',
      'Check voting transparency',
      'Monitor governance activity'
    ],
    examples: ['Governance attacks', 'Protocol manipulation']
  },
  {
    id: 'fake-blockchain-startup-scam',
    name: 'Fake Blockchain Startup Scam',
    category: 'Crypto-Fraud',
    description: 'Fake blockchain startups that collect investments without delivering products.',
    severity: 'critical',
    commonIndicators: [
      'No verifiable product development',
      'Unrealistic startup claims',
      'Anonymous founding team',
      'No progress updates'
    ],
    preventionTips: [
      'Verify product development progress',
      'Research founding team background',
      'Check startup legitimacy',
      'Be skeptical of unrealistic claims'
    ],
    examples: ['Fake startups', 'Startup investment fraud']
  },
  {
    id: 'crypto-recovery-phrase-generator-scam',
    name: 'Crypto Recovery Phrase Generator Scam',
    category: 'Crypto-Fraud',
    description: 'Fake recovery phrase generators that steal real phrases or generate useless ones.',
    severity: 'critical',
    commonIndicators: [
      'Unverified recovery tools',
      'Requests for existing phrases',
      'Fake generation processes',
      'Phishing recovery sites'
    ],
    preventionTips: [
      'Never share existing recovery phrases',
      'Use official wallet recovery methods',
      'Verify tool authenticity',
      'Report phishing attempts'
    ],
    examples: ['Fake recovery generators', 'Phrase theft']
  },
  {
    id: 'fake-crypto-escrow-service-scam',
    name: 'Fake Crypto Escrow Service Scam',
    category: 'Crypto-Fraud',
    description: 'Fake escrow services that steal funds held in trust for transactions.',
    severity: 'critical',
    commonIndicators: [
      'Unverified escrow services',
      'No proper licensing',
      'Unusual fee structures',
      'Poor customer support'
    ],
    preventionTips: [
      'Use reputable escrow services',
      'Verify service licensing',
      'Check user reviews',
      'Understand escrow terms'
    ],
    examples: ['Fake escrow services', 'Escrow fund theft']
  },
  {
    id: 'wallet-signature-phishing-scam',
    name: 'Wallet Signature Phishing Scam',
    category: 'Crypto-Fraud',
    description: 'Fake signature requests that trick users into signing malicious transactions.',
    severity: 'critical',
    commonIndicators: [
      'Unexpected signature requests',
      'Suspicious transaction details',
      'Requests for blanket approvals',
      'Phishing signature sites'
    ],
    preventionTips: [
      'Review signature details carefully',
      'Check transaction authenticity',
      'Never sign blank approvals',
      'Verify signature requests'
    ],
    examples: ['Signature phishing', 'Malicious transaction approvals']
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
