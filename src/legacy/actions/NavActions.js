export const PATH_CHANGE = 'PATH_CHANGE';

export function reportPathChange(oldPath, newPath) {
    return {
        type: PATH_CHANGE,
        oldPath,
        newPath,
    };
}
