import { apiClient } from './api';
import { JOBS_BASE_URL } from './apiUrls';

export interface JobQueryParams {
  ukCity?: string;
  isStudentFriendly?: boolean;
  noExperienceRequired?: boolean;
  category?: string;
  page?: number;
  limit?: number;
}

export interface JobItem {
  _id: string;
  posterId?: string;
  title: string;
  companyName?: string;
  category?: string | null;
  feedType?: 'standard' | 'quick-gig' | string;
  description?: string;
  ukCity?: string;
  isStudentFriendly?: boolean;
  noExperienceRequired?: boolean;
  salaryRange?: string;
  deadline?: string;
  isPaid?: boolean;
  isActive?: boolean;
  isExpired?: boolean;
  applicantCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobsResponse {
  jobs: JobItem[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export const jobsService = {
  // GET /api/jobs/standard
  getStandardJobs: async (params?: JobQueryParams): Promise<JobsResponse> => {
    try {
      const response = await apiClient.get<JobsResponse>('/api/jobs/standard', {
        baseURL: JOBS_BASE_URL,
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error('[jobsService] GET /api/jobs/standard FAILED:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        url: `${error?.config?.baseURL || ''}${error?.config?.url || ''}`,
        params: error?.config?.params,
      });
      throw error;
    }
  },

  // GET /api/jobs/quick-gigs
  getQuickGigs: async (params?: JobQueryParams): Promise<JobsResponse> => {
    try {
      const response = await apiClient.get<JobsResponse>('/api/jobs/quick-gigs', {
        baseURL: JOBS_BASE_URL,
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error('[jobsService] GET /api/jobs/quick-gigs FAILED:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        url: `${error?.config?.baseURL || ''}${error?.config?.url || ''}`,
        params: error?.config?.params,
      });
      throw error;
    }
  },
};