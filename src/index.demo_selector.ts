import { Canvas } from "./component";

const demoSelector = document.getElementById('demo-selector') as HTMLSelectElement;

function initCanvas() {
    const canvas = document.querySelector('canvas')!;
    const root = new Canvas(canvas);
    return root;
}

function loadDemo(root: Canvas, demoName: string) {
    const endpoint = `/api/demo/${demoName}`;
    import(endpoint).then((module) => {
        console.log('Demo loaded:', module);
        root.clear();
        root.ctx.clearRect(0, 0, root.canvas.width, root.canvas.height);
        const demo = module.default;
        demo(root);
    });
    demoSelector.value = demoName;
}

function initDemoSelector() {
    const endpoint = '/api/demos';
    const root = initCanvas();
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            data.forEach((demo: { name: string; path: string; }) => {
                const option = document.createElement('option');
                option.value = demo.name;
                option.textContent = demo.name;
                demoSelector.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching demos:', error));
    demoSelector.addEventListener('change', (e) => {
        const selectedDemo = demoSelector.value;
        console.log('Selected demo:', selectedDemo);
        loadDemo(root, selectedDemo);
    });
    return root;
}

export { initDemoSelector };
