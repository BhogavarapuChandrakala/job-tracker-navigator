
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  onAddJobClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddJobClick }) => {
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
      <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
        <Plus className="h-8 w-8 text-purple-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No job applications yet</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Start tracking your job search by adding your first application.
      </p>
      <Button onClick={onAddJobClick}>
        <Plus className="mr-1 h-4 w-4" />
        Add Your First Application
      </Button>
    </div>
  );
};

export default EmptyState;
