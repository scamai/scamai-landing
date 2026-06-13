export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Scam AI",
    "legalName": "Reality Inc.",
    "url": "https://www.scam.ai",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.scam.ai/scamai-logo.svg",
      "width": 400,
      "height": 100
    },
    "image": "https://www.scam.ai/scamai-logo.svg",
    "foundingDate": "2024",
    "description": "All-in-one AI Trust Platform for detecting synthetic media and deepfakes in real-time with industry-leading accuracy.",
    "slogan": "Building trust in the AI era",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://twitter.com/scamai",
      "https://linkedin.com/company/scamai",
      "https://www.producthunt.com/products/scam-ai"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Sales",
        "email": "contact@scam.ai"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "email": "ceo@scam.ai"
      }
    ],
    "knowsAbout": [
      "deepfake detection",
      "synthetic media verification",
      "AI trust",
      "computer vision",
      "audio forensics",
      "KYC verification",
      "fraud prevention"
    ],
    "memberOf": {
      "@type": "Organization",
      "name": "Berkeley SkyDeck"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Scam AI",
    "url": "https://www.scam.ai",
    "description": "All-in-one AI Trust Platform for detecting synthetic media and deepfakes",
    "inLanguage": ["en", "es", "pt", "ja", "ko", "zh-CN", "zh-TW", "id", "fr", "de", "ar"],
    "publisher": {
      "@type": "Organization",
      "name": "Scam AI",
      "url": "https://www.scam.ai"
    }
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Scam AI Platform",
    "applicationCategory": "SecurityApplication",
    "operatingSystem": "Web",
    "url": "https://www.scam.ai",
    "image": "https://www.scam.ai/scamai-logo.svg",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "200 free images per month",
      "availability": "https://schema.org/InStock"
    },
    "description": "AI-powered deepfake detection and synthetic media verification platform with real-time analysis.",
    "featureList": [
      "Real-time deepfake detection with 98.2% accuracy",
      "AI detection for images and videos",
      "Audio detection for synthetic voices",
      "GenAI content detection",
      "API integration in under 10 minutes",
      "SOC 2 Type II compliant",
      "GDPR compliant",
      "Processing time under 4 seconds"
    ],
    "creator": {
      "@type": "Organization",
      "name": "Reality Inc."
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Scam AI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Scam AI is an AI-powered platform for detecting deepfakes and synthetic media in real-time. We provide AI detection, audio detection, and GenAI content verification with industry-leading accuracy."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate is Scam AI's deepfake detection?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Scam AI's Eva-v1 models are continuously trained on the latest synthetic media techniques with processing times under 4 seconds. Accuracy varies by media type and attack technique — contact us for benchmark details relevant to your use case."
        }
      },
      {
        "@type": "Question",
        "name": "Is Scam AI compliant with security standards?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Scam AI is SOC 2 Type II compliant and GDPR compliant, ensuring enterprise-grade security and data protection."
        }
      },
      {
        "@type": "Question",
        "name": "How much does Scam AI cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Scam AI offers 200 free images per month for free. Pay-as-you-go pricing starts at $0.05 per image. Optional add-ons (face attributes, liveness detection, ID document verification) are $0.008 per image each. Enterprise pricing is available for high-volume users."
        }
      },
      {
        "@type": "Question",
        "name": "How does Scam AI compare to other deepfake detection tools?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Scam AI offers both vision and audio detection in a single platform with sub-4-second processing, and provides a developer-friendly API with integration in under 10 minutes. Unlike many competitors, Scam AI offers a free tier of 200 images per month, transparent per-image pricing, and is SOC 2 Type II and GDPR compliant."
        }
      },
      {
        "@type": "Question",
        "name": "What industries use Scam AI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Scam AI is used across financial services for KYC verification, content platforms for moderation, call centers for voice authentication, media organizations for content verification, HR departments for remote interview verification, insurance for claims validation, and government agencies for public sector security."
        }
      }
    ]
  };

  const datasetsSchema = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    "name": "Scam AI Research Datasets",
    "url": "https://www.scam.ai/en/research",
    "description": "Open datasets for benchmarking deepfake detection, document forgery, and synthetic media analysis models.",
    "creator": {
      "@type": "Organization",
      "name": "Reality Inc.",
      "url": "https://www.scam.ai"
    },
    "dataset": [
      {
        "@type": "Dataset",
        "name": "Real-World Faceswap Dataset (RWFS)",
        "description": "Real-world faceswap samples for benchmarking deepfake detection models.",
        "url": "https://www.scam.ai/en/research",
        "license": "https://scam.ai/en/research",
        "creator": { "@type": "Organization", "name": "Reality Inc." }
      },
      {
        "@type": "Dataset",
        "name": "AIForge-Doc",
        "description": "Benchmark dataset for detecting AI-forged tampering in financial and form documents.",
        "url": "https://www.scam.ai/en/research",
        "license": "https://scam.ai/en/research",
        "creator": { "@type": "Organization", "name": "Reality Inc." }
      },
      {
        "@type": "Dataset",
        "name": "Adversarial Age Estimation Attack Dataset",
        "description": "Dataset of low-cost cosmetic attacks on age estimation systems.",
        "url": "https://www.scam.ai/en/research",
        "license": "https://scam.ai/en/research",
        "creator": { "@type": "Organization", "name": "Reality Inc." }
      },
      {
        "@type": "Dataset",
        "name": "GPT-4o-receipt: Fully-Synthetic AI-Generated Receipt Dataset",
        "description": "Fully synthetic AI-generated financial receipts for document forgery detection research.",
        "url": "https://www.scam.ai/en/research",
        "license": "https://scam.ai/en/research",
        "creator": { "@type": "Organization", "name": "Reality Inc." }
      },
      {
        "@type": "Dataset",
        "name": "Simulated Gaze Estimation for Reading Dataset",
        "description": "Simulated gaze estimation data for robust reading and cheating identification research.",
        "url": "https://www.scam.ai/en/research",
        "license": "https://scam.ai/en/research",
        "creator": { "@type": "Organization", "name": "Reality Inc." }
      }
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to detect deepfakes with Scam AI API",
    "description": "Integrate Scam AI deepfake detection into your application in under 10 minutes using the REST API.",
    "totalTime": "PT10M",
    "tool": [
      { "@type": "HowToTool", "name": "Scam AI API key (free at app.scam.ai)" },
      { "@type": "HowToTool", "name": "Python, JavaScript, or cURL" }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Create a free Scam AI account",
        "text": "Sign up at app.scam.ai to get your API key. The free tier includes 200 images per month with no credit card required.",
        "url": "https://app.scam.ai"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Send an image or video to the detection API",
        "text": "Make a POST request to https://api.scam.ai/v1/detect with your API key in the Authorization header and the image URL in the JSON body."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Review the detection results",
        "text": "The API returns a JSON response with is_deepfake (boolean), confidence score (0-1), and the model used (eva-v1-fast or eva-v1-pro). Processing takes under 4 seconds."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Integrate into your workflow",
        "text": "Use webhooks for asynchronous processing, batch API for bulk analysis, or real-time API for live content moderation. Full documentation at scam.ai/en/resources/documentation."
      }
    ]
  };

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Scam AI Deepfake Detection Platform — Product Demo",
    "description": "See Scam AI's deepfake detection platform in action. Detect AI-generated images, deepfake videos, and synthetic media in real-time with 98.2% accuracy using the Eva-v1 model.",
    "thumbnailUrl": "https://www.scam.ai/en/opengraph-image",
    "contentUrl": "https://www.scam.ai/dashboard.mp4",
    "uploadDate": "2024-06-01",
    "publisher": {
      "@type": "Organization",
      "name": "Scam AI",
      "url": "https://www.scam.ai",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.scam.ai/scamai-logo.svg"
      }
    }
  };

  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Scam AI — Deepfake Detection Platform",
    "url": "https://www.scam.ai",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "[data-speakable]"]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />
    </>
  );
}
