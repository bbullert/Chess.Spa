export interface IRootState {
	x: string;
}

class RootState implements IRootState {
	x: "";
}

export const rootState = new RootState();
