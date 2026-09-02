# wujue / Dithob

> 计算机科学与技术学生｜AI 应用、Agent 工具与测试工程，聚焦 RAG、OCR 与文档理解
>
> 邮箱：2508807574@qq.com ｜ 主页：https://dithob.github.io ｜ GitHub：https://github.com/Dithob

---

## 项目经历

### 腾讯地图 UI 自动化测试 Agent · 参与框架建设（2026.06 – 2026.09）

- **智能体编排与用例生成**：构建 LLM Agent 质量效能体系，按职责分五层编排 13 个 Skill 与 3 个自研 MCP 服务，打通「自然语言需求→自动化用例→知识沉淀」闭环；联动 TAPD/Figma 从需求自动生成可执行 case.py，单用例生成约 10–15 分钟（手写需 1–2 小时），覆盖 17 个业务域、600+ 生成代码单元。
- **MCP 工具开发与多模态感知**：自研设备控制与线上诊断 MCP，接入腾讯地图 MCP 解析坐标构造测试数据；融合 UIAutomator、OCR、OmniParser、OpenCV 四层 UI 感知，链式降级解决自绘控件无 resource-id 的定位问题；scrcpy 长连接投屏将截图耗时从约 1s 降至 30–100ms。
- **知识工程与语义检索**：设计纯文件知识图谱，基于 23 个研发仓库的 UI 索引做同源静态推理，让 Agent 生成前先读懂研发代码；以 AST 三级过滤扫描 1500+ 私有 helper，结合 jieba + BM25 实现公共方法语义检索与经验回流复用，避免规模化生成时重复造轮子。
- **可靠性工程与自愈闭环**：以意图锁定、门禁探索、九维度自审等护栏机制保障生成质量；通过 Lint 门禁与逐步断言保证代码稳定，以 health 回测通过率淘汰 flaky 用例；失败后基于证据包自动再生成补丁，形成 Self-heal 闭环。

### 基于 RAG 的医药数据分析问答助手 · 项目主要成员（2025.10 – 2026.02）

- **项目目标**：面向药品采购、零售、库存等全链路数据及 800 余张业务表，基于 Dify、LangChain、Milvus 与 MySQL 建设 LLM 数据分析问答助手，将销售人员的自然语言问题转化为可执行 SQL 与可读分析结论。
- **应用架构设计**：负责 LLM 应用核心链路设计，基于 Dify 完成工作流编排与模型接入，落地「问题理解–Schema 检索–SQL 生成–结果解释–人工反馈」业务链路，降低业务人员理解复杂库表结构的门槛。
- **表结构理解与字段召回**：对数据字典做元数据增强，将表名、字段名、字段含义与常见枚举值拼接为富文本后向量化；结合业务规则过滤、问题类型判断、样例对与 CoT，引导模型优先选择相关表和字段，提高 SQL 生成稳定性。
- **评估与自修正闭环**：引入 SQL 预执行与自纠错机制，捕获 MySQL Error 后回传 LLM 重写；构建约 200 条 Golden Dataset，以 RAGAS 指标、执行准确率与 Bad Case 回流评估检索与 SQL 质量，执行成功率由约 70% 提升至 90%+。

### 智能持续测试平台 · 独立设计与开发（2025.10 – 2026.02）

- **平台与框架设计**：基于 Python/Pytest/Requests 搭建五层接口自动化框架，基于 OpenAPI 自动生成契约用例校验状态码、响应 Schema 与业务错误码；以 Vue.js + FastAPI + MySQL + Redis + Docker 构建轻量测试平台，统一管理项目与用例。
- **UI 自动化与性能压测**：基于 Playwright 落地 PO 模式业务用例，集成 Trace、截图与录制支持回放；使用 JMeter/Locust 设计阶梯加压、稳定性与峰值压测，统计 QPS、P95、错误率并定位慢接口。
- **AI 增强与质量闭环**：将 Pytest/Playwright/Locust 执行封装为平台任务，经 Redis 队列异步调度；引入 LLM 用例生成流水线（生成草稿、人工复核、留存 Bad Case）；报告页聚合通过率、失败原因与趋势，形成测试闭环。

---

## 在校成果

- **竞赛**：2025「互联网+」创新创业大赛银奖；中国国际大学生创新大赛校级二等奖；重庆市 AI 大模型创新应用大赛省级三等奖。
- **论文**：《LHAF: A Lightweight Hierarchical Adaptive Framework for LLM-based Multimodal Emotion Recognition in Conversations》（SCI I 区在投）。

## 专业技能

- **测试开发基础**：熟练运用等价类、边界值、场景法、状态机、决策表等测试设计方法；熟悉需求评审、用例评审、提测执行、缺陷跟进、回归验证等测试全流程；熟练使用 TAPD、智研平台管理用例与缺陷。
- **工程与平台能力**：熟练使用 Python、Pytest、Requests 编写接口自动化，Playwright、Selenium、uiautomator2、ADB 编写 UI/移动端自动化，JMeter、Locust 编写性能压测；熟悉 Linux、FastAPI、MySQL、Docker、Git 等工程能力。
- **AI 应用与测试能力**：理解 RAG、Harness、Memory 等 Agent 机制，熟悉 MCP、Skill、Subagent 等 Agent 工具框架；能构建 Golden Dataset 与 Bad Case 回流闭环，设计幻觉、拒答、格式化、多轮回归等测试集，以关键词、JSON Schema、相似度、规则断言批量校验；有 Agent 用例自动更新与人工复核的落地经验。
