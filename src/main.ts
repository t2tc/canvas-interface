
import { Canvas } from './component';
import { Dialog, DialogOptions } from './dialog';

type EventType = 'click' | 'mousemove';
type EventDispatcher = (e: MouseEvent) => void;
type EventDispatchers = Record<EventType, EventDispatcher[]>;

const canvas = document.querySelector('canvas')!;
const canvasRoot = new Canvas(canvas);
const ctx = canvas.getContext('2d')!;

const dialogOptions: DialogOptions = {
    title: '提示',
    content: '这是一个对话框示例',
    pos: [100, 100],
    buttons: [
        {
            text: '取消',
            type: 'default',
            onclick: () => console.log('取消')
        },
        {
            text: '确定',
            type: 'primary',
            onclick: () => console.log('确定')
        }
    ]
};

const dialog = new Dialog(dialogOptions);
canvasRoot.addChild(dialog);
dialog.show(ctx);

console.log(dialog);
console.log(canvasRoot);
