import './WordleArtDesignChecker.scss';
import WordleArtDesign from './WordleArtDesign';
import SolutionWordForm from './SolutionWordForm';
import { useState } from 'react';
import checkGridDesigns, { type ValidGridDesign } from '../logic-scripts/grid-design-checker';
import WordleArtDesignDetailed from './WordleArtDesignDetailed';

interface WordleArtDesignCheckerProps {
    solutionWord: string;
    setSolutionWord: (newSolutionWord: string) => void;
    validGridDesigns: ValidGridDesign[];
    setValidGridDesigns: (newValidGridDesigns: ValidGridDesign[]) => void; 
    lastWordCalculated: string;
    setLastWordCalculated: (newLastWordCalculated: string) => void;
}

/**
 * Component to check what grid designs are valid with given solution word.
 * 
 * @param {WordleArtDesignCheckerProps} props 
 * @returns {JSX.Element}
 */
function WordleArtDesignChecker({
    solutionWord, setSolutionWord, 
    validGridDesigns, setValidGridDesigns, 
    lastWordCalculated, setLastWordCalculated
}: WordleArtDesignCheckerProps) {
    /** Currently selected grid design to display in detail. Nothing displayed if null. */
    const [selectedGridDesign, setSelectedGridDesign] = useState<ValidGridDesign | null>(null);

    /**
     * Handles when User clicks on grid design to see more details.
     * @param {ValidGridDesign | null} validGridDesign 
     */
    const handleGridDesignClick = (validGridDesign: ValidGridDesign | null) => {
        setSelectedGridDesign(validGridDesign);
        
        console.log(validGridDesign);
    };

    /** Handles when User closes detailed modal for currently selected grid design. */
    const handleGridDesignDetailedClose = () => {
        setSelectedGridDesign(null);
    };

    /**
     * Handles form submit event for new solution word.
     * @param {string} solutionWord 
     */
    const handleFormSubmit = (solutionWord: string) => {
        /** Find any valid grid designs for the given solution word. */
        const newValidGridDesigns = checkGridDesigns(solutionWord) || [];

        setValidGridDesigns(newValidGridDesigns);
        setLastWordCalculated(solutionWord);
        
        console.log(newValidGridDesigns);
    };

    /** Array of valid grid design components. */
    const validGridDesignComponents = validGridDesigns.map((validGridDesignSingle, designIndex) => (
        <li key={ designIndex } className="all-valid-grid-designs-list-item">
            <WordleArtDesign 
                { ...validGridDesignSingle }
                onClickHandler={ handleGridDesignClick }
            />
        </li>
    ));
    
    return (
        <main>
            <h1>Wordle Art Design Checker</h1>
            <SolutionWordForm 
                formSubmitHandler={ handleFormSubmit } 
                solutionWord={ solutionWord }
                setSolutionWord={ setSolutionWord }
            />
            <div id="last-word-calculated">{ 
                lastWordCalculated 
                    ? `Showing ${ validGridDesigns.length } results for solution: ${ lastWordCalculated }`
                    : null
            }</div>
            <ul id="all-valid-grid-designs">
                { validGridDesignComponents }
            </ul>
            { 
                (selectedGridDesign !== null) 
                    ? <WordleArtDesignDetailed 
                        { ...selectedGridDesign }
                        solutionWord={ lastWordCalculated }
                        closeHandler={ handleGridDesignDetailedClose }
                    />
                    : null
            }
        </main>
    );
}

export default WordleArtDesignChecker;
