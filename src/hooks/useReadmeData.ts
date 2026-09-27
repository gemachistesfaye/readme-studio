import { useState, useMemo, useCallback } from 'react';
import {
  BasicInfoData,
  Feature,
  InstallationData,
  InstallationStep,
  ReadmeData,
  TechCategory,
  UsageData,
  UsageExample,
  ValidationErrors,
} from '@/types';
import { validateBasicInfo } from '@/utils/validation';

const initialReadmeData: ReadmeData = {
  basicInfo: {
    projectName: '',
    description: '',
    repositoryUrl: '',
    demoUrl: '',
    authorName: '',
    authorGithub: '',
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
};

export function useReadmeData() {
  const [data, setData] = useState<ReadmeData>(initialReadmeData);
  const [touched, setTouched] = useState<Partial<Record<keyof BasicInfoData, boolean>>>({});

  const allErrors = useMemo(() => validateBasicInfo(data.basicInfo), [data.basicInfo]);

  const visibleErrors = useMemo(() => {
    const visible: ValidationErrors = {};
    for (const key of Object.keys(touched) as (keyof BasicInfoData)[]) {
      if (touched[key] && allErrors[key]) {
        visible[key] = allErrors[key];
      }
    }
    return visible;
  }, [allErrors, touched]);

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
    setData((prev) => ({
      ...prev,
      techStack: {
        technologies: prev.techStack.technologies.filter((t) => t.id !== id),
      },
    }));
  }, []);

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

  return {
    data,
    updateBasicInfo,
    touchField,
    addTechnology,
    removeTechnology,
    addFeature,
    updateFeature,
    removeFeature,
    updateInstallationField,
    addInstallationStep,
    updateInstallationStep,
    removeInstallationStep,
    updateUsageIntroduction,
    updateUsageField,
    addUsageExample,
    updateUsageExample,
    removeUsageExample,
    errors: visibleErrors,
    isValid: Object.keys(allErrors).length === 0,
  };
}
