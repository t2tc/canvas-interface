
let options: [string, () => void][] = [];

function onSelected(value: string) {
    console.log(`Selected: ${value}`);
    for (const [_, fn] of options) {
        if (value === _) {
            fn();
            localStorage.setItem("case", value);
        }
    }
}

function createSelectRoot(root: HTMLDivElement) {
    const select = document.createElement("select");
    select.id = "select";
    select.onchange = () => {
        const selected = select.options[select.selectedIndex];
        if (selected) {
            onSelected(selected.value);
        }
    }
    const defualt = document.createElement("option");
    defualt.value = "";
    defualt.textContent = "Select";
    select.appendChild(defualt);
    root.appendChild(select);
    return select;
}

function getSelect() {
    return document.getElementById("select") as HTMLSelectElement;
}

function addOption(value: string, onSelected: () => void) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    getSelect().appendChild(option);
    options.push([value, onSelected]);
}

(function addRefreshListener() {
    new EventSource("/refresh").addEventListener('refresh', () => {
        location.reload();
    })
})();

const root = document.querySelector("#root") as HTMLDivElement;
createSelectRoot(root);
const testCases = await fetch("/test-cases.json").then(res => res.json()) as string[];
testCases.forEach(value => addOption((value), () => loadTest(value)));

async function loadTest(name: string) {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const module = await import(`/cases/${name}.js`);
    module.default();
};

function onWindowLoad(fn: () => void) {
    if (document.readyState === "complete") {
        fn();
    } else {
        window.addEventListener("load", fn);
    }
}

onWindowLoad(async () => {
    const caseName = localStorage.getItem("case");
    console.log("called");
    console.log(caseName);
    if (caseName) {
        queueMicrotask(() => {
            onSelected(caseName);
            getSelect().value = caseName;
        })
    }
});

export {}