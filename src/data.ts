export type Project = {
  slug: string;
  title: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  status: string;
  statusEn: string;
  summary: string;
  summaryEn: string;
  stack: string[];
  repository: string;
  docs?: string;
  featured?: boolean;
  evidence: string[];
  limitations: string;
  limitationsEn: string;
};

export const site = {
  name: 'wujue / Dithob',
  shortName: 'Dithob',
  github: 'https://github.com/Dithob',
  website: 'https://dithob.github.io',
};

export const projects: Project[] = [
  {
    slug: 'deepresume',
    title: 'DeepResume',
    titleEn: 'DeepResume',
    category: 'AI 应用',
    categoryEn: 'AI Applications',
    status: 'MVP / 持续开发',
    statusEn: 'MVP / Active development',
    summary: '把简历、目标 JD、学习计划与职业证据放在同一个工作台中的求职学习闭环。',
    summaryEn: 'A CV-to-offer workspace connecting resume evidence, target JDs, learning plans, and career proof.',
    stack: ['Next.js', 'TypeScript', 'FastAPI', 'Python'],
    repository: 'https://github.com/Dithob/DeepResume',
    featured: true,
    evidence: ['Public README', 'Runnable local MVP', 'Architecture and workflow documentation'],
    limitations: '当前版本是本地评估用 MVP，核心数据仍有内存存储边界，不能表述为生产 SaaS。',
    limitationsEn: 'The current version is a local-evaluation MVP with in-memory storage boundaries; it is not presented as a production SaaS.',
  },
  {
    slug: 'paperqa-agent',
    title: 'PaperQAAgent',
    titleEn: 'PaperQAAgent',
    category: '论文与 RAG',
    categoryEn: 'Paper Research & RAG',
    status: '可运行 MVP',
    statusEn: 'Runnable MVP',
    summary: '面向论文搜索、PDF 阅读、页面级证据检索与引用溯源问答的本地优先工作台。',
    summaryEn: 'A local-first paper research workspace for PDF reading, page-linked retrieval, and citation-grounded answers.',
    stack: ['Python', 'FastAPI', 'Next.js', 'PyMuPDF'],
    repository: 'https://github.com/Dithob/PaperQAAgent',
    featured: true,
    evidence: ['Public README', 'Local quick-start workflow', 'Page-linked evidence design'],
    limitations: '当前 Agent 范围聚焦单篇论文，尚未覆盖多论文综合、账号体系和完整视觉理解。',
    limitationsEn: 'The current Agent scope is one paper at a time; multi-paper synthesis, accounts, and full visual understanding are out of scope.',
  },
  {
    slug: 'youcansee',
    title: 'Youcansee',
    titleEn: 'Youcansee',
    category: 'Agent Skill / OCR',
    categoryEn: 'Agent Skill / OCR',
    status: '可安装 Skill',
    statusEn: 'Installable skill',
    summary: '面向 coding-agent 的多档位读图与 OCR Skill，包含候选故障转移、本地 VLM 和安全配置边界。',
    summaryEn: 'A multi-tier image understanding and OCR skill for coding agents, with fallback candidates and safe configuration boundaries.',
    stack: ['Python', 'OCR', 'Agent Skill', 'OpenAI-compatible API'],
    repository: 'https://github.com/Dithob/Youcansee',
    featured: true,
    evidence: ['Bilingual README', 'Skill manifest and scripts', 'Local tests and dry-run path'],
    limitations: '远程视觉服务是否可用取决于外部 Provider；静态检查与 dry-run 不等于线上调用成功。',
    limitationsEn: 'Remote vision availability depends on the configured provider; static checks and dry-runs do not prove a live paid API call.',
  },
  {
    slug: 'media-content-distiller',
    title: 'media-content-distiller',
    titleEn: 'media-content-distiller',
    category: '开发者工具',
    categoryEn: 'Developer Tooling',
    status: 'CLI / Skill',
    statusEn: 'CLI / Skill',
    summary: '字幕优先的音视频内容蒸馏工具，把一次性 URL 处理与可复用 CLI 配置分开。',
    summaryEn: 'A subtitle-first media distillation tool separating one-off URL work from reusable CLI workflows.',
    stack: ['Node.js', 'CLI', 'HTTP API', 'Markdown'],
    repository: 'https://github.com/Dithob/media-content-distiller',
    featured: true,
    evidence: ['Public CLI', 'Bilingual README', 'Local CLI and npm-install verification'],
    limitations: '当前字幕获取依赖外部服务；本地媒体不会被自动上传。',
    limitationsEn: 'Subtitle acquisition depends on an external service; local media is not uploaded automatically.',
  },
  {
    slug: 'maoding-agent',
    title: 'maodingAgent',
    titleEn: 'maodingAgent',
    category: 'macOS / Agent 工程',
    categoryEn: 'macOS / Agent Engineering',
    status: '阶段性完成',
    statusEn: 'Milestone complete',
    summary: '本地优先的 AI 编程 Agent 会话监控器，包含协议、状态归约、Hook、诊断和 macOS App 骨架。',
    summaryEn: 'A local-first AI coding-agent session monitor with protocols, state reduction, hooks, diagnostics, and a macOS app shell.',
    stack: ['Swift', 'SwiftUI', 'Unix Socket', 'JSON Schema'],
    repository: 'https://github.com/Dithob/maodingAgent',
    evidence: ['Public milestone documentation', '135 automated tests reported in README', 'M0 self-check and GUI checklist'],
    limitations: '部分真实 Agent 私有协议仍明确保持在独立实现边界之外。',
    limitationsEn: 'Some private Agent protocol details remain explicitly outside the independent implementation boundary.',
  },
  {
    slug: 'autotest-framework',
    title: 'autotest-framework',
    titleEn: 'autotest-framework',
    category: '测试工程',
    categoryEn: 'Engineering Quality',
    status: '框架型项目',
    statusEn: 'Framework project',
    summary: '基于 Pytest、Requests、OpenAPI 和 CI 的可扩展 API 测试自动化框架。',
    summaryEn: 'An extensible API test automation framework built around Pytest, Requests, OpenAPI, and CI.',
    stack: ['Python', 'Pytest', 'Requests', 'OpenAPI', 'Allure'],
    repository: 'https://github.com/Dithob/autotest-framework',
    evidence: ['Public README', 'Data-driven and contract-validation design', 'CI-oriented structure'],
    limitations: '不同业务环境的认证、数据库和服务依赖需要按项目配置，仓库本身不代表某个生产系统。',
    limitationsEn: 'Authentication, database, and service dependencies vary by environment; the repository is not presented as a specific production system.',
  },
];

export const notes = [
  { category: 'AI / Agent', categoryEn: 'AI / Agent', title: 'Building tools with explicit evidence boundaries', titleEn: 'Building tools with explicit evidence boundaries', description: '记录如何区分已验证事实、推断和外部服务状态。', descriptionEn: 'How to separate verified facts, inference, and external-service state.', href: 'https://github.com/Dithob' },
  { category: 'RAG / OCR / Document Processing', categoryEn: 'RAG / OCR / Document Processing', title: 'From documents to evidence-linked workflows', titleEn: 'From documents to evidence-linked workflows', description: '围绕论文、PDF、OCR 和可回查证据的工程笔记索引。', descriptionEn: 'Engineering notes on papers, PDFs, OCR, and traceable evidence.', href: 'https://github.com/Dithob/PaperQAAgent' },
  { category: 'Testing / Engineering', categoryEn: 'Testing / Engineering', title: 'Validation is part of the product surface', titleEn: 'Validation is part of the product surface', description: '测试、诊断、边界与回滚如何成为工具可信度的一部分。', descriptionEn: 'How tests, diagnostics, boundaries, and rollback support trust.', href: 'https://github.com/Dithob/autotest-framework' },
];
