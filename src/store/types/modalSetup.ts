export class ModalSetup {
	public title: string;
	public content: string;
	public confirmContent: string = "Confirm";
	public cancelContent: string = "Cancel";
	public confirmOnly: boolean = false;

	public constructor(init?: Partial<any>) {
		Object.assign(this, init);
	}
}
