import './ValidGridDesignDisplay.scss';
import WordleArtDesign from './WordleArtDesign';
import WordleArtDesignDetailed from './WordleArtDesignDetailed';
import { useState } from 'react';
import { type ValidGridDesign } from '../logic-scripts/grid-design-checker';

interface ValidGridDesignDisplayProps {
    validGridDesigns: ValidGridDesign[];
    lastWordCalculated: string;
}

/**
 * Component that displays list of valid grid designs.
 * 
 * @param {ValidGridDesignDisplayProps} props
 * @returns {JSX.Element}
 */
function ValidGridDesignDisplay({ validGridDesigns, lastWordCalculated }: ValidGridDesignDisplayProps) {
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
    
    /** Array of valid grid design components. */
    const validGridDesignComponents = validGridDesigns.map((validGridDesignSingle, designIndex) => (
        <li 
            key={ designIndex } 
            className="all-valid-grid-designs-list-item"
        >
            <div 
                className="grid-design-list-item-animation-container"
                style={{animationDelay: (designIndex * 30).toString() + "ms"}}
            >
                <WordleArtDesign 
                    { ...validGridDesignSingle }
                    onClickHandler={ handleGridDesignClick }
                />
            </div>
        </li>
    ));

    return (
        <>
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
        </>
    );
}

export default ValidGridDesignDisplay;
