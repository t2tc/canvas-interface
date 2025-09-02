import { Component } from './component';

type Point = [number, number];

interface EventArea {
    component: Component;
    shape: 'rect' | 'circle' | 'path';
    // 对于矩形，保存 [x, y, width, height]
    // 对于圆形，保存 [centerX, centerY, radius]
    // 对于路径，保存 SVG 路径字符串
    area: [number, number, number, number] | [number, number, number] | string;
}

type EventType = 
    | 'click'
    | 'dblclick'
    | 'mousedown'
    | 'mouseup'
    | 'mousemove'
    | 'mouseenter'
    | 'mouseleave';

type EventHandler = (e: MouseEvent) => void;

export class CanvasEventManager {
    private static instance: CanvasEventManager;
    private canvas: HTMLCanvasElement | null = null;
    private eventHandlers: Map<string, Map<EventType, EventHandler>> = new Map();
    private virtualBitmap: EventArea[] = [];
    private devicePixelRatio: number = 1;

    private constructor() {}

    static getInstance(): CanvasEventManager {
        if (!CanvasEventManager.instance) {
            CanvasEventManager.instance = new CanvasEventManager();
        }
        return CanvasEventManager.instance;
    }

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.devicePixelRatio = window.devicePixelRatio || 1;
        this.setupEventListeners();
    }

    private setupEventListeners() {
        if (!this.canvas) return;

        const handleEvent = (e: MouseEvent) => {
            const point: Point = this.getCanvasPoint(e);
            const areaId = this.findEventArea(point);
            if (areaId) {
                const handlers = this.eventHandlers.get(areaId);
                const handler = handlers?.get(e.type as EventType);
                handler?.(e);
            }
        };

        this.canvas.addEventListener('click', handleEvent);
        this.canvas.addEventListener('dblclick', handleEvent);
        this.canvas.addEventListener('mousedown', handleEvent);
        this.canvas.addEventListener('mouseup', handleEvent);
        this.canvas.addEventListener('mousemove', handleEvent);
    }

    private getCanvasPoint(e: MouseEvent): Point {
        if (!this.canvas) return [0, 0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / (rect.width * this.devicePixelRatio);
        const scaleY = this.canvas.height / (rect.height * this.devicePixelRatio);
        return [
            (e.clientX - rect.left) * scaleX,
            (e.clientY - rect.top) * scaleY
        ];
    }

    private findEventArea(point: Point): string | null {
        // 遍历虚拟位图，检查点是否在某个区域内
        for (const area of this.virtualBitmap) {
            if (!this.isPointInArea(point, area)) {
                continue;
            } else {
                return area.component.getId();
            }
        }
        return null;
    }

    private isPointInArea(point: Point, area: EventArea): boolean {
        const [x, y] = point;

        switch (area.shape) {
            case 'rect': {
                const [areaX, areaY, width, height] = area.area as [number, number, number, number];
                return x >= areaX && x <= areaX + width && 
                       y >= areaY && y <= areaY + height;
            }
            case 'circle': {
                const [centerX, centerY, radius] = area.area as [number, number, number];
                const dx = x - centerX;
                const dy = y - centerY;
                return dx * dx + dy * dy <= radius * radius;
            }
            case 'path': {
                // TODO: 实现路径的点击检测
                return false;
            }
        }
    }

    registerEventArea(component: Component, shape: EventArea['shape'], area: EventArea['area']) {
        const areaId = component.getId();
        this.virtualBitmap.push({ component, shape, area });
        if (!this.eventHandlers.has(areaId)) {
            this.eventHandlers.set(areaId, new Map());
        }
    }

    unregisterEventArea(component: Component) {
        const areaId = component.getId();
        const index = this.virtualBitmap.findIndex(area => area.component.getId() === areaId);
        if (index > -1) {
            this.virtualBitmap.splice(index, 1);
        }
        this.eventHandlers.delete(areaId);
    }

    on(component: Component, eventType: EventType, handler: EventHandler) {
        const areaId = component.getId();
        const handlers = this.eventHandlers.get(areaId);
        if (handlers) {
            handlers.set(eventType, handler);
        }
    }

    off(component: Component, eventType: EventType) {
        const areaId = component.getId();
        const handlers = this.eventHandlers.get(areaId);
        if (handlers) {
            handlers.delete(eventType);
        }
    }
}
