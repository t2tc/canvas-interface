import { Component } from './component';
import { Rect } from './shape';
import { CanvasText } from './text';

export interface DialogButton {
    text: string;
    type: 'primary' | 'default';
    onclick: () => void;
}

export interface DialogOptions {
    title: string;
    content: string;
    pos: [number, number];
    buttons: DialogButton[];
}

export class Dialog extends Component {
    private visible: boolean = false;
    private width: number = 300;
    private height: number = 200;
    private padding: number = 20;
    private titleHeight: number = 40;
    private buttonHeight: number = 40;

    constructor(private options: DialogOptions) {
        super();
        this.name = 'Dialog';
        this.createChildren();
    }

    private createChildren() {
        const [x, y] = this.options.pos;

        // 背景
        const background = new Rect(x, y, this.width, this.height)
            .setName('Background')
            .fill("#ffffff")
            .stroke("#e0e0e0", 1)
            .shadow("rgba(0, 0, 0, 0.1)");
        this.addChild(background);

        // 标题区域
        const titleBackground = new Rect(x, y, this.width, this.titleHeight)
            .setName('TitleBackground')
            .fill("#f5f5f5");
        const titleText = new CanvasText(
            this.options.title,
            x + this.padding,
            y + this.titleHeight / 2
        )
            .setName('TitleText')
            .setFont(14)
            .fill("#333333")
            .setBaseline("middle");
        this.addChild(titleBackground).addChild(titleText);

        // 内容
        const content = new CanvasText(
            this.options.content,
            x + this.padding,
            y + this.titleHeight + this.padding
        )
            .setName('Content')
            .fill("#333333");
        this.addChild(content);

        // 按钮区域
        const buttonY = y + this.height - this.buttonHeight;
        const buttonWidth = 80;
        const buttonGap = 10;

        const buttonAreaBackground = new Rect(x, buttonY, this.width, this.buttonHeight)
            .setName('ButtonAreaBackground')
            .fill("#f5f5f5");
        this.addChild(buttonAreaBackground);

        const totalWidth = this.options.buttons.length * buttonWidth + 
            (this.options.buttons.length - 1) * buttonGap;
        let buttonX = x + (this.width - totalWidth) / 2;

        this.options.buttons.forEach((button, index) => {
            const buttonContainer = new Component().setName(`Button${index}`);

            const buttonRect = new Rect(
                buttonX,
                buttonY + (this.buttonHeight - 30) / 2,
                buttonWidth,
                30
            )
                .setName('ButtonBackground')
                .fill(button.type === 'primary' ? '#1890ff' : '#ffffff')
                .stroke(button.type === 'primary' ? '#1890ff' : '#d9d9d9')
                .shadow("rgba(0, 0, 0, 0.1)", 2, 1, 1);

            const buttonText = new CanvasText(
                button.text,
                buttonX + buttonWidth / 2,
                buttonY + this.buttonHeight / 2
            )
                .setName('ButtonText')
                .fill(button.type === 'primary' ? '#ffffff' : '#333333')
                .setFont(12)
                .setBaseline("middle")
                .setAlign("center");

            buttonContainer.addChild(buttonRect).addChild(buttonText);
            this.addChild(buttonContainer);
            buttonX += buttonWidth + buttonGap;
        });
    }

    show(ctx: CanvasRenderingContext2D) {
        this.visible = true;
        this.render(ctx);
    }

    hide(ctx: CanvasRenderingContext2D) {
        this.visible = false;
        const [x, y] = this.options.pos;
        ctx.clearRect(x, y, this.width, this.height);
    }

    render(ctx: CanvasRenderingContext2D) {
        if (!this.visible) return;
        super.render(ctx);
    }
}