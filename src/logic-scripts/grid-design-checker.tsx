import gridDesignsDefault from "./grid-designs-default.json";
import fiveLetterWordsObj from "./five-letter-words-dict.json";
import gridDesignRarity from "./grid-design-rarity.json";

/**
 * TODO: Refactor script into singleton.
 */

export type GridValue = -1 | 0 | 1;

interface GridDesign {
    name: string;
    canMirror: boolean;
    grid: number[][];
}

interface SolutionWordObj {
    [key: string]: number[];
}

interface SolutionWordLetterCount {
    [key: string]: number;
}

export interface ValidGridDesign {
    name: string;
    grid: number[][];
    guesses: string[][];
    rarity: number;
    difficulty: number;
    colorFill: number;
}

interface GuessesHashMap {
    [key: string]: string[];
}

// Array of five letter words
const fiveLetterWordsArr: string[] = Object.keys(fiveLetterWordsObj);

/**
 * Returns true if a 5-letter word is found in valid list of 5-letter words, else returns false.
 * @param {string} word 
 * @returns {boolean}
 */
function isWordValid(word: string): boolean {
    return word in fiveLetterWordsObj;
}

/**
 * Returns true if a proposed grid design is possible to achieve in Wordle, else returns false.
 * @param {GridDesign} gridDesign 
 * @returns {boolean}
 */
function isGridDesignValid(gridDesign: GridDesign): boolean {
    /**
     * GridDesign is valid if only one row of all Green AND the that all Green 
     * row is last row in design (NO later rows OR all later rows are entirely 
     * Grey).
     */

    /** Holds last index of all green row. Value is -1 if no all green row found yet.  */
    let allGreenIndex = -1;

    // Check that each row of design is valid
    for (let i = 0; i < gridDesign.grid.length; i++) {
        // If previous row already all Green AND current row has any non-Grey, design NOT valid
        if ((allGreenIndex !== -1) && !gridDesign.grid[i].every((gridVal) => gridVal === 0)) {
            return false;
        }

        // If current row is all green
        if (gridDesign.grid[i].every((gridVal) => gridVal === 1)) {
            allGreenIndex = i;
        }
    }

    return true;
}

/**
 * Calculates the 'rarity' value of a grid design as the percentage of all 
 * solution words that make the grid design possible.
 * @param {string} name 
 * @returns {number}
 */
function getGridDesignRarity(name: string) {
    // Return -1 if name passed as argument is NOT present in the rarity hash map
    if (!(name in gridDesignRarity)) {
        return -1;
    }

    // If rarity hash map value is array, use array length to calculate percentage
    if (Array.isArray(gridDesignRarity[name])) {
        return Math.round(100 * gridDesignRarity[name].length / fiveLetterWordsArr.length)
    }

    // If reach here, rarity hash map value is number. Use it to calculate percentage
    return Math.round(100 * gridDesignRarity[name] / fiveLetterWordsArr.length);
}

/**
 * Calculates the 'difficulty' value of a grid design and the number of guesses for each row.
 * @param {GridDesign} gridDesign 
 * @param {string[][]} guesses 
 * @param {number} maxWords 
 * @returns {number}
 */
