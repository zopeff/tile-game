export function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}

export async function fetchRemoteResource(path){
    const response = await fetch( path )
    return await response.json();
}
