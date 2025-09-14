import { type Canvas } from "../component";
import { ShapeConfig, createShape } from "../shape";

// 使用 JSON 配置方式创建相同的图形组合
const shapeConfig: ShapeConfig = {
    shape_type: 'ShapeGroup',
    fill: '#ff6b6b',
    stroke: '#000',
    strokeWidth: 2,
    shadow: {
        color: 'rgba(0,0,0,0.2)'
    },
    children: [
        {
            shape_type: 'Circle',
            x: 400,
            y: 200,
            radius: 30,
        },
        {
            shape_type: 'Circle',
            x: 460,
            y: 200,
            radius: 30,
        },
        {
            shape_type: 'Rect',
            x: 380,
            y: 250,
            width: 100,
            height: 20,
        }
    ]
};

export default function test(canvas: Canvas) {
    const jsonGroup = createShape(shapeConfig);
    canvas.addChild(jsonGroup);
    canvas.render();
}
/* 
// 创建一个更复杂的嵌套图形示例
const complexConfig: ShapeConfig = {
    shape_type: 'ShapeGroup',
    children: [
        {
            shape_type: 'Rect',
            x: 100,
            y: 350,
            width: 200,
            height: 100,
            fill: '#4dabf7',
            stroke: '#1864ab',
            strokeWidth: 2
        },
        {
            shape_type: 'ShapeGroup',
            fill: '#ff922b',
            shadow: {
                color: 'rgba(0,0,0,0.3)',
                blur: 5,
                offsetX: 3,
                offsetY: 3
            },
            children: [
                {
                    shape_type: 'Circle',
                    x: 150,
                    y: 400,
                    radius: 20
                },
                {
                    shape_type: 'Circle',
                    x: 250,
                    y: 400,
                    radius: 20
                }
            ]
        }
    ]
};

const complexShape = createShape(complexConfig);
canvasRoot.addChild(complexShape);
complexShape.render(ctx);

// 使用 JSON 配置创建文本
const textConfig: ShapeConfig = {
    shape_type: 'Text',
    text: '使用 JSON 配置创建的文本',
    x: 400,
    y: 350,
    fontSize: 18,
    fontFamily: 'Arial',
    baseline: 'middle',
    align: 'center',
    fill: '#333',
    stroke: '#999',
    strokeWidth: 0.5,
    shadow: {
        color: 'rgba(0,0,0,0.2)',
        blur: 2,
        offsetX: 1,
        offsetY: 1
    }
};

const textShape = createShape(textConfig);
canvasRoot.addChild(textShape);
textShape.render(ctx);

// 使用 JSON 配置创建 SVG 路径
const pathConfig: ShapeConfig = {
    shape_type: 'Path',
    svgPath: 'M150 450 L200 500 L250 450 Z',  // 简单的三角形路径
    fill: '#4c6ef5',
    stroke: '#364fc7',
    strokeWidth: 2,
    shadow: {
        color: 'rgba(0,0,0,0.3)',
        blur: 3
    }
};

const pathShape = createShape(pathConfig);
canvasRoot.addChild(pathShape);
pathShape.render(ctx);

// 创建一个包含文本和路径的组合
const mixedGroupConfig: ShapeConfig = {
    shape_type: 'ShapeGroup',
    children: [
        {
            shape_type: 'Path',
            svgPath: 'M350 450 C350 430, 400 430, 400 450 S450 470, 450 450 Z',  // 波浪形路径
            fill: '#20c997'
        },
        {
            shape_type: 'Text',
            text: '组合示例',
            x: 400,
            y: 480,
            fontSize: 14,
            align: 'center',
            fill: '#087f5b'
        }
    ],
    stroke: '#000',
    strokeWidth: 1
};

const mixedGroup = createShape(mixedGroupConfig);
canvasRoot.addChild(mixedGroup);
mixedGroup.render(ctx);
 */