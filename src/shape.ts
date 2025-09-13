import { CanvasText } from './shape.text';
import { Path } from './shape.path';
import { Shape, Fillable, Strokable, Shadowable } from './shape.base';

// 定义 ShapeConfig 接口及其子类型
export type ShapeType = 'Rect' | 'Circle' | 'ShapeGroup' | 'Text' | 'Path';

// 重新导出 Shape 类和相关接口
export { Shape, Fillable, Strokable, Shadowable };

export interface BaseShapeConfig {
    shape_type: ShapeType;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    shadow?: {
        color: string;
        blur?: number;
        offsetX?: number;
        offsetY?: number;
    };
    children?: ShapeConfig[];
}

export interface RectConfig extends BaseShapeConfig {
    shape_type: 'Rect';
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface CircleConfig extends BaseShapeConfig {
    shape_type: 'Circle';
    x: number;
    y: number;
    radius: number;
}

export interface ShapeGroupConfig extends BaseShapeConfig {
    shape_type: 'ShapeGroup';
}

export interface TextConfig extends BaseShapeConfig {
    shape_type: 'Text';
    text: string;
    x: number;
    y: number;
    fontSize?: number;
    fontFamily?: string;
    baseline?: CanvasTextBaseline;
    align?: CanvasTextAlign;
}

export interface PathConfig extends BaseShapeConfig {
    shape_type: 'Path';
    svgPath: string;
}

export type ShapeConfig = RectConfig | CircleConfig | ShapeGroupConfig | TextConfig | PathConfig;

export class ShapeGroup extends Shape {
    private shapes: Shape[] = [];

    constructor(...shapes: Shape[]) {
        super();
        shapes.forEach(shape => this.addShape(shape));
    }

    addShape(shape: Shape): this {
        this.shapes.push(shape);
        return this;
    }

    removeShape(shape: Shape): this {
        const index = this.shapes.indexOf(shape);
        if (index !== -1) {
            this.shapes.splice(index, 1);
        }
        return this;
    }

    protected doFill(ctx: CanvasRenderingContext2D): void {
        this.shapes.forEach(shape => {
            if (this.fillColor) {
                shape.fill(this.fillColor);
            }
            shape.renderFill(ctx);
        });
    }

    protected doStroke(ctx: CanvasRenderingContext2D): void {
        this.shapes.forEach(shape => {
            if (this.strokeColor) {
                shape.stroke(this.strokeColor, this.strokeWidth);
            }
            shape.renderStroke(ctx);
        });
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        this.renderShadow(ctx);
        // 不调用 renderFill 和 renderStroke，因为我们需要为每个形状单独设置样式
        this.shapes.forEach(shape => {
            if (this.fillColor) {
                shape.fill(this.fillColor);
            }
            if (this.strokeColor) {
                shape.stroke(this.strokeColor, this.strokeWidth);
            }
            if (this.shadowColor) {
                shape.shadow(
                    this.shadowColor,
                    this.shadowBlur,
                    this.shadowOffsetX,
                    this.shadowOffsetY
                );
            }
            shape.render(ctx);
        });
        ctx.restore();
    }
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

/**
 * 根据配置创建形状
 * @param config 形状配置
 * @returns 创建的形状实例
 */
export function createShape(config: ShapeConfig): Shape {
    let shape: Shape;
    
    // 根据形状类型创建相应的实例
    switch (config.shape_type) {
        case 'Rect':
            shape = new Rect(config.x, config.y, config.width, config.height);
            break;
        case 'Circle':
            shape = new Circle(config.x, config.y, config.radius);
            break;
        case 'ShapeGroup':
            shape = new ShapeGroup();
            break;
        case 'Text':
            const textConfig = config as TextConfig;
            shape = new CanvasText(textConfig.text, textConfig.x, textConfig.y);
            
            // 设置文本特有的属性
            if (textConfig.fontSize || textConfig.fontFamily) {
                (shape as CanvasText).setFont(
                    textConfig.fontSize || 12, 
                    textConfig.fontFamily || 'Arial'
                );
            }
            
            if (textConfig.baseline) {
                (shape as CanvasText).setBaseline(textConfig.baseline);
            }
            
            if (textConfig.align) {
                (shape as CanvasText).setAlign(textConfig.align);
            }
            break;
        case 'Path':
            const pathConfig = config as PathConfig;
            shape = new Path(pathConfig.svgPath);
            break;
        default:
            throw new Error(`不支持的形状类型: ${(config as any).shape_type}`);
    }
    
    // 应用样式
    if (config.fill) {
        shape.fill(config.fill);
    }
    
    if (config.stroke) {
        shape.stroke(config.stroke, config.strokeWidth);
    }
    
    if (config.shadow) {
        shape.shadow(
            config.shadow.color,
            config.shadow.blur,
            config.shadow.offsetX,
            config.shadow.offsetY
        );
    }
    
    // 处理子形状（如果有）
    if (config.children && config.children.length > 0) {
        if (config.shape_type === 'ShapeGroup') {
            const group = shape as ShapeGroup;
            config.children.forEach(childConfig => {
                const childShape = createShape(childConfig);
                group.addShape(childShape);
            });
        } else {
            console.warn('子形状只能添加到 ShapeGroup 中，其他形状的 children 属性将被忽略');
        }
    }
    
    return shape;
}
