
import getCanvas from "test_util";

export default function test() {
    const canvas = getCanvas();
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.font = "48px serif";
    ctx.fillText("Hello World", 100, 100);
}
