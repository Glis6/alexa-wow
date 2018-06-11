/**
 * @param {string} text The text to clean up.
 * @returns {string} The cleaned and formatted text.
 */
export const cleanupText = (text: string): string => {
    text = text.replace(",", "").replace(".", "").replace(" ", "").toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * @param slot The slot that we're checking.
 * @returns {string[]} All strings contained in the slot.
 */
export const getSlotValuesIfValid = (slot: any): string[] => {
    if(!slot)
        return undefined;
    if(!slot.resolutions) {
        if(slot.value)
            return [slot.value];
        return undefined;
    }
    const resolutions = slot.resolutions;
    return resolutions.resolutionsPerAuthority
        .filter(request => request.status.code === "ER_SUCCESS_MATCH")
        .map(request => request.values.map(values => values.value.name).shift());
};