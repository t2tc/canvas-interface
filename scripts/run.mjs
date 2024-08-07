
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import http from 'node:http';

const devTempRoot = "./devtemp";
const testCaseRoot = "./test/cases";

function removeFileExtension(file) {
    return file.replace(/\.[^/.]+$/, "");
}

let sendRefreshSignal = () => {
    console.log("Refresh signal not sent since no active connections");
};

const testCases = fs.readdirSync(testCaseRoot).map(removeFileExtension);

const ctx = await esbuild.context({
    entryPoints: [
        "test/index.html",
        "test/entry.ts",
    ],
    loader: {
        ".html": "copy",
    },
    bundle: true,
    outdir: 'devtemp',
    format: "esm",
    plugins: [
        {
            name: "rebuildLogger",
            setup(build) {
                build.onEnd(result => {
                    console.log("Server content rebuilded.");
                    sendRefreshSignal();
                });
            }
        }
    ]
})

function createTestCaseList() {
    const name = "test-cases.json";
    const path = devTempRoot + "/" + name;
    const content = JSON.stringify(testCases);
    fs.writeFileSync(path, content);
}

function buildTestUtils() {
    const name = "test_util.ts";
    const result = esbuild.transformSync(fs.readFileSync("test/test_util.ts", "utf8"), {
        loader: "ts"
    });
    fs.writeFileSync(devTempRoot + "/test_util.js", result.code);
}

async function buildLibrary() {
    const lctx = await esbuild.context({
        entryPoints: [
            "src/main.ts"
        ],
        bundle: true,
        format: "esm",
        outdir: devTempRoot,
        plugins: [
            {
                name: "rebuildLogger",
                setup(build) {
                    build.onEnd(result => {
                        console.log("Library rebuilded.");
                        ctx.rebuild();
                    })
                }
            }
        ]
    })
    lctx.watch();
}

async function buildTestCases() {
    const lctx = await esbuild.context({
        entryPoints: testCases.map(testCase => testCaseRoot + "/" + testCase + ".ts"),
        outdir: devTempRoot + "/cases",
        format: "esm",
        plugins: [
            {
                name: "rebuildLogger",
                setup(build) {
                    build.onEnd(result => {
                        console.log("Test cases rebuilded.");
                        ctx.rebuild();
                    })
                }
            }
        ]
    })
    lctx.watch();
}

await ctx.watch();

let { host, port } = await ctx.serve({
    servedir: 'devtemp/',
});

http.createServer((req, res) => {
    const options = {
        hostname: host,
        port: port,
        path: req.url,
        method: req.method,
        headers: req.headers,
    }

    if (req.url === '/refresh') {
        let id = 0;
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
        sendRefreshSignal = () => {
            console.log("Refresh signal sent");
            res.write(`event: refresh\ndata:\nid: ${id++}\n\n`);
        }
        req.on('close', () => {
            console.log("Connection closed");
        });
    } else {
        const proxyReq = http.request(options, proxyRes => {
            // If esbuild returns "not found", send a custom 404 page
            if (proxyRes.statusCode === 404) {
                res.writeHead(404, { 'Content-Type': 'text/html' })
                res.end('<h1>A custom 404 page</h1>')
                return
            }

            res.writeHead(proxyRes.statusCode, proxyRes.headers)
            proxyRes.pipe(res, { end: true })
        })

        req.pipe(proxyReq, { end: true })
    }
}).listen(port + 1, () => {
    console.log('Server started on http://localhost:' + (port + 1));
})

buildLibrary();
buildTestCases();
buildTestUtils();
createTestCaseList();
