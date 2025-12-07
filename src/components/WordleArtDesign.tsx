import './WordleArtDesign.scss';
import WordleArtDesignGrid from './WordleArtDesignGrid';
import type { ValidGridDesign } from '../logic-scripts/grid-design-checker';

interface WordleArtDesignProps {
    name: string;
    grid: number[][];
    guesses: string[][]; 
    rarity: number; 
    colorFill: number; 
    onClickHandler: (arg0: ValidGridDesign) => void;
}

/**
 * Component to display single valid grid design and handle User click event.
 * 
 * @param {WordleArtDesignProps} props
 * @returns {JSX.Element}
 */
function WordleArtDesign({ name, grid, guesses, rarity, colorFill, onClickHandler }: WordleArtDesignProps) {
    /** Click handler function for when the grid design container is clicked. */
    const handleGridDesignClick = () => {
        onClickHandler({ name, grid, guesses, rarity, colorFill });
    };

    return (
        <div className='wordle-art-design-container'>
            <WordleArtDesignGrid 
                grid={ grid } 
                handleGridDesignClick={ handleGridDesignClick } 
            />
            <div className='design-name'>{ name }</div>
            <div className='design-rarity'>Rarity: { rarity }</div>
            <div className='design-color-filled'>Color Fill: { colorFill }%</div>
        </div>
    );
}

export default WordleArtDesign;
