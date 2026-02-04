'use client';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import type { IntakeFields, IntakeErrors } from '@/hooks/useIntakeForm';

const PROJECT_TYPES = [
  'Build MVP',
  'Scale Team',
  'Rescue & Replace',
  'Modernize',
  'QA & Testing',
  'Design & UX',
  'DevOps',
  'AI Integration',
];

const COMPANY_SIZES = ['1-5', '6-10', '11-49', '50-250', '251+'] as const;

interface ProjectInfoStepProps {
  fields: IntakeFields;
  errors: IntakeErrors;
  onFieldChange: <K extends keyof IntakeFields>(key: K, value: IntakeFields[K]) => void;
  onNext: () => void;
  preselectedType?: string;
}

export function ProjectInfoStep({
  fields,
  errors,
  onFieldChange,
  onNext,
  preselectedType,
}: ProjectInfoStepProps) {
  const selectedType = fields.projectType || preselectedType || '';

  return (
    <div className="space-y-8">
      {/* Project type */}
      <fieldset>
        <legend className="text-body-lg font-medium text-foreground mb-3">
          What do you need?
        </legend>
        <div className="flex flex-wrap gap-2">
          {PROJECT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onFieldChange('projectType', type)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200',
                selectedType === type
                  ? 'bg-primary text-black border-primary'
                  : 'border-border text-foreground-subtle hover:text-foreground hover:border-primary',
              )}
            >
              {type}
            </button>
          ))}
        </div>
        {errors.projectType && (
          <p className="mt-2 text-sm text-red-500">{errors.projectType}</p>
        )}
      </fieldset>

      {/* Company name & website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Company name"
          placeholder="ACME"
          value={fields.companyName}
          onChange={(e) => onFieldChange('companyName', e.target.value)}
          error={errors.companyName}
        />
        <Input
          label="Company website (optional)"
          placeholder="https://acme.com"
          value={fields.companyWebsite}
          onChange={(e) => onFieldChange('companyWebsite', e.target.value)}
          error={errors.companyWebsite}
        />
      </div>

      {/* Company size */}
      <fieldset>
        <legend className="text-body-lg font-medium text-foreground mb-3">
          Company size
        </legend>
        <div className="flex flex-wrap gap-2">
          {COMPANY_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onFieldChange('companySize', size)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200',
                fields.companySize === size
                  ? 'bg-primary text-black border-primary'
                  : 'border-border text-foreground-subtle hover:text-foreground hover:border-primary',
              )}
            >
              {size}
            </button>
          ))}
        </div>
        {errors.companySize && (
          <p className="mt-2 text-sm text-red-500">{errors.companySize}</p>
        )}
      </fieldset>

      {/* Project description */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Tell us about your project
        </label>
        <textarea
          value={fields.message}
          onChange={(e) => onFieldChange('message', e.target.value)}
          placeholder="Describe what you need..."
          rows={4}
          className={cn(
            'w-full px-4 py-3 rounded-lg border transition-colors duration-200 text-sm resize-none',
            'bg-surface-card text-foreground placeholder:text-foreground-muted',
            'border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none',
            errors.message && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          )}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
        )}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={onNext}
        className={cn(
          'w-full py-3 rounded-lg text-sm font-semibold transition-colors duration-200',
          'bg-primary text-black hover:bg-primary-dark',
        )}
      >
        Continue
      </button>
    </div>
  );
}

export default ProjectInfoStep;
