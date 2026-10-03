import { createContext, type Dispatch, type SetStateAction } from "react";

export interface AppUser {
	_id?: string;
	email: string;
	firstName?: string;
	lastName?: string;
	role?: "investor" | "manager" | "admin";
	kycStatus?: "unverified" | "pending" | "verified" | "rejected";
	balance?: number;
	totalInvested?: number;
	totalReturns?: number;
	withdrawalLimit?: number;
	investorType?: string;
	targetCapital?: string;
	avatar?: string;
	jobTitle?: string;
	company?: string;
	bio?: string;
	timezone?: string;
	preferences?: Record<string, boolean>;
}

export interface AppContextValue {
	user: AppUser | null;
	loading: boolean;
	error: string | null;
	login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
	logout: () => Promise<void>;
	setError: Dispatch<SetStateAction<string | null>>;
	updateUserState: (updatedUser: Partial<AppUser>) => void;
	refetchData: () => Promise<void>;
}

export const AppContext = createContext<AppContextValue | null>(null);