
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { JobStatus } from "@/types/job";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FilterX } from "lucide-react";

interface JobFilterProps {
  onFilterChange: (filters: { status?: JobStatus; dateSort?: string }) => void;
}

const statusOptions: JobStatus[] = ["Applied", "Interview", "Offer", "Rejected"];
const dateSortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

const JobFilter: React.FC<JobFilterProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState<JobStatus | "">("");
  const [dateSort, setDateSort] = useState<string>("newest");

  const handleStatusChange = (value: JobStatus | "") => {
    setStatus(value);
    onFilterChange({ status: value || undefined, dateSort });
  };

  const handleDateSortChange = (value: string) => {
    setDateSort(value);
    onFilterChange({ status: status || undefined, dateSort: value });
  };

  const clearFilters = () => {
    setStatus("");
    setDateSort("newest");
    onFilterChange({});
  };

  return (
    <div className="flex flex-wrap gap-4 items-end mb-6">
      <div className="min-w-[180px]">
        <Label htmlFor="status-filter" className="mb-2 block">
          Filter by Status
        </Label>
        <Select 
          value={status} 
          onValueChange={(value) => handleStatusChange(value as JobStatus | "")}
        >
          <SelectTrigger id="status-filter">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[180px]">
        <Label htmlFor="date-sort" className="mb-2 block">
          Sort by Date
        </Label>
        <Select 
          value={dateSort} 
          onValueChange={handleDateSortChange}
        >
          <SelectTrigger id="date-sort">
            <SelectValue placeholder="Sort by Date" />
          </SelectTrigger>
          <SelectContent>
            {dateSortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-10" 
        onClick={clearFilters}
        title="Clear filters"
      >
        <FilterX className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default JobFilter;
