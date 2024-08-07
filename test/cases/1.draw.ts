import getCanvas from "test_util";
import { Circle, draw, group, Path, Rect, RRect } from "canvas_interface";

const shape1 = group(
    new Rect(100, 100).placedAt(0, 0).fill({
        type: 'linear',
        x0: 0,
        y0: 0,
        x1: 100,
        y1: 100,
        colorStops: [[0, 'red'], [1, 'blue']],
    }).stroke({
        lineWidth: 2,
        color: 'green'
    }),
    new Circle(20).placedAt(100, 100).fill('red'),
    new Circle(40).placedAt(200, 100).fill('blue'),
    new Circle(50).placedAt(200, 200).fill('yellow'),
    new Circle(20).placedAt(100, 300).fill('green').stroke({
        lineWidth: 10,
        color: 'black'
    }),
    new RRect(20, 30, 5).placedAt(10, 10).fill('black'),
    new Path("M 0 0 L 100 200 L 200 100 Z").fill('black').placedAt(100, 300),
).shadow({
    x: 10,
    y: 10,
    blur: 8,
    color: 'red'
});

export default function test() {
    draw(getCanvas()!.getContext("2d"), shape1);
}
