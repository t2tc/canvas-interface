import { Circle } from '../shape.ts';

export default function test(canvas) {
  // 创建一个圆形
  const circle = new Circle(200, 200, 50);
  
  // 设置样式
  circle.fill('#ff6b6b');
  circle.stroke('#000', 2);
  circle.shadow('rgba(0,0,0,0.2)', 5, 3, 3);
  
  // 添加到画布
  canvas.addChild(circle);
  
  // 渲染画布
  canvas.render();
  
  console.log('Circle demo loaded');
}