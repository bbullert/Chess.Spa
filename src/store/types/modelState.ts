export class ModelState {
	public errors: any = {};

	constructor(errors?: any) {
		if (!errors) return;
		for (let x of errors) {
			let name = x.name.charAt(0).toLowerCase() + x.name.slice(1);
			this.errors[name] = x.messages;
		}
	}

	getErrors(key: string): string[] {
		return this.errors[key];
	}

	getError(key: string): string | null {
		const errors = this.getErrors(key);
		return errors !== undefined && errors.length > 0 ? errors[0] : null;
	}

	hasErrors(key: string): boolean {
		return this.errors[key] === undefined;
	}

	isValid(): boolean {
		for (let x in this.errors) {
			if (this.errors[x] !== undefined) return false;
		}
		return true;
	}
}