function calculateValidGridDesignDifficulty(gridDesign: GridDesign, guesses: string[][], maxWords: number): number {
    /**
     * All Grey rows and all Green rows have lowest difficulty. The most valid 
     * guesses result from all Grey rows. All Green rows are just the 
     * solution word. These rows have a difficulty of 0.
     * All other rows will have a mix of colors and the number of valid guesses 
     * will be between 1 and maxWords.
     * If one row has (maxWords - 1) guesses, add value of 1 to difficulty.
     * If one row has only 1 guess, and is not all Green, add value of 
     * (maxWords - 1) difficulty.
     * 
     * Ignore repeated rows. List of words should only add to difficulty once.
     */

    /** 
     * Difficulty value of the grid design. Higher value, more difficult 
     * design for the solution word. 
     */
    let difficulty: number = 0;

    // Calculate difficulty, row-by-row
    for (let iRow = 0; iRow < gridDesign.grid.length; iRow++) {
        // Skip row if all Grey or Green
        if (gridDesign.grid[iRow].every((gridVal) => gridVal === 0)
            || gridDesign.grid[iRow].every((gridVal) => gridVal === 1)
        ) {
            continue;
        }

        // If reach here, row has mix of Grey, Yellow, and Green

        // Check if current row is identical to previous row, skip difficulty for that row
        let isRowCopy: boolean = false;
        prevRowLoop: for (let iPrevRow = 0; iPrevRow < iRow; iPrevRow++) {
            for (let iNode = 0; iNode < gridDesign.grid[iRow].length; iNode++) {
                // If any node in this row is not the same, skip checking rest of row
                if (gridDesign.grid[iPrevRow][iNode] !== gridDesign.grid[iRow][iNode]) {
                    continue prevRowLoop;
                }
            }

            // Will only reach here if iPrevRow is identical to current tested row
            isRowCopy = true;

            // No longer need to check any more rows for duplication
            break;
        }

        /**
         * If current row is a copy, skip adding to total difficulty level. It was 
         * already accounted for.
         */
        if (isRowCopy) { continue; } 

        // Use number of guesses for this row to add to difficulty value
        difficulty += maxWords - guesses[iRow].length;
    }

    return difficulty;
}

/**
 * Creates new grid design with certain color values swapped. Returns undefined 
 * if grid design is not valid.
 * @param {GridDesign} gridDesign 
 * @param {GridValue} newYellowVal 
 * @param {GridValue} newGreyVal 
 * @param {GridValue} newGreenVal 
 * @returns {GridDesign|undefined}
 */
function swapGridDesignValues(gridDesign: GridDesign, newYellowVal: GridValue, newGreyVal: GridValue, newGreenVal: GridValue): GridDesign | undefined {
    // Check new grid value arguments are all different
    if ((newYellowVal === newGreyVal) || (newGreyVal === newGreenVal) || (newYellowVal === newGreenVal)) {
        return;
    }

    // Deep copy grid design object
    const newGridDesign = {
        name: gridDesign.name + ' ' + (newYellowVal + 1).toString() + (newGreyVal + 1).toString() + (newGreenVal + 1).toString(),
        canMirror: gridDesign.canMirror,
        grid: gridDesign.grid.map(gridDesignRow => gridDesignRow.slice()),
    };
    
    // Set new value for each grid node
    for (const gridDesignRow of newGridDesign.grid) {
        for (let i = 0; i < gridDesignRow.length; i++) {
            if (gridDesignRow[i] === -1) {
                gridDesignRow[i] = newYellowVal;
            } else if (gridDesignRow[i] === 0) {
                gridDesignRow[i] = newGreyVal;
            } else {
                gridDesignRow[i] = newGreenVal;
            }
        }
    }
    
    // Check that new grid design is valid
    if (!isGridDesignValid(newGridDesign)) { return; }

    // If reach here, new grid design is valid
    return newGridDesign;
}

/**
 * Creates new grid design with color values flipped horizontally.
 * @param {GridDesign} gridDesign 
 * @returns {GridDesign}
 */
function flipGridDesignHorizontally(gridDesign: GridDesign): GridDesign {
    // Deep copy grid design object
    const newGridDesign = {
        name: gridDesign.name + ' (Mirror)',
        canMirror: true,
        grid: gridDesign.grid.map(gridDesignRow => gridDesignRow.slice()),
    };

    /**
     * Swap values in just the first-two and last-two indices. Middle index 
     * remains unchanged.
     */

    /** Temporary variable used to swap two grid node values. */
    let tempNodeVal: number;

    for (const gridDesignRow of newGridDesign.grid) {
        for (let i = 0; (2 * i + 1) < gridDesignRow.length; i++) {
            tempNodeVal = gridDesignRow[i];
            gridDesignRow[i] = gridDesignRow[gridDesignRow.length - i - 1];
            gridDesignRow[gridDesignRow.length - i - 1] = tempNodeVal;
        }
    }

    // If reach here, new grid design is valid
    return newGridDesign;
}

/**
 * Returns true if grid design is horizontally symmetric. Else returns false.
 * @param {GridDesign} gridDesign
 * @returns {boolean}
 */
