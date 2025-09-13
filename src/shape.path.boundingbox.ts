
// tl: canvas 并没有提供一个方法使我们能恰好获得路径的边界框，所以将会需要一点计算。然而，
// 我们并不始终需要找到最小的边界框。对于包含二次或者三次贝塞尔曲线的路径，我们只是把控制点
// 包含在边界框内。

// tl: 也许我们并不真的需要 bbox 🤔

type Path2DCommandMoveTo = {
    type: 'moveTo',
    x: number,
    y: number,
}

type Path2DCommandLineTo = {
    type: 'lineTo',
    x: number,
    y: number,
}

type Path2DCommandQuadraticCurveTo = {
    type: 'quadraticCurveTo',
    cp1x: number,
    cp1y: number,
    x: number,
    y: number,
}

type Path2DCommandBezierCurveTo = {
    type: 'bezierCurveTo',
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number,
}

type Path2DCommandArcTo = {
    type: 'arcTo',
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    radius: number,
}

type Path2DCommandClosePath = {
    type: 'closePath',
}

type Path2DCommand =
    | Path2DCommandMoveTo
    | Path2DCommandLineTo
    | Path2DCommandQuadraticCurveTo
    | Path2DCommandBezierCurveTo
    | Path2DCommandArcTo
    | Path2DCommandClosePath

function parsePath2D(path2D: string): Path2DCommand[] {
    const commands: Path2DCommand[] = [];
    const tokens = path2D.match(/[a-zA-Z][^a-zA-Z]*/g) || [];

    let currentX = 0;
    let currentY = 0;

    for (const token of tokens) {
        const command = token[0];
        const args = token.slice(1).trim().split(/[\s,]+/).map(Number);

        switch (command) {
            case 'M': // moveTo (absolute)
                currentX = args[0];
                currentY = args[1];
                commands.push({
                    type: 'moveTo',
                    x: currentX,
                    y: currentY,
                });
                break;

            case 'm': // moveTo (relative)
                currentX += args[0];
                currentY += args[1];
                commands.push({
                    type: 'moveTo',
                    x: currentX,
                    y: currentY,
                });
                break;

            case 'L': // lineTo (absolute)
                currentX = args[0];
                currentY = args[1];
                commands.push({
                    type: 'lineTo',
                    x: currentX,
                    y: currentY,
                });
                break;

            case 'l': // lineTo (relative)
                currentX += args[0];
                currentY += args[1];
                commands.push({
                    type: 'lineTo',
                    x: currentX,
                    y: currentY,
                });
                break;

            case 'Q': // quadraticCurveTo (absolute)
                commands.push({
                    type: 'quadraticCurveTo',
                    cp1x: args[0],
                    cp1y: args[1],
                    x: args[2],
                    y: args[3],
                });
                currentX = args[2];
                currentY = args[3];
                break;

            case 'q': // quadraticCurveTo (relative)
                commands.push({
                    type: 'quadraticCurveTo',
                    cp1x: currentX + args[0],
                    cp1y: currentY + args[1],
                    x: currentX + args[2],
                    y: currentY + args[3],
                });
                currentX += args[2];
                currentY += args[3];
                break;

            case 'C': // bezierCurveTo (absolute)
                commands.push({
                    type: 'bezierCurveTo',
                    cp1x: args[0],
                    cp1y: args[1],
                    cp2x: args[2],
                    cp2y: args[3],
                    x: args[4],
                    y: args[5],
                });
                currentX = args[4];
                currentY = args[5];
                break;

            case 'c': // bezierCurveTo (relative)
                commands.push({
                    type: 'bezierCurveTo',
                    cp1x: currentX + args[0],
                    cp1y: currentY + args[1],
                    cp2x: currentX + args[2],
                    cp2y: currentY + args[3],
                    x: currentX + args[4],
                    y: currentY + args[5],
                });
                currentX += args[4];
                currentY += args[5];
                break;

            case 'A': // arcTo (absolute)
                commands.push({
                    type: 'arcTo',
                    x1: args[0],
                    y1: args[1],
                    x2: args[2],
                    y2: args[3],
                    radius: args[4],
                });
                currentX = args[2];
                currentY = args[3];
                break;

            case 'Z': // closePath
            case 'z':
                commands.push({ type: 'closePath' });
                break;
        }
    }

    return commands;
}

function getPathBoundingBox(path2D: string): DOMRect {
    const commands = parsePath2D(path2D);
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    let startX = 0;
    let startY = 0;

    for (const command of commands) {
        switch (command.type) {
            case 'moveTo':
            case 'lineTo':
                minX = Math.min(minX, command.x);
                minY = Math.min(minY, command.y);
                maxX = Math.max(maxX, command.x);
                maxY = Math.max(maxY, command.y);
                if (command.type === 'moveTo') {
                    startX = command.x;
                    startY = command.y;
                }
                break;

            case 'quadraticCurveTo':
                minX = Math.min(minX, command.cp1x, command.x);
                minY = Math.min(minY, command.cp1y, command.y);
                maxX = Math.max(maxX, command.cp1x, command.x);
                maxY = Math.max(maxY, command.cp1y, command.y);
                break;

            case 'bezierCurveTo':
                minX = Math.min(minX, command.cp1x, command.cp2x, command.x);
                minY = Math.min(minY, command.cp1y, command.cp2y, command.y);
                maxX = Math.max(maxX, command.cp1x, command.cp2x, command.x);
                maxY = Math.max(maxY, command.cp1y, command.cp2y, command.y);
                break;

            case 'arcTo':
                minX = Math.min(minX, command.x1, command.x2);
                minY = Math.min(minY, command.y1, command.y2);
                maxX = Math.max(maxX, command.x1, command.x2);
                maxY = Math.max(maxY, command.y1, command.y2);
                break;

            case 'closePath':
                minX = Math.min(minX, startX);
                minY = Math.min(minY, startY);
                maxX = Math.max(maxX, startX);
                maxY = Math.max(maxY, startY);
                break;
        }
    }

    return new DOMRect(
        minX === Number.POSITIVE_INFINITY ? 0 : minX,
        minY === Number.POSITIVE_INFINITY ? 0 : minY,
        maxX === Number.NEGATIVE_INFINITY ? 0 : maxX - minX,
        maxY === Number.NEGATIVE_INFINITY ? 0 : maxY - minY
    );
}

function getPathBoundingBoxPercise(path2D: string) {
    // TODO(tl): 精确计算路径的边界框
    console.error('getPathBoundingBoxPercise not implemented.');
    return getPathBoundingBox(path2D);
}

export {
    getPathBoundingBox,
    getPathBoundingBoxPercise,
}