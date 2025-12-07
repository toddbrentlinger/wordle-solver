import './WordleArtDesignGrid.scss';

interface WordleArtDesignGridProps {
    grid: number[][];
    handleGridDesignClick: () => void;
    handleGridDesignNodeClick?: (rowIndex: number, nodeIndex: number) => void;
}

/**
 * Component that displays grid design for a Wordle game board and handles 
 * click events on whole grid as well as on each node.
 * 
 * @param {WordleArtDesignGridProps} props
 * @returns {JSX.Element}
 */
function WordleArtDesignGrid({ grid, handleGridDesignClick, handleGridDesignNodeClick = () => {} }: WordleArtDesignGridProps) {
    /** Row elements of the grid design. */
    const boardRows = grid.map((gridRow, rowIndex) => {
        /** Node elements of a single row of the grid design. */
        const gridRowNodes = gridRow.map((gridVal, nodeIndex) => {
            /** Class name of grid node to set the color of the node. */
            const boardNodeClassName = (gridVal === -1) ? 'wordle-yellow'
                : (gridVal === 0) ? 'wordle-grey' : 'wordle-green';

            return (
                <div 
                    className={ boardNodeClassName + ' board-node' }
                    onClick={() => handleGridDesignNodeClick(rowIndex, nodeIndex)}
                    key={ nodeIndex }
                ></div>
            );
        });

        return (
            <div className='board-row' key={ rowIndex }>{ gridRowNodes }</div>
        );
    });

    return (
        <div 
            className='wordle-art-design board-container'
            onClick={ handleGridDesignClick }
        >
            <div className='board'>
                { boardRows }
            </div>
        </div>
    );
}

export default WordleArtDesignGrid;