function isGridDesignHorizontallySymmetric(gridDesign: GridDesign): boolean {
    /**
     * If first and last nodes have different values, or second and second-to-last 
     * nodes have different values, the row cannot be symmetric and whole grid 
     * design cannot be symmetric. Return false if any node is found to be not 
     * symmetric.
     */
    for (const row of gridDesign.grid) {
        for (let i = 0; (2 * i + 1) < row.length; i++) {
            if (row[i] !== row[row.length - i - 1]) {
                return false;
            }
        }
    }

    // If reach here, every row is symmetric individually. Whole grid design is symmetric.
    return true;
}

/**
 * Returns array of every variation of a base grid design. A grid design can 
 * have each of their color values swapped and can also be mirrored by flipping 
 * along the horizontal direction.
 * @param {GridDesign} gridDesign 
 * @returns {GridDesign[]}
 */
function getAllGridDesignVarations(gridDesign: GridDesign): GridDesign[] {
    /**
     * Array of all variations of the base grid design. Initialize with just 
     * the base grid design.
     */
    const gridDesignVariations: GridDesign[] = [ gridDesign ];

    /** 
     * Arguments to pass to function to swap a single color out of the possible 
     * 6 color sequence possibilities. 
     * 
     * Six possible combinations to check if valid for given word:
     * 1 yellow grey green (-1, 0, 1) default
     * 2 yellow green grey (-1, 1, 0)
     * 3 grey yellow green (0, -1, 1)
     * 4 grey green yellow (0, 1, -1)
     * 5 green yellow grey (1, -1, 0)
     * 6 green grey yellow (1, 0, -1)
     */
    const swapArgumentValues: [GridValue, GridValue, GridValue][] = [
        [-1, 1, 0],
        [0, -1, 1],
        [0, 1, -1],
        [1, -1, 0],
        [1, 0, -1]
    ];

    // Add color swaps of base design

    /** Holds new variation of a grid design or undefined if not a valid grid design. */
    let currentGridDesign: GridDesign | undefined;

    // Add any valid grid design variations after swapping each color
    swapArgumentValues.forEach((singleSwapArgumentValues: [GridValue, GridValue, GridValue]) => {
        // Create grid design with swapped colors. Add to variations array if it's valid.
        currentGridDesign = swapGridDesignValues(gridDesign, ...singleSwapArgumentValues);
        if (currentGridDesign) {
            gridDesignVariations.push(currentGridDesign);
        }
    });

    // Mirror along vertical axis (Horizontal Mirror)
    if (gridDesign.canMirror && !isGridDesignHorizontallySymmetric(gridDesign)) {
        const designGridFlippedHorizontally: GridDesign = flipGridDesignHorizontally(gridDesign);
        gridDesignVariations.push(designGridFlippedHorizontally);
        
        /**
         * Create a grid design with swapped colors of mirrored grid design. 
         * Add to variations array if it's valid.
         */
        swapArgumentValues.forEach((singleSwapArgumentValues: [GridValue, GridValue, GridValue]) => {
            currentGridDesign = swapGridDesignValues(designGridFlippedHorizontally, ...singleSwapArgumentValues);
            if (currentGridDesign) {
                gridDesignVariations.push(currentGridDesign);
            }
        });
    }

    return gridDesignVariations;
}

/**
 * Returns array of all valid grid designs for the solution word. 
 * Returns undefined if solution word argument is not valid word.
 * @param {string} solutionWord 
 * @param {number} maxWords 
 * @param {GridDesign[]} gridDesignArr
 * @returns {ValidGridDesign[]|undefined}
 */
