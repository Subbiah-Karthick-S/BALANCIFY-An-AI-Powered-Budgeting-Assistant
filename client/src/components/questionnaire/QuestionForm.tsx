import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Question, QuestionField } from '@/types/financial';
import { ChevronLeft, ChevronRight, Rocket } from 'lucide-react';
import { GoalBuilder } from './GoalBuilder';

interface QuestionFormProps {
  question: Question;
  data: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  progress: number;
}

export function QuestionForm({
  question,
  data,
  onDataChange,
  onNext,
  onPrev,
  isFirst,
  isLast,
  progress,
}: QuestionFormProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>(data);

  useEffect(() => {
    setFormValues(data);
  }, [data]);

  const handleFieldChange = (fieldId: string, value: any) => {
    const newValues = { ...formValues, [fieldId]: value };
    setFormValues(newValues);
    onDataChange(newValues);
  };

  const handleNext = () => {
    onNext();
  };

  const renderField = (field: QuestionField) => {
    const value = formValues[field.id] !== undefined ? formValues[field.id] : (field.defaultValue || '');

    // Handle conditional fields
    if (field.condition) {
      const [conditionField, conditionValue] = field.condition.split('=');
      if (formValues[conditionField] !== conditionValue) {
        return null;
      }
    }

    switch (field.type) {
      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-gray-300">{field.label}</Label>
            <Input
              id={field.id}
              type="number"
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => {
                const numValue = parseFloat(e.target.value);
                // For household_size, ensure minimum value of 1
                if (field.id === 'household_size') {
                  handleFieldChange(field.id, Math.max(1, numValue || 1));
                } else {
                  handleFieldChange(field.id, numValue || 0);
                }
              }}
              className="bg-gray-800/50 border-gray-600 focus:border-neon-cyan focus:ring-neon-cyan text-white"
            />
          </div>
        );

      case 'text':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-gray-300">{field.label}</Label>
            <Input
              id={field.id}
              type="text"
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="bg-gray-800/50 border-gray-600 focus:border-neon-cyan focus:ring-neon-cyan text-white"
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-gray-300">{field.label}</Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="bg-gray-800/50 border-gray-600 focus:border-neon-cyan focus:ring-neon-cyan text-white"
              rows={3}
            />
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-gray-300">{field.label}</Label>
            <RadioGroup
              value={value}
              onValueChange={(val) => handleFieldChange(field.id, val)}
              className="flex flex-wrap gap-4"
            >
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                  <Label htmlFor={`${field.id}-${option}`} className="text-gray-300 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-gray-300">{field.label}</Label>
            <div className="grid grid-cols-2 gap-3">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option}`}
                    checked={(value || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const currentValues = value || [];
                      if (checked) {
                        handleFieldChange(field.id, [...currentValues, option]);
                      } else {
                        handleFieldChange(field.id, currentValues.filter((v: string) => v !== option));
                      }
                    }}
                  />
                  <Label htmlFor={`${field.id}-${option}`} className="text-gray-300 cursor-pointer text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-gray-300">{field.label}</Label>
            <Select value={value} onValueChange={(val) => handleFieldChange(field.id, val)}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 focus:border-neon-cyan text-white">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option} className="text-white hover:bg-gray-700">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'range':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-gray-300">{field.label}</Label>
            <div className="space-y-2">
              <Slider
                value={[value || field.min || 0]}
                onValueChange={(vals) => handleFieldChange(field.id, vals[0])}
                min={field.min}
                max={field.max}
                step={field.step}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{field.min}</span>
                <span className="text-neon-cyan font-medium">{value || field.min}</span>
                <span>{field.max}</span>
              </div>
            </div>
          </div>
        );

      case 'goal-builder':
        return (
          <div key={field.id} className="space-y-2">
            <GoalBuilder
              value={value || [{
                description: "Emergency Fund",
                target_amount: 500000,
                timeline_months: 24,
                priority: "high",
                category: "emergency"
              }]}
              onChange={(goals) => handleFieldChange(field.id, goals)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Progress Header */}
      <Card className="glass-effect border-white/20 mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-orbitron text-2xl font-bold text-neon-cyan">Mission Briefing</h2>
            <span className="text-cosmic-300">Progress: {Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-neon-cyan to-cosmic-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Question Container */}
      <Card className="glass-effect border-white/20">
        <CardContent className="p-8">
          <h3 className="font-orbitron text-2xl font-bold mb-6 text-neon-cyan flex items-center">
            <Rocket className="mr-3" />
            {question.title}
          </h3>
          
          <div className="space-y-6">
            {question.fields.map(renderField)}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={onPrev}
          disabled={isFirst}
          variant="outline"
          className="px-6 py-3 glass-effect border-white/20 hover:border-neon-cyan transition-all duration-300 disabled:opacity-50"
        >
          <ChevronLeft className="mr-2 w-4 h-4" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          className="px-6 py-3 bg-gradient-to-r from-cosmic-600 to-space-600 hover:from-cosmic-500 hover:to-space-500 transition-all duration-300"
        >
          {isLast ? 'Complete Mission' : 'Next'}
          <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
