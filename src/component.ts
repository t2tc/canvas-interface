import { ComponentManager } from './component-manager';

export interface CanvasElement {
    render(ctx: CanvasRenderingContext2D): void;
}

export class Component implements CanvasElement {
    private static componentCounters: Map<string, number> = new Map();
    protected parent: Component | null = null;
    protected children: Component[] = [];
    protected id: string;
    protected name: string | null = null;

    constructor() {
        const componentType = this.constructor.name;
        const currentCount = Component.componentCounters.get(componentType) || 0;
        Component.componentCounters.set(componentType, currentCount + 1);
        this.id = `${componentType}#${currentCount + 1}`;
        
        // 自动注册到 ComponentManager
        ComponentManager.getInstance().register(this);
    }

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

    /**
     * 销毁组件，从管理器中注销并清理资源
     */
    destroy(): void {
        // 先销毁所有子组件
        this.children.forEach(child => child.destroy());
        this.children = [];
        
        // 从父组件中移除
        if (this.parent) {
            this.parent.removeChild(this);
        }
        
        // 从管理器中注销
        ComponentManager.getInstance().unregister(this);
    }

    setName(name: string): this {
        this.name = name;
        return this;
    }

    getId(): string {
        return this.id;
    }

    render(ctx: CanvasRenderingContext2D): void {
        this.children.forEach(child => child.render(ctx));
    }

    toString(level: number = 0): string {
        const indent = '  '.repeat(level);
        let result = `${indent}${this.id} ${this.name ?? ""}\n`;
        this.children.forEach(child => {
            result += child.toString(level + 1);
        });
        return result;
    }
}

export class Canvas extends Component {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas = canvas;
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