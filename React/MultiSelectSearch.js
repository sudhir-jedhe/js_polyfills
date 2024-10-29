import "./MultiSelectSearch.css";
import React, { useState } from "react";

const MultiSelectSearch = ({ options, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleSelect = (option) => {
        setSelectedOptions((prev) => {
            if (prev.includes(option)) {
                return prev.filter((item) => item !== option);
            }
            return [...prev, option];
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="multi-select-search">
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />
            <div className="options-container">
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => (
                        <div
                            key={index}
                            className={`option ${selectedOptions.includes(option) ? 'selected' : ''}`}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </div>
                    ))
                ) : (
                    <div className="no-options">No options found</div>
                )}
            </div>
            <div className="selected-options">
                {selectedOptions.length > 0 && (
                    <span>Selected: {selectedOptions.join(', ')}</span>
                )}
            </div>
        </div>
    );
};

export default MultiSelectSearch;



.multi-select-search {
    position: relative;
    width: 300px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    background: white;
}

.search-input {
    width: 100%;
    border: none;
    outline: none;
    padding: 5px;
}

.options-container {
    max-height: 150px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 5px;
    background: white;
    position: absolute;
    width: 100%;
    z-index: 100;
}

.option {
    padding: 10px;
    cursor: pointer;
}

.option:hover {
    background: #f0f0f0;
}

.selected {
    background: #007bff;
    color: white;
}

.no-options {
    padding: 10px;
    color: gray;
}

.selected-options {
    margin-top: 5px;
}
