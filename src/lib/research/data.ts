export type ResearchPaper = {
  slug: string;
  title: string;
  authors?: string;
  link?: string;
  arxivId?: string;
  abstract?: string;
  category: string;
  tags: string[];
  citation?: string;
  coming?: boolean;
};

export type ResearchDataset = {
  id: string;
  name: string;
  description?: string;
  link: string;
  paper?: string;
  paperSlug?: string;
  citation: string;
};

export type ResearchCategory = {
  category: string;
  tags: string[];
  paperSlugs: string[];
};

export const researchPapers: ResearchPaper[] = [
  // Document Forgery
  {
    slug: "docforge-bench",
    title: "DOCFORGE-BENCH: A Comprehensive Benchmark for Document Forgery Detection and Analysis",
    authors:
      "Zengqi Zhao, Weidi Xia, Peter Wei, Yan Zhang, Yiyi Zhang, Jane Mo, Tiannan Zhang, Yuanqin Dai, Zexi Chen, Simiao Ren",
    link: "https://arxiv.org/abs/2603.01433",
    arxivId: "2603.01433",
    category: "Document Forgery",
    tags: ["Document Forgery", "Benchmark"],
    citation: `@article{zhao2026docforge,
  title={DOCFORGE-BENCH: A Comprehensive Benchmark for Document Forgery Detection and Analysis},
  author={Zhao, Zengqi and Xia, Weidi and Wei, Peter and Zhang, Yan and Zhang, Yiyi and Mo, Jane and Zhang, Tiannan and Dai, Yuanqin and Chen, Zexi and Ren, Simiao},
  journal={arXiv preprint arXiv:2603.01433},
  year={2026}
}`,
  },
  {
    slug: "when-the-forger-is-the-judge",
    title: "When the Forger Is the Judge: GPT-Image-2 Cannot Recognize Its Own Faked Documents",
    authors:
      "Jiaqi Wu, Yuchen Zhou, Dennis Tsang Ng, Xingyu Shen, Kidus Zewde, Ankit Raj, Tommy Duong, Simiao Ren",
    link: "https://arxiv.org/abs/2604.25213",
    arxivId: "2604.25213",
    category: "Document Forgery",
    tags: ["Document Forgery", "GPT-Image-2", "Benchmark"],
    citation: `@article{wu2026forger,
  title={When the Forger Is the Judge: GPT-Image-2 Cannot Recognize Its Own Faked Documents},
  author={Wu, Jiaqi and Zhou, Yuchen and Ng, Dennis Tsang and Shen, Xingyu and Zewde, Kidus and Raj, Ankit and Duong, Tommy and Ren, Simiao},
  journal={arXiv preprint arXiv:2604.25213},
  year={2026}
}`,
  },
  {
    slug: "aiforge-doc-benchmark",
    title: "AIForge-Doc: A Benchmark for Detecting AI-Forged Tampering in Financial and Form Documents",
    authors:
      "Jiaqi Wu, Yuchen Zhou, Muduo Xu, Zisheng Liang, Simiao Ren, Jiayu Xue, Meige Yang, Siying Chen, Jingheng Huan",
    link: "https://arxiv.org/abs/2602.20569",
    arxivId: "2602.20569",
    category: "Document Forgery",
    tags: ["Document Forgery", "Benchmark"],
    citation: `@article{wu2026aiforge,
  title={AIForge-Doc: A Benchmark for Detecting AI-Forged Tampering in Financial and Form Documents},
  author={Wu, Jiaqi and Zhou, Yuchen and Xu, Muduo and Liang, Zisheng and Ren, Simiao and Xue, Jiayu and Yang, Meige and Chen, Siying and Huan, Jingheng},
  journal={arXiv preprint arXiv:2602.20569},
  year={2026}
}`,
  },
  {
    slug: "mllms-document-manipulation",
    title: "Can Multi-modal (reasoning) LLMs detect document manipulation?",
    authors:
      "Zisheng Liang, Kidus Zewde, Rudra Pratap Singh, Disha Patil, Zexi Chen, Jiayu Xue, Yao Yao, Yifei Chen, Qinzhe Liu, Simiao Ren",
    link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=n4B3bH4AAAAJ&sortby=pubdate&citation_for_view=n4B3bH4AAAAJ:2KloaMYe4IUC",
    category: "Document Forgery",
    tags: ["Document Forgery", "LLM"],
  },
  {
    slug: "synthetic-financial-documents-fool-humans",
    title: "Can fully synthetic AI-generated financial documents fool humans?",
    category: "Document Forgery",
    tags: ["Document Forgery", "Human Study"],
    coming: true,
  },

  // Age Estimation
  {
    slug: "teenager-fool-ai-age-estimation",
    title: "Can a Teenager Fool an AI? Evaluating Low-Cost Cosmetic Attacks on Age Estimation Systems",
    authors:
      "Xingyu Shen, Tommy Duong, Xiaodong An, Zengqi Zhao, Zebang Hu, Haoyu Hu, Ziyou Wang, Finn Guo, Simiao Ren",
    link: "https://arxiv.org/abs/2602.19539",
    arxivId: "2602.19539",
    category: "Age Estimation",
    tags: ["Age Estimation", "Adversarial", "Benchmark"],
    citation: `@article{shen2026can,
  title={Can a Teenager Fool an AI? Evaluating Low-Cost Cosmetic Attacks on Age Estimation Systems},
  author={Shen, Xingyu and Duong, Tommy and An, Xiaodong and Zhao, Zengqi and Hu, Zebang and Hu, Haoyu and Wang, Ziyou and Guo, Finn and Ren, Simiao},
  journal={arXiv preprint arXiv:2602.19539},
  year={2026}
}`,
  },
  {
    slug: "vlm-age-estimation-benchmark",
    title:
      "Out of the box age estimation through facial imagery: A Comprehensive Benchmark of Vision-Language Models vs. out-of-the-box Traditional Architectures",
    authors:
      "Simiao Ren, Xingyu Shen, Ankit Raj, Albert Dai, Caroline Zhang, Yuan Xu, Zexi Chen, Siqi Wu, Chen Gong, Yuxin Zhang",
    link: "https://arxiv.org/abs/2602.07815",
    arxivId: "2602.07815",
    category: "Age Estimation",
    tags: ["Age Estimation", "VLM", "Benchmark"],
  },

  // AI-Generated Detection
  {
    slug: "gpt-image-2-in-the-wild",
    title:
      "GPT-Image-2 in the Wild: A Twitter Dataset of Self-Reported AI-Generated Images from the First Week of Deployment",
    authors:
      "Kidus Zewde, Simiao Ren, Xingyu Shen, Jenny Wu, Yuchen Zhou, Tommy Duong, Zikang Zhang, Ethan Traister",
    link: "https://arxiv.org/abs/2604.25370",
    arxivId: "2604.25370",
    category: "AI-Generated Detection",
    tags: ["AI Detection", "GPT-Image-2", "Dataset"],
    citation: `@article{zewde2026gptimage2,
  title={GPT-Image-2 in the Wild: A Twitter Dataset of Self-Reported AI-Generated Images from the First Week of Deployment},
  author={Zewde, Kidus and Ren, Simiao and Shen, Xingyu and Wu, Jenny and Zhou, Yuchen and Duong, Tommy and Zhang, Zikang and Traister, Ethan},
  journal={arXiv preprint arXiv:2604.25370},
  year={2026}
}`,
  },
  {
    slug: "open-source-ai-detection-benchmark",
    title:
      "How well are open sourced AI-generated image detection models out-of-the-box: A comprehensive benchmark study",
    authors:
      "Simiao Ren, Yuchen Zhou, Xingyu Shen, Kidus Zewde, Tommy Duong, George Huang, Neo Tiangratanakul, Dennis Ng, En Wei, Jiayu Xue",
    link: "https://arxiv.org/abs/2602.07814",
    arxivId: "2602.07814",
    category: "AI-Generated Detection",
    tags: ["AI Detection", "Benchmark", "Open Source"],
  },
  {
    slug: "survey-ai-generated-deepfake-detection",
    title: "Survey on the development of AI-generated and deepfake detection",
    category: "AI-Generated Detection",
    tags: ["AI Detection", "Survey"],
    coming: true,
  },

  // Deepfake Detection
  {
    slug: "deepfake-detectors-in-reality",
    title: "Do deepfake detectors work in reality?",
    authors:
      "Simiao Ren, Disha Patil, Kidus Zewde, Dennis Ng, Hengwei Xu, Shengkai Jiang, Ramini Desai, Ning-Yau Cheng, Yining Zhou, Ragavi Muthukrishnan",
    link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=n4B3bH4AAAAJ&sortby=pubdate&citation_for_view=n4B3bH4AAAAJ:tKAzc9rXhukC",
    category: "Deepfake Detection",
    tags: ["Deepfake Detection", "Real-World"],
    citation: `@inproceedings{ren2025deepfake,
  title={Do deepfake detectors work in reality?},
  author={Ren, Simiao and Patil, Disha and Zewde, Kidus and Ng, Tsang Dennis and Xu, Hengwei and Jiang, Shengkai and Desai, Ramini and Cheng, Ning-Yau and Zhou, Yining and Muthukrishnan, Ragavi},
  booktitle={Proceedings of the 4th workshop on security implications of deepfakes and cheapfakes},
  pages={21--26},
  year={2025}
}`,
  },
  {
    slug: "mllms-deepfake-detectors",
    title: "Can Multi-modal (reasoning) LLMs work as deepfake detectors?",
    authors:
      "Simiao Ren, Yao Yao, Kidus Zewde, Zisheng Liang, Ning-Yau Cheng, Xiaoou Zhan, Qinzhe Liu, Yifei Chen, Hengwei Xu",
    link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=n4B3bH4AAAAJ&sortby=pubdate&citation_for_view=n4B3bH4AAAAJ:ZfRJV9d4-WMC",
    category: "Deepfake Detection",
    tags: ["Deepfake Detection", "LLM"],
  },

  // Interview Tech
  {
    slug: "reading-gaze-estimation-cheating",
    title: "Reading gaze estimation dataset for robust cheating identification",
    category: "Interview Tech",
    tags: ["Interview", "Gaze Estimation"],
    coming: true,
  },
];

export const researchCategoryOrder: ResearchCategory[] = [
  {
    category: "Document Forgery",
    tags: ["Document Forgery", "Benchmark"],
    paperSlugs: [
      "docforge-bench",
      "when-the-forger-is-the-judge",
      "aiforge-doc-benchmark",
      "mllms-document-manipulation",
      "synthetic-financial-documents-fool-humans",
    ],
  },
  {
    category: "Age Estimation",
    tags: ["Age Estimation", "Benchmark"],
    paperSlugs: ["teenager-fool-ai-age-estimation", "vlm-age-estimation-benchmark"],
  },
  {
    category: "AI-Generated Detection",
    tags: ["AI Detection", "Benchmark"],
    paperSlugs: [
      "gpt-image-2-in-the-wild",
      "open-source-ai-detection-benchmark",
      "survey-ai-generated-deepfake-detection",
    ],
  },
  {
    category: "Deepfake Detection",
    tags: ["Deepfake Detection"],
    paperSlugs: ["deepfake-detectors-in-reality", "mllms-deepfake-detectors"],
  },
  {
    category: "Interview Tech",
    tags: ["Interview", "Gaze Estimation"],
    paperSlugs: ["reading-gaze-estimation-cheating"],
  },
];

export const researchDatasets: ResearchDataset[] = [
  {
    id: "rwfs",
    name: "Real-World Faceswap Dataset (RWFS)",
    description:
      "A real-world faceswap collection used to evaluate deepfake detectors against in-the-wild manipulations rather than lab-only synthetics.",
    link: "https://drive.google.com/file/d/1A-RPa61f5ROJ0ovcXWW1fNFZgunaAOyd/view?usp=sharing",
    paper:
      "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=n4B3bH4AAAAJ&sortby=pubdate&citation_for_view=n4B3bH4AAAAJ:tKAzc9rXhukC",
    paperSlug: "deepfake-detectors-in-reality",
    citation: `@inproceedings{ren2025deepfake,
  title={Do deepfake detectors work in reality?},
  author={Ren, Simiao and Patil, Disha and Zewde, Kidus and Ng, Tsang Dennis and Xu, Hengwei and Jiang, Shengkai and Desai, Ramini and Cheng, Ning-Yau and Zhou, Yining and Muthukrishnan, Ragavi},
  booktitle={Proceedings of the 4th workshop on security implications of deepfakes and cheapfakes},
  pages={21--26},
  year={2025}
}`,
  },
  {
    id: "aiforge-doc",
    name: "AI-edit document forgery dataset (AIForge-Doc)",
    description:
      "Financial and form documents tampered by a suite of AI editing tools, paired with originals — used to benchmark document forgery detectors.",
    link: "https://drive.google.com/file/d/1M1GZAdpdRPqlGJe9lJpLkmnxAEh4y1k1/view",
    paper: "https://arxiv.org/abs/2602.20569",
    paperSlug: "aiforge-doc-benchmark",
    citation: `@article{wu2026aiforge,
  title={AIForge-Doc: A Benchmark for Detecting AI-Forged Tampering in Financial and Form Documents},
  author={Wu, Jiaqi and Zhou, Yuchen and Xu, Muduo and Liang, Zisheng and Ren, Simiao and Xue, Jiayu and Yang, Meige and Chen, Siying and Huan, Jingheng},
  journal={arXiv preprint arXiv:2602.20569},
  year={2026}
}`,
  },
  {
    id: "aiforge-doc-v2",
    name: "AIForge-Doc v2.0 (GPT-Image-2 document forgeries)",
    description:
      "A v2 expansion of AIForge-Doc covering GPT-Image-2 generated tampering — used in the 'When the Forger Is the Judge' benchmark.",
    link: "https://drive.google.com/file/d/14rUt2SIOHSSEW_gYeywIaXtRTaYcwr4T/view?usp=drive_link",
    paper: "https://arxiv.org/abs/2604.25213",
    paperSlug: "when-the-forger-is-the-judge",
    citation: `@article{wu2026forger,
  title={When the Forger Is the Judge: GPT-Image-2 Cannot Recognize Its Own Faked Documents},
  author={Wu, Jiaqi and Zhou, Yuchen and Ng, Dennis Tsang and Shen, Xingyu and Zewde, Kidus and Raj, Ankit and Duong, Tommy and Ren, Simiao},
  journal={arXiv preprint arXiv:2604.25213},
  year={2026}
}`,
  },
  {
    id: "gpt-image-2-twitter",
    name: "GPT-Image-2 Twitter Dataset (GPT-image-2.0X)",
    description:
      "Self-reported AI-generated images collected from Twitter during the first week of GPT-Image-2 deployment — captures real-world distribution shift.",
    link: "https://drive.google.com/file/d/1lUNzgpMtTOWW0oDZLi6WlUbiKwzdswUA/view?usp=sharing",
    paper: "https://arxiv.org/abs/2604.25370",
    paperSlug: "gpt-image-2-in-the-wild",
    citation: `@article{zewde2026gptimage2,
  title={GPT-Image-2 in the Wild: A Twitter Dataset of Self-Reported AI-Generated Images from the First Week of Deployment},
  author={Zewde, Kidus and Ren, Simiao and Shen, Xingyu and Wu, Jenny and Zhou, Yuchen and Duong, Tommy and Zhang, Zikang and Traister, Ethan},
  journal={arXiv preprint arXiv:2604.25370},
  year={2026}
}`,
  },
  {
    id: "age-estimation",
    name: "Adversarial age estimation attack dataset",
    description:
      "Faces with low-cost cosmetic adversarial perturbations designed to defeat age estimation systems — used in 'Can a Teenager Fool an AI?'.",
    link: "https://drive.google.com/file/d/1QcbykqEs2zkknZexgkzWxGltWDE9smbr/view?usp=sharing",
    paper: "https://arxiv.org/abs/2602.19539",
    paperSlug: "teenager-fool-ai-age-estimation",
    citation: `@article{shen2026can,
  title={Can a Teenager Fool an AI? Evaluating Low-Cost Cosmetic Attacks on Age Estimation Systems},
  author={Shen, Xingyu and Duong, Tommy and An, Xiaodong and Zhao, Zengqi and Hu, Zebang and Hu, Haoyu and Wang, Ziyou and Guo, Finn and Ren, Simiao},
  journal={arXiv preprint arXiv:2602.19539},
  year={2026}
}`,
  },
  {
    id: "gpt4o-receipt",
    name: "Fully-synthetic AI-generated receipt (GPT-4o-receipt)",
    description:
      "Fully synthetic receipts generated by GPT-4o, paired with a human-study evaluation of detectability — used for AI-generated document forensics research.",
    link: "https://drive.google.com/file/d/1Q7Qa-0jkjLXDjzrluFExOgVKmQn_a40T/view",
    paper: "https://arxiv.org/abs/2603.11442",
    citation: `@article{zhang2026gpt4o,
  title={GPT4o-Receipt: A Dataset and Human Study for AI-Generated Document Forensics},
  author={Zhang, Yan and Ren, Simiao and Raj, Ankit and Wei, En and Ng, Dennis and Shen, Alex and Xu, Jiayue and Zhang, Yuxin and Marotta, Evelyn},
  journal={arXiv preprint arXiv:2603.11442},
  year={2026}
}`,
  },
  {
    id: "gaze-estimation",
    name: "Simulated gaze estimation for reading dataset",
    description:
      "Synthetic eye-movement trajectories rendered through a 3D eye simulator, replaying real reading paths — used for script reading detection research.",
    link: "https://drive.google.com/file/d/17O4W0xdxijDaq2H21BkfKAAxgvC2Fhip/view?usp=sharing",
    citation: `@article{zewde2026synthetic,
  title={A Synthetic Eye Movement Dataset for Script Reading Detection: Real Trajectory Replay on a 3D Eye Simulator},
  author={Zewde, Kidus and Zhou, Yuchen and Ng, Dennis and Tiangratanakul, Neo and Duong, Tommy and Raj, Ankit and Zhang, Yuxin and Shen, Xingyu and Ren, Simiao},
  journal={arXiv preprint arXiv:XXXX.XXXXX},
  year={2026},
  note={Authors affiliated with Scam AI}
}`,
  },
];

export function getPaperBySlug(slug: string): ResearchPaper | undefined {
  return researchPapers.find((p) => p.slug === slug);
}

export function getDatasetById(id: string): ResearchDataset | undefined {
  return researchDatasets.find((d) => d.id === id);
}

export function getPapersByCategory(category: string): ResearchPaper[] {
  return researchPapers.filter((p) => p.category === category);
}

export function getPublishedPaperSlugs(): string[] {
  return researchPapers.filter((p) => !p.coming && p.slug).map((p) => p.slug);
}

export function getAllPaperSlugs(): string[] {
  return researchPapers.filter((p) => p.slug).map((p) => p.slug);
}

export function getDatasetsForPaper(slug: string): ResearchDataset[] {
  return researchDatasets.filter((d) => d.paperSlug === slug);
}
