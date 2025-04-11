
import { Job, JobFormData } from "../types/job";
import { getApiUrl } from "../components/ApiUrlConfig";

// Get API URL from configuration
const getBaseUrl = () => getApiUrl();

export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response = await fetch(getBaseUrl());
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const createJob = async (job: JobFormData): Promise<Job> => {
  try {
    const response = await fetch(getBaseUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

export const updateJob = async (id: string, job: Partial<JobFormData>): Promise<Job> => {
  try {
    const response = await fetch(`${getBaseUrl()}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

export const deleteJob = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${getBaseUrl()}/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
