import { useState, useMemo, useCallback } from 'react';
import { BasicInfoData, ReadmeData, TechCategory, ValidationErrors } from '@/types';
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

  return {
    data,
    updateBasicInfo,
    touchField,
    addTechnology,
    removeTechnology,
    errors: visibleErrors,
    isValid: Object.keys(allErrors).length === 0,
  };
}