function checkGridDesigns(solutionWord: string, maxWords: number = 10, gridDesignarr: GridDesign[] = gridDesignsDefault): ValidGridDesign[] | undefined {
    // Check that solutionWord is valid
    if (!isWordValid(solutionWord)) { return; }

    /** Array of valid grid designs to be returned */
    const validGridDesignArr: ValidGridDesign[] = [];

    /** Hash map to hold array of guesses for previously calculated grid design rows. */
    const guessesHashMap: GuessesHashMap = {};

    /** 
     * Temporary variable to hold a valid grid design to be added to array or 
     * equal to undefined when grid design was not valid.
     */
    let validGridDesign: ValidGridDesign | undefined;
    
    for (const gridDesignObj of gridDesignarr) {
        // Check all variations of each grid design
        getAllGridDesignVarations(gridDesignObj).forEach((gridDesignVersion) => {
            // If current variation is NOT valid, skip
            if (gridDesignVersion !== undefined) {
                // Check if current grid design can be valid with solution word
                validGridDesign = checkSingleGridDesign(
                    solutionWord, 
                    gridDesignVersion,
                    maxWords,
                    guessesHashMap
                );

                // Push valid grid design to array. Skip if undefined (not valid).
                if (validGridDesign !== undefined) {
                    validGridDesignArr.push(validGridDesign);
                }
            }
        });
    }

    // Sort valid grid designs by rarity value primarily and color fill secondarily 
    validGridDesignArr.sort((a, b) => {
        if (a.rarity === b.rarity) {
            return b.colorFill - a.colorFill;
        }
        return a.rarity - b.rarity;
    });

    return validGridDesignArr;
}

/**
 * Returns valid grid design given solution word and base grid design. 
 * Returns undefined if solution is not valid grid design.
 * @param {string} solutionWord 
 * @param {GridDesign} gridDesignObj 
 * @param {number} maxWords 
 * @param {GuessesHashMap} guessesHashMap
 * @returns {ValidGridDesign|undefined}
 */
function checkSingleGridDesign(solutionWord: string, gridDesignObj: GridDesign, maxWords: number, guessesHashMap: GuessesHashMap = {}): ValidGridDesign | undefined {
    /** Object to hold letters and their indices in solution word. */
    const solutionWordObj: SolutionWordObj = {};

    /**
     * Create object for solution where keys are letter in word and value is 
     * array of indices where that letter is present in the word. 
     */
    solutionWord.split('').forEach((char, index) => {
        // If letter already key in solution word object, push index to existing array
        if (char in solutionWordObj) {
            solutionWordObj[char].push(index);
        } else { // Else add letter as key and index in array as it's value
            solutionWordObj[char] = [ index ];
        }
    });
    
    /** Words to guess for each row of grid design. */
    const guesses: string[][] = [];

    /** Holds guesses for current grid design row being tested. */
    let validWordsArr: string[];

    /** Number of grey nodes in grid design. Used to calculate color fill percentage. */
    let numGreyNodes: number = 0;

    /** Key for hash map of guesses for previously calculated grid design rows. */
    let hashMapKey: string;

    // Find possible guesses for each row of grid design 
    for (const gridDesignRow of gridDesignObj.grid) {
        hashMapKey = gridDesignRow
            .reduce((accum, curr) => accum + (curr + 1).toString(), '');

        // If guesses array already found for this grid design row
        if (hashMapKey in guessesHashMap) {
            // Use guesses array already in hash map
            validWordsArr = guessesHashMap[hashMapKey];
        } else { // Else new grid design row
            // Get array of valid guesses for the current row of grid design
            validWordsArr = checkSingleGridDesignRow(solutionWordObj, gridDesignRow, maxWords);

            // Add guesses array to hash map
            guessesHashMap[hashMapKey] = validWordsArr;
        }

        // If NO valid words found (empty word array), grid design NOT possible. Return undefined
        if (validWordsArr.length === 0) {
            return;
        }

        // If reach here, found guesses for the current row. 
        
        // Find number of grey nodes to help calculate color fill percentage
        numGreyNodes += gridDesignRow.reduce((accum, curr) => {
            if (curr === 0) { return accum + 1; }
            return accum;
        }, 0);
        
        // Add guesses for row.
        guesses.push(validWordsArr);
    }

    /** Percent of all 5-letter words that can create the grid design if it was the solution word. */
    const rarity: number = getGridDesignRarity(gridDesignObj.name);

    /** Higher difficulty number equals less number of guesses to create the grid design. */
    const difficulty: number = calculateValidGridDesignDifficulty(gridDesignObj, guesses, maxWords);

    /** Calculate color fill percentage using number of grey nodes. */
    const colorFill = Math.round(
        100 - 100 * (numGreyNodes / (gridDesignObj.grid.length * gridDesignObj.grid[0].length))
    );
    
    return { 
        ...gridDesignObj, 
        guesses, 
        rarity,
        difficulty,
        colorFill,
    };
}

/**
 * Returns array of guesses to complete a single row of a grid design.
 * @param {SolutionWordObj} solutionWordObj 
 * @param {number[]} gridDesignRow 
 * @param {number} maxWords 
 * @returns {string[]}
 */
function checkSingleGridDesignRow(solutionWordObj: SolutionWordObj, gridDesignRow: number[], maxWords: number = 1): string[] {
    /** Array of valid words that produce the grid design row. */
    const validWordsArr: string[] = [];
    
    /** Holds solution word letter counts. Key is letter and value is that letter count. */
    const solutionLetterCount: SolutionWordLetterCount = {};
    
    /**
     * Variable to hold copy of solutionLetterCount with letter counts that can 
     * change when testing each word.
     */
    let solutionLetterCountShallowCopy: SolutionWordLetterCount;
    
    /** Array of indices where a possible yellow grid node will be produced. */
    let possibleYellowIndices: number[];

    // Fill solutionLetterCount with letters and those letter counts in solution word
    for (const [key, value] of Object.entries(solutionWordObj)) {
        solutionLetterCount[key] = value.length;
    }
    
    // Loop through every 5-letter word to find maxWords amount of valid guesses
    wordLoop: for (const word of fiveLetterWordsArr) {
        // Start with copy of solution letter counts to be decremented through the current word
        solutionLetterCountShallowCopy = { ...solutionLetterCount };

        // Initialize possible yellow indices array with empty array through the current word
        possibleYellowIndices = [];

        /**
         * For each letter in word, test if each produce the same color in the 
         * grid design row. Possible yellow indices are tracked separately since 
         * they need to be checked after every green letter is found first.
         */
        for (let i = 0; i < word.length; i++) {
            // If letter is key in solutionWordObj (letter present in solution). Yellow or Green.
            if (word[i] in solutionWordObj) {
                // If letter is in same index as solution word, should be Green
                if (solutionWordObj[word[i]].includes(i)) {
                    // If grid design value at i-index is NOT Green, word is NOT valid
                    if (!(gridDesignRow[i] === 1)) {
                        continue wordLoop;
                    }

                    // If reach here, grid design value at i-index is Green
                    solutionLetterCountShallowCopy[word[i]]--;
                }
                // Else letter is in different index than solution word, could be Yellow
                else {
                    possibleYellowIndices.push(i);
                }
            }
            // Else letter is NOT key in solutionObj (letter NOT present in solution). Grey.
            else {
                // If i-index NOT grey in gridDesignRow, word is NOT valid. Skip rest of word.
                if (gridDesignRow[i] !== 0) {
                    continue wordLoop;
                }
            }
        }

        // Check possible yellow letter indices
        for (const possibleYellowIndex of possibleYellowIndices) {
            // If letter at possibleYellowIndex has nonzero count, letter is Yellow
            if (solutionLetterCountShallowCopy[word[possibleYellowIndex]] > 0) {
                // If possibleYellowIndex NOT yellow in gridDesignRow, word is NOT valid. Skip rest of word.
                if (gridDesignRow[possibleYellowIndex] !== -1) {
                    continue wordLoop;
                }

                // Decrement count of letter
                solutionLetterCountShallowCopy[word[possibleYellowIndex]]--;
            }
            // Else letter at possibleYellowIndex has zero count, letter is Grey, NOT Yellow
            else {
                // If possibleYellowIndex NOT Grey in gridDesignRow, word is NOT valid. Skip rest of word.
                if (gridDesignRow[possibleYellowIndex] !== 0) {
                    continue wordLoop;
                }
            }
        }
        
        // If reach here, current word is valid. Add valid word AND decrement max word counter.
        validWordsArr.push(word);
        maxWords--;

        // Stop checking words if max valid words have been found
        if (maxWords === 0) {
            break;
        }
    }
    
    return validWordsArr;
}

export { isWordValid, checkSingleGridDesign, };
export default checkGridDesigns;
