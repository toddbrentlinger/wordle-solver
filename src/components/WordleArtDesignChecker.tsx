import './WordleArtDesignChecker.scss';
import SolutionWordForm from './SolutionWordForm';
import checkGridDesigns, { type ValidGridDesign } from '../logic-scripts/grid-design-checker';
import ValidGridDesignDisplay from './ValidGridDesignDisplay';

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
    
    return (
        <main>
            <h1>Wordle Art Design Checker</h1>
            <SolutionWordForm 
                formSubmitHandler={ handleFormSubmit } 
                solutionWord={ solutionWord }
                setSolutionWord={ setSolutionWord }
            />
            <ValidGridDesignDisplay 
                validGridDesigns={ validGridDesigns }
                lastWordCalculated={ lastWordCalculated }
            />
        </main>
    );
}

export default WordleArtDesignChecker;
