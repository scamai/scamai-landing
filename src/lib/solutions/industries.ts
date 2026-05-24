export type Industry = {
  slug: string;
  name: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  stat: { value: string; label: string };
  capabilities: { title: string; description: string }[];
  useCases: { title: string; description: string; bullets: string[] }[];
  faqs: { question: string; answer: string }[];
  relatedProduct: 'ai' | 'audio' | 'both';
  ctaHeadline: string;
  ctaSubheadline: string;
  keywords: string[];
  metaDescription: string;
};

export const industries: Industry[] = [
  {
    slug: 'fintech',
    name: 'Fintech & Banking',
    eyebrow: 'FINTECH',
    headline: 'Deepfake detection for fintech and banking',
    subheadline:
      'Protect your onboarding and transaction flows from synthetic identity attacks. ScamAI integrates into KYC pipelines in under 10 minutes, flagging deepfake selfies, AI-generated documents, and voice clone fraud before they reach your agents.',
    stat: { value: '340%', label: 'increase in deepfake KYC fraud attempts in 2025 (Deloitte)' },
    capabilities: [
      {
        title: 'KYC Deepfake Detection',
        description:
          'Detect synthetic faces and deepfake selfies during customer onboarding at 95.3% accuracy. Flags face swaps, GAN-generated images, and diffusion model outputs in under 4 seconds.',
      },
      {
        title: 'Synthetic Identity Fraud Prevention',
        description:
          'Identify AI-fabricated identities combining real and fake data used to open accounts, apply for loans, or bypass credit checks.',
      },
      {
        title: 'Document Authenticity Verification',
        description:
          'Verify ID documents, bank statements, and financial forms for AI-generated tampering using our AIForge-Doc detection model.',
      },
      {
        title: 'Voice Clone Fraud Detection',
        description:
          'Protect phone-based customer service and voice banking from vishing attacks by detecting cloned voices with 98.5% accuracy in real time.',
      },
    ],
    useCases: [
      {
        title: 'Account Opening & KYC',
        description: 'Screen every selfie and ID document submitted during digital onboarding for synthetic manipulation.',
        bullets: ['Deepfake selfie detection', 'ID document forgery screening', 'Liveness check bypass prevention'],
      },
      {
        title: 'Loan & Credit Applications',
        description: 'Verify income documents and financial statements are not AI-generated or tampered.',
        bullets: ['AI-edited document detection', 'Synthetic financial record screening', 'Fraud pattern matching'],
      },
      {
        title: 'Phone Banking & Call Centers',
        description: 'Protect voice authentication systems from voice clone attacks targeting account access.',
        bullets: ['Real-time vishing detection', 'Caller voice authentication', 'Voice impersonation alerts'],
      },
      {
        title: 'Regulatory Compliance',
        description: 'Meet FFIEC, AML, and KYC regulatory requirements with documented AI detection workflows.',
        bullets: ['SOC 2 Type II certified', 'GDPR compliant processing', 'Audit logging and reporting'],
      },
    ],
    faqs: [
      {
        question: 'How does deepfake detection integrate with existing KYC pipelines?',
        answer:
          'ScamAI provides a REST API that integrates in under 10 minutes. Submit an image URL or base64 payload and receive a JSON response with is_deepfake boolean, confidence score, and manipulation type. It sits alongside your existing liveness checks and ID verification tools.',
      },
      {
        question: 'What types of identity fraud can ScamAI detect in fintech?',
        answer:
          'ScamAI detects face swaps in selfie verification, GAN-generated identity photos, AI-edited bank statements and documents, and voice-cloned callers attempting to impersonate account holders.',
      },
      {
        question: 'Is ScamAI SOC 2 and GDPR compliant for financial services use?',
        answer:
          'Yes. ScamAI is SOC 2 Type II certified and GDPR compliant. Images are not stored after processing, and full audit logging is available for compliance reporting.',
      },
      {
        question: 'How fast is deepfake detection for real-time KYC flows?',
        answer:
          'Eva-v1-Fast processes each image in under 2 seconds, suitable for real-time onboarding flows without adding perceptible friction. Eva-v1-Pro processes in under 4 seconds for maximum accuracy.',
      },
      {
        question: 'Can ScamAI scale for high-volume financial services workloads?',
        answer:
          'Yes. ScamAI offers enterprise plans with SLA-backed uptime of 99.9%, dedicated throughput, and volume pricing. Contact sales@scam.ai for enterprise onboarding.',
      },
    ],
    relatedProduct: 'both',
    ctaHeadline: 'Start protecting your KYC pipeline today',
    ctaSubheadline: '200 free images per month. No credit card required.',
    keywords: [
      'deepfake detection fintech',
      'KYC deepfake protection',
      'financial fraud deepfake',
      'synthetic identity detection',
      'deepfake KYC API',
      'voice clone banking fraud',
    ],
    metaDescription:
      'Protect fintech KYC and banking onboarding from deepfake fraud. ScamAI detects synthetic identities, AI-edited documents, and voice clone attacks with 95.3% accuracy. SOC 2 Type II certified.',
  },
  {
    slug: 'dating',
    name: 'Dating Apps',
    eyebrow: 'DATING',
    headline: 'Deepfake and fake profile detection for dating apps',
    subheadline:
      'Romance scammers use AI-generated profile photos and cloned voices to deceive users at scale. ScamAI gives dating platforms the API to automatically verify profile images and audio for synthetic manipulation before matches are made.',
    stat: { value: '70%+', label: 'of online romance scam profiles involve AI-generated or manipulated photos' },
    capabilities: [
      {
        title: 'Profile Photo Verification',
        description:
          'Detect AI-generated or manipulated profile images at upload time, catching face swaps, GAN-generated faces, and diffusion model outputs before they reach other users.',
      },
      {
        title: 'Voice Catfishing Prevention',
        description:
          'Identify cloned voices in audio and video messages, protecting users from scammers using AI to impersonate attractive individuals.',
      },
      {
        title: 'Synthetic Face Detection',
        description:
          'Flag profiles built with fully AI-generated faces that have never existed, stopping bot farms and mass catfishing operations.',
      },
      {
        title: 'Continuous Monitoring',
        description:
          'Re-verify profile content periodically as users update photos or send new media, maintaining trust throughout the relationship lifecycle.',
      },
    ],
    useCases: [
      {
        title: 'Profile Creation & Verification',
        description: 'Scan every profile photo at upload for synthetic manipulation before the account goes live.',
        bullets: ['AI-generated face detection', 'Face swap identification', 'GAN image flagging'],
      },
      {
        title: 'In-App Media Verification',
        description: 'Verify photos and videos shared in chats to detect catfishing attempts mid-conversation.',
        bullets: ['Real-time media scanning', 'Deepfake video detection', 'Voice message authentication'],
      },
      {
        title: 'Trust & Safety Automation',
        description: 'Automatically flag suspicious profiles for human review, reducing moderation costs.',
        bullets: ['Confidence scoring', 'Automated escalation', 'Bulk profile scanning API'],
      },
      {
        title: 'Romance Scam Prevention',
        description: 'Identify scammer patterns before emotional investment deepens and financial harm occurs.',
        bullets: ['Synthetic identity screening', 'Pattern-based fraud detection', 'Cross-profile similarity analysis'],
      },
    ],
    faqs: [
      {
        question: 'Can ScamAI detect AI-generated profile photos at upload?',
        answer:
          'Yes. ScamAI integrates into your upload pipeline via REST API. Each photo is analyzed in under 2 seconds, returning a confidence score and deepfake classification. Photos flagged above your chosen threshold can be held for review or rejected automatically.',
      },
      {
        question: 'How does ScamAI detect fake profiles built with AI-generated faces?',
        answer:
          'ScamAI\'s Eva-v1 model detects the subtle artifacts left by GAN generators and diffusion models like Stable Diffusion, DALL-E, and Midjourney. Fully synthetic faces that have never existed are identified through frequency-domain and semantic analysis.',
      },
      {
        question: 'Can ScamAI verify voice messages for voice cloning?',
        answer:
          'Yes. The Audio Detection API identifies AI-generated or cloned speech from platforms including ElevenLabs, PlayHT, and Resemble AI. It works with MP3, WAV, and OGG files with 98.5% accuracy.',
      },
      {
        question: 'What is the pricing for dating app deepfake detection?',
        answer:
          'ScamAI is priced at $0.05 per image analyzed, with a free tier of 200 images per month. Volume discounts are available for platforms processing millions of uploads. Contact sales@scam.ai for dating platform pricing.',
      },
      {
        question: 'How quickly can a dating platform integrate ScamAI?',
        answer:
          'Integration takes under 10 minutes with the REST API. SDKs are available for Python and JavaScript. Full documentation is at scam.ai/en/resources/documentation.',
      },
    ],
    relatedProduct: 'both',
    ctaHeadline: 'Build a safer dating platform',
    ctaSubheadline: '200 free image analyses per month. No credit card required.',
    keywords: [
      'dating app deepfake detection',
      'fake profile detection API',
      'catfishing prevention',
      'AI-generated profile photos',
      'romance scam prevention',
      'synthetic face detection dating',
    ],
    metaDescription:
      'Protect dating app users from AI-generated fake profiles and voice catfishing. ScamAI API detects synthetic faces, deepfakes, and cloned voices at profile upload. 200 free analyses per month.',
  },
  {
    slug: 'call-centers',
    name: 'Call Centers',
    eyebrow: 'CALL CENTERS',
    headline: 'Voice clone detection for call centers',
    subheadline:
      'Voice phishing attacks using AI-cloned voices are targeting call centers to steal account credentials, authorize fraudulent transactions, and impersonate executives. ScamAI\'s real-time audio deepfake detection identifies synthetic voices in under 3 seconds — before the fraud succeeds.',
    stat: { value: '$12.5B', label: 'lost globally to voice phishing (vishing) in 2024 — FBI IC3 Report' },
    capabilities: [
      {
        title: 'Real-Time Stream Analysis',
        description:
          'Analyze live call audio in real time, processing each segment in under 3 seconds to flag voice clones before agents are deceived.',
      },
      {
        title: 'Caller Voice Authentication',
        description:
          'Verify that the caller\'s voice is genuine, not AI-generated, as part of your existing voice authentication and IVR flows.',
      },
      {
        title: 'Executive Impersonation Detection',
        description:
          'Detect AI-cloned voices attempting to impersonate executives, VIPs, or known customers to authorize wire transfers or account changes.',
      },
      {
        title: 'Fraud Alert Integration',
        description:
          'Webhook-based alerts fire in real time when a synthetic voice is detected, triggering escalation workflows in your CRM or call management system.',
      },
    ],
    useCases: [
      {
        title: 'Inbound Call Verification',
        description: 'Screen every inbound call\'s voice against synthetic audio patterns before routing to agents.',
        bullets: ['Real-time vishing detection', 'Voice authentication bypass prevention', 'Automated fraud alerts'],
      },
      {
        title: 'Account Change Authorization',
        description: 'Verify voice identity before processing high-risk actions like wire transfers, password resets, or account closures.',
        bullets: ['High-stakes call screening', 'Multi-factor voice verification', 'Audit trail for compliance'],
      },
      {
        title: 'Executive & VIP Protection',
        description: 'Protect C-suite and known-customer voice profiles from cloning attacks targeting privileged access.',
        bullets: ['Voice profile matching', 'Clone impersonation detection', 'Priority fraud escalation'],
      },
      {
        title: 'Quality & Compliance Monitoring',
        description: 'Retrospectively scan recorded calls to identify successful fraud attempts and train detection models.',
        bullets: ['Batch audio analysis', 'FFIEC-aligned fraud logging', 'Agent training from fraud samples'],
      },
    ],
    faqs: [
      {
        question: 'Can ScamAI detect voice clones in real-time phone calls?',
        answer:
          'Yes. ScamAI provides a streaming endpoint that analyzes audio segments in under 3 seconds. It integrates with call center platforms via REST API webhook, firing a fraud alert when synthetic voice patterns are detected mid-call.',
      },
      {
        question: 'What voice synthesis platforms does ScamAI detect?',
        answer:
          'ScamAI detects output from ElevenLabs, PlayHT, Resemble AI, Azure TTS, Google TTS, Amazon Polly, and other major voice synthesis platforms, including emerging open-source models.',
      },
      {
        question: 'How accurate is ScamAI audio deepfake detection?',
        answer:
          'ScamAI achieves 98.5% accuracy for voice clone detection across multiple languages and accents. It detects spectral and temporal artifacts in synthetic speech that are imperceptible to human agents.',
      },
      {
        question: 'How does ScamAI integrate with existing call center infrastructure?',
        answer:
          'ScamAI provides a REST API that receives audio payloads or streaming audio chunks and returns a detection result. It works alongside existing IVR, CRM, and call management platforms with under 10 minutes integration time.',
      },
      {
        question: 'Is ScamAI compliant for use in regulated call centers?',
        answer:
          'Yes. ScamAI is SOC 2 Type II certified and GDPR compliant. Audio is not stored after processing, and full audit logging is available for regulatory reporting.',
      },
    ],
    relatedProduct: 'audio',
    ctaHeadline: 'Protect your call center from voice fraud',
    ctaSubheadline: 'Real-time voice clone detection. Contact sales for enterprise pricing.',
    keywords: [
      'voice clone detection call centers',
      'vishing prevention',
      'call center fraud detection',
      'voice phishing detection API',
      'synthetic voice call center',
      'real-time audio deepfake detection',
    ],
    metaDescription:
      'Protect call centers from vishing and voice clone fraud. ScamAI detects AI-cloned voices in real time with 98.5% accuracy. SOC 2 Type II certified. Integrates in under 10 minutes.',
  },
  {
    slug: 'kyc',
    name: 'KYC & Identity Verification',
    eyebrow: 'KYC',
    headline: 'Stop deepfake fraud in KYC identity verification',
    subheadline:
      'Deepfake attacks are bypassing liveness checks and KYC onboarding flows at scale. ScamAI\'s Eva-v1 model detects synthetic faces, AI-edited documents, and presentation attack spoofs in under 4 seconds — protecting your compliance workflow without adding friction.',
    stat: { value: '95.3%', label: 'detection accuracy on deepfake KYC bypass attempts with Eva-v1-Pro' },
    capabilities: [
      {
        title: 'Deepfake Selfie Detection',
        description:
          'Identify synthetic faces submitted in selfie-based identity verification flows, catching face swaps, GAN-generated images, and diffusion model outputs with 95.3% accuracy.',
      },
      {
        title: 'ID Document Forgery Detection',
        description:
          'Detect AI-generated and AI-edited identity documents including passports, driver\'s licenses, and financial documents using our AIForge-Doc model.',
      },
      {
        title: 'Liveness Check Bypass Prevention',
        description:
          'Catch deepfake video injections and 3D mask attacks that bypass traditional liveness detection systems.',
      },
      {
        title: 'Compliance-Ready Reporting',
        description:
          'Every detection includes a confidence score, manipulation type, and timestamp for audit-ready compliance documentation.',
      },
    ],
    useCases: [
      {
        title: 'Digital Onboarding',
        description: 'Screen selfies and ID documents in real time during the onboarding flow.',
        bullets: ['Deepfake selfie detection', 'ID document forgery screening', 'Sub-4-second response time'],
      },
      {
        title: 'Re-Verification & Periodic Checks',
        description: 'Re-verify customer identity at account review, transaction limits, or suspicious activity triggers.',
        bullets: ['Batch identity re-verification', 'Triggered deepfake rescreening', 'Continuous compliance monitoring'],
      },
      {
        title: 'High-Risk Transaction Authorization',
        description: 'Add deepfake verification as a step-up authentication factor for large transfers or account changes.',
        bullets: ['Risk-based verification triggers', 'Step-up authentication layer', 'Fraud event logging'],
      },
      {
        title: 'AML & Regulatory Compliance',
        description: 'Document all deepfake screening results to meet AML, KYC, and FFIEC regulatory requirements.',
        bullets: ['SOC 2 Type II certified', 'Full audit trail API', 'GDPR-compliant data handling'],
      },
    ],
    faqs: [
      {
        question: 'How does ScamAI integrate into KYC onboarding pipelines?',
        answer:
          'ScamAI provides a REST API — submit a selfie or ID document image URL and receive a detection result in under 4 seconds. It works alongside existing liveness checks from providers like iProov, Jumio, or Onfido without replacing them.',
      },
      {
        question: 'What deepfake attacks can ScamAI catch that traditional liveness checks miss?',
        answer:
          'Traditional liveness checks are optimized for 2D print attacks and basic replay. ScamAI additionally catches deepfake video injections (digital injections directly into the API), GAN-generated synthetic face images, and AI-edited identity documents — attack vectors liveness alone does not cover.',
      },
      {
        question: 'Is ScamAI compliant for regulated KYC workflows?',
        answer:
          'Yes. ScamAI is SOC 2 Type II certified and GDPR compliant. Images are not stored after processing. A full audit log of all detection events with timestamps and confidence scores is available via API for regulatory documentation.',
      },
      {
        question: 'How fast is deepfake detection for live KYC flows?',
        answer:
          'Eva-v1-Fast processes in under 2 seconds, adding no perceptible friction to digital onboarding. Eva-v1-Pro provides maximum accuracy in under 4 seconds for higher-risk verification scenarios.',
      },
      {
        question: 'Can ScamAI detect AI-edited identity documents?',
        answer:
          'Yes. ScamAI\'s document detection capability (based on the published AIForge-Doc research, arXiv:2602.20569) identifies AI-generated tampering in financial forms, passports, and statements, including edits made with GPT-Image-2 and other generative tools.',
      },
    ],
    relatedProduct: 'ai',
    ctaHeadline: 'Strengthen your KYC pipeline against deepfakes',
    ctaSubheadline: '200 free analyses per month. No credit card required.',
    keywords: [
      'KYC deepfake API',
      'identity verification deepfake',
      'deepfake KYC bypass prevention',
      'synthetic identity detection KYC',
      'liveness check deepfake',
      'AI identity fraud detection',
    ],
    metaDescription:
      'Detect deepfake selfies and AI-edited ID documents in KYC onboarding. ScamAI\'s Eva-v1 model achieves 95.3% accuracy in under 4 seconds. SOC 2 Type II certified.',
  },
  {
    slug: 'media',
    name: 'Media & Publishing',
    eyebrow: 'MEDIA',
    headline: 'AI-generated content detection for media and newsrooms',
    subheadline:
      'AI-generated images, synthetic audio statements, and deepfake video are entering editorial pipelines at unprecedented speed. ScamAI gives newsrooms and media organizations the API to verify the authenticity of visual and audio content before it reaches audiences.',
    stat: { value: '3,000%', label: 'increase in AI-generated media circulating online since 2022 (ScamAI Research)' },
    capabilities: [
      {
        title: 'Image Authenticity Verification',
        description:
          'Detect AI-generated images from Stable Diffusion, DALL-E, Midjourney, and other generative models before publication. Identify face swaps and digitally manipulated photography.',
      },
      {
        title: 'Deepfake Video Analysis',
        description:
          'Analyze video content frame by frame for synthetic manipulation, catching deepfake interviews, fabricated news footage, and AI-generated statements attributed to public figures.',
      },
      {
        title: 'Synthetic Audio Detection',
        description:
          'Verify audio recordings of quotes, interviews, and statements for AI-generated or voice-cloned speech, protecting editorial integrity.',
      },
      {
        title: 'Batch Content Processing',
        description:
          'Process large volumes of submitted user-generated content, wire photos, or syndicated media through the API for newsroom-scale verification.',
      },
    ],
    useCases: [
      {
        title: 'Pre-Publication Verification',
        description: 'Screen images, videos, and audio before they enter the editorial workflow.',
        bullets: ['AI-generated image detection', 'Deepfake video analysis', 'Synthetic audio verification'],
      },
      {
        title: 'User-Generated Content Moderation',
        description: 'Automatically flag AI-generated or manipulated media submitted by the public.',
        bullets: ['Automated UGC screening', 'Confidence-based review queue', 'Bulk API processing'],
      },
      {
        title: 'Fact-Checking Support',
        description: 'Add synthetic media detection to fact-checking workflows to assess viral content authenticity.',
        bullets: ['On-demand analysis API', 'Forensic confidence scores', 'Manipulation type identification'],
      },
      {
        title: 'Wire & Syndication Verification',
        description: 'Verify incoming syndicated images and video from wire services for downstream manipulation.',
        bullets: ['Batch wire content scanning', 'Source authentication layer', 'Publication audit trail'],
      },
    ],
    faqs: [
      {
        question: 'Can ScamAI detect AI-generated images from Midjourney and DALL-E?',
        answer:
          'Yes. ScamAI\'s Eva-v1 model is trained to detect outputs from Stable Diffusion, DALL-E, Midjourney, Flux, and other major generative image models, as well as GAN-generated imagery.',
      },
      {
        question: 'How does ScamAI detect deepfake videos of public figures?',
        answer:
          'ScamAI analyzes video frame by frame for temporal inconsistencies, synthetic face patterns, and generation artifacts. It identifies face swaps and AI-generated statements attributed to real individuals.',
      },
      {
        question: 'How can newsrooms integrate ScamAI into editorial workflows?',
        answer:
          'ScamAI provides a REST API that newsrooms can integrate into their CMS, DAM, or fact-checking tools. Submit media URLs, receive detection results in under 4 seconds. Full documentation is at scam.ai/en/resources/documentation.',
      },
      {
        question: 'Can ScamAI process large volumes of UGC at newsroom scale?',
        answer:
          'Yes. ScamAI offers enterprise plans with dedicated throughput and batch API endpoints for processing large volumes of submitted images and videos. Contact sales@scam.ai for newsroom-scale pricing.',
      },
      {
        question: 'Is there research backing ScamAI\'s detection capabilities?',
        answer:
          'Yes. ScamAI\'s detection models are based on peer-reviewed research published at IEEE workshops and on arXiv, including "Do deepfake detectors work in reality?" (2025) and "GPT-Image-2 in the Wild" (arXiv:2604.25370).',
      },
    ],
    relatedProduct: 'both',
    ctaHeadline: 'Protect your editorial pipeline from synthetic media',
    ctaSubheadline: '200 free analyses per month. No credit card required.',
    keywords: [
      'deepfake detection media',
      'content authentication newsroom',
      'AI-generated image detection news',
      'media verification API',
      'deepfake news detection',
      'synthetic media journalism',
    ],
    metaDescription:
      'Verify images, video, and audio for AI generation before publication. ScamAI\'s deepfake detection API protects newsrooms and media organizations. 200 free analyses per month.',
  },
  {
    slug: 'insurance',
    name: 'Insurance',
    eyebrow: 'INSURANCE',
    headline: 'Detect AI-generated fraud in insurance claims',
    subheadline:
      'Fraudsters are using AI image editors and video generators to fabricate accident scenes, damage photos, and injury evidence. ScamAI\'s detection API screens claims media for synthetic manipulation, protecting insurers from fraudulent payouts.',
    stat: { value: '280%', label: 'increase in AI-edited photo fraud in insurance claims in 2025' },
    capabilities: [
      {
        title: 'Claims Photo Authentication',
        description:
          'Detect AI-edited, AI-generated, or manipulated photos submitted as evidence in property, auto, and casualty claims.',
      },
      {
        title: 'Synthetic Video Detection',
        description:
          'Identify deepfake or AI-generated video footage submitted to support fraudulent claims, including staged accident scenes.',
      },
      {
        title: 'Document Forgery Detection',
        description:
          'Screen supporting documents (repair estimates, medical reports) for AI-generated tampering using the AIForge-Doc detection capability.',
      },
      {
        title: 'Fraud Pattern Matching',
        description:
          'Cross-reference submitted media against known fraud patterns and synthetic media signatures from the ScamAI Scam Database.',
      },
    ],
    useCases: [
      {
        title: 'First Notice of Loss (FNOL)',
        description: 'Screen every photo and video submitted at initial claim filing for synthetic manipulation.',
        bullets: ['AI-edited damage photo detection', 'Staged scene identification', 'Instant fraud confidence score'],
      },
      {
        title: 'Claims Adjudication',
        description: 'Add deepfake screening as a step in the adjudication workflow for flagged or high-value claims.',
        bullets: ['Adjuster workflow integration', 'Bulk media screening', 'Detailed manipulation reports'],
      },
      {
        title: 'SIU Investigation Support',
        description: 'Provide Special Investigations Units with forensic-grade synthetic media analysis for fraud cases.',
        bullets: ['Forensic confidence scoring', 'Manipulation type identification', 'Evidence-grade reporting'],
      },
      {
        title: 'Subrogation & Recovery',
        description: 'Detect fraud in third-party claims and litigation evidence to protect recovery outcomes.',
        bullets: ['Third-party media verification', 'Legal-grade analysis reports', 'Batch document screening'],
      },
    ],
    faqs: [
      {
        question: 'Can ScamAI detect AI-edited photos submitted in insurance claims?',
        answer:
          'Yes. ScamAI detects subtle AI editing artifacts in photos submitted as claims evidence, including images edited with generative tools to add or remove damage, alter conditions, or fabricate injuries.',
      },
      {
        question: 'How does ScamAI integrate with claims management systems?',
        answer:
          'ScamAI provides a REST API — submit a media URL or file payload and receive a detection result in under 4 seconds. It integrates with Guidewire, Duck Creek, and other CMS platforms via webhook or direct API call.',
      },
      {
        question: 'What is the ROI of adding deepfake detection to claims processing?',
        answer:
          'A single fraudulent claim caught by ScamAI can represent tens of thousands of dollars in avoided payout. At $0.05 per image analyzed, the cost per 1,000 claims screened is $50 — a fraction of average fraud losses.',
      },
      {
        question: 'Is ScamAI compliant for insurance industry use?',
        answer:
          'Yes. ScamAI is SOC 2 Type II certified and GDPR compliant. All analysis results are logged with timestamps and confidence scores for audit and litigation purposes.',
      },
      {
        question: 'Can ScamAI screen large volumes of claims at high speed?',
        answer:
          'Yes. ScamAI\'s enterprise plan provides batch API endpoints and dedicated throughput for processing thousands of claim images daily. Contact sales@scam.ai for insurance-scale pricing.',
      },
    ],
    relatedProduct: 'both',
    ctaHeadline: 'Stop AI-generated claims fraud',
    ctaSubheadline: '200 free analyses per month. No credit card required.',
    keywords: [
      'deepfake insurance fraud',
      'AI claims fraud detection',
      'insurance photo fraud AI',
      'synthetic media insurance',
      'claims document forgery detection',
      'AI-edited photo insurance',
    ],
    metaDescription:
      'Detect AI-edited photos, synthetic video, and forged documents in insurance claims. ScamAI\'s deepfake detection API protects insurers from synthetic media fraud. SOC 2 Type II certified.',
  },
  {
    slug: 'hr',
    name: 'HR & Hiring',
    eyebrow: 'HR',
    headline: 'Detect deepfakes in remote interviews and video hiring',
    subheadline:
      'Job applicants are using real-time deepfake tools, AI voice changers, and synthetic avatars to impersonate other people or hide their identity during remote interviews. ScamAI gives HR teams and hiring platforms the ability to verify candidate video and audio authenticity.',
    stat: { value: '1 in 14', label: 'remote job applicants now uses AI-assisted video tools during interviews' },
    capabilities: [
      {
        title: 'Video Interview Deepfake Detection',
        description:
          'Detect real-time deepfakes and synthetic avatars used in video interviews, flagging face swap tools and virtual camera overlays.',
      },
      {
        title: 'Voice Synthesis Detection',
        description:
          'Identify AI-generated or cloned voices used to impersonate other individuals or disguise the candidate\'s real voice during phone and video screening.',
      },
      {
        title: 'Candidate Identity Verification',
        description:
          'Verify that the person in the interview video matches the identity documents submitted during the application process.',
      },
      {
        title: 'Asynchronous Video Screening',
        description:
          'Batch-analyze recorded interview videos for synthetic manipulation before advancing candidates to the next hiring stage.',
      },
    ],
    useCases: [
      {
        title: 'Live Video Interview Monitoring',
        description: 'Screen live video call feeds for real-time deepfake tools used by candidates.',
        bullets: ['Real-time frame analysis', 'Synthetic face detection', 'Live alert integration'],
      },
      {
        title: 'Asynchronous Interview Review',
        description: 'Analyze pre-recorded video submissions for deepfake manipulation before review.',
        bullets: ['Batch video analysis', 'Confidence-scored reports', 'Automated candidate flagging'],
      },
      {
        title: 'Phone Screen Verification',
        description: 'Detect voice cloning during phone screens and voice-first interviews.',
        bullets: ['Real-time audio analysis', 'Voice authenticity scoring', 'Impersonation detection'],
      },
      {
        title: 'Background & Identity Cross-Check',
        description: 'Compare interview video against submitted photos for identity consistency.',
        bullets: ['Cross-media identity matching', 'Document-to-selfie verification', 'Fraud escalation workflow'],
      },
    ],
    faqs: [
      {
        question: 'Can ScamAI detect deepfake tools used in real-time video interviews?',
        answer:
          'Yes. ScamAI analyzes video frames for synthetic manipulation patterns produced by real-time deepfake tools. It can process live video feed samples or recorded segments submitted via API.',
      },
      {
        question: 'What deepfake tools are candidates using in remote interviews?',
        answer:
          'Common tools include HeyGen, DeepFaceLive, and virtual camera software overlaying synthetic faces. ScamAI detects the generation artifacts these tools produce regardless of the specific software used.',
      },
      {
        question: 'Can ScamAI verify that a candidate\'s voice matches their submitted identity?',
        answer:
          'ScamAI\'s audio detection identifies whether a voice is AI-generated or cloned. For identity cross-verification, it flags suspicious audio patterns that suggest the candidate is not who they claim to be.',
      },
      {
        question: 'How do hiring platforms integrate ScamAI?',
        answer:
          'ScamAI provides a REST API compatible with any video interview platform, ATS, or HRMS. Submit video or audio file URLs and receive detection results in under 4 seconds. Full API documentation is at scam.ai/en/resources/documentation.',
      },
      {
        question: 'What\'s the cost of adding deepfake detection to hiring workflows?',
        answer:
          'At $0.05 per image and $0.05 per audio file analyzed, screening a 30-minute video interview (sampled at one frame per 30 seconds) costs approximately $3. A free tier of 200 analyses per month is available to start.',
      },
    ],
    relatedProduct: 'both',
    ctaHeadline: 'Verify who you are actually hiring',
    ctaSubheadline: '200 free analyses per month. No credit card required.',
    keywords: [
      'remote interview deepfake detection',
      'video interview verification',
      'HR deepfake detection',
      'hiring fraud detection',
      'deepfake job interview',
      'AI voice interview fraud',
    ],
    metaDescription:
      'Detect deepfakes, AI voice tools, and synthetic avatars in remote job interviews. ScamAI verifies video and audio authenticity for HR teams and hiring platforms.',
  },
  {
    slug: 'government',
    name: 'Government & Public Sector',
    eyebrow: 'GOVERNMENT',
    headline: 'Synthetic media detection for government and public sector',
    subheadline:
      'State actors and disinformation campaigns are using AI-generated images, deepfake videos of officials, and synthetic audio to undermine public trust and influence policy. ScamAI provides government agencies and public sector organizations with enterprise-grade synthetic media detection.',
    stat: { value: '47', label: 'documented state-actor influence campaigns using AI-generated media in 2025' },
    capabilities: [
      {
        title: 'Deepfake Video Detection',
        description:
          'Detect AI-generated videos of government officials, public figures, and political candidates used in disinformation campaigns.',
      },
      {
        title: 'Propaganda Image Detection',
        description:
          'Identify AI-generated imagery used in influence operations, including fabricated protest scenes, staged events, and manipulated news photography.',
      },
      {
        title: 'Official Communication Authentication',
        description:
          'Verify that images, videos, and audio attributed to government sources are authentic and unmanipulated.',
      },
      {
        title: 'Mass Media Verification',
        description:
          'Process large volumes of social media content, news imagery, and submitted media through the API for agency-scale synthetic media screening.',
      },
    ],
    useCases: [
      {
        title: 'Election Integrity',
        description: 'Screen viral content involving candidates and election officials for AI-generated manipulation.',
        bullets: ['Deepfake politician detection', 'AI-generated political imagery', 'Rapid response verification'],
      },
      {
        title: 'Disinformation Response',
        description: 'Identify and flag synthetic media used in coordinated influence campaigns before it spreads.',
        bullets: ['Mass content screening', 'Source attribution analysis', 'Real-time detection API'],
      },
      {
        title: 'Citizen-Facing Services',
        description: 'Protect identity verification in e-government and public benefit portals from deepfake bypass.',
        bullets: ['Digital ID deepfake detection', 'Benefits fraud prevention', 'SOC 2 Type II compliance'],
      },
      {
        title: 'Law Enforcement & Digital Forensics',
        description: 'Provide forensic-grade synthetic media analysis for criminal investigations involving deepfakes.',
        bullets: ['Forensic confidence scores', 'Evidence-grade reporting', 'Chain-of-analysis documentation'],
      },
    ],
    faqs: [
      {
        question: 'Can ScamAI detect deepfake videos of political figures and officials?',
        answer:
          'Yes. ScamAI\'s Eva-v1 model detects face swaps, synthetic faces, and deepfake video manipulation at 95.3% accuracy, including AI-generated videos of public figures regardless of which generation tool was used.',
      },
      {
        question: 'How does ScamAI handle government-scale media volumes?',
        answer:
          'ScamAI offers enterprise API plans with batch processing endpoints, dedicated throughput, and SLA-backed uptime of 99.9%. Contact sales@scam.ai for government procurement and security review.',
      },
      {
        question: 'What compliance certifications does ScamAI hold?',
        answer:
          'ScamAI is SOC 2 Type II certified and GDPR compliant. Government procurement reviews can request the SOC 2 report and data processing documentation from security@scam.ai.',
      },
      {
        question: 'Is ScamAI used by public sector organizations?',
        answer:
          'ScamAI\'s platform is deployed for enterprise customers across regulated industries. For specific public sector references, contact sales@scam.ai.',
      },
      {
        question: 'Does ScamAI publish research on detecting state-actor deepfakes?',
        answer:
          'Yes. ScamAI\'s research team publishes peer-reviewed work on deepfake detection in the wild, including "GPT-Image-2 in the Wild" (arXiv:2604.25370) and "Do deepfake detectors work in reality?" (IEEE Workshop 2025).',
      },
    ],
    relatedProduct: 'both',
    ctaHeadline: 'Protect public communications from synthetic media',
    ctaSubheadline: 'Contact us for government and public sector pricing.',
    keywords: [
      'deepfake detection government',
      'public sector synthetic media',
      'government deepfake API',
      'election deepfake detection',
      'disinformation AI detection',
      'deepfake political video',
    ],
    metaDescription:
      'Detect deepfake videos, AI-generated imagery, and synthetic audio in government and public sector contexts. ScamAI provides enterprise-grade synthetic media detection with SOC 2 compliance.',
  },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

export function getAllIndustrySlugs(): string[] {
  return industries.map((i) => i.slug);
}
