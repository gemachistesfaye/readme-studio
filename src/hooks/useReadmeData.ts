import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  BadgeStyle,
  BadgeType,
  BasicInfoData,
  ContactData,
  ContactErrors,
  ContributingData,
  Feature,
  InstallationData,
  InstallationStep,
  LicenseData,
  ReadmeBadge,
  ReadmeData,
  ReadmeSectionId,
  TechCategory,
  TemplateId,
  UsageData,
  UsageExample,
  ValidationErrors,
  GitHubImportAnalysis,
  GitHubImportSelection,
} from '@/types';
import { validateBasicInfo, validateContact } from '@/utils/validation';
import { mapGitHubImportToReadmeData } from '@/utils/githubImport';
import { moveItem, moveItemById } from '@/utils/listOrder';
import {
  isDefaultSectionOrder,
  moveSectionInOrder,
  normalizeSectionOrder,
} from '@/utils/sectionOrder';
import { DEFAULT_SECTION_ORDER } from '@/constants/sections';
import { README_TEMPLATES } from '@/constants/templates';
import {
  createInitialReadmeData,
  loadReadmeDraft,
  saveReadmeDraft,
} from '@/utils/readmeDraftStorage';

export type DraftSaveStatus = 'Saving…' | 'Saved' | 'Could not save';

