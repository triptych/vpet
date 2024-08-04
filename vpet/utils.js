export function encodeUnicode(str) {
    return encodeURIComponent(JSON.stringify(str));
}

export function decodeUnicode(str) {
    return JSON.parse(decodeURIComponent(str));
}