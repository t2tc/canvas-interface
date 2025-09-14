import { type Canvas } from '../component.ts';
import { Rect } from '../shape.ts';

export default function test(canvas: Canvas) {
  // 创建一个矩形
  const rect = new Rect(150, 150, 100, 80);
  
  // 设置样式
  rect.fill('#4ecdc4');
  rect.stroke('#292f36', 2);
  rect.shadow('rgba(0,0,0,0.2)', 5, 3, 3);
  
  // 添加到画布
  canvas.addChild(rect);
  
  // 渲染画布
  canvas.render();
  
  console.log('Rectangle demo loaded');
}