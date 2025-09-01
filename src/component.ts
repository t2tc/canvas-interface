export interface CanvasElement {
    render(ctx: CanvasRenderingContext2D): void;
}

export class Component implements CanvasElement {
    protected parent: Component | null = null;
    protected children: Component[] = [];
    protected name: string = 'Component';

    addChild(child: Component): this {
        child.parent = this;
        this.children.push(child);
        return this;
    }

    removeChild(child: Component): this {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            child.parent = null;
            this.children.splice(index, 1);
        }
        return this;
    }

    setName(name: string): this {
        this.name = name;
        return this;
    }

    render(ctx: CanvasRenderingContext2D): void {
        this.children.forEach(child => child.render(ctx));
    }

    toString(level: number = 0): string {
        const indent = '  '.repeat(level);
        let result = `${indent}${this.name}\n`;
        this.children.forEach(child => {
            result += child.toString(level + 1);
        });
        return result;
    }
}

export class Canvas extends Component {
    private ctx: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        super();
        this.name = 'Canvas';
        this.ctx = canvas.getContext('2d')!;

        if (window.devicePixelRatio > 1) {
            canvas.style.width = canvas.clientWidth + 'px';
            canvas.style.height = canvas.clientHeight + 'px';
            canvas.width = canvas.clientWidth * window.devicePixelRatio;
            canvas.height = canvas.clientHeight * window.devicePixelRatio;
            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render() {
        this.clear();
        this.children.forEach(child => child.render(this.ctx));
    }
}