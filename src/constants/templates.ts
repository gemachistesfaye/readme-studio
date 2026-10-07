import { ReadmeData, ReadmeTemplate } from '@/types';

export const README_TEMPLATES: ReadmeTemplate[] = [
  {
    id: 'blank',
    name: 'Blank',
    description: 'Start completely from scratch with a clean slate.',
    sections: ['Basic Info'],
    apply: (currentData: ReadmeData): ReadmeData => ({
      basicInfo: {
        projectName: '',
        description: '',
        repositoryUrl: '',
        demoUrl: '',
        authorName: '',
        authorGithub: '',
      },
      badges: {
        badges: [],
      },
      techStack: {
        technologies: [],
      },
      features: {
        features: [],
      },
      installation: {
        prerequisites: '',
        cloneCommand: '',
        installCommand: '',
        setupInstructions: [],
      },
      usage: {
        introduction: '',
        examples: [],
      },
      contributing: {
        enabled: true,
        introduction: 'Contributions are welcome! Please feel free to submit a Pull Request.',
        guidelines: [
          'Fork the repository',
          'Create your feature branch (git checkout -b feature/amazing-feature)',
          'Commit your changes (git commit -m "feat: add amazing feature")',
          'Push to the branch (git push origin feature/amazing-feature)',
          'Open a Pull Request',
        ],
        customInstructions: '',
      },
      license: {
        type: 'MIT',
        customName: '',
        customText: '',
      },
      contact: {
        email: '',
        website: '',
        linkedin: '',
        twitter: '',
        additionalLinkLabel: '',
        additionalLinkUrl: '',
      },
      layout: {
        sectionOrder: [...currentData.layout.sectionOrder],
        includeToc: currentData.layout.includeToc ?? false,
      },
      githubStats: {
        enabled: false,
        username: '',
        showStats: true,
        showTopLangs: true,
        showStreak: true,
        theme: 'github_dark',
      },
    }),
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Balanced README structure for general software projects.',
    sections: ['Features', 'Installation', 'Usage', 'Contributing', 'License', 'Contact'],
    apply: (current: ReadmeData): ReadmeData => ({
      ...current,
      basicInfo: {
        ...current.basicInfo,
        projectName: current.basicInfo.projectName || 'My Awesome Project',
        description:
          current.basicInfo.description ||
          'A comprehensive software project designed to deliver reliable performance with a modern workflow.',
      },
      features: current.features.features.length > 0 ? current.features : {
        features: [
          {
            id: `feat-${Date.now()}-1`,
            title: 'Core Engine',
            description: 'Fast, efficient core architecture designed for scalability.',
          },
          {
            id: `feat-${Date.now()}-2`,
            title: 'Configurable Options',
            description: 'Flexible configuration to adapt to different environments.',
          },
          {
            id: `feat-${Date.now()}-3`,
            title: 'Developer Experience',
            description: 'Intuitive CLI and programmatic interface with robust typing.',
          },
        ],
      },
      installation: current.installation.setupInstructions.length > 0 || current.installation.cloneCommand ? current.installation : {
        prerequisites: 'Ensure you have the required runtime and package manager installed on your system.',
        cloneCommand: 'git clone https://github.com/username/project.git',
        installCommand: 'npm install',
        setupInstructions: [
          {
            id: `step-${Date.now()}-1`,
            instruction: 'Build the project locally',
            command: 'npm run build',
          },
        ],
      },
      usage: current.usage.examples.length > 0 ? current.usage : {
        introduction: 'Get started quickly by following the examples below.',
        examples: [
          {
            id: `usage-${Date.now()}-1`,
            title: 'Basic Execution',
            description: 'Run the standard execution pipeline.',
            code: 'npm start',
            language: 'bash',
          },
        ],
      },
      contributing: {
        ...current.contributing,
        enabled: true,
        introduction: current.contributing.introduction || 'Contributions are welcome! Please feel free to submit a Pull Request.',
        guidelines: current.contributing.guidelines.length > 0 ? current.contributing.guidelines : [
          'Fork the repository',
          'Create your feature branch (git checkout -b feature/amazing-feature)',
          'Commit your changes (git commit -m "feat: add amazing feature")',
          'Push to the branch (git push origin feature/amazing-feature)',
          'Open a Pull Request',
        ],
      },
    }),
  },
  {
    id: 'web-app',
    name: 'Web Application',
    description: 'Structured for frontend and full-stack web projects.',
    sections: ['Features', 'Installation', 'Environment Setup', 'Usage', 'Contributing', 'License'],
    apply: (current: ReadmeData): ReadmeData => ({
      ...current,
      basicInfo: {
        ...current.basicInfo,
        projectName: current.basicInfo.projectName || 'Web Application',
        description:
          current.basicInfo.description ||
          'A responsive modern web application built for an engaging and responsive user experience.',
      },
      features: current.features.features.length > 0 ? current.features : {
        features: [
          {
            id: `feat-${Date.now()}-1`,
            title: 'Responsive User Interface',
            description: 'Adaptive design optimized across mobile, tablet, and desktop viewports.',
          },
          {
            id: `feat-${Date.now()}-2`,
            title: 'Real-time Updates',
            description: 'Interactive and reactive UI components with instant visual feedback.',
          },
          {
            id: `feat-${Date.now()}-3`,
            title: 'Accessible Design',
            description: 'Keyboard navigation and screen-reader accessible interface components.',
          },
        ],
      },
      installation: current.installation.setupInstructions.length > 0 || current.installation.cloneCommand ? current.installation : {
        prerequisites: 'Node.js LTS and a modern web browser.',
        cloneCommand: 'git clone https://github.com/username/webapp.git',
        installCommand: 'npm install',
        setupInstructions: [
          {
            id: `step-${Date.now()}-1`,
            instruction: 'Copy sample environment variables',
            command: 'cp .env.example .env.local',
          },
        ],
      },
      usage: current.usage.examples.length > 0 ? current.usage : {
        introduction: 'Follow these steps to run and develop the application locally.',
        examples: [
          {
            id: `usage-${Date.now()}-1`,
            title: 'Start Development Server',
            description: 'Launches the local development server with hot module reloading.',
            code: 'npm run dev',
            language: 'bash',
          },
          {
            id: `usage-${Date.now()}-2`,
            title: 'Production Build',
            description: 'Generates optimized production bundles.',
            code: 'npm run build',
            language: 'bash',
          },
        ],
      },
      contributing: {
        ...current.contributing,
        enabled: true,
        introduction: current.contributing.introduction || 'Contributions, issues, and feature requests are welcome!',
        guidelines: current.contributing.guidelines.length > 0 ? current.contributing.guidelines : [
          'Fork the repository',
          'Create your feature branch (git checkout -b feature/ui-improvement)',
          'Commit your changes (git commit -m "feat(ui): enhance component responsiveness")',
          'Push to the branch (git push origin feature/ui-improvement)',
          'Open a Pull Request',
        ],
      },
    }),
  },
  {
    id: 'api-backend',
    name: 'API / Backend',
    description: 'Designed for APIs, microservices, and backend services.',
    sections: ['Prerequisites', 'Installation', 'Environment Config', 'API Endpoints', 'License'],
    apply: (current: ReadmeData): ReadmeData => ({
      ...current,
      basicInfo: {
        ...current.basicInfo,
        projectName: current.basicInfo.projectName || 'Backend API Service',
        description:
          current.basicInfo.description ||
          'High-performance backend API service with secure endpoints and structured request handling.',
      },
      features: current.features.features.length > 0 ? current.features : {
        features: [
          {
            id: `feat-${Date.now()}-1`,
            title: 'RESTful Architecture',
            description: 'Structured endpoints with standard HTTP methods and JSON responses.',
          },
          {
            id: `feat-${Date.now()}-2`,
            title: 'Input Validation & Error Handling',
            description: 'Strict payload validation and clear diagnostic error responses.',
          },
          {
            id: `feat-${Date.now()}-3`,
            title: 'Performance & Security',
            description: 'Optimized routing, rate limiting, and security headers enabled.',
          },
        ],
      },
      installation: current.installation.setupInstructions.length > 0 || current.installation.cloneCommand ? current.installation : {
        prerequisites: 'Runtime environment and database connection configured.',
        cloneCommand: 'git clone https://github.com/username/api-service.git',
        installCommand: 'npm install',
        setupInstructions: [
          {
            id: `step-${Date.now()}-1`,
            instruction: 'Configure environment variables',
            command: 'cp .env.example .env',
          },
          {
            id: `step-${Date.now()}-2`,
            instruction: 'Run database migrations or schema setup',
            command: 'npm run db:migrate',
          },
        ],
      },
      usage: current.usage.examples.length > 0 ? current.usage : {
        introduction: 'Run the service locally or test endpoints using curl or API clients.',
        examples: [
          {
            id: `usage-${Date.now()}-1`,
            title: 'Start Service in Development Mode',
            description: 'Starts the API server with auto-restart.',
            code: 'npm run dev',
            language: 'bash',
          },
          {
            id: `usage-${Date.now()}-2`,
            title: 'Health Check Request',
            description: 'Verify server health via the status endpoint.',
            code: 'curl -X GET http://localhost:8080/health',
            language: 'bash',
          },
        ],
      },
    }),
  },
  {
    id: 'ai-ml',
    name: 'AI / ML',
    description: 'Structured for machine learning, data science, and AI projects.',
    sections: ['Features', 'Installation', 'Model & Environment', 'Usage Examples', 'License'],
    apply: (current: ReadmeData): ReadmeData => ({
      ...current,
      basicInfo: {
        ...current.basicInfo,
        projectName: current.basicInfo.projectName || 'AI / Machine Learning Project',
        description:
          current.basicInfo.description ||
          'Machine learning and AI solution providing automated inference and data processing workflows.',
      },
      features: current.features.features.length > 0 ? current.features : {
        features: [
          {
            id: `feat-${Date.now()}-1`,
            title: 'Model Pipeline',
            description: 'Modular data preprocessing, inference, and postprocessing pipeline.',
          },
          {
            id: `feat-${Date.now()}-2`,
            title: 'Configurable Parameters',
            description: 'Customizable hyperparameter settings and runtime configuration.',
          },
          {
            id: `feat-${Date.now()}-3`,
            title: 'Evaluation & Metrics',
            description: 'Built-in evaluation scripts and performance tracking.',
          },
        ],
      },
      installation: current.installation.setupInstructions.length > 0 || current.installation.cloneCommand ? current.installation : {
        prerequisites: 'Python 3.10+ / runtime dependencies and required system drivers.',
        cloneCommand: 'git clone https://github.com/username/ml-project.git',
        installCommand: 'pip install -r requirements.txt',
        setupInstructions: [
          {
            id: `step-${Date.now()}-1`,
            instruction: 'Download or link pretrained model weights',
            command: 'python scripts/download_weights.py',
          },
        ],
      },
      usage: current.usage.examples.length > 0 ? current.usage : {
        introduction: 'Run inference or train models using the provided command scripts.',
        examples: [
          {
            id: `usage-${Date.now()}-1`,
            title: 'Run Inference on Input Data',
            description: 'Execute inference pipeline with sample input.',
            code: 'python run_inference.py --input sample.json',
            language: 'bash',
          },
        ],
      },
    }),
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'A lightweight README for smaller utilities and libraries.',
    sections: ['Basic Info', 'Installation', 'Usage', 'License'],
    apply: (current: ReadmeData): ReadmeData => ({
      ...current,
      basicInfo: {
        ...current.basicInfo,
        projectName: current.basicInfo.projectName || 'Minimal Project',
        description:
          current.basicInfo.description ||
          'A simple, lightweight utility built to accomplish specific tasks efficiently.',
      },
      features: {
        features: [],
      },
      installation: current.installation.setupInstructions.length > 0 || current.installation.cloneCommand ? current.installation : {
        prerequisites: '',
        cloneCommand: '',
        installCommand: 'npm install my-package',
        setupInstructions: [],
      },
      usage: current.usage.examples.length > 0 ? current.usage : {
        introduction: '',
        examples: [
          {
            id: `usage-${Date.now()}-1`,
            title: 'Quick Start',
            description: 'Import and call the function.',
            code: 'import { run } from "my-package";\n\nrun();',
            language: 'typescript',
          },
        ],
      },
      contributing: {
        ...current.contributing,
        enabled: false,
      },
    }),
  },
];
