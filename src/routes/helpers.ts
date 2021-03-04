export function isEmpty(text?: string) {
    return text === null || text.match(/^\s*$/) !== null;
}