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

// Returns true if point P inside the triangle with vertices at A, B and C
// representing 2D vectors and points as [x,y]. Based on                        
// http://www.blackpawn.com/texts/pointinpoly/default.html
Math.pointInTriangle = function(P, A, B, C) {
    // Compute vectors        
    function vec(from, to) {  return [to[0] - from[0], to[1] - from[1]];  }
    function dot(u, v) {  return u[0] * v[0] + u[1] * v[1];  }
        
    var v0 = vec(A, C);
    var v1 = vec(A, B);
    var v2 = vec(A, P);
    // Compute dot products
    
    var dot00 = dot(v0, v0);
    var dot01 = dot(v0, v1);
    var dot02 = dot(v0, v2);
    var dot11 = dot(v1, v1);
    var dot12 = dot(v1, v2);
    // Compute barycentric coordinates
    var invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
    var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    // Check if point is in triangle
    return (u >= 0) && (v >= 0) && (u + v < 1);
}