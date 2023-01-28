export class Timer {
	private _tickStep: number = 100;
	private _timeLeft: number;
	private _isEnabled: boolean = false;
	private _timeout: Date;

	public constructor(init?: any) {
		this._timeLeft = init.timeLeft;
		this._isEnabled = init.isEnabled;
		if (init.timeout) this._timeout = new Date(init.timeout);
		if (this.isEnabled) this.tick();
	}

	get tickStep(): number {
		return this._tickStep;
	}

	get isEnabled(): boolean {
		return this._isEnabled;
	}

	get timeLeft(): number {
		return this.isEnabled && this._timeout
			? Math.max(this._timeout.getTime() - Date.now(), 0)
			: this._timeLeft;
	}

	public onTimeout: { (): void };

	public onTick: { (): void };

	public toString(): string {
		let delta = this.timeLeft;
		const s = 1000,
			m = s * 60,
			h = m * 60;

		const hours = Math.floor(delta / h);
		delta -= hours * h;
		const minutes = Math.floor(delta / m);
		delta -= minutes * m;
		const seconds = Math.floor(delta / s);
		delta -= seconds * s;

		if (hours != 0)
			return (
				`${hours < 10 ? "0" : ""}${hours}:` +
				`${minutes < 10 ? "0" : ""}${minutes}:` +
				`${seconds < 10 ? "0" : ""}${seconds}`
			);
		return (
			`${minutes < 10 ? "0" : ""}${minutes}:` +
			`${seconds < 10 ? "0" : ""}${seconds}`
		);
	}

	private tick(): void {
		if (this.onTick) this.onTick();
		if (this.timeLeft <= 0) {
			if (this.onTimeout) this.onTimeout();
			return;
		}
		setTimeout(() => this.tick(), this._tickStep);
	}
}
