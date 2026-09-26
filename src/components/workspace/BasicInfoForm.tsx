import React from 'react';
import { BasicInfoData, ValidationErrors } from '@/types';
import { FormField } from '@/components/common/FormField';
import { TextInput } from '@/components/common/TextInput';
import { TextArea } from '@/components/common/TextArea';
import { MAX_DESCRIPTION_LENGTH } from '@/utils/validation';

interface BasicInfoFormProps {
  data: BasicInfoData;
  errors: ValidationErrors;
  onChange: (field: keyof BasicInfoData, value: string) => void;
  onBlur: (field: keyof BasicInfoData) => void;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  data,
  errors,
  onChange,
  onBlur,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Project Name */}
      <FormField
        id="projectName"
        label="Project Name"
        required
        error={errors.projectName}
      >
        <TextInput
          id="projectName"
          placeholder="README Studio"
          value={data.projectName}
          hasError={!!errors.projectName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('projectName', e.target.value)}
          onBlur={() => onBlur('projectName')}
        />
      </FormField>

      {/* Short Description */}
      <FormField
        id="description"
        label="Short Description"
        required
        counter={`${data.description.length} / ${MAX_DESCRIPTION_LENGTH}`}
        error={errors.description}
      >
        <TextArea
          id="description"
          placeholder="A modern tool for creating professional GitHub README files."
          rows={3}
          maxLength={MAX_DESCRIPTION_LENGTH}
          value={data.description}
          hasError={!!errors.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange('description', e.target.value)}
          onBlur={() => onBlur('description')}
        />
      </FormField>

      {/* URLs Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="repositoryUrl"
          label="Repository URL"
          error={errors.repositoryUrl}
        >
          <TextInput
            id="repositoryUrl"
            type="url"
            placeholder="https://github.com/username/project"
            value={data.repositoryUrl}
            hasError={!!errors.repositoryUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('repositoryUrl', e.target.value)}
            onBlur={() => onBlur('repositoryUrl')}
          />
        </FormField>

        <FormField
          id="demoUrl"
          label="Live Demo URL"
          error={errors.demoUrl}
        >
          <TextInput
            id="demoUrl"
            type="url"
            placeholder="https://project.example.com"
            value={data.demoUrl}
            hasError={!!errors.demoUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('demoUrl', e.target.value)}
            onBlur={() => onBlur('demoUrl')}
          />
        </FormField>
      </div>

      {/* Author Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="authorName"
          label="Author Name"
          error={errors.authorName}
        >
          <TextInput
            id="authorName"
            placeholder="Your name"
            value={data.authorName}
            hasError={!!errors.authorName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('authorName', e.target.value)}
            onBlur={() => onBlur('authorName')}
          />
        </FormField>

        <FormField
          id="authorGithub"
          label="Author GitHub URL"
          error={errors.authorGithub}
        >
          <TextInput
            id="authorGithub"
            type="url"
            placeholder="https://github.com/username"
            value={data.authorGithub}
            hasError={!!errors.authorGithub}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('authorGithub', e.target.value)}
            onBlur={() => onBlur('authorGithub')}
          />
        </FormField>
      </div>
    </div>
  );
};
