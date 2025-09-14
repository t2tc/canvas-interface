import { initDemoSelector } from './index.demo_selector';
initDemoSelector();

const debugBar = document.querySelector("#debug-button-holder")! as HTMLDivElement;

const refreshButton = (() => {
    const button = document.createElement('button');
    const icon = document.createElement('span');
    icon.textContent = '⟳';
    icon.style.fontSize = '16px';
    button.appendChild(icon);
    debugBar.appendChild(button);
    button.addEventListener('click', () => {
    })
    return button;
})();

const componentDebugButton = (() => {
    const button = document.createElement('button');
    button.textContent = '组件管理器调试';
    debugBar.appendChild(button);
    return button;
})();
