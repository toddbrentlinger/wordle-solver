import './WordleArtDesignCreator.scss';
import SolutionWordForm from './SolutionWordForm';
import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import WordleArtDesignGrid from './WordleArtDesignGrid';
import WordleArtDesignDetailed from './WordleArtDesignDetailed';
import ValidGridDesignDisplay from './ValidGridDesignDisplay';
import checkGridDesigns, { checkSingleGridDesign, isWordValid, type ValidGridDesign } from '../logic-scripts/grid-design-checker';

type GridValue = -1 | 0 | 1;

interface WordleArtDesignCreatorProps {
    solutionWord: string;
    setSolutionWord: (newSolutionWord: string) => void; 
    gridValues: GridValue[][];
    setGridValues: (newGridValues: GridValue[][]) => void;
}

/**
 * Component for User to create a grid design and check if it's valid with given solution word.
 * 
 * @param {WordleArtDesignCreatorProps} props 
 * @returns {JSX.Element}
 */
function WordleArtDesignCreator({ solutionWord, setSolutionWord, gridValues, setGridValues }: WordleArtDesignCreatorProps) {
    /** 
     * Valid design from the User created grid design. Value is null if grid 
     * design is NOT valid. 
     */
    const [validDesign, setValidDesign] = useState<ValidGridDesign | null>(null);
    
    /** Array of valid designs from all variations of the User created grid design. */
    const [validGridDesigns, setValidGridDesigns] = useState<ValidGridDesign[]>([]);

    /** Boolean flag to display modal of detailed valid grid design. */
    const [showValidDesignDetail, setShowValidDesignDetail] = useState(false);

    /** Name of User created grid design. Default value of 'Custom Design'. */
    const [designName, setDesignName] = useState('Custom Design');

    /** 
     * Last solution word used to calculate the valid grid designs. Displayed 
     * on list of results. 
     */
    const [lastWordCalculated, setLastWordCalculated] = useState('');

    /** 
     * When component first renders, calculate valid grid design from the User 
     * made grid design.
    */
    useEffect(() => {
        updateValidDesign(gridValues);
    }, []);

    /** Handles solution word from submit event. */
    const handleFormSubmit = () => {
        // Calculate and update valid grid design from the User made grid design
        updateValidDesign(gridValues);
    };

    /**
     * Handles User adding a new grid design to the library of grid designs 
     * checked in Checker component. 
     * @param {SubmitEvent} e 
     */
    const handleAddDesignFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    /**
     * Handles User changing the name of the current grid design.
     * @param {ChangeEvent<HTMLInputElement>} e 
     */
    const handleDesignNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDesignName(e.target.value);
    };

    /**
     * Toggles through possible values for a given node of the grid design.
     * @param {number} iRow 
     * @param {number} iCol 
     */
    const setGridValue = (iRow: number, iCol: number) => {
        // Deep copy 2D array of grid values
        const newGridValues = gridValues.map((gridValuesRow) => gridValuesRow.slice());

        /**
         * If node was grey, make yellow. If node was yellow, make green. if 
         * node was green, make grey.
         */
        if (newGridValues[iRow][iCol] === 0) {
            newGridValues[iRow][iCol] = -1;
        } else if (newGridValues[iRow][iCol] === -1) {
           newGridValues[iRow][iCol] = 1; 
        } else {
            newGridValues[iRow][iCol] = 0;
        }

        // Update state with new grid values
        setGridValues(newGridValues);
        
        // Checks and updates valid grid design for new grid design
        updateValidDesign(newGridValues);
    };

    /**
     * Fills the User grid design with some value.
     * @param {GridValue} fillVal 
     */
    const fillGrid = (fillVal: GridValue = 0) => {
        // Create new grid array filled with same value
        const newGridValues = gridValues
            .map((gridValuesRow) => new Array(gridValuesRow.length).fill(fillVal));

        // Update state with new grid values
        setGridValues(newGridValues);

        // Checks and updates valid grid design for new grid design
        updateValidDesign(newGridValues);
    };

    /**
     * Checks and updates valid grid design from new User defined grid values.
     * @param {number[][]} gridValues 
     */
    const updateValidDesign = (gridValues: number[][]) => {
        // If solution word is valid, check for valid grid design
        if (isWordValid(solutionWord)) {
            /** 
             * Check if User defined grid design is valid for the solution word. 
             * Value is undefined if grid design is NOT valid (no guesses for 
             * at least one row).
             */
            const validGridDesign = checkSingleGridDesign(
                solutionWord,
                {
                    name: designName,
                    grid: gridValues,
                    canMirror: true,
                },
                10
            );

            /** Find any valid grid designs for the given solution word. */
            const newValidGridDesigns = checkGridDesigns(
                solutionWord, 
                10,
                [{
                    name: designName,
                    grid: gridValues,
                    canMirror: true,
                }]
            ) || [];

            // Update array of valid grid designs for all variations of the grid design
            setValidGridDesigns(newValidGridDesigns);
            
            // Update valid grid design state (null if NO valid grid design found)
            setValidDesign((validGridDesign !== undefined) ? validGridDesign : null);
        } else { // Else solution word NOT valid
            // Set array of valid grid designs to empty array for non-valid solution word
            setValidGridDesigns([]);
            
            // Set valid grid design state to null for non-valid solution word
            setValidDesign(null);
        }

        // Update last solution word calculated 
        setLastWordCalculated(solutionWord);
    };

    /** Handles when User clicks to close modal of detailed valid grid design. */
    const handleGridDesignDetailedClose = () => {
        setShowValidDesignDetail(false);
    };

    /** Handles when User click to open modal of detailed valid grid design. */
    const handleGridDesignDetailedOpen = () => {
        setShowValidDesignDetail(true);
    };

    return (
        <main id="wordle-art-design-creator-app">
            <h1>Wordle Art Design Creator</h1>
            <SolutionWordForm 
                formSubmitHandler={handleFormSubmit} 
                solutionWord={solutionWord}
                setSolutionWord={setSolutionWord}
            />
            <article>
                <button type="button" onClick={() => fillGrid(0)}>Fill Grey</button>
                <button type="button" onClick={() => fillGrid(-1)}>Fill Yellow</button>
                <button type="button" onClick={() => fillGrid(1)}>Fill Green</button>
            </article>
            <article id="design-creator-grid-container">
                <WordleArtDesignGrid 
                    grid={gridValues}
                    handleGridDesignClick={() => {}}
                    handleGridDesignNodeClick={setGridValue}
                />
            </article>
            <form onSubmit={ handleAddDesignFormSubmit }>
                <label>
                    <span>Design Name</span>
                    <input
                        name="design-name"
                        value={ designName }
                        onChange={ handleDesignNameChange } 
                    />
                </label>
                <button type="submit">Save Custom Design</button>
            </form>
            <div>
                {
                    (validDesign !== null) 
                        ? (
                            <div>
                                { `VALID with Rarity: ${validDesign.rarity}` }
                                <button
                                    type="button"
                                    onClick={handleGridDesignDetailedOpen}
                                >
                                    Show Details
                                </button>
                            </div>
                        ) : 'NOT VALID' 
                }
            </div>
            { 
                (showValidDesignDetail && validDesign !== null) 
                    ? <WordleArtDesignDetailed 
                        { ...validDesign }
                        solutionWord={solutionWord}
                        closeHandler={handleGridDesignDetailedClose}
                    />
                    : null
            }
            <ValidGridDesignDisplay 
                validGridDesigns={ validGridDesigns }
                lastWordCalculated={ lastWordCalculated }
            />
        </main>
    );
}

export default WordleArtDesignCreator;
