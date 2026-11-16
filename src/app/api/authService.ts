import { apiClient } from './api';
import tokenStorage from './tokenstorage';

// Add these types and methods to your authService.ts

export interface RegisterRequestPayload {
    fullName: string;
    username: string;
    email: string;
    password: string;
}

export interface VerifyOtpPayload {
    email: string;
    otp: string;
}

export interface AuthResponse {
    message: string;
    user?: {
        id: string;
        fullName: string;
        username: string;
        email: string;
        roles: string[];
        tokenBalance: number;
        isOnboardingCompleted: boolean;
    };
    accessToken?: string;
    refreshToken?: string;
}

export interface UpdateProfilePayload {
    ukCity: string;
    ukBorough: string;
    bdDistrict: string;
}

export const authService = {
    async login(payload: any): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login/login', payload);
        const { accessToken, refreshToken } = response.data;
        if (accessToken && refreshToken) {
            await tokenStorage.setTokens(accessToken, refreshToken);
        }
        return response.data;
    },

    async requestRegisterOtp(payload: RegisterRequestPayload): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register/request-otp', payload);
        return response.data;
    },

    async verifyRegisterOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register/verify', payload);
        const { accessToken, refreshToken } = response.data;

        if (accessToken && refreshToken) {
            await tokenStorage.setTokens(accessToken, refreshToken);
        }
        return response.data;
    },
    async updateProfile(payload: UpdateProfilePayload): Promise<any> {
        const token = await tokenStorage.getAccessToken();
        const response = await apiClient.patch('/auth/profile', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    async getProfile(): Promise<any> {
    const token = await tokenStorage.getAccessToken();
    const response = await apiClient.get('/auth/getprofile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  
    async logout() {
        await tokenStorage.clearTokens();
    },
};