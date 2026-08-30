export type Project = {
  slug: string;
  code: string;
  accent: 'pink' | 'lime' | 'blue' | 'orange' | 'purple' | 'red';
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

export type ThemeId = 'neo-brutalist' | 'editorial' | 'minimalist-flat' | 'bento-grid' | 'geometric-bold';

export type Signal = {
  number: string;
  label: string;
  labelEn: string;
  detail: string;
  detailEn: string;
  tone: 'pink' | 'lime' | 'blue' | 'orange';
};

export type Capability = {
  number: string;
  title: string;
  titleEn: string;
  detail: string;
  detailEn: string;
  tone: 'pink' | 'lime' | 'blue';
};

export type FocusItem = {
  number: string;
  title: string;
  titleEn: string;
  detail: string;
  detailEn: string;
};

export type WorkflowStep = {
  number: string;
  title: string;
  titleEn: string;
  detail: string;
  detailEn: string;
  tone: 'pink' | 'lime' | 'blue';
};

export const themes: Array<{
  id: ThemeId;
  label: string;
  labelEn: string;
  short: string;
  shortEn: string;
}> = [
  { id: 'neo-brutalist', label: '新野兽派', labelEn: 'Neo-Brutalist', short: '野兽派', shortEn: 'NEO' },
  { id: 'editorial', label: '编辑杂志风', labelEn: 'Editorial', short: '杂志', shortEn: 'EDITORIAL' },
  { id: 'minimalist-flat', label: '极简扁平', labelEn: '极简', short: '极简', shortEn: 'FLAT' },
  { id: 'bento-grid', label: '白色模式', labelEn: 'White Mode', short: '白色', shortEn: 'WHITE' },
  { id: 'geometric-bold', label: '黑色模式', labelEn: 'Black Mode', short: '黑色', shortEn: 'BLACK' },
];

export const site = {
  name: 'wujue / Dithob',
  shortName: 'Dithob',
  github: 'https://github.com/Dithob',
  website: 'https://dithob.github.io',
  mail: '2508807574@qq.com',
};

export const brand = {
  role: '计算机科学与技术学生｜AI 应用、Agent 工具、RAG/OCR 与测试工程',
  roleEn: 'CS student building AI applications, agent tools, RAG/OCR systems, and developer workflows.',
  tagline: '构建可运行、可解释、可核验的 AI 工具。',
  taglineEn: 'Building runnable, explainable, and verifiable AI tools.',
  positioning: '让项目不仅能运行，还能说明证据、边界和下一步。',
  positioningEn: 'Make projects runnable, explainable, and clear about evidence, limits, and next steps.',
};

export const signals: Signal[] = [
  { number: '01', label: '源码公开', labelEn: 'Open source', detail: 'SOURCE', detailEn: 'SOURCE', tone: 'pink' },
  { number: '02', label: '证据优先', labelEn: 'Evidence-led', detail: 'EVIDENCE', detailEn: 'EVIDENCE', tone: 'lime' },
  { number: '03', label: '边界明确', labelEn: 'Limits shown', detail: 'LIMITS', detailEn: 'LIMITS', tone: 'blue' },
  { number: '04', label: '持续构建', labelEn: 'Always building', detail: 'BUILD', detailEn: 'BUILD', tone: 'orange' },
];

export const capabilities: Capability[] = [
  {
    number: 'A1',
    title: 'AI Applications',
    titleEn: 'AI Applications',
    detail: 'RAG / PDF / Paper / Resume / Agent',
    detailEn: 'RAG / PDF / Paper / Resume / Agent',
    tone: 'pink',
  },
  {
    number: 'B2',
    title: 'Agent & Developer Tools',
    titleEn: 'Agent & Developer Tools',
    detail: 'Skills / CLI / OCR / Media / Automation',
    detailEn: 'Skills / CLI / OCR / Media / Automation',
    tone: 'lime',
  },
  {
    number: 'C3',
    title: 'Engineering Quality',
    titleEn: 'Engineering Quality',
    detail: 'Testing / Validation / CI / Observability / Safety',
    detailEn: 'Testing / Validation / CI / Observability / Safety',
    tone: 'blue',
  },
];

export const focusItems: FocusItem[] = [
  {
    number: '01',
    title: 'PaperQAAgent',
    titleEn: 'PaperQAAgent',
    detail: '页面级证据、论文阅读工作流与本地优先体验。',
    detailEn: 'Page-linked evidence and local-first paper research.',
  },
  {
    number: '02',
    title: 'DeepResume',
    titleEn: 'DeepResume',
    detail: '把简历、JD、学习计划和职业证据连接成闭环。',
    detailEn: 'A loop connecting resumes, JDs, learning plans, and career evidence.',
  },
  {
    number: '03',
    title: 'Agent tooling',
    titleEn: 'Agent tooling',
    detail: '可安装、可验证、边界清晰的 Skill 与 CLI。',
    detailEn: 'Installable, verifiable skills and CLI workflows.',
  },
];

export const workflowSteps: WorkflowStep[] = [
  {
    number: '01',
    title: '先确认事实',
    titleEn: 'Verify first',
    detail: '先把输入、现状和可公开证据分开。',
    detailEn: 'Separate inputs, current state, and public evidence.',
    tone: 'pink',
  },
  {
    number: '02',
    title: '再组织系统',
    titleEn: 'Shape the system',
    detail: '把问题拆成可以运行和回看的工作流。',
    detailEn: 'Turn the problem into a runnable, reviewable workflow.',
    tone: 'lime',
  },
  {
    number: '03',
    title: '最后说明边界',
    titleEn: 'State the boundary',
    detail: '把测试、限制和下一步一起交付。',
    detailEn: 'Ship tests, limitations, and the next step together.',
    tone: 'blue',
  },
];

export const projects: Project[] = [
  {
    slug: 'deepresume',
    code: '01',
    accent: 'pink',
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
    code: '02',
    accent: 'blue',
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
    code: '03',
    accent: 'lime',
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
    code: '04',
    accent: 'orange',
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
    code: '05',
    accent: 'purple',
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
    code: '06',
    accent: 'red',
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
