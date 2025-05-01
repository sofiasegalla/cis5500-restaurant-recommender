export function parseStringArray(arr) {
    let trimmed = arr.substring(arr.indexOf('[') + 1, arr.lastIndexOf(']'));
    const regex = /'([^']+)'/g;
    let match;
    const output = [];

    while ((match = regex.exec(trimmed)) !== null) {
        output.push(match[1]);
    }

    return output;
}
