import Button from '@/components/common/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NavigationButtons({ currentStep, totalSteps, onNext, onPrev, formData }) {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="flex justify-between items-center">
      <div>
        {!isFirstStep && (
          <Button 
            variant="secondary" 
            onClick={onPrev}
            icon={<ChevronLeft className="w-4 h-4" />}
            size="lg"
          >
            Previous
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {currentStep >= 3 && !isLastStep && (
          <Button 
            variant="outline" 
            href="/dashboard"
            size="lg"
          >
            Skip for Now
          </Button>
        )}
        
        {!isLastStep && (
          <Button 
            variant="primary" 
            onClick={onNext}
            icon={<ChevronRight className="w-4 h-4" />}
            size="lg"
          >
            {currentStep === totalSteps - 2 ? 'Complete Setup' : 'Continue'}
          </Button>
        )}
      </div>
    </div>
  );
}