import './WordleArtDesignDetailed.scss';
import WordleArtDesignGrid from './WordleArtDesignGrid';
import { useRef, useState, type MouseEvent } from 'react';

interface WordleArtDesignDetailedProps {
    name: string;
    grid: number[][];
    guesses: string[][];
    rarity: number;
    colorFill: number;
    solutionWord: string;
    closeHandler: (e: MouseEvent<HTMLButtonElement> | MouseEvent<HTMLDivElement>) => void;
}

/**
 * Component to display detailed valid grid design including guesses.
 * 
 * @param {WordleArtDesignDetailedProps} props
 * @returns {JSX.Element}
 */
function WordleArtDesignDetailed({ name, grid, guesses, rarity, colorFill, solutionWord, closeHandler }: WordleArtDesignDetailedProps) {
    /** Reference to transparent background element that closes modal when clicked. */
    const backgroundCloseRef = useRef(null); 

    /** Index of highlighted guess for each row of valid grid design. */
    const [selectedGuessesIndices, setSelectedGuessesIndices] = useState(
        (new Array(guesses.length)).fill(-1)    
    );

    /**
     * Handles the User selecting a guess in a single row.
     * @param {number} iRow 
     * @param {number} iCol 
     */
    const handleGuessSelect = (iRow: number, iCol: number) => {
        /** Copy of selectedGuessesIndices */
        const newSelectedGuessesIndices = [...selectedGuessesIndices];

        // New index value is set for the chosen row
        newSelectedGuessesIndices[iRow] = iCol;

        setSelectedGuessesIndices(newSelectedGuessesIndices);
    };

    /**
     * Handles User clicking outside modal to close the modal.
     * @param {MouseEvent<HTMLDivElement>} e 
     */
    const handleCloseClick = (e: MouseEvent<HTMLDivElement>) => {
        /**
         * Call the close handler prop only if the User clicks on the 
         * background, outside the modal.
         */
        if (backgroundCloseRef.current && backgroundCloseRef.current === e.target) {
            closeHandler(e);
        }
    };

    /** Components to display each row of guesses for the grid design. */
    const guessComponents = guesses.map((guessesRow, iRow) => {
        /** Components to display a single row of guesses for the grid design. */
        const guessesNodes = guessesRow.map((guess, iGuess) => {
            return (
                <span 
                    key={ `${iRow}-${iGuess}` }
                    className={(selectedGuessesIndices[iRow] === iGuess) ? 'selected' : undefined}
                    onClick={() => handleGuessSelect(iRow, iGuess)}
                >
                    { guess }
                </span>
            );
        })

        return (
            <section 
                key={ iRow }
                className="detailed-guess-single"
            >
                <div className="detailed-guess-single-row-number">
                    { "Guess " + (iRow + 1) }
                </div>
                <div className="detailed-guess-single-row-guesses">
                    { guessesNodes }
                </div>
            </section>
        );
    });

    return (
        <div 
            id="modal-container"
            onClick={ handleCloseClick }
            ref={ backgroundCloseRef }
        >
            <div id="detailed-container">
                <button
                    type="button"
                    onClick={ closeHandler }
                >Close</button>
                <article id="detailed-header">
                    <WordleArtDesignGrid 
                        grid={ grid } 
                        handleGridDesignClick={() => {}} 
                    />
                    <div id="detailed-header-name">{ name }</div>
                    <div>Rarity: { rarity }</div>
                    <div>Color Fill: { colorFill }%</div>
                    <div>Solution: { solutionWord }</div>
                </article>
                <article id="detailed-guesses">
                    { guessComponents }
                </article>
            </div>
        </div>
    );
}

export default WordleArtDesignDetailed;
