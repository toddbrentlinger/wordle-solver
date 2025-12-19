import checkGridDesigns, { type ValidGridDesign } from "./grid-design-checker";
import fiveLetterWordsObj from "./five-letter-words-dict.json";

interface RarityHashMap {
    [key: string]: number | string[];
}

/**
 * Calculates 'rarity' value for each grid design. Key of hash map is the grid 
 * design name and value is either an array of solution words where the grid 
 * design is possible or a number for the total solution words where the grid 
 * design is possible.
 * 
 * @param {number} maxWordsToTrack Maximum number of solution words to store for a grid design before switching to storing number instead (Default: 10)
 * @param {number} updatePercentNotif Percent multiple that an update message is sent (Default: 5)
 * @param {function} updateMessageHandler Function handler to send an update message about the current progress (Default: console.log)
 * @returns {RarityHashMap}
 */
function calculateGridDesignRarityAll(maxWordsToTrack = 10, updatePercentNotif = 5, updateMessageHandler: (updateMessage: string) => void = console.log) {
    /** 
     * Stores either array of solution words or number of total solution words 
     * that create a specific grid design. Keys of hash map are names of the 
     * grid design. 
     */
    const hashMap: RarityHashMap = {};

    /** Array of five letter words. */
    const fiveLetterWordsArr = Object.keys(fiveLetterWordsObj);

    /** Total number of words tested. Used to calculate current progress percentage. */
    const totalWords = fiveLetterWordsArr.length;

    /** Start time of calculation. Used to calculate current progress percentage. */
    const startTime = performance.now();

    /** All valid grid designs for a given solution word. */
    let validGridDesigns: ValidGridDesign[];

    /** Next progress percentage to send update message. */
    let nextPercentNotif = updatePercentNotif;

    /** Current progress percentage of all words tested so far. */
    let currentPercent: number;

    /** Current time. Used to calculate current progress percentage. */
    let currTime: number;

    /** Estimated time left to test rest of words. */
    let timeLeftMS: number;

    /**
     * Loop through each word and find any valid grid designs. Add that 
     * solution word to each of those grid design names in the hash map, 
     * as either a value in an array or incrementing a counter value.
     */
    for (const [index, word] of fiveLetterWordsArr.entries()) {
        // Find any valid grid designs for the current solution word
        validGridDesigns = checkGridDesigns(word, 1) || [];

        // Add the solution word to each valid grid design in the hash map
        for (const validGridDesignSingle of validGridDesigns) {
            if (validGridDesignSingle.name in hashMap) {
                // If value is still array of solution words
                if (Array.isArray(hashMap[validGridDesignSingle.name])) {
                    // If array is already at max word length, change to number
                    if (hashMap[validGridDesignSingle.name].length === maxWordsToTrack) {
                        hashMap[validGridDesignSingle.name] = maxWordsToTrack + 1;
                    } else { // Else can still push values too array of solution words
                        hashMap[validGridDesignSingle.name].push(word);
                    }
                } else { // Else value is already number, increment number
                    hashMap[validGridDesignSingle.name]++;
                }
            } else { // Else grid design NOT already in hash map
                // Add first solution word to grid design as only value in array
                hashMap[validGridDesignSingle.name] = [ word ];
            }
        }

        // Current percentage of all words tested
        currentPercent = 100 * (index + 1) / totalWords;
        
        // Check if need to send update message about current progress percentage
        if (currentPercent >= nextPercentNotif) {
            currTime = performance.now();

            // Estimate time left to complete remaining words
            timeLeftMS = (currTime - startTime) * (totalWords - index - 1) / (index + 1);

            // Send message about current progress to update message handler
            updateMessageHandler(`${nextPercentNotif}% Complete. Estimated time left: ${timeLeftMS / 1000}s`);
            
            // Update next percentage value to send an update message
            nextPercentNotif += updatePercentNotif;
        }
    }

    return hashMap;
}

export default calculateGridDesignRarityAll;
