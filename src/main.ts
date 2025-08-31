
interface DialogButton {
    text: string;
    type: 'primary' | 'default';
    onclick: () => void;
}

interface DialogOptions {
    title: string;
    content: string;
    pos: [number, number];
    buttons: DialogButton[];
}

interface CanvasElement {
    render(ctx: CanvasRenderingContext2D): void;
}

interface Fillable {
    fill(color: string): this;
    renderFill(ctx: CanvasRenderingContext2D): void;
}

interface Strokable {
    stroke(color: string, width?: number): this;
    renderStroke(ctx: CanvasRenderingContext2D): void;
}

interface Shadowable {
    shadow(color: string, blur?: number, offsetX?: number, offsetY?: number): this;
    renderShadow(ctx: CanvasRenderingContext2D): void;
}

abstract class Shape implements CanvasElement, Fillable, Strokable, Shadowable {
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
        ctx.restore();
    }

    protected abstract doFill(ctx: CanvasRenderingContext2D): void;
    protected abstract doStroke(ctx: CanvasRenderingContext2D): void;
}

class Rect extends Shape {
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

class Circle extends Shape {
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

class Path extends Shape {
    private path2D: Path2D;

    constructor(svgPath: string) {
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

class CanvasText implements CanvasElement {
    private color: string = '#333333';
    private fontSize: number = 12;
    private fontFamily: string = 'Arial';
    private baseline: CanvasTextBaseline = 'top';
    private align: CanvasTextAlign = 'left';

    constructor(
        private text: string,
        private x: number,
        private y: number
    ) {}

    setFont(size: number, family: string = 'Arial') {
        this.fontSize = size;
        this.fontFamily = family;
        return this;
    }

    setColor(color: string) {
        this.color = color;
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

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.textBaseline = this.baseline;
        ctx.textAlign = this.align;
        ctx.fillText(this.text, this.x, this.y);
    }
}

function draw(ctx: CanvasRenderingContext2D, ...elements: CanvasElement[]) {
    elements.forEach(element => element.render(ctx));
}

class Dialog {
    private options: DialogOptions;
    private visible: boolean = false;
    private width: number = 300;
    private height: number = 200;
    private padding: number = 20;
    private titleHeight: number = 40;
    private buttonHeight: number = 40;

    constructor(options: DialogOptions) {
        this.options = options;
    }

    private drawBackground() {
        const [x, y] = this.options.pos;
        const backgroundRect = new Rect(x, y, this.width, this.height)
            .fill("#ffffff")
            .stroke("#e0e0e0", 1)
            .shadow("rgba(0, 0, 0, 0.1)");
        draw(ctx, backgroundRect);
    }

    private drawTitle() {
        const [x, y] = this.options.pos;
        const titleBackground = new Rect(x, y, this.width, this.titleHeight).fill("#f5f5f5");
        const titleText = new CanvasText(this.options.title, x + this.padding, y + this.titleHeight / 2)
            .setFont(14)
            .setColor("#333333")
            .setBaseline("middle");
        draw(ctx, titleBackground, titleText);
    }

    private drawContent() {
        const [x, y] = this.options.pos;
        const content = new CanvasText(
            this.options.content,
            x + this.padding,
            y + this.titleHeight + this.padding
        );
        draw(ctx, content);
    }

    private drawButtons() {
        const [x, y] = this.options.pos;
        const buttonY = y + this.height - this.buttonHeight;
        const buttonWidth = 80;
        const buttonGap = 10;

        const buttonAreaBackground = new Rect(x, buttonY, this.width, this.buttonHeight).fill("#f5f5f5");
        draw(ctx, buttonAreaBackground);

        const totalWidth = this.options.buttons.length * buttonWidth + 
            (this.options.buttons.length - 1) * buttonGap;
        let buttonX = x + (this.width - totalWidth) / 2;

        this.options.buttons.forEach(button => {
            const buttonRect = new Rect(
                buttonX,
                buttonY + (this.buttonHeight - 30) / 2,
                buttonWidth,
                30
            )
                .fill(button.type === 'primary' ? '#1890ff' : '#ffffff')
                .stroke(button.type === 'primary' ? '#1890ff' : '#d9d9d9')
                .shadow("rgba(0, 0, 0, 0.1)", 2, 1, 1);

            const buttonText = new CanvasText(
                button.text,
                buttonX + buttonWidth / 2,
                buttonY + this.buttonHeight / 2
            )
                .setColor(button.type === 'primary' ? '#ffffff' : '#333333')
                .setFont(12)
                .setBaseline("middle")
                .setAlign("center");

            draw(ctx, buttonRect, buttonText);
            buttonX += buttonWidth + buttonGap;
        });
    }

    show() {
        this.visible = true;
        this.render();
    }

    hide() {
        this.visible = false;
        ctx.clearRect(...this.options.pos, this.width, this.height);
    }

    private render() {
        if (!this.visible) return;

        this.drawBackground();
        this.drawTitle();
        this.drawContent();
        this.drawButtons();
    }
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

if (window.devicePixelRatio > 1) {
    canvas.style.width = canvas.clientWidth + 'px';
    canvas.style.height = canvas.clientHeight + 'px';
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

type EventType = 'click' | 'mousemove';

type EventDispatchers = {
    [key in EventType]: ((event: Event) => void)[] | undefined;
}

const eventDispatchers: EventDispatchers = {
    click: [],
    mousemove: [],
};

function addEventDispatcher(type: EventType, callback: (event: Event) => void) {
    eventDispatchers[type]?.push(callback);
}

canvas.addEventListener('click', (event) => {
    eventDispatchers.click?.forEach(callback => callback(event));
});

canvas.addEventListener('mousemove', (event) => {
    eventDispatchers.mousemove?.forEach(callback => callback(event));
});

const DIALOG = new Dialog({
    title: 'Hello',
    content: 'This is a dialog',
    pos: [100, 100],
    buttons: [
        {
            text: 'OK',
            type: 'primary',
            onclick: () => {
                DIALOG.hide();
            }
        },
    ]
});

DIALOG.show();
