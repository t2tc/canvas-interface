import { serve } from 'bun';
import { join, basename } from 'path';
import { readdir, stat } from 'fs/promises';
import index from "../index.html";

// 项目根目录
const PROJECT_ROOT = process.cwd();
// demos 目录路径
const DEMOS_DIR = join(PROJECT_ROOT, 'src', 'demos');

// 获取所有 demo 文件
async function getDemos() {
  try {
    const files = await readdir(DEMOS_DIR);
    const demoFiles: { name: string; path: string; }[] = [];
    
    for (const file of files) {
      const filePath = join(DEMOS_DIR, file);
      const fileStat = await stat(filePath);
      
      // 只处理 .ts 文件
      if (fileStat.isFile() && file.endsWith('.ts')) {
        // 移除 .ts 扩展名
        const name = basename(file, '.ts');
        demoFiles.push({
          name,
          path: `/demos/${name}`
        });
      }
    }

    return demoFiles;
  } catch (error) {
    console.error('Error scanning demos directory:', error);
    return [];
  }
}

async function bundleDemo(demoName: string) {
  const demoPath = join(DEMOS_DIR, `${demoName}.ts`);
  const result = await Bun.build({
    entrypoints: [demoPath],
    target: 'browser',
    sourcemap: 'inline',
  });
  let content = await result.outputs[0].text();
  return content;
}

async function transformSrc(srcPath: string) {
  const path = join(PROJECT_ROOT, 'src', srcPath);
  const isTypeScript = path.endsWith(".ts");
  let src = await Bun.file(path).text();
  if (isTypeScript) {
    const transpiler = new Bun.Transpiler({
      target: 'browser',
    });
    src = transpiler.transformSync(src);
  }
  return src;
}

const server = serve({
  development: true,
  routes: {
    "/": index,
    "/api/demos": async (req) => {
      let demos = await getDemos();
      return new Response(JSON.stringify(demos));
    },
    "/api/demo/:name": async (req) => {
      let demoName = req.params.name;
      let demo = await bundleDemo(demoName);
      return new Response(demo, {
        headers: {
          "Content-Type": "application/javascript",
        },
      });
    },
//   "/api/src/*": async (req) => {
//     const match = "/api/src/";
//     const url = req.url;
//     // 使用正则表达式提取 /api/src/ 后的路径部分
//     const srcPath = url.match(new RegExp(`${match}(.+)`))?.[1];
//     console.log("srcPath", srcPath);
//     return new Response("{}", {
//       headers: {
//         "Content-Type": "application/javascript",
//       },
//     });
//   },
  }
});

console.log(`Server running at http://localhost:${server.port}`);