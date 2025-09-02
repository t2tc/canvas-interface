import { Component } from './component';

export interface Fillable {
    fill(color: string): this;
    renderFill(ctx: CanvasRenderingContext2D): void;
}

export interface Strokable {
    stroke(color: string, width?: number): this;
    renderStroke(ctx: CanvasRenderingContext2D): void;
}

export interface Shadowable {
    shadow(color: string, blur?: number, offsetX?: number, offsetY?: number): this;
    renderShadow(ctx: CanvasRenderingContext2D): void;
}

export abstract class Shape extends Component implements Fillable, Strokable, Shadowable {
    protected fillColor: string = '';
    protected strokeColor: string = '';
    protected strokeWidth: number = 1;
    protected shadowColor: string = '';
    protected shadowBlur: number = 0;
    protected shadowOffsetX: number = 0;
    protected shadowOffsetY: number = 0;

    fill(color: string) {
        this.fillColor = color;
        return this;
    }

    stroke(color: string, width: number = 1) {
        this.strokeColor = color;
        this.strokeWidth = width;
        return this;
    }

    shadow(color: string, blur: number = 4, offsetX: number = 2, offsetY: number = 2) {
        this.shadowColor = color;
        this.shadowBlur = blur;
        this.shadowOffsetX = offsetX;
        this.shadowOffsetY = offsetY;
        return this;
    }

    renderFill(ctx: CanvasRenderingContext2D) {
        if (this.fillColor) {
            ctx.fillStyle = this.fillColor;
            this.doFill(ctx);
        }
    }

    renderStroke(ctx: CanvasRenderingContext2D) {
        if (this.strokeColor) {
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;
            this.doStroke(ctx);
        }
    }

    renderShadow(ctx: CanvasRenderingContext2D) {
        if (this.shadowColor) {
            ctx.shadowColor = this.shadowColor;
            ctx.shadowBlur = this.shadowBlur;
            ctx.shadowOffsetX = this.shadowOffsetX;
            ctx.shadowOffsetY = this.shadowOffsetY;
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        this.renderShadow(ctx);
        this.renderFill(ctx);
        this.renderStroke(ctx);
        super.render(ctx);
        ctx.restore();
    }

    protected abstract doFill(ctx: CanvasRenderingContext2D): void;
    protected abstract doStroke(ctx: CanvasRenderingContext2D): void;
}

export class Rect extends Shape {
    constructor(
        private x: number,
        private y: number,
        private width: number,
        private height: number
    ) {
        super();
    }

    protected doFill(ctx: CanvasRenderingContext2D) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    protected doStroke(ctx: CanvasRenderingContext2D) {
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

export class Circle extends Shape {
    constructor(
        private x: number,
        private y: number,
        private radius: number
    ) {
        super();
    }

    protected doFill(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    protected doStroke(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}
