import type { ChangeEvent, FormEvent } from "react";

interface SolutionWordFormProps {
    formSubmitHandler: (solutionWord: string) => void;
    solutionWord: string;
    setSolutionWord: (newSolutionWord: string) => void;
}

/**
 * Form component to change solution word and handle submit event.
 * 
 * @param {SolutionWordFormProps} props 
 * @returns {JSX.Element}
 */
function SolutionWordForm({ formSubmitHandler, solutionWord, setSolutionWord }: SolutionWordFormProps) {
    /**
     * Handles submit event for solution word form.
     * @param {FormEvent<HTMLFormElement>} e 
     */
    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        formSubmitHandler(solutionWord);
    };

    /**
     * Handles change event for solution word form.
     * @param {ChangeEvent<HTMLInputElement>} e 
     */
    const handleSolutionWordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSolutionWord(e.target.value);
    };
    
    return (
        <form onSubmit={ handleFormSubmit }>
            <input
                name="solution-word"
                value={ solutionWord }
                onChange={ handleSolutionWordChange }
                required
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default SolutionWordForm;
