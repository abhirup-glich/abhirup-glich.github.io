import type { ProjectRecord } from "../types/project";

export const projectsData: ProjectRecord[] = [
  // --- A. APPLICATIONS & SOFTWARE ---
  {
    id: "tipflow",
    slug: "tipflow",
    title: "TipFlow",
    shortDescription: "Cross-platform webcam-based hand gesture control system enabling touchless computer interaction without mouse hardware.",
    detailedDescription: "TipFlow is an offline-first desktop application that transforms standard webcam video feeds into responsive, zero-latency computer controls through real-time hand gesture tracking. Developed to overcome traditional hardware constraints, it delivers reliable mouse pointer navigation, clicking, dragging, and desktop automation completely offline.",
    primaryCategory: "Applications & Software",
    categoryTags: ["Applications & Software", "AI & Automation", "Computer Vision"],
    technologies: ["Python", "MediaPipe", "OpenCV", "PySide6", "Computer Vision"],
    status: "Launched",
    statusLabel: "Launched / Continuing Development",
    featured: true,
    liveUrl: "https://tipflowapp.vercel.app/",
    implementedFeatures: [
      "Real-time webcam hand tracking and landmark extraction",
      "Sub-pixel pointer movement smoothing and jitter reduction",
      "Pinch gesture detection for left and right mouse clicks",
      "Drag-and-drop gesture states with continuous hold validation",
      "Dynamic vertical and horizontal scrolling through hand orientation",
      "Customizable desktop hotkeys and system shortcuts",
      "Interactive multi-step gesture tutorial and calibration suite"
    ],
    plannedFeatures: [
      "Multi-hand independent cursor support",
      "Custom user-trained gesture shortcuts"
    ],
    technicalImplementation: "Built using Python with OpenCV for video stream capture and MediaPipe for 21-point hand landmark identification. PySide6 powers the native multi-platform graphical interface, running an optimized worker thread architecture that minimizes CPU overhead and maintains smooth frame rates.",
    technicalChallenges: [
      "Minimizing cursor jitter caused by webcam sensor noise",
      "Maintaining under 25ms tracking latency on standard consumer laptops",
      "Ensuring robust landmark detection across varied indoor lighting conditions"
    ],
    relatedProjectIds: ["tipflow-product-distribution", "tipflow-website", "tipflow-packaging"]
  },
  {
    id: "glo",
    slug: "glo-desktop-companion",
    title: "GLO — Intelligent Desktop Companion",
    shortDescription: "Interactive floating AI companion featuring an expressive glowing character, Dynamic Island integration and local AI capabilities.",
    detailedDescription: "GLO is an intelligent desktop companion designed to bring warmth and interactive presence to everyday computing. Built around a dynamic, glowing avatar, GLO combines local intelligence, system-level task assistance, and expressive emotional animations with seamless macOS-style Dynamic Island interactions.",
    primaryCategory: "Applications & Software",
    categoryTags: ["Applications & Software", "AI & Automation", "UI/UX & Product Design"],
    technologies: ["Python", "Local AI", "UI/UX", "Computer Vision"],
    status: "In Development",
    statusLabel: "In Development",
    featured: true,
    implementedFeatures: [
      "Floating desktop widget architecture with borderless alpha transparency",
      "Initial glowing visual signature and state changes",
      "Basic voice command recognition pipeline"
    ],
    plannedFeatures: [
      "Dynamic Island desktop expander with contextual notification widgets",
      "Expressive state-driven character emotion animations",
      "Offline local LLM execution for private query handling",
      "Draggable interactive physics on desktop screens"
    ],
    technicalImplementation: "Engineered in Python with a lightweight transparent window overlay. Implements event-driven state machines for character mood transitions and hooks for speech-to-text input processing.",
    technicalChallenges: [
      "Rendering transparent alpha windows without tearing across multi-monitor setups",
      "Balancing local AI model memory footprint with low idle CPU usage"
    ],
    relatedProjectIds: ["glo-brand-design", "jarvis-assistant"]
  },
  {
    id: "fast-facial-attendance",
    slug: "fast-facial-attendance-system",
    title: "F.A.S.T. — Facial Attendance System",
    shortDescription: "Automated facial-recognition attendance management system engineered for reliable group identification.",
    detailedDescription: "F.A.S.T. (Facial Attendance System Technology) is an automated biometric solution created to replace manual roll calls and contact-based biometric scanners. It utilizes computer vision pipelines and deep facial embeddings to detect, identify, and log attendance for multiple individuals simultaneously.",
    primaryCategory: "Applications & Software",
    categoryTags: ["Applications & Software", "AI & Automation", "Cybersecurity & Networking"],
    technologies: ["Python", "OpenCV", "FaceNet", "PostgreSQL"],
    status: "Prototype",
    statusLabel: "Built / Prototype",
    featured: true,
    implementedFeatures: [
      "Automated video frame capture and face bounding box detection",
      "128-dimensional facial embedding generation using FaceNet",
      "Multi-person simultaneous identification in video feeds",
      "Automated attendance logging into a relational database",
      "Configurable Euclidean distance matching threshold"
    ],
    plannedFeatures: [
      "Liveness detection to prevent photographic spoofing",
      "Automated PDF attendance report generation"
    ],
    technicalImplementation: "Leveraged OpenCV Haar cascades / MTCNN for facial detection followed by a pre-trained FaceNet deep neural network for feature extraction. Match vectors are validated against a local PostgreSQL database storing enrolled student profiles.",
    technicalChallenges: [
      "Achieving consistent accuracy under angled face orientations and dim room lighting",
      "Optimizing batch inference time to prevent video stream lag"
    ],
    relatedProjectIds: ["fast-students"]
  },
  {
    id: "fast-students",
    slug: "fast-for-students",
    title: "F.A.S.T. for Students",
    shortDescription: "Companion mobile application for students to track attendance percentages and review personal attendance logs.",
    detailedDescription: "Designed as the student-facing companion to the F.A.S.T. ecosystem, this mobile application provides students with transparent, real-time access to their lecture attendance, aggregate percentages, and attendance history.",
    primaryCategory: "Applications & Software",
    categoryTags: ["Applications & Software", "UI/UX & Product Design"],
    technologies: ["Flutter", "Supabase", "Dart"],
    status: "Prototype",
    statusLabel: "Prototype",
    featured: false,
    implementedFeatures: [
      "Student authentication and profile linking",
      "Dashboard displaying subject-wise attendance percentages",
      "Historical log viewer with date-wise present/absent statuses",
      "Low-attendance alert threshold indicator"
    ],
    plannedFeatures: [
      "Push notifications for missed class sessions",
      "Attendance dispute submission workflow"
    ],
    technicalImplementation: "Developed using Flutter for cross-platform mobile delivery with Supabase handling cloud authentication, PostgreSQL row-level security, and real-time database synchronization.",
    relatedProjectIds: ["fast-facial-attendance"]
  },
  {
    id: "jarvis-assistant",
    slug: "jarvis-ai-assistant",
    title: "JARVIS AI Assistant",
    shortDescription: "Experimental voice-driven desktop assistant for operating system controls, application launching, and routine automation.",
    detailedDescription: "JARVIS is an experimental desktop automation agent capable of processing natural language voice commands to execute system-level operations, control media playback, launch software tools, and retrieve live web data.",
    primaryCategory: "Applications & Software",
    categoryTags: ["Applications & Software", "AI & Automation"],
    technologies: ["Python", "Speech Recognition", "Automation", "Pyttsx3"],
    status: "Prototype",
    statusLabel: "Prototype / Development",
    featured: false,
    implementedFeatures: [
      "Microphone speech capture and intent parsing",
      "Application launcher for standard system utilities and web browsers",
      "OS volume, screen brightness, and power management shortcuts",
      "Automated Wikipedia summary queries and weather forecast lookups"
    ],
    plannedFeatures: [
      "Integration with local open-weight LLMs for complex multi-step reasoning",
      "Custom system telemetry voice queries"
    ],
    technicalImplementation: "Built in Python utilizing SpeechRecognition and Google Speech API for voice transcribing, coupled with Pyttsx3 for offline text-to-speech feedback and subprocess calls for OS automation.",
    relatedProjectIds: ["goat-ai-assistant", "glo"]
  },
  {
    id: "goat-ai-assistant",
    slug: "goat-ai-assistant",
    title: "GOAT AI Assistant",
    shortDescription: "Early offline voice assistant prototype built in C++ using the Vosk offline speech recognition engine.",
    detailedDescription: "An exploration into high-performance, strictly offline voice assistants. Built using modern C++ and the Vosk speech library, GOAT investigated minimal memory footprint voice processing and command execution without reliance on external cloud APIs.",
    primaryCategory: "Applications & Software",
    categoryTags: ["Applications & Software", "AI & Automation"],
    technologies: ["C++", "Vosk", "Speech Synthesis", "PortAudio"],
    status: "Prototype",
    statusLabel: "Prototype",
    featured: false,
    implementedFeatures: [
      "Offline acoustic model loading and decoding with Vosk",
      "Direct microphone streaming via PortAudio",
      "Basic system command keyword dispatcher",
      "Lightweight speech synthesis feedback"
    ],
    technicalImplementation: "Implemented in standard C++ linking directly with Vosk C-API and PortAudio for cross-platform audio input capture.",
    relatedProjectIds: ["jarvis-assistant"]
  },
  {
    id: "snapodr",
    slug: "snapodr",
    title: "SnapOdr",
    shortDescription: "QR-code restaurant ordering and dining management platform connecting diners and kitchen staff.",
    detailedDescription: "SnapOdr is a contactless dining platform that eliminates wait times in restaurants. Customers scan a table-specific QR code to access a rich digital menu, customize items, submit orders directly to the kitchen display, and complete digital payments.",
    primaryCategory: "Applications & Software",
    categoryTags: ["Applications & Software", "Startups & Business", "Web Development"],
    technologies: ["Kotlin", "Supabase", "Razorpay", "PostgreSQL"],
    status: "In Development",
    statusLabel: "Product Development",
    featured: true,
    implementedFeatures: [
      "Table-specific QR code generation and instant menu loading",
      "Interactive digital catalog with dietary tags and modifiers",
      "Real-time kitchen order ticket (KOT) status pipeline",
      "Razorpay payment gateway integration prototype",
      "Admin menu management and stock toggle panel"
    ],
    plannedFeatures: [
      "Multi-branch enterprise restaurant analytics",
      "Automated inventory decrementing on order fulfillment"
    ],
    technicalImplementation: "Mobile client built with Kotlin, supported by Supabase for real-time WebSocket subscriptions and backend PostgreSQL data persistence. Razorpay handles transaction tokenization.",
    relatedProjectIds: ["snapodr-saas-model", "snapodr-customer-ui"]
  },
  {
    id: "parakotha",
    slug: "parakotha",
    title: "ParaKotha",
    shortDescription: "Multilingual civic issue-reporting platform connecting neighborhood residents with local authorities.",
    detailedDescription: "ParaKotha ('Neighborhood Talk') is a civic engagement platform developed as a hackathon prototype. It empowers residents to report local infrastructure issues—such as potholes, broken streetlights, and sanitation hazards—on an interactive community map with photo evidence and status tracking.",
    primaryCategory: "Applications & Software",
    categoryTags: ["Applications & Software", "Web Development", "UI/UX & Product Design"],
    technologies: ["Figma", "Supabase", "OpenFreeMap", "TypeScript"],
    status: "Prototype",
    statusLabel: "Hackathon Prototype",
    featured: true,
    implementedFeatures: [
      "Geolocated issue reporting with category tags and image uploads",
      "Interactive OpenFreeMap map view displaying nearby community reports",
      "Status lifecycle tracking (Reported, In Review, Resolved)",
      "Multilingual Bengali and English language UI toggle"
    ],
    plannedFeatures: [
      "Automated ward counselor notification routing",
      "Community upvoting system for issue prioritization"
    ],
    technicalImplementation: "Prototyped in Figma and developed with a web frontend integrating OpenFreeMap vector tiles for privacy-friendly map rendering and Supabase for relational data storage and asset hosting.",
    relatedProjectIds: ["parakotha-dashboard"]
  },
  {
    id: "jiosphere-launcher",
    slug: "jiosphere-custom-launcher",
    title: "JioSphere Custom Launcher",
    shortDescription: "Customized set-top box interface optimizing web browsing, remote navigation, and app accessibility.",
    detailedDescription: "An experimental custom interface designed for the Jio set-top box ecosystem. It enhances the TV experience by streamlining application shortcuts, remote-control D-pad navigation, browser access, and multimedia streaming.",
    primaryCategory: "Applications & Software",
    categoryTags: ["Applications & Software", "Experiments & Concepts"],
    technologies: ["Android", "Web", "Remote Control API", "JavaScript"],
    status: "Experimental",
    statusLabel: "Experimental Prototype",
    featured: false,
    implementedFeatures: [
      "Simplified TV grid launcher with oversized accessibility tiles",
      "D-pad keyboard and remote control focus management",
      "Direct browser bookmark shortcuts for popular streaming services",
      "Low-overhead lightweight UI rendering for hardware-constrained STBs"
    ],
    technicalImplementation: "Engineered web-based launcher container tested within the set-top box web environment with custom key-event listeners mapping directional remote inputs to on-screen navigation nodes.",
    relatedProjectIds: ["jio-stb-network-research", "jiosphere-streaming"]
  },
  {
    id: "1stcopyhub",
    slug: "1stcopyhub",
    title: "1stCopyHub",
    shortDescription: "E-commerce platform concept supporting multi-category refurbished goods and verified second-hand items.",
    detailedDescription: "1stCopyHub is an e-commerce concept crafted to organize the refurbished and pre-owned marketplace. It outlines an end-to-end shopping experience featuring graded product quality indicators, buyer protection, warranty information, and seller inventory management.",
    primaryCategory: "Applications & Software",
    categoryTags: ["Applications & Software", "Web Development", "Startups & Business"],
    technologies: ["React", "Next.js", "Supabase", "Razorpay"],
    status: "Concept",
    statusLabel: "Concept / Development",
    featured: false,
    implementedFeatures: [
      "Product catalog with grade-level condition indicators",
      "Category filtering, price sorting, and search mechanics",
      "Wishlist state management and persistent cart structure",
      "Admin inventory management wireframes"
    ],
    plannedFeatures: [
      "Multi-vendor seller onboarding and verification portal",
      "Integrated courier API tracking and automated label printing"
    ],
    technicalImplementation: "Conceptualized and planned on Next.js with Supabase backend schema definitions for orders, product variants, and user profiles.",
    relatedProjectIds: ["1stcopyhub-storefront"]
  },

  // --- B. STARTUPS & BUSINESS ---
  {
    id: "virtual-valley",
    slug: "virtual-valley",
    title: "Virtual Valley",
    shortDescription: "Digital agency providing bespoke web development, business presence management, and automation solutions.",
    detailedDescription: "Virtual Valley is an established digital services agency founded by Abhirup Sarkar. It specializes in crafting bespoke high-performance websites, establishing robust online business presences, optimizing local discovery, and designing tailored automation workflows for modern businesses.",
    primaryCategory: "Startups & Business",
    categoryTags: ["Startups & Business", "Web Development"],
    technologies: ["Next.js", "Tailwind CSS", "TypeScript", "Automation"],
    status: "Launched",
    statusLabel: "Established Business",
    featured: true,
    liveUrl: "https://virtual-valley.vercel.app",
    implementedFeatures: [
      "Full digital service delivery pipeline across web, branding, and automation",
      "Client acquisition systems and automated lead qualification workflows",
      "Portfolio of delivered client websites and digital presence solutions",
      "Standardized pricing packages and service tier models"
    ],
    technicalImplementation: "Operates with a modern web stack utilizing Next.js, Vercel edge deployment, responsive styling with Tailwind CSS, and custom integrations for client communications.",
    relatedProjectIds: ["virtual-valley-website", "vv-promotional-content", "vv-ai-workflow-platform"]
  },
  {
    id: "startiqo",
    slug: "startiqo",
    title: "Startiqo",
    shortDescription: "Startup funding and investment consultancy platform facilitating grant applications and investor outreach.",
    detailedDescription: "Startiqo is a startup advisory platform designed to bridge early-stage founders with government grants, angel investor syndicates, and venture funding programs. The platform simplifies eligibility analysis, application structuring, and consultation booking.",
    primaryCategory: "Startups & Business",
    categoryTags: ["Startups & Business", "Web Development"],
    technologies: ["React", "Tailwind CSS", "Vercel", "Financial Logic"],
    status: "Concept",
    statusLabel: "Website / Business Concept",
    featured: false,
    liveUrl: "https://thestartiqo.vercel.app/",
    implementedFeatures: [
      "Landing page presenting grant advisory and funding consultancy services",
      "Structured funding step-by-step roadmap for founders",
      "Consultation intake form and meeting scheduling funnel",
      "Interactive funding eligibility assessment calculator"
    ],
    technicalImplementation: "Built using React and Tailwind CSS, hosted on Vercel with responsive layouts and client-side financial estimation formulas.",
    relatedProjectIds: ["startiqo-website"]
  },
  {
    id: "tipflow-product-distribution",
    slug: "tipflow-product-distribution",
    title: "TipFlow — Product & Distribution",
    shortDescription: "Commercial product identity, installer distribution pipelines, and branding strategy for TipFlow.",
    detailedDescription: "The business and distribution operations of TipFlow. Encompasses software release packaging, installer signing research, cross-platform distribution pipelines, user documentation, and market positioning as a privacy-preserving touchless controller.",
    primaryCategory: "Startups & Business",
    categoryTags: ["Startups & Business", "Applications & Software"],
    technologies: ["Packaging", "Marketing Strategy", "Release Distribution"],
    status: "Launched",
    statusLabel: "Launched Product",
    featured: false,
    liveUrl: "https://tipflowapp.vercel.app/",
    implementedFeatures: [
      "Official website distribution channel with direct installer downloads",
      "Software versioning and release notes documentation",
      "Brand messaging focusing on 100% offline privacy and accessibility",
      "User feedback collection and bug reporting channels"
    ],
    technicalImplementation: "Integrated Inno Setup for Windows bundling, static website hosting on Vercel, and release asset distribution via verified web mirrors.",
    relatedProjectIds: ["tipflow", "tipflow-website", "tipflow-packaging"]
  },
  {
    id: "snapodr-saas-model",
    slug: "snapodr-saas-model",
    title: "SnapOdr — Restaurant SaaS Model",
    shortDescription: "SaaS architecture and subscription business model for scaling contactless restaurant operations.",
    detailedDescription: "Strategic SaaS framework designed to commercialize SnapOdr across diverse hospitality venues. Evaluates subscription tiers, transaction fee models, restaurant onboarding automation, and merchant settlement workflows.",
    primaryCategory: "Startups & Business",
    categoryTags: ["Startups & Business", "Applications & Software"],
    technologies: ["SaaS Architecture", "Supabase", "Multi-tenancy"],
    status: "In Development",
    statusLabel: "Product Development",
    featured: false,
    implementedFeatures: [
      "Tiered pricing structure definition (Basic, Pro, Multi-outlet)",
      "Multi-tenant database schema architecture",
      "Customer lifetime value and merchant acquisition cost modeling"
    ],
    plannedFeatures: [
      "Self-service restaurant onboarding and instant QR kit generation",
      "Automated monthly invoicing and settlement reports"
    ],
    technicalImplementation: "Designed as a multi-tenant cloud system utilizing Supabase Row Level Security to isolate restaurant data while sharing core processing microservices.",
    relatedProjectIds: ["snapodr", "snapodr-customer-ui"]
  },
  {
    id: "auralex",
    slug: "auralex",
    title: "Auralex",
    shortDescription: "Early AI-focused technology brand concept and research initiative.",
    detailedDescription: "Auralex was an early conceptual exploration into artificial intelligence branding, voice automation capabilities, and potential commercial applications. Maintained as an archival milestone in product conception without fabricated claims of commercial output.",
    primaryCategory: "Startups & Business",
    categoryTags: ["Startups & Business", "AI & Automation"],
    technologies: ["Brand Strategy", "AI Research Concept"],
    status: "Concept",
    statusLabel: "Early Concept",
    featured: false,
    implementedFeatures: [
      "Brand nomenclature and mission statement drafting",
      "Exploratory feature roadmap for AI-driven productivity software"
    ],
    technicalImplementation: "Strategic documentation and architectural concept notes.",
    relatedProjectIds: ["glo", "jarvis-assistant"]
  },
  {
    id: "buggy-but-brilliant",
    slug: "buggy-but-brilliant",
    title: "Buggy but Brilliant / Bugs to Brilliant",
    shortDescription: "Precursor creative agency brand exploring software engineering, design, and digital marketing services.",
    detailedDescription: "An earlier agency brand concept that preceded Virtual Valley. 'Buggy but Brilliant' (later explored as 'Bugs to Brilliant') served as a creative incubator for software experiments, branding experiments, and video marketing initiatives.",
    primaryCategory: "Startups & Business",
    categoryTags: ["Startups & Business", "Creative & Publishing"],
    technologies: ["Branding", "Creative Strategy", "Motion Graphics"],
    status: "Concept",
    statusLabel: "Earlier Business Concept",
    featured: false,
    implementedFeatures: [
      "Brand name development and illustrated visual identity concepts",
      "Experimental video reel packaging",
      "Foundational framework for client digital service offerings"
    ],
    relatedProjectIds: ["bbb-logo-reveal", "virtual-valley"]
  },

  // --- C. WEBSITES & UI/UX ---
  {
    id: "hotel-simvo",
    slug: "hotel-simvo-website",
    title: "Hotel Simvo Website",
    shortDescription: "Client website for Hotel Simvo in Upper Pelling, Sikkim, featuring accommodations and local SEO.",
    detailedDescription: "A bespoke hospitality website designed and developed for Hotel Simvo in Upper Pelling, West Sikkim. The platform showcases room categories, hotel amenities, Himalayan views, and local travel information, accompanied by targeted SEO optimization to boost direct inquiries.",
    primaryCategory: "Web Development",
    categoryTags: ["Web Development", "UI/UX & Product Design", "Client Work"],
    technologies: ["HTML", "CSS", "JavaScript", "SEO", "Responsive Design"],
    status: "Client Work",
    statusLabel: "Client Work",
    featured: true,
    implementedFeatures: [
      "Comprehensive room catalog with high-resolution visual galleries",
      "Traveler guide with regional attractions around Upper Pelling",
      "Direct WhatsApp and call booking integration",
      "On-page SEO optimization and Google Business profile alignment",
      "Mobile-optimized responsive design tailored for travelers on cellular networks"
    ],
    technicalImplementation: "Engineered using clean, semantic HTML5, CSS3, and JavaScript ensuring fast initial page loads even over 3G/4G mountain networks. Applied structured data (Schema.org) for hotel metadata.",
    technicalChallenges: [
      "Optimizing heavy mountain landscape imagery to load instantaneously on low-bandwidth cellular connections"
    ],
    relatedProjectIds: ["awara-cafe", "virtual-valley"]
  },
  {
    id: "momostar-website",
    slug: "momostar-website",
    title: "MomoStar Website",
    shortDescription: "Modern restaurant brand website demo showcasing signature offerings and visual menu presentation.",
    detailedDescription: "A vibrant culinary website prototype created for MomoStar, a fast-casual dining concept. Features engaging dish photography, interactive menu sections, store operating hours, and promotional highlights.",
    primaryCategory: "Web Development",
    categoryTags: ["Web Development", "UI/UX & Product Design"],
    technologies: ["React", "Tailwind CSS", "JavaScript"],
    status: "Client Work",
    statusLabel: "Client Demo",
    featured: false,
    implementedFeatures: [
      "Visual digital menu with item ingredients and spice indicators",
      "Promotional banner section for seasonal meal combos",
      "Store location map embed and operating hours badge"
    ],
    technicalImplementation: "Constructed with React and styled with Tailwind CSS, utilizing component-driven menu items for easy price updates.",
    relatedProjectIds: ["momostar-seasonal-campaigns"]
  },
  {
    id: "awara-cafe",
    slug: "awara-cafe-online-presence",
    title: "Awara Cafe Online Presence",
    shortDescription: "Digital business listing, local SEO optimization, and discovery platform management for Awara Cafe.",
    detailedDescription: "End-to-end digital visibility assignment executed for Awara Cafe. Centered on establishing verified Google Business profiles, optimizing discoverability on restaurant search platforms, updating digital menus, and managing digital listings.",
    primaryCategory: "Web Development",
    categoryTags: ["Web Development", "Startups & Business", "Client Work"],
    technologies: ["Local SEO", "Digital Presence", "Google My Business"],
    status: "Client Work",
    statusLabel: "Client Work",
    featured: false,
    implementedFeatures: [
      "Google Business Profile verification, optimization, and category tagging",
      "High-resolution menu asset upload and keyword enrichment",
      "Local map pin accuracy and customer review response framework",
      "Cross-platform directory synchronization"
    ],
    relatedProjectIds: ["hotel-simvo", "virtual-valley"]
  },
  {
    id: "abhirup-portfolio",
    slug: "abhirup-personal-portfolio",
    title: "Abhirup Personal Portfolio",
    shortDescription: "Interactive developer portfolio showcasing projects, startups, security experiments, and custom UI design.",
    detailedDescription: "The current portfolio platform designed and built by Abhirup Sarkar. Emphasizes modern glassmorphic aesthetics, fluid 60fps animations, centralized project architecture, terminal simulation, and accessible responsive engineering.",
    primaryCategory: "Web Development",
    categoryTags: ["Web Development", "UI/UX & Product Design"],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"],
    status: "Built / Worked On",
    statusLabel: "Built / Continuing Development",
    featured: true,
    liveUrl: "https://abhirup-glich.github.io",
    implementedFeatures: [
      "Comprehensive 50-project interactive project discovery explorer",
      "Multi-faceted search, category filtering, and status filtering",
      "Dynamic project detail routing with deep-link support",
      "Sleek dark glassmorphic design system with GPU-accelerated motion",
      "Interactive retro terminal popup with functional command parser",
      "Performance-tuned asset loading and responsive touch interactions"
    ],
    technicalImplementation: "Developed with React 19, TypeScript, and Vite. Utilizes Framer Motion for spring physics and layout transitions, with custom CSS backdrop filters and responsive Tailwind utility grids.",
    relatedProjectIds: ["virtual-valley-website"]
  },
  {
    id: "virtual-valley-website",
    slug: "virtual-valley-website",
    title: "Virtual Valley Website",
    shortDescription: "Official website for Virtual Valley digital agency highlighting services, pricing, and client onboarding.",
    detailedDescription: "The official web presence of Virtual Valley agency. Built to communicate premium agency positioning, demonstrate modern frontend craftsmanship, and guide prospective clients through service packages.",
    primaryCategory: "Web Development",
    categoryTags: ["Web Development", "UI/UX & Product Design", "Startups & Business"],
    technologies: ["React", "Tailwind CSS", "Framer Motion", "Vercel"],
    status: "Built / Worked On",
    statusLabel: "Website Development",
    featured: false,
    liveUrl: "https://virtual-valley.vercel.app",
    implementedFeatures: [
      "Hero section with dynamic typography animations",
      "Interactive service matrix outlining Web, UI/UX, and Automation packages",
      "Transparent project pricing tiers and deliverable timelines",
      "Responsive consultation booking form"
    ],
    technicalImplementation: "Built using React and Tailwind CSS, featuring custom Framer Motion hover states, scroll triggers, and fast edge deployment on Vercel.",
    relatedProjectIds: ["virtual-valley", "vv-promotional-content"]
  },
  {
    id: "startiqo-website",
    slug: "startiqo-website",
    title: "Startiqo Website",
    shortDescription: "Consultancy website featuring funding assistance workflows, advisory tiers, and an interactive calculator.",
    detailedDescription: "The official website developed for Startiqo. Outlines comprehensive grant advisory, equity funding consulting, startup registration support, and interactive financial calculators for early-stage entrepreneurs.",
    primaryCategory: "Web Development",
    categoryTags: ["Web Development", "UI/UX & Product Design"],
    technologies: ["React", "Tailwind CSS", "Vercel"],
    status: "Built / Worked On",
    statusLabel: "Website Development",
    featured: false,
    liveUrl: "https://thestartiqo.vercel.app/",
    implementedFeatures: [
      "Structured funding roadmap outlining the journey from pitch to disbursement",
      "Advisory tier comparisons with package breakdown",
      "Interactive funding requirement and valuation calculator",
      "Mobile-friendly consultation inquiry funnel"
    ],
    technicalImplementation: "Developed as a responsive single-page application deployed on Vercel with clean Tailwind typography and client-side form validation.",
    relatedProjectIds: ["startiqo"]
  },
  {
    id: "tipflow-website",
    slug: "tipflow-official-website",
    title: "TipFlow Official Website",
    shortDescription: "Product landing page showcasing gesture controls, platform compatibility, and direct software downloads.",
    detailedDescription: "The official landing page for the TipFlow touchless gesture control software. Serves as the primary distribution hub, presenting product capabilities, interactive gesture demonstrations, security reassurances, and direct desktop installers.",
    primaryCategory: "Web Development",
    categoryTags: ["Web Development", "UI/UX & Product Design", "Applications & Software"],
    technologies: ["React", "Tailwind CSS", "Framer Motion", "Vercel"],
    status: "Launched",
    statusLabel: "Launched Website",
    featured: false,
    liveUrl: "https://tipflowapp.vercel.app/",
    implementedFeatures: [
      "Interactive gesture demonstration cards with animated state guides",
      "Compatibility indicator across Windows, Linux, and macOS platforms",
      "Direct software installer download buttons and SHA checksum verifications",
      "100% offline privacy declaration section"
    ],
    technicalImplementation: "Crafted in React with custom Tailwind styling and Framer Motion spring animations, hosted on Vercel for fast global delivery.",
    relatedProjectIds: ["tipflow", "tipflow-product-distribution"]
  },
  {
    id: "modern-society",
    slug: "modern-society-website",
    title: "Modern Society Website",
    shortDescription: "Design exploration for a modern community platform emphasizing dark-mode UI and event timelines.",
    detailedDescription: "A conceptual design study for a progressive community organization. Focuses on an immersive dark-mode visual aesthetic, interactive event calendars, member profiles, and editorial community publications.",
    primaryCategory: "UI/UX & Product Design",
    categoryTags: ["UI/UX & Product Design", "Web Development"],
    technologies: ["Figma", "Tailwind CSS", "UI Design"],
    status: "Concept",
    statusLabel: "Design Concept",
    featured: false,
    implementedFeatures: [
      "Dark visual language with selective high-contrast neon accents",
      "Event schedule timeline with interactive RSVP cards",
      "Community newsletter and article layout concepts"
    ],
    technicalImplementation: "Prototyped in Figma with component auto-layouts and translated into static Tailwind CSS prototype components.",
    relatedProjectIds: ["redstone-agency"]
  },
  {
    id: "redstone-agency",
    slug: "redstone-inspired-agency-website",
    title: "Redstone-Inspired Agency Website",
    shortDescription: "Design exploration focusing on brutalist dark typography, micro-interactions, and creative presentation.",
    detailedDescription: "A frontend and visual design exercise exploring dark, brutalist typography and minimalist aesthetics inspired by high-end design agencies. Conducted as an independent study in layout experimentation without affiliation with original references.",
    primaryCategory: "UI/UX & Product Design",
    categoryTags: ["UI/UX & Product Design", "Web Development"],
    technologies: ["CSS", "Typography Design", "Frontend Animation"],
    status: "Concept",
    statusLabel: "Design Exercise",
    featured: false,
    implementedFeatures: [
      "Oversized kinetic typography with variable font weights",
      "Custom cursor interactions and magnetic hover elements",
      "Subtle monochrome grid layouts with high-precision spacing"
    ],
    technicalImplementation: "Built using modular CSS and vanilla JavaScript to test micro-interactions and smooth scroll inertia.",
    relatedProjectIds: ["modern-society"]
  },
  {
    id: "snapodr-customer-ui",
    slug: "snapodr-customer-interface",
    title: "SnapOdr Customer Interface",
    shortDescription: "Mobile-first web interface for diners to explore digital menus, customize orders, and pay via QR code.",
    detailedDescription: "The customer-facing touchpoint of the SnapOdr restaurant system. Designed specifically for frictionless smartphone use when scanning a QR code at a dining table, avoiding any app download requirement.",
    primaryCategory: "UI/UX & Product Design",
    categoryTags: ["UI/UX & Product Design", "Applications & Software"],
    technologies: ["Figma", "Kotlin / Web", "Mobile UI", "CSS"],
    status: "In Development",
    statusLabel: "Product Component",
    featured: false,
    implementedFeatures: [
      "Instant load QR landing view displaying table number and restaurant brand",
      "Category tabs with smooth horizontal scroll and dietary badge filters",
      "Item customization drawer for spice level and side selections",
      "Live order summary sheet with bill splitting prototype"
    ],
    technicalImplementation: "Designed in Figma following iOS/Android native interaction patterns and implemented as a lightweight responsive mobile web component.",
    relatedProjectIds: ["snapodr", "snapodr-saas-model"]
  },
  {
    id: "1stcopyhub-storefront",
    slug: "1stcopyhub-storefront",
    title: "1stCopyHub Storefront",
    shortDescription: "E-commerce user interface featuring product discovery grids, quality condition badges, and checkout UX.",
    detailedDescription: "User experience and interface design for the 1stCopyHub e-commerce project. Tackles consumer hesitation around refurbished electronics through transparent condition grading, certified inspection checklists, and intuitive filter systems.",
    primaryCategory: "UI/UX & Product Design",
    categoryTags: ["UI/UX & Product Design", "Web Development"],
    technologies: ["Next.js", "Tailwind CSS", "Figma", "UI/UX"],
    status: "Concept",
    statusLabel: "Product Concept / Development",
    featured: false,
    implementedFeatures: [
      "Multi-faceted filter sidebar with quality grade selection",
      "Product showcase view with 360-degree photo preview concept",
      "Persistent cart drawer with instant shipping calculator",
      "Streamlined three-step checkout stepper flow"
    ],
    technicalImplementation: "Interface designed in Figma and wireframed with responsive Tailwind CSS components.",
    relatedProjectIds: ["1stcopyhub"]
  },
  {
    id: "parakotha-dashboard",
    slug: "parakotha-civic-dashboard",
    title: "ParaKotha Civic Dashboard",
    shortDescription: "Interactive civic administration dashboard featuring map visualization and bilingual issue management.",
    detailedDescription: "The administrative and analytical interface of the ParaKotha civic reporting ecosystem. Empowers municipal workers and community organizers to view clusters of reported neighborhood problems, update resolution progress, and coordinate field action.",
    primaryCategory: "UI/UX & Product Design",
    categoryTags: ["UI/UX & Product Design", "Applications & Software"],
    technologies: ["Figma", "OpenFreeMap", "Leaflet", "UI/UX"],
    status: "Prototype",
    statusLabel: "Hackathon Prototype",
    featured: false,
    implementedFeatures: [
      "Interactive map pin clustering based on geo-coordinates",
      "Kanban workflow board for issue triage (New, Verified, Dispatched, Resolved)",
      "Bilingual interface supporting Bengali and English data labels",
      "Photo verification modal with geolocation metadata overlay"
    ],
    technicalImplementation: "Prototyped in Figma and developed as an interactive web dashboard utilizing Leaflet and OpenFreeMap tiles.",
    relatedProjectIds: ["parakotha"]
  },

  // --- D. CYBERSECURITY & NETWORKING ---
  {
    id: "network-device-management-poc",
    slug: "network-device-management-poc",
    title: "Network Device Management PoC",
    shortDescription: "Experimental TR-069 device management lab using GenieACS, MongoDB, Docker, and Linux/WSL.",
    detailedDescription: "A hands-on networking and telecommunications laboratory implementing an Auto Configuration Server (ACS) environment. Utilized GenieACS deployed in Docker on Linux/WSL to simulate, provision, and monitor CPE (Customer Premises Equipment) network routers via the TR-069 protocol.",
    primaryCategory: "Cybersecurity & Networking",
    categoryTags: ["Cybersecurity & Networking", "Experiments & Concepts"],
    technologies: ["GenieACS", "MongoDB", "Docker", "Linux", "WSL", "TR-069"],
    status: "Learning / Lab Work",
    statusLabel: "Lab Implementation",
    featured: true,
    implementedFeatures: [
      "Multi-container GenieACS deployment orchestrating CWMP, NBI, and FS services",
      "MongoDB database integration for storing device parameters and configuration trees",
      "TR-069 protocol session handshake analysis and XML SOAP message inspection",
      "Simulated CPE parameter configuration (SSID, WAN IP, firewall rules)"
    ],
    technicalImplementation: "Built within Ubuntu on WSL2 using Docker Compose to orchestrate GenieACS services and MongoDB. Network packet capture was configured to inspect CWMP Inform messages.",
    technicalChallenges: [
      "Resolving inter-container network routing for TR-069 connection requests",
      "Handling ACS authentication and XML parameter parsing quirks"
    ],
    relatedProjectIds: ["jio-stb-network-research"]
  },
  {
    id: "jio-stb-network-research",
    slug: "jio-stb-network-research",
    title: "Jio STB Network Research",
    shortDescription: "Local-network security analysis and diagnostic traffic inspection of a Jio set-top box.",
    detailedDescription: "Controlled experimental research into the networking behavior, local communication ports, and telemetry transmission of a Jio set-top box. Investigated device discovery mechanisms, DHCP option behaviors, and local streaming endpoints within a closed home laboratory.",
    primaryCategory: "Cybersecurity & Networking",
    categoryTags: ["Cybersecurity & Networking", "Experiments & Concepts"],
    technologies: ["Wireshark", "Network Analysis", "Linux", "Nmap"],
    status: "Experimental",
    statusLabel: "Experimental",
    featured: false,
    implementedFeatures: [
      "Local network port enumeration and open service identification via Nmap",
      "Wireshark packet capture analysis of STB boot sequences and broadcast packets",
      "DNS resolution flow monitoring and domain query mapping",
      "Diagnostic interface identification and access boundary testing"
    ],
    technicalImplementation: "Conducted in an isolated subnet using managed switches with port mirroring. Analyzed capture dumps in Wireshark on Kali Linux.",
    relatedProjectIds: ["network-device-management-poc", "jiosphere-launcher"]
  },
  {
    id: "esp32-wifi-security-lab",
    slug: "esp32-wifi-security-lab",
    title: "ESP32 Wi-Fi Security Lab",
    shortDescription: "Educational wireless security laboratory using ESP32 microcontrollers for protocol analysis.",
    detailedDescription: "A controlled educational security exploration utilizing an ESP32 microcontroller running ESP32WifiPhisher to demonstrate wireless protocol vulnerabilities, 802.11 beacon behavior, and the mechanics of rogue access points in an isolated educational testbed.",
    primaryCategory: "Cybersecurity & Networking",
    categoryTags: ["Cybersecurity & Networking", "Experiments & Concepts"],
    technologies: ["ESP32", "C++", "Wi-Fi Protocols", "Packet Capture", "Wireshark"],
    status: "Learning / Lab Work",
    statusLabel: "Experimental",
    featured: false,
    implementedFeatures: [
      "Flashing and configuring ESP32 firmware for 802.11 frame generation",
      "Captive portal behavior testing across varied mobile operating systems",
      "Packet capture analysis of 802.11 probe requests and association frames",
      "Documentation of mitigation strategies including 802.11w Protected Management Frames"
    ],
    technicalImplementation: "Implemented on an ESP32 development board using the ESP-IDF / Arduino environment within a controlled RF-shielded lab space.",
    relatedProjectIds: ["tryhackme-practical-labs"]
  },
  {
    id: "tryhackme-practical-labs",
    slug: "tryhackme-practical-labs",
    title: "TryHackMe Practical Labs",
    shortDescription: "Hands-on cybersecurity training across 10+ completed TryHackMe virtual machine challenges.",
    detailedDescription: "Practical offensive and defensive cybersecurity skill-building through the structured completion of over 10 TryHackMe lab rooms. Focused on foundational penetration testing concepts, network reconnaissance, service enumeration, privilege escalation fundamentals, and web vulnerability identification.",
    primaryCategory: "Cybersecurity & Networking",
    categoryTags: ["Cybersecurity & Networking", "Learning / Lab Work"],
    technologies: ["Linux", "Nmap", "Wireshark", "Metasploit", "Bash"],
    status: "Learning / Lab Work",
    statusLabel: "Hands-on Practice",
    featured: false,
    implementedFeatures: [
      "Network reconnaissance using Nmap service scripts and banner grabbing",
      "Directory and parameter fuzzing with Gobuster and ffuf",
      "Linux file permission auditing and SUID binary enumeration",
      "Network traffic capture review and credential leakage analysis"
    ],
    technicalImplementation: "Practiced hands-on using Kali Linux inside virtualized testing environments connecting via OpenVPN to TryHackMe virtual labs.",
    relatedProjectIds: ["portswigger-web-security", "boiler-ctf-assessment"]
  },
  {
    id: "portswigger-web-security",
    slug: "portswigger-web-security-academy",
    title: "PortSwigger Web Security Academy",
    shortDescription: "Rigorous web security exercises completing 50+ labs with Burp Suite across OWASP vulnerabilities.",
    detailedDescription: "Extensive hands-on web application security practice completing 50+ official PortSwigger Web Security Academy laboratory environments. Focused on mastering Burp Suite Professional/Community features to detect and remediate critical OWASP Top 10 vulnerabilities.",
    primaryCategory: "Cybersecurity & Networking",
    categoryTags: ["Cybersecurity & Networking", "Learning / Lab Work"],
    technologies: ["Burp Suite", "HTTP", "SQL Injection", "XSS", "CSRF", "Web Security"],
    status: "Learning / Lab Work",
    statusLabel: "Hands-on Practice",
    featured: false,
    implementedFeatures: [
      "SQL injection exploitation across UNION attacks and blind boolean/time delays",
      "Cross-Site Scripting (XSS) detection across stored, reflected, and DOM contexts",
      "Cross-Site Request Forgery (CSRF) token bypass analysis",
      "Server-Side Request Forgery (SSRF) and broken access control testing",
      "Burp Suite Repeater, Intruder, and Proxy workflow mastery"
    ],
    technicalImplementation: "Conducted directly through browser-proxy interposition using Burp Suite against PortSwigger's live laboratory instances.",
    relatedProjectIds: ["tryhackme-practical-labs", "boiler-ctf-assessment"]
  },
  {
    id: "boiler-ctf-assessment",
    slug: "boiler-ctf-security-assessment",
    title: "Boiler CTF Security Assessment",
    shortDescription: "Reconnaissance, enumeration, and technical analysis of the TryHackMe Boiler security challenge.",
    detailedDescription: "Comprehensive technical assessment and report preparation evaluating the TryHackMe 'Boiler CTF' virtual machine. Documents thorough enumeration methodology across FTP, web services, Linux privilege escalation vectors, and security remediation recommendations.",
    primaryCategory: "Cybersecurity & Networking",
    categoryTags: ["Cybersecurity & Networking", "Learning / Lab Work"],
    technologies: ["Linux", "Reconnaissance", "Security Reporting", "Nmap"],
    status: "Learning / Lab Work",
    statusLabel: "Lab / Report Preparation",
    featured: false,
    implementedFeatures: [
      "Methodical attack surface reconnaissance documenting all exposed ports",
      "Analysis of anonymous FTP service and hidden file artifacts",
      "Web application directory discovery and CMS vulnerability appraisal",
      "Structured technical vulnerability report compilation"
    ],
    technicalImplementation: "Executed on Kali Linux utilizing standard command-line auditing tools and documented according to standard penetration test reporting guidelines.",
    relatedProjectIds: ["tryhackme-practical-labs", "portswigger-web-security"]
  },

  // --- E. AI & AUTOMATION ---
  {
    id: "omnidimension-calling",
    slug: "omnidimension-calling-automation",
    title: "OmniDimension Calling Automation",
    shortDescription: "AI-assisted outbound calling pipeline integrated with Google Sheets for automated queue management.",
    detailedDescription: "An intelligent outbound telephony workflow combining Google Sheets spreadsheets with an automated calling API. Reads contacts dynamically from designated queues, initiates outbound communication, tracks delivery states, and appends interaction outcomes back to the spreadsheet in real time.",
    primaryCategory: "AI & Automation",
    categoryTags: ["AI & Automation", "Applications & Software"],
    technologies: ["Python", "Google Sheets API", "Webhooks", "Telephony API"],
    status: "Built / Worked On",
    statusLabel: "Automation Workflow",
    featured: true,
    implementedFeatures: [
      "Bidirectional Google Sheets API integration for real-time contact ingestion",
      "Automated phone number validation and call queue dispatcher",
      "Webhook receiver listening for call completion, duration, and disposition status",
      "Automated retry scheduling for unanswered or busy phone lines",
      "Detailed status timestamp logging back into Google Sheets columns"
    ],
    technicalImplementation: "Engineered in Python using gspread and oauth2client for secure Google Sheets communication, integrated with cloud telephony webhooks for asynchronous status processing.",
    technicalChallenges: [
      "Handling Google Sheets API rate-limits during bulk batch processing",
      "Guaranteeing idempotent webhook processing to prevent duplicate calls"
    ],
    relatedProjectIds: ["vv-ai-workflow-platform"]
  },
  {
    id: "vv-ai-workflow-platform",
    slug: "virtual-valley-ai-workflow-platform",
    title: "Virtual Valley AI Workflow Platform",
    shortDescription: "Proposed SaaS platform concept for automated business workflow discovery and AI integrations.",
    detailedDescription: "A conceptual automation-as-a-service platform developed under Virtual Valley. Aims to empower small and medium enterprises to identify repetitive business bottlenecks, explore pre-built automation templates, and deploy AI-driven pipelines.",
    primaryCategory: "AI & Automation",
    categoryTags: ["AI & Automation", "Startups & Business"],
    technologies: ["Next.js", "LLM APIs", "Workflow Automation"],
    status: "Concept",
    statusLabel: "Concept",
    featured: false,
    implementedFeatures: [
      "Workflow assessment questionnaire wireframes",
      "Curated library of business automation use cases (invoicing, customer support)",
      "Interactive pipeline visualizer concept"
    ],
    technicalImplementation: "Architectural specification outlining webhook connectors, LLM prompt templates, and background job runners.",
    relatedProjectIds: ["virtual-valley", "omnidimension-calling"]
  },
  {
    id: "google-ai-browser-automation",
    slug: "google-ai-browser-automation",
    title: "Google AI Browser Automation",
    shortDescription: "Research experiment investigating browser-based AI interface interaction and information retrieval.",
    detailedDescription: "An experimental exploration evaluating how programmatic browser automation can interact with web-based generative AI interfaces for research assistance. Examined DOM structure dynamics, response streaming detection, and text extraction pipelines without unauthorized API emulation.",
    primaryCategory: "AI & Automation",
    categoryTags: ["AI & Automation", "Experiments & Concepts"],
    technologies: ["Python", "Browser Automation", "DOM Parsing"],
    status: "Experimental",
    statusLabel: "Research Concept",
    featured: false,
    implementedFeatures: [
      "Headless browser session management with realistic viewport sizing",
      "DOM observer mechanics to detect streamed text completion",
      "Clean markdown formatting of extracted response text"
    ],
    technicalImplementation: "Explored using Python browser automation drivers to evaluate DOM stability and timing constraints.",
    relatedProjectIds: ["jarvis-assistant"]
  },
  {
    id: "tipflow-packaging",
    slug: "tipflow-cross-platform-packaging",
    title: "TipFlow Cross-Platform Packaging",
    shortDescription: "Engineering work packaging and distributing Python desktop software across multi-platform installers.",
    detailedDescription: "Technical engineering initiative solving the complexities of packaging a deep-learning and computer vision desktop application. Addressed bundling heavy binary dependencies (OpenCV, MediaPipe, PySide6) into self-contained, standalone Windows installers with minimal footprint.",
    primaryCategory: "AI & Automation",
    categoryTags: ["Applications & Software", "AI & Automation"],
    technologies: ["PyInstaller", "Inno Setup", "Bash", "GitHub Actions"],
    status: "Built / Worked On",
    statusLabel: "Development Work",
    featured: false,
    implementedFeatures: [
      "PyInstaller spec configuration bundling dynamic C-extensions and model weights",
      "Inno Setup script creating professional Windows wizard installers with uninstallation",
      "Asset compression reducing the distribution footprint by over 45%",
      "Automated release asset bundling scripts"
    ],
    technicalImplementation: "Configured custom PyInstaller runtime hooks to correctly resolve hidden MediaPipe binary dependencies, followed by automated Inno Setup compilation.",
    technicalChallenges: [
      "Eliminating false-positive antivirus heuristic flags on packaged binaries",
      "Resolving dynamic library path conflicts across varied Windows versions"
    ],
    relatedProjectIds: ["tipflow", "tipflow-product-distribution"]
  },
  {
    id: "jiosphere-streaming",
    slug: "jiosphere-media-streaming-interface",
    title: "JioSphere Media Streaming Interface",
    shortDescription: "Browser-based media playback and streaming experiment tailored for set-top box hardware.",
    detailedDescription: "An experimental media player interface tested on a Jio set-top box browser. Focused on overcoming hardware-accelerated playback limitations, mixed media format decoding, and responsive full-screen remote navigation.",
    primaryCategory: "AI & Automation",
    categoryTags: ["Applications & Software", "Experiments & Concepts"],
    technologies: ["HTML5 Video", "JavaScript", "CORS", "Media Elements"],
    status: "Experimental",
    statusLabel: "Experimental",
    featured: false,
    implementedFeatures: [
      "Custom HTML5 video controls optimized for directional TV remote buttons",
      "Format fallback handling across MP4, HLS, and WebM streams",
      "Buffer health monitoring to mitigate playback freezing on low RAM"
    ],
    technicalImplementation: "Crafted in lightweight vanilla JavaScript to avoid performance penalties on low-spec set-top box hardware.",
    relatedProjectIds: ["jiosphere-launcher", "jio-stb-network-research"]
  },

  // --- F. CREATIVE & BRAND DEVELOPMENT ---
  {
    id: "tipflow-launch-campaign",
    slug: "tipflow-launch-campaign",
    title: "TipFlow Launch Campaign",
    shortDescription: "Visual identity, promotional banners, release announcements, and social assets for the TipFlow launch.",
    detailedDescription: "Comprehensive creative campaign developed for the public release of TipFlow. Included designing hero brand visuals, feature callout graphics, release banners, and social media announcements communicating the concept of touchless gesture control.",
    primaryCategory: "Creative & Publishing",
    categoryTags: ["Creative & Publishing", "Startups & Business"],
    technologies: ["Graphic Design", "Social Media Strategy", "Branding"],
    status: "Client Work",
    statusLabel: "Creative Work",
    featured: false,
    implementedFeatures: [
      "Suite of promotional social graphics highlighting key gesture capabilities",
      "Hero launch announcement posters featuring high-contrast glowing aesthetics",
      "Platform compatibility badge graphics and software screenshot presentations"
    ],
    technicalImplementation: "Designed using high-resolution graphic design tools and rendered for optimal social compression across LinkedIn and Twitter.",
    relatedProjectIds: ["tipflow", "tipflow-motion-graphics"]
  },
  {
    id: "tipflow-motion-graphics",
    slug: "tipflow-motion-graphics",
    title: "TipFlow Motion Graphics",
    shortDescription: "Storyboard planning and motion design concept for a 30-second gesture tutorial video.",
    detailedDescription: "Motion graphics project and storyboard conceptualizing a fast-paced 30-second introductory video for TipFlow. Illustrates hand gestures synchronizing with on-screen computer actions to rapidly onboard new users.",
    primaryCategory: "Creative & Publishing",
    categoryTags: ["Creative & Publishing", "Applications & Software"],
    technologies: ["Motion Design", "UI Animation", "Visual Prototyping"],
    status: "Concept",
    statusLabel: "UI Animation Concept",
    featured: false,
    implementedFeatures: [
      "30-second video storyboard breakdown with visual keyframes",
      "Kinetic typography sequences detailing key product highlights",
      "Animated hand silhouette vector overlays demonstrating pinch gestures"
    ],
    technicalImplementation: "Storyboarded with asset preparation in Figma and Illustrator, animated with vector keyframe curves and motion prototyping.",
    relatedProjectIds: ["tipflow", "tipflow-launch-campaign"]
  },
  {
    id: "glo-brand-design",
    slug: "glo-character-brand-design",
    title: "GLO Character & Brand Design",
    shortDescription: "Expressive glowing character design, emotional expressions, and interface branding for GLO.",
    detailedDescription: "Visual identity and character design exploration for GLO, the intelligent desktop companion. Developed the distinctive glowing orb character, facial expression sheets, color palette signatures, and micro-avatar designs.",
    primaryCategory: "Creative & Publishing",
    categoryTags: ["Creative & Publishing", "UI/UX & Product Design"],
    technologies: ["Illustrator", "Figma", "Character Design"],
    status: "In Development",
    statusLabel: "Design / In Development",
    featured: false,
    implementedFeatures: [
      "Multi-state emotion matrix (Neutral, Listening, Thinking, Celebrating, Alert)",
      "Glowing atmospheric light signature color variants",
      "Iconography set for desktop menu bar and Dynamic Island widgets"
    ],
    technicalImplementation: "Created in Figma and Adobe Illustrator with layered vector assets optimized for real-time software animation rendering.",
    relatedProjectIds: ["glo"]
  },
  {
    id: "vv-promotional-content",
    slug: "virtual-valley-promotional-content",
    title: "Virtual Valley Promotional Content",
    shortDescription: "Agency marketing concepts, animated service demonstrations, and promotional social content.",
    detailedDescription: "Creative marketing suite produced for Virtual Valley agency. Encompasses video reels, service showcase carousels, customer proposition cards, and animated typography highlighting web development excellence.",
    primaryCategory: "Creative & Publishing",
    categoryTags: ["Creative & Publishing", "Startups & Business"],
    technologies: ["Motion Graphics", "Digital Branding", "Content Design"],
    status: "Client Work",
    statusLabel: "Creative Work",
    featured: false,
    implementedFeatures: [
      "Short-form agency intro video reels for social channels",
      "Multi-slide carousel graphics breaking down agency service deliverables",
      "Client testimonial presentation templates and case study layouts"
    ],
    technicalImplementation: "Created using motion graphics software with custom typography animation, interface walkthroughs, and branded presentation assets.",
    relatedProjectIds: ["virtual-valley", "virtual-valley-website"]
  },
  {
    id: "bbb-logo-reveal",
    slug: "buggy-but-brilliant-logo-reveal",
    title: "Buggy but Brilliant Logo Reveal",
    shortDescription: "Animated logo reveal concept featuring illustrated brand mechanics and motion design.",
    detailedDescription: "A motion design study animating the 'Buggy but Brilliant' brand mark. Explored a playful transition from glitchy, 'buggy' retro digital artifacts into a crisp, polished logo reveal with synchronized sound effects.",
    primaryCategory: "Creative & Publishing",
    categoryTags: ["Creative & Publishing", "Experiments & Concepts"],
    technologies: ["Motion Design", "Brand Animation", "Sound Design"],
    status: "Concept",
    statusLabel: "Concept",
    featured: false,
    implementedFeatures: [
      "Custom glitch displacement map animations",
      "Dynamic shape layer path morphing into the central emblem",
      "Integrated audio cue timing for impactful brand reveals"
    ],
    technicalImplementation: "Animated with vector motion graphics utilizing shape keyframes, particle generators, and displacement effect stacks.",
    relatedProjectIds: ["buggy-but-brilliant"]
  },
  {
    id: "momostar-seasonal-campaigns",
    slug: "momostar-seasonal-campaigns",
    title: "MomoStar Seasonal Campaigns",
    shortDescription: "Promotional campaign concepts and festival graphics proposed for the MomoStar brand.",
    detailedDescription: "A suite of seasonal promotional campaign designs created for MomoStar. Encompassed festival celebration banners, combo deal cards, and social media engagement posts crafted to drive foot traffic.",
    primaryCategory: "Creative & Publishing",
    categoryTags: ["Creative & Publishing", "Client Work"],
    technologies: ["Graphic Design", "Campaign Planning", "Typography"],
    status: "Client Work",
    statusLabel: "Client Proposal",
    featured: false,
    implementedFeatures: [
      "Diwali and holiday festival menu card layouts",
      "Discount promotion graphics formatted for Instagram and WhatsApp status",
      "Table-top tent card designs showcasing chef's specials"
    ],
    technicalImplementation: "Designed in Figma with print-ready CMYK deliverables and RGB digital social assets.",
    relatedProjectIds: ["momostar-website"]
  },

  // --- G. DOCUMENT DESIGN & PUBLISHING ---
  {
    id: "sbi-life-recruitment-document",
    slug: "sbi-life-recruitment-document",
    title: "SBI Life Recruitment Document",
    shortDescription: "Structured recruitment and agency presentation document designed for SBI Life advisors.",
    detailedDescription: "A professional print and digital document created to present recruitment program details, incentive tiers, recognition structures, and membership benefits for prospective financial advisors at SBI Life Insurance.",
    primaryCategory: "Creative & Publishing",
    categoryTags: ["Creative & Publishing", "Document Design", "Client Work"],
    technologies: ["InDesign / Canva", "Typography", "Print Layout"],
    status: "Client Work",
    statusLabel: "Document Design",
    featured: false,
    implementedFeatures: [
      "Structured informational layout categorizing complex compensation schemes",
      "Clear visual hierarchy with infographic-style milestone timelines",
      "Print-ready typography, bleed margins, and CMYK color profile",
      "Interactive digital PDF version with embedded contact links"
    ],
    technicalImplementation: "Typeset and structured using professional desktop publishing software with strict alignment grids and legible typography hierarchies.",
    relatedProjectIds: ["bengali-bhagavad-gita"]
  },
  {
    id: "bengali-bhagavad-gita",
    slug: "bengali-bhagavad-gita-book-formatting",
    title: "Bengali Bhagavad Gita Book Formatting",
    shortDescription: "Typesetting, pagination, and publication layout for a Bengali-language Bhagavad Gita edition.",
    detailedDescription: "A comprehensive publication formatting and typesetting project for a Bengali edition of the Bhagavad Gita. Required meticulous attention to Indic typography, complex ligatures, Sanskrit sloka alignment, footnote hierarchies, and print-ready book specifications.",
    primaryCategory: "Creative & Publishing",
    categoryTags: ["Creative & Publishing", "Publishing / Typesetting", "Client Work"],
    technologies: ["InDesign / Word", "Bengali Typography", "PDF Typesetting"],
    status: "Client Work",
    statusLabel: "Publishing / Typesetting",
    featured: false,
    implementedFeatures: [
      "Correct rendering of intricate Bengali conjunctive characters and vowel diacritics",
      "Parallel dual-column sloka and Bengali translation formatting",
      "Running headers, chapter pagination, and multi-tier table of contents",
      "High-resolution PDF generation ready for offset press printing"
    ],
    technicalImplementation: "Formatted with specialized Unicode Bengali font sets with custom baseline grids, paragraph styles, and page master spreads.",
    technicalChallenges: [
      "Ensuring zero font-rendering corruption across complex Sanskrit-Bengali conjunct glyphs during PDF export"
    ],
    relatedProjectIds: ["sbi-life-recruitment-document"]
  }
];

export const TOTAL_PROJECTS_COUNT = projectsData.length;
