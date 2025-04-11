
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface HeaderProps {
  onAddJobClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddJobClick }) => {
  return (
    <header className="border-b pb-4 mb-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">Student Job Tracker</h1>
          <p className="text-gray-500">Track your job applications in one place</p>
        </div>
        
        <Button onClick={onAddJobClick} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-1 h-4 w-4" /> Add Application
        </Button>
      </div>
    </header>
  );
};

export default Header;
