export const firstOrNull = <T>(array: T[] | null): T | null => {
    if (array && array.length > 0) {
        return array[0];
    }
    return null;
};

export const filterNullability = <T>(arr: (T | null | undefined)[]): T[] => {
    return arr.filter((item): item is T => item !== null && item !== undefined);
};
