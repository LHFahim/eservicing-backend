export const moveItemToIndex = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
    const element = array[fromIndex];
    array.splice(fromIndex, 1);
    array.splice(toIndex, 0, element);
    return array;
};
