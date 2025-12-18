import React from "react";

interface FooterProps {
    initialYear: number;
    sourceCodeUrl: string;
    children?: React.ReactNode;
}

/**
 * Footer component that displays copyright year and source code URL.
 * 
 * @param {FooterProps} props 
 * @returns {JSX.Element}
 */
function Footer({ initialYear, sourceCodeUrl, children }: FooterProps) {
    /**
     * Returns string of year, or year range, for the project copyright.
     * @returns {JSX.Element}
     */
    const getCopyrightString = () => {
        const currentYear = new Date().getFullYear();
        
        /**
         * If project created in current year, just display current year.
         * Else project was created some previous year, display range of years.
         */
        return (currentYear === initialYear)
            ? initialYear
            : `${initialYear}-${currentYear}`;
    };

    return (
        <footer>
            <p>
                <small>
                    <a href={ sourceCodeUrl } target="_blank" rel="noreferrer">Source Code</a> &copy; <time id="copyright-current-year">{ getCopyrightString() }</time> Todd Brentlinger, Santa Cruz, CA, USA. All Rights Reserved.
                </small>
            </p>
            { children }
        </footer>
    );
}

export default Footer;
