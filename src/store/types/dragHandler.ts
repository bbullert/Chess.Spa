export class DragHandler {
	element: any;
	position: any;
	offset: any;

	constructor() {
		this.release();
	}

	isDrag(): boolean {
		return this.element != null;
	}

	release(): void {
		this.element = null;
		this.position = { x: 0, y: 0 };
		this.offset = { x: 0, y: 0 };
	}
}
