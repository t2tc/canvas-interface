import { Component } from './component';
import { Rect } from './shape';
import { CanvasText } from './shape.text';
import { CanvasEventManager } from './event';

export interface ButtonOptions {
    text: string;
    type: 'primary' | 'default';
    width?: number;
    height?: number;
    onclick?: () => void;
}

export class Button extends Component {
    private width: number;
    private height: number;
    private background: Rect;

    constructor(
        private x: number,
        private y: number,
        private options: ButtonOptions
    ) {
        super();
        this.width = options.width ?? 80;
        this.height = options.height ?? 30;
        this.createChildren();
        this.setupEventHandling();
    }

    private createChildren() {
        this.background = new Rect(
            this.x,
            this.y,
            this.width,
            this.height
        )
            .setName('ButtonBackground')
            .fill(this.options.type === 'primary' ? '#1890ff' : '#ffffff')
            .stroke(this.options.type === 'primary' ? '#1890ff' : '#d9d9d9')
            .shadow("rgba(0, 0, 0, 0.1)", 2, 1, 1);

        const text = new CanvasText(
            this.options.text,
            this.x + this.width / 2,
            this.y + this.height / 2
        )
            .setName('ButtonText')
            .fill(this.options.type === 'primary' ? '#ffffff' : '#333333')
            .setFont(12)
            .setBaseline("middle")
            .setAlign("center");

        this.addChild(this.background).addChild(text);
    }

    private setupEventHandling() {
        const eventManager = CanvasEventManager.getInstance();
        console.log("setupEventHandling", eventManager);

        // 注册按钮的可点击区域
        eventManager.registerEventArea(
            this,
            'rect',
            [this.x, this.y, this.width, this.height]
        );

        // 注册点击事件处理函数
        if (this.options.onclick) {
            eventManager.on(this, 'click', () => {
                this.options.onclick?.();
            });
        }

        // 注册鼠标悬停效果
        // tl: 下面的悬停因为尚没有实现刷新机制，因而不会工作。
        eventManager.on(this, 'mouseenter', () => {
            this.background
                .fill(this.options.type === 'primary' ? '#40a9ff' : '#f5f5f5')
                .stroke(this.options.type === 'primary' ? '#40a9ff' : '#d9d9d9');
        });

        eventManager.on(this, 'mouseleave', () => {
            this.background
                .fill(this.options.type === 'primary' ? '#1890ff' : '#ffffff')
                .stroke(this.options.type === 'primary' ? '#1890ff' : '#d9d9d9');
        });
    }
}