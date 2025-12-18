import './App.scss';
import WordleArtDesignApp from './components/WordleArtDesignApp';
import Footer from './components/Footer';

/**
 * Component for main app of wordle-solver project.
 * 
 * @returns {JSX.Element}
 */
function App() {
    return (
        <>
            <WordleArtDesignApp />
            <Footer 
                initialYear={ 2025 }
                sourceCodeUrl={ 'https://github.com/toddbrentlinger/wordle-solver' }
            ></Footer>
        </>
    )
}

export default App
