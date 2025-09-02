import { Shape } from './shape';

export class CanvasText extends Shape {
    private fontSize: number = 12;
    private fontFamily: string = 'Arial';
    private baseline: CanvasTextBaseline = 'top';
    private align: CanvasTextAlign = 'left';

    constructor(
        private text: string,
        private x: number,
        private y: number
    ) {
        super();
    }

    setFont(size: number, family: string = 'Arial') {
        this.fontSize = size;
        this.fontFamily = family;
        return this;
    }

    setBaseline(baseline: CanvasTextBaseline) {
        this.baseline = baseline;
        return this;
    }

    setAlign(align: CanvasTextAlign) {
        this.align = align;
        return this;
    }

    protected doFill(ctx: CanvasRenderingContext2D) {
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.textBaseline = this.baseline;
        ctx.textAlign = this.align;
        ctx.fillText(this.text, this.x, this.y);
    }

    protected doStroke(ctx: CanvasRenderingContext2D) {
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.textBaseline = this.baseline;
        ctx.textAlign = this.align;
        ctx.strokeText(this.text, this.x, this.y);
    }
}