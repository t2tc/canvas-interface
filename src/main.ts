
import { Canvas } from './component';
import { Dialog, DialogOptions } from './dialog';
import { CanvasEventManager } from './event';
import { ComponentManager } from './component-manager';

const canvas = document.querySelector('canvas')!;
const canvasRoot = new Canvas(canvas);
const ctx = canvas.getContext('2d')!;

// 初始化事件管理器
CanvasEventManager.getInstance().init(canvas);

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

const dialog = new Dialog(dialogOptions);
canvasRoot.addChild(dialog);
dialog.show(ctx);

console.log(dialog);
console.log(canvasRoot.toString());

const debugButtonHolder = document.getElementById('debug-button-holder')! as HTMLDivElement;

// 添加 ComponentManager 调试按钮
const componentDebugButton = document.createElement('button');
componentDebugButton.textContent = '组件管理器调试';
componentDebugButton.addEventListener('click', () => {
    ComponentManager.getInstance().debug();
});
debugButtonHolder.appendChild(componentDebugButton);

// 添加事件调试按钮
const eventDebugButton = document.createElement('button');
eventDebugButton.textContent = '事件调试';
eventDebugButton.addEventListener('click', () => {
    console.log(CanvasEventManager.getInstance());
});
debugButtonHolder.appendChild(eventDebugButton);