export function useReadmeData() {
  const [data, setData] = useState<ReadmeData>(
    () => loadReadmeDraft() ?? createInitialReadmeData()
  );
  const [saveStatus, setSaveStatus] = useState<DraftSaveStatus>('Saved');
  const [currentTemplateId, setCurrentTemplateId] = useState<TemplateId>('blank');
  const [touched, setTouched] = useState<Partial<Record<keyof BasicInfoData, boolean>>>({});
  const [touchedContact, setTouchedContact] = useState<Partial<Record<keyof ContactData, boolean>>>({});

  useEffect(() => {
    setSaveStatus('Saving…');
    const saveTimer = window.setTimeout(() => {
      try {
        saveReadmeDraft(data);
        setSaveStatus('Saved');
      } catch {
        setSaveStatus('Could not save');
      }
    }, 500);

    return () => window.clearTimeout(saveTimer);
  }, [data]);

  const allErrors = useMemo(() => validateBasicInfo(data.basicInfo), [data.basicInfo]);
  const allContactErrors = useMemo(() => validateContact(data.contact), [data.contact]);

  const visibleErrors = useMemo(() => {
    const visible: ValidationErrors = {};
    for (const key of Object.keys(touched) as (keyof BasicInfoData)[]) {
      if (touched[key] && allErrors[key]) {
        visible[key] = allErrors[key];
      }
    }
    return visible;
  }, [allErrors, touched]);

  const visibleContactErrors = useMemo(() => {
    const visible: ContactErrors = {};
    for (const key of Object.keys(touchedContact) as (keyof ContactData)[]) {
      if (touchedContact[key] && allContactErrors[key]) {
        visible[key] = allContactErrors[key];
      }
    }
    return visible;
  }, [allContactErrors, touchedContact]);

  // Check whether the workspace has meaningful content that would warrant confirmation
  const hasUserContent = useMemo(() => {
    const b = data.basicInfo;
    if (
      b.projectName.trim() ||
      b.description.trim() ||
      b.repositoryUrl.trim() ||
      b.demoUrl.trim() ||
      b.authorName.trim() ||
      b.authorGithub.trim()
    ) return true;
    if (data.badges.badges.length > 0) return true;
    if (data.techStack.technologies.length > 0) return true;
    if (data.features.features.length > 0) return true;
    if (
      data.installation.prerequisites.trim() ||
      data.installation.cloneCommand.trim() ||
      data.installation.installCommand.trim() ||
      data.installation.setupInstructions.length > 0
    ) return true;
    if (data.usage.introduction.trim() || data.usage.examples.length > 0) return true;
    if (
      data.contributing.introduction.trim() ||
      data.contributing.guidelines.length > 0 ||
      data.contributing.customInstructions.trim() ||
      !data.contributing.enabled
    ) return true;
    if (data.license.type !== 'MIT' || data.license.customName.trim() || data.license.customText.trim()) return true;
    if (
      data.contact.email.trim() ||
      data.contact.website.trim() ||
      data.contact.linkedin.trim() ||
      data.contact.twitter.trim() ||
      data.contact.additionalLinkLabel.trim() ||
      data.contact.additionalLinkUrl.trim()
    ) return true;
    if (!isDefaultSectionOrder(data.layout?.sectionOrder)) return true;
    return false;
  }, [data]);

  const resetReadme = useCallback(() => {
    setData(createInitialReadmeData());
    setCurrentTemplateId('blank');
    setTouched({});
    setTouchedContact({});
  }, []);

  // Normalized section order — always a complete, duplicate-free list
  const sectionOrder = useMemo(
    () => normalizeSectionOrder(data.layout?.sectionOrder),
    [data.layout]
  );

  // True when the current order already matches DEFAULT_SECTION_ORDER
  const isSectionOrderDefault = useMemo(
    () => isDefaultSectionOrder(data.layout?.sectionOrder),
    [data.layout]
  );

  // 1. Section Order Operations
  const moveSectionUp = useCallback((sectionId: ReadmeSectionId) => {
    setData((prev) => ({
      ...prev,
      layout: {
        sectionOrder: moveSectionInOrder(
          normalizeSectionOrder(prev.layout?.sectionOrder),
          sectionId,
          -1
        ),
      },
    }));
  }, []);

  const moveSectionDown = useCallback((sectionId: ReadmeSectionId) => {
    setData((prev) => ({
      ...prev,
      layout: {
        sectionOrder: moveSectionInOrder(
          normalizeSectionOrder(prev.layout?.sectionOrder),
          sectionId,
          1
        ),
      },
    }));
  }, []);

  // Resets ordering only. Section content is never touched.
  const resetSectionOrder = useCallback(() => {
    setData((prev) => ({
      ...prev,
      layout: {
        sectionOrder: [...DEFAULT_SECTION_ORDER],
      },
    }));
  }, []);

  // 2. Template Operations
  const applyTemplate = useCallback((templateId: TemplateId) => {
    const template = README_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    setData((prev) => {
      const updated = template.apply(prev);
      return updated;
    });
    setCurrentTemplateId(templateId);
  }, []);

  // 3. GitHub Import Operations
  const importGitHubData = useCallback(
    (analysis: GitHubImportAnalysis, selection: GitHubImportSelection) => {
      setData((prev) => mapGitHubImportToReadmeData(prev, analysis, selection));
    },
    []
  );

  // 4. Badge Operations
  const addBadge = useCallback(
    (
      type: BadgeType,
      label: string,
      message?: string,
      color?: string,
      logo?: string,
      link?: string,
      style: BadgeStyle = 'flat'
    ): { success: boolean; error?: string } => {
      const trimmedLabel = label.trim();
      if (!trimmedLabel) {
        return { success: false, error: 'Badge label cannot be empty.' };
      }

      // Check for duplicate badge (same label and type)
      const isDuplicate = data.badges.badges.some(
        (b) => b.type === type && b.label.toLowerCase() === trimmedLabel.toLowerCase()
      );

      if (isDuplicate) {
        return { success: false, error: `A ${type} badge for "${trimmedLabel}" already exists.` };
      }

      const newBadge: ReadmeBadge = {
        id: `badge-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type,
        label: trimmedLabel,
        message: message?.trim() || undefined,
        color: color?.trim() || undefined,
        logo: logo?.trim() || undefined,
        link: link?.trim() || undefined,
        style,
      };

      setData((prev) => ({
        ...prev,
        badges: {
          badges: [...prev.badges.badges, newBadge],
        },
      }));

      return { success: true };
    },
    [data.badges.badges]
  );

  const updateBadge = useCallback(
    (id: string, updates: Partial<Omit<ReadmeBadge, 'id'>>): { success: boolean; error?: string } => {
      setData((prev) => ({
        ...prev,
        badges: {
          badges: prev.badges.badges.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        },
      }));
      return { success: true };
    },
    []
  );

  const removeBadge = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      badges: {
        badges: prev.badges.badges.filter((b) => b.id !== id),
      },
    }));
  }, []);

  const moveBadgeUp = useCallback((index: number) => {
    if (index <= 0) return;
    setData((prev) => ({
      ...prev,
      badges: {
        badges: moveItem(prev.badges.badges, index, index - 1),
      },
    }));
  }, []);

  const moveBadgeDown = useCallback((index: number) => {
    setData((prev) => {
      if (index >= prev.badges.badges.length - 1) return prev;
      return {
        ...prev,
        badges: {
          badges: moveItem(prev.badges.badges, index, index + 1),
        },
      };
    });
  }, []);

  // Basic Info Handlers
  const updateBasicInfo = useCallback((field: keyof BasicInfoData, value: string) => {
    setData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: value,
      },
    }));
  }, []);

  const touchField = useCallback((field: keyof BasicInfoData) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  }, []);

  // Tech Stack Handlers
  const addTechnology = useCallback(
    (name: string, category: TechCategory): { success: boolean; error?: string } => {
      const trimmed = name.trim();
      if (!trimmed) {
        return { success: false, error: 'Technology name cannot be empty.' };
      }

      const isDuplicate = data.techStack.technologies.some(
        (t) => t.name.toLowerCase() === trimmed.toLowerCase()
      );

      if (isDuplicate) {
        return { success: false, error: `"${trimmed}" is already in your tech stack.` };
      }

      const newTech = {
        id: `tech-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: trimmed,
        category,
      };

      setData((prev) => ({
        ...prev,
        techStack: {
          technologies: [...prev.techStack.technologies, newTech],
        },
      }));

      return { success: true };
    },
    [data.techStack.technologies]
  );

  const removeTechnology = useCallback((id: string) => {
    setData((prev) => {
      const newTechList = prev.techStack.technologies.filter((t) => t.id !== id);

      return {
        ...prev,
        techStack: { technologies: newTechList },
      };
    });
  }, []);

  // Feature Handlers
  const addFeature = useCallback(
    (title: string, description?: string): { success: boolean; error?: string } => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        return { success: false, error: 'Feature title cannot be empty.' };
      }

      const isDuplicate = data.features.features.some(
        (f) => f.title.toLowerCase() === trimmedTitle.toLowerCase()
      );

      if (isDuplicate) {
        return { success: false, error: `"${trimmedTitle}" is already added as a feature.` };
      }

      const newFeature: Feature = {
        id: `feat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: trimmedTitle,
        description: description?.trim() || '',
      };

      setData((prev) => ({
        ...prev,
        features: {
          features: [...prev.features.features, newFeature],
        },
      }));

      return { success: true };
    },
    [data.features.features]
  );

  const updateFeature = useCallback(
    (id: string, title: string, description: string): { success: boolean; error?: string } => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        return { success: false, error: 'Feature title cannot be empty.' };
      }

      const isDuplicate = data.features.features.some(
        (f) => f.id !== id && f.title.toLowerCase() === trimmedTitle.toLowerCase()
      );

      if (isDuplicate) {
        return { success: false, error: `Another feature with the title "${trimmedTitle}" already exists.` };
      }

      setData((prev) => ({
        ...prev,
        features: {
          features: prev.features.features.map((f) =>
            f.id === id ? { ...f, title: trimmedTitle, description: description.trim() } : f
          ),
        },
      }));

      return { success: true };
    },
    [data.features.features]
  );

  const removeFeature = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      features: {
        features: prev.features.features.filter((f) => f.id !== id),
      },
    }));
  }, []);

  // 6. Feature Ordering (ids and content are preserved, only the position changes)
  const moveFeatureUp = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      features: {
        features: moveItemById(prev.features.features, id, -1),
      },
    }));
  }, []);

  const moveFeatureDown = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      features: {
        features: moveItemById(prev.features.features, id, 1),
      },
    }));
  }, []);

  // Installation Handlers
  const updateInstallationField = useCallback(
    (field: keyof Omit<InstallationData, 'setupInstructions'>, value: string) => {
      setData((prev) => ({
        ...prev,
        installation: {
          ...prev.installation,
          [field]: value,
        },
      }));
    },
    []
  );

  const addInstallationStep = useCallback(
    (instruction: string, command?: string): { success: boolean; error?: string } => {
      const trimmedInstruction = instruction.trim();
      if (!trimmedInstruction) {
        return { success: false, error: 'Instruction cannot be empty.' };
      }

      const newStep: InstallationStep = {
        id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        instruction: trimmedInstruction,
        command: command?.trim() || '',
      };

      setData((prev) => ({
        ...prev,
        installation: {
          ...prev.installation,
          setupInstructions: [...prev.installation.setupInstructions, newStep],
        },
      }));

      return { success: true };
    },
    []
  );

  const updateInstallationStep = useCallback(
    (id: string, instruction: string, command: string): { success: boolean; error?: string } => {
      const trimmedInstruction = instruction.trim();
      if (!trimmedInstruction) {
        return { success: false, error: 'Instruction cannot be empty.' };
      }

      setData((prev) => ({
        ...prev,
        installation: {
          ...prev.installation,
          setupInstructions: prev.installation.setupInstructions.map((s) =>
            s.id === id ? { ...s, instruction: trimmedInstruction, command: command.trim() } : s
          ),
        },
      }));

      return { success: true };
    },
    []
  );

  const removeInstallationStep = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      installation: {
        ...prev.installation,
        setupInstructions: prev.installation.setupInstructions.filter((s) => s.id !== id),
      },
    }));
  }, []);

  // 7. Custom Installation Step Ordering
  // Only the flexible step collection is reorderable — fixed fields
  // (prerequisites, clone command, install command) keep their positions.
  const moveInstallationStepUp = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      installation: {
        ...prev.installation,
        setupInstructions: moveItemById(prev.installation.setupInstructions, id, -1),
      },
    }));
  }, []);

  const moveInstallationStepDown = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      installation: {
        ...prev.installation,
        setupInstructions: moveItemById(prev.installation.setupInstructions, id, 1),
      },
    }));
  }, []);

  // Usage Handlers
  const updateUsageIntroduction = useCallback((introduction: string) => {
    setData((prev) => ({
      ...prev,
      usage: {
        ...prev.usage,
        introduction,
      },
    }));
  }, []);

  const updateUsageField = useCallback(
    (field: keyof Omit<UsageData, 'examples'>, value: string) => {
      setData((prev) => ({
        ...prev,
        usage: {
          ...prev.usage,
          [field]: value,
        },
      }));
    },
    []
  );

  const addUsageExample = useCallback(
    (
      title: string,
      description?: string,
      code?: string,
      language: string = 'bash'
    ): { success: boolean; error?: string } => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        return { success: false, error: 'Example title cannot be empty.' };
      }

      const isDuplicate = data.usage.examples.some(
        (e) => e.title.toLowerCase() === trimmedTitle.toLowerCase()
      );

      if (isDuplicate) {
        return {
          success: false,
          error: `An example with the title "${trimmedTitle}" already exists.`,
        };
      }

      const newExample: UsageExample = {
        id: `usage-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: trimmedTitle,
        description: description?.trim() || '',
        code: code?.trim() || '',
        language: language.trim() || 'bash',
      };

      setData((prev) => ({
        ...prev,
        usage: {
          ...prev.usage,
          examples: [...prev.usage.examples, newExample],
        },
      }));

      return { success: true };
    },
    [data.usage.examples]
  );

  const updateUsageExample = useCallback(
    (
      id: string,
      title: string,
      description: string,
      code: string,
      language: string
    ): { success: boolean; error?: string } => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        return { success: false, error: 'Example title cannot be empty.' };
      }

      const isDuplicate = data.usage.examples.some(
        (e) => e.id !== id && e.title.toLowerCase() === trimmedTitle.toLowerCase()
      );

      if (isDuplicate) {
        return {
          success: false,
          error: `Another example with the title "${trimmedTitle}" already exists.`,
        };
      }

      setData((prev) => ({
        ...prev,
        usage: {
          ...prev.usage,
          examples: prev.usage.examples.map((e) =>
            e.id === id
              ? {
                  ...e,
                  title: trimmedTitle,
                  description: description.trim(),
                  code: code.trim(),
                  language: language.trim() || 'bash',
                }
              : e
          ),
        },
      }));

      return { success: true };
    },
    [data.usage.examples]
  );

  const removeUsageExample = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      usage: {
        ...prev.usage,
        examples: prev.usage.examples.filter((e) => e.id !== id),
      },
    }));
  }, []);

  // 8. Usage Example Ordering
  // Title, description, code, and language are preserved as-is.
  const moveUsageExampleUp = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      usage: {
        ...prev.usage,
        examples: moveItemById(prev.usage.examples, id, -1),
      },
    }));
  }, []);

  const moveUsageExampleDown = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      usage: {
        ...prev.usage,
        examples: moveItemById(prev.usage.examples, id, 1),
      },
    }));
  }, []);

  // Contributing Handlers
  const toggleContributingEnabled = useCallback((enabled: boolean) => {
    setData((prev) => ({
      ...prev,
      contributing: {
        ...prev.contributing,
        enabled,
      },
    }));
  }, []);

  const updateContributingField = useCallback(
    (field: keyof Omit<ContributingData, 'enabled' | 'guidelines'>, value: string) => {
      setData((prev) => ({
        ...prev,
        contributing: {
          ...prev.contributing,
          [field]: value,
        },
      }));
    },
    []
  );

  const addGuideline = useCallback(
    (text: string): { success: boolean; error?: string } => {
      const trimmed = text.trim();
      if (!trimmed) {
        return { success: false, error: 'Guideline cannot be empty.' };
      }

      const isDuplicate = data.contributing.guidelines.some(
        (g) => g.toLowerCase() === trimmed.toLowerCase()
      );

      if (isDuplicate) {
        return { success: false, error: `"${trimmed}" is already in your guidelines.` };
      }

      setData((prev) => ({
        ...prev,
        contributing: {
          ...prev.contributing,
          guidelines: [...prev.contributing.guidelines, trimmed],
        },
      }));

      return { success: true };
    },
    [data.contributing.guidelines]
  );

  const updateGuideline = useCallback(
    (index: number, text: string): { success: boolean; error?: string } => {
      const trimmed = text.trim();
      if (!trimmed) {
        return { success: false, error: 'Guideline cannot be empty.' };
      }

      const isDuplicate = data.contributing.guidelines.some(
        (g, idx) => idx !== index && g.toLowerCase() === trimmed.toLowerCase()
      );

      if (isDuplicate) {
        return { success: false, error: `Another guideline step with "${trimmed}" already exists.` };
      }

      setData((prev) => ({
        ...prev,
        contributing: {
          ...prev.contributing,
          guidelines: prev.contributing.guidelines.map((g, idx) => (idx === index ? trimmed : g)),
        },
      }));

      return { success: true };
    },
    [data.contributing.guidelines]
  );

  const removeGuideline = useCallback((index: number) => {
    setData((prev) => ({
      ...prev,
      contributing: {
        ...prev.contributing,
        guidelines: prev.contributing.guidelines.filter((_, idx) => idx !== index),
      },
    }));
  }, []);

  // License Handlers
  const updateLicense = useCallback((field: keyof LicenseData, value: string) => {
    setData((prev) => {
      const updatedLicense = {
        ...prev.license,
        [field]: value,
      };

      // Automatically keep license badge synchronized with License type
      let updatedBadges = prev.badges.badges;
      if (field === 'type') {
        const newType = value;
        if (newType === 'None') {
          // Remove license badge if license is None
          updatedBadges = updatedBadges.filter((b) => b.type !== 'license');
        } else {
          // Update existing license badge label & message if one exists
          updatedBadges = updatedBadges.map((b) =>
            b.type === 'license'
              ? {
                  ...b,
                  message: newType === 'Custom' ? (prev.license.customName || 'Custom') : newType,
                }
              : b
          );
        }
      }

      return {
        ...prev,
        license: updatedLicense,
        badges: { badges: updatedBadges },
      };
    });
  }, []);

  // Contact Handlers
  const updateContactField = useCallback((field: keyof ContactData, value: string) => {
    setData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  }, []);

  const touchContactField = useCallback((field: keyof ContactData) => {
    setTouchedContact((prev) => ({
      ...prev,
      [field]: true,
    }));
  }, []);

  return {
    data,
    saveStatus,
    resetReadme,
    currentTemplateId,
    hasUserContent,
    sectionOrder,
    isSectionOrderDefault,
    moveSectionUp,
    moveSectionDown,
    resetSectionOrder,
    applyTemplate,
    importGitHubData,
    addBadge,
    updateBadge,
    removeBadge,
    moveBadgeUp,
    moveBadgeDown,
    updateBasicInfo,
    touchField,
    addTechnology,
    removeTechnology,
    addFeature,
    updateFeature,
    removeFeature,
    moveFeatureUp,
    moveFeatureDown,
    updateInstallationField,
    addInstallationStep,
    updateInstallationStep,
    removeInstallationStep,
    moveInstallationStepUp,
    moveInstallationStepDown,
    updateUsageIntroduction,
    updateUsageField,
    addUsageExample,
    updateUsageExample,
    removeUsageExample,
    moveUsageExampleUp,
    moveUsageExampleDown,
    toggleContributingEnabled,
    updateContributingField,
    addGuideline,
    updateGuideline,
    removeGuideline,
    updateLicense,
    updateContactField,
    touchContactField,
    errors: visibleErrors,
    contactErrors: visibleContactErrors,
    isValid: Object.keys(allErrors).length === 0 && Object.keys(allContactErrors).length === 0,
  };
}
