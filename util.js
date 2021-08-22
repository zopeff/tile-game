export async function fetchRemoteResource(path){
    const response = await fetch( path )
    return await response.json();
}

Math.clamp = function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}

// Random integer between min and max
Math.randomInteger = function (min, max) {
    return Math.round((Math.random() * (max - min)) + min);
}
// Linear Interpolation
Math.lerp = function (a, b, n) {
    return a + ((b - a) * n);
}

Math.scaleVector = function (v, s) {
    v.x *= s;
    v.y *= s;
}

Math.normalizeVector = function (v) {
    var m = Math.sqrt(v.x * v.x + v.y * v.y);
    Math.scaleVector(v, 1 / m);
}