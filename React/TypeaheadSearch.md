import "./TypeaheadSearch.css";
import "./TypeaheadSearch.css";
import React, { useEffect, useState } from "react";
import React from "react";
import React, { useEffect, useState } from "react";
import TypeaheadSearch from "./TypeaheadSearch";

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

const TypeaheadSearch = ({ apiUrl }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchOptions = async (query) => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}?search=${query}`);
            if (!response.ok) {
                throw new Error('Error fetching data');
            }
            const data = await response.json();
            setFilteredOptions(data.results); // Adjust based on API response structure
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchOptions = debounce(fetchOptions, 300);

    useEffect(() => {
        if (searchTerm) {
            debouncedFetchOptions(searchTerm);
        } else {
            setFilteredOptions([]);
        }
    }, [searchTerm]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleOptionClick = (option) => {
        setSearchTerm(option);
        setFilteredOptions([]);
    };

    return (
        <div className="typeahead-search">
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search..."
                className="search-input"
            />
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            {filteredOptions.length > 0 && (
                <div className="options-container">
                    {filteredOptions.map((option, index) => (
                        <div
                            key={index}
                            className="option"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.name} {/* Adjust based on the API response */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TypeaheadSearch;


.typeahead-search {
    position: relative;
    width: 300px;
    margin: 0 auto;
}

.search-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.options-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 4px 4px;
    background: white;
    z-index: 1000;
}

.option {
    padding: 10px;
    cursor: pointer;
}

.option:hover {
    background: #f0f0f0;
}

.loading, .error {
    padding: 10px;
    color: red;
    text-align: center;
}



const App = () => {
    const apiUrl = 'https://api.example.com/search'; // Replace with your actual API endpoint

    return (
        <div>
            <h1>Typeahead Search Example</h1>
            <TypeaheadSearch apiUrl={apiUrl} />
        </div>
    );
};

export default App;


/**************************************** */


const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

const TypeaheadSearch = ({ apiUrl }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1); // For keyboard navigation

    const fetchOptions = async (query) => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}?search=${query}`);
            if (!response.ok) {
                throw new Error('Error fetching data');
            }
            const data = await response.json();
            setFilteredOptions(data.results); // Adjust based on API response structure
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchOptions = debounce(fetchOptions, 300);

    useEffect(() => {
        if (searchTerm) {
            debouncedFetchOptions(searchTerm);
        } else {
            setFilteredOptions([]);
        }
    }, [searchTerm]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setSelectedIndex(-1); // Reset selection on new input
    };

    const handleOptionClick = (option) => {
        setSearchTerm(option.name); // Use a property for the option name
        setFilteredOptions([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setSelectedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex((prev) => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter') {
            if (selectedIndex >= 0) {
                handleOptionClick(filteredOptions[selectedIndex]);
            }
        }
    };

    return (
        <div className="typeahead-search">
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="search-input"
            />
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            {filteredOptions.length > 0 && (
                <div className="options-container">
                    {filteredOptions.map((option, index) => (
                        <div
                            key={option.id} // Assuming each option has a unique ID
                            className={`option ${selectedIndex === index ? 'highlighted' : ''}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            <div>{option.name}</div>
                            <div className="option-details">{option.details}</div> {/* More data display */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TypeaheadSearch;


.typeahead-search {
    position: relative;
    width: 300px;
    margin: 0 auto;
}

.search-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.options-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 4px 4px;
    background: white;
    z-index: 1000;
}

.option {
    padding: 10px;
    cursor: pointer;
}

.option:hover,
.option.highlighted {
    background: #f0f0f0;
}

.option-details {
    font-size: 12px;
    color: #666;
}

.loading, .error {
    padding: 10px;
    color: red;
    text-align: center;
}
