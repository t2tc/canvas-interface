import { Shape } from './shape.base';

class Path extends Shape {
    private path2D: Path2D;

    constructor(svgPath: string, svgViewBox: [number, number, number, number], size: [number, number]) {
        super();
        this.path2D = new Path2D(svgPath);
    }

    protected doFill(ctx: CanvasRenderingContext2D) {
        ctx.fill(this.path2D);
    }

    protected doStroke(ctx: CanvasRenderingContext2D) {
        ctx.stroke(this.path2D);
    }
}

export {
    Path,
}