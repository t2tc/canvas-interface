import { Component } from './component';

export class ComponentManager {
    private static instance: ComponentManager;
    private components: Map<string, Component> = new Map();
    private componentsByType: Map<string, Component[]> = new Map();

    private constructor() {}

    static getInstance(): ComponentManager {
        if (!ComponentManager.instance) {
            ComponentManager.instance = new ComponentManager();
        }
        return ComponentManager.instance;
    }

    /**
     * 注册组件到管理器
     */
    register(component: Component): void {
        const id = component.getId();
        const type = component.constructor.name;
        
        // 添加到主映射表
        this.components.set(id, component);
        
        // 添加到类型分组
        if (!this.componentsByType.has(type)) {
            this.componentsByType.set(type, []);
        }
        this.componentsByType.get(type)!.push(component);
    }

    /**
     * 从管理器中注销组件
     */
    unregister(component: Component): void {
        const id = component.getId();
        const type = component.constructor.name;
        
        // 从主映射表移除
        this.components.delete(id);
        
        // 从类型分组移除
        const typeComponents = this.componentsByType.get(type);
        if (typeComponents) {
            const index = typeComponents.indexOf(component);
            if (index > -1) {
                typeComponents.splice(index, 1);
            }
            // 如果该类型没有组件了，删除类型键
            if (typeComponents.length === 0) {
                this.componentsByType.delete(type);
            }
        }
    }

    /**
     * 根据 ID 查找组件
     */
    findById(id: string): Component | undefined {
        return this.components.get(id);
    }

    /**
     * 根据类型查找所有组件
     */
    findByType<T extends Component>(type: string): T[] {
        return (this.componentsByType.get(type) || []) as T[];
    }

    /**
     * 获取所有组件
     */
    getAllComponents(): Component[] {
        return Array.from(this.components.values());
    }

    /**
     * 获取组件总数
     */
    getComponentCount(): number {
        return this.components.size;
    }

    /**
     * 获取各类型组件的统计信息
     */
    getTypeStatistics(): Map<string, number> {
        const stats = new Map<string, number>();
        for (const [type, components] of this.componentsByType) {
            stats.set(type, components.length);
        }
        return stats;
    }

    /**
     * 清空所有组件
     */
    clear(): void {
        this.components.clear();
        this.componentsByType.clear();
    }

    /**
     * 调试信息
     */
    debug(): void {
        console.log('ComponentManager Debug Info:');
        console.log('Total components:', this.getComponentCount());
        console.log('Type statistics:', Object.fromEntries(this.getTypeStatistics()));
        console.log('All components:', this.getAllComponents().map(c => c.getId()));
    }
}