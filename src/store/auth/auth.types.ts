export interface IAuthState {
	id: string;
	userName?: string | null;
	email?: string | null;
	role?: string | null;
	authToken?: string | null;
	isPersistent: boolean;
	isAuthenticated: boolean;
}

export class AuthState implements IAuthState {
	id: "";
	userName: "";
	email: "";
	role: "";
	authToken: "";
	isPersistent: false;
	isAuthenticated: false;
}

export const authState = new AuthState();
