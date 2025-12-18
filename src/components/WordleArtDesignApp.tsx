import './WordleArtDesignApp.scss';
import { useState } from 'react';
import WordleArtDesignChecker from './WordleArtDesignChecker';
import WordleArtDesignCreator from './WordleArtDesignCreator';
import type { ValidGridDesign, GridValue } from '../logic-scripts/grid-design-checker';

type WordleArtDesignAppState = 'checker' | 'creator';

/**
 * Component to either find valid grid designs for a given Wordle solution word 
 * or create a custom grid design to check for validity with a given Wordle 
 * solution word.
 * 
 * @returns {JSX.Element}
 */
function WordleArtDesignApp() {
    /** Current solution word in form for controlled input element. */
    const [solutionWord, setSolutionWord] = useState('');

    /** Array of valid grid designs checked for the last word calculated. */
    const [validGridDesigns, setValidGridDesigns] = useState<ValidGridDesign[]>([]);
    
    /** Last solution word used to check for valid grid designs. */
    const [lastWordCalculated, setLastWordCalculated] = useState('');
    
    /** State of design app with value of 'checker' or 'creator'. */
    const [designAppState, setDesignAppState] = useState<WordleArtDesignAppState>('checker');
    
    /** Grid values of User custom grid design. */
    const [customGridValues, setCustomGridValues] = useState<GridValue[][]>([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]);

    /**
     * Sets new state for the design app.
     * @param {WordleArtDesignAppState} newDesignAppState 
     */
    const setNewDesignAppState = function(newDesignAppState: WordleArtDesignAppState) {
        // Return if current state is already in the new state
        if (designAppState === newDesignAppState) { return; }

        setDesignAppState(newDesignAppState);
    };

    return (
        <>
            <header>
                <ul id="design-app-top-nav">
                    <li
                        className={(designAppState === 'checker') ? 'active right-curve-tab': ''}
                        onClick={() => setNewDesignAppState('checker')}
                    >Checker</li>
                    <li 
                        className={(designAppState === 'creator') ? 'active left-curve-tab': ''}
                        onClick={() => setNewDesignAppState('creator')}
                    >Creator</li>
                </ul>
            </header>
            {
                (designAppState === 'creator')
                    ? <WordleArtDesignCreator 
                        solutionWord={solutionWord}
                        setSolutionWord={setSolutionWord} 
                        gridValues={customGridValues}
                        setGridValues={setCustomGridValues}
                    />
                    : <WordleArtDesignChecker 
                        solutionWord={solutionWord}
                        setSolutionWord={setSolutionWord} 
                        validGridDesigns={validGridDesigns}
                        setValidGridDesigns={setValidGridDesigns}
                        lastWordCalculated={lastWordCalculated}
                        setLastWordCalculated={setLastWordCalculated}
                    />
            }
        </>
    );
}

export default WordleArtDesignApp;
