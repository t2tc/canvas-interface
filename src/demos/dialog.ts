import { Canvas } from '../component';
import { Dialog, DialogOptions } from '../dialog';
import { CanvasEventManager } from '../event';

const dialogOptions: DialogOptions = {
    title: '提示',
    content: '这是一个对话框示例',
    pos: [100, 100],
    buttons: [
        {
            text: '取消',
            type: 'default',
            onclick: () => alert('取消')
        },
        {
            text: '确定',
            type: 'primary',
            onclick: () => alert('确定')
        }, {
            text: '取消',
            type: 'default',
            onclick: () => alert('取消')
        }
    ]
};

export default function test(canvas: Canvas) {
    const eventManager = CanvasEventManager.getInstance();
    eventManager.init(canvas.canvas);
    const dialog = new Dialog(dialogOptions);
    canvas.addChild(dialog);
    canvas.render();
}
