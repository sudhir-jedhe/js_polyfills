"use client"

import React, { useState, useRef, useEffect } from 'react';
import { removeDiacritics, highlightMatch } from './utils/stringUtils';

interface AutoCompleteProps {
  items: string[] | { [group: string]: string[] };
  placeholder?: string;
  maxSuggestions?: number;
  filterType?: 'startsWith' | 'endsWith' | 'contains';
  caseSensitive?: boolean;
  diacriticSensitive?: boolean;
  minFilterLength?: number;
  autofill?: boolean;
  grouped?: boolean;
}

export default function AutoComplete({
  items,
  placeholder = 'Type to search...',
  maxSuggestions = 10,
  filterType = 'startsWith',
  caseSensitive = false,
  diacriticSensitive = false,
  minFilterLength = 1,
  autofill = false,
  grouped = false,
}: AutoCompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filterItems = (query: string): string[] => {
    if (query.length < minFilterLength) return [];

    let allItems: string[] = grouped 
      ? Object.values(items as { [group: string]: string[] }).flat() 
      : items as string[];

    let filteredItems = allItems.filter(item => {
      let itemToCheck = caseSensitive ? item : item.toLowerCase();
      let queryToCheck = caseSensitive ? query : query.toLowerCase();

      if (!diacriticSensitive) {
        itemToCheck = removeDiacritics(itemToCheck);
        queryToCheck = removeDiacritics(queryToCheck);
      }

      switch (filterType) {
        case 'startsWith':
          return itemToCheck.startsWith(queryToCheck);
        case 'endsWith':
          return itemToCheck.endsWith(queryToCheck);
        case 'contains':
        default:
          return itemToCheck.includes(queryToCheck);
      }
    });

    return filteredItems.slice(0, maxSuggestions);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSuggestions(filterItems(value));
    setFocusedIndex(-1);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      setInputValue(suggestions[focusedIndex]);
      setSuggestions([]);
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (autofill && suggestions.length > 0 && inputValue) {
      const match = suggestions[0];
      if (match.toLowerCase().startsWith(inputValue.toLowerCase())) {
        inputRef.current!.value = inputValue + match.slice(inputValue.length);
        inputRef.current!.setSelectionRange(inputValue.length, match.length);
      }
    }
  }, [suggestions, inputValue, autofill]);

  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;

    if (grouped) {
      const groupedItems = items as { [group: string]: string[] };
      return (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
          {Object.entries(groupedItems).map(([group, groupItems]) => {
            const filteredGroupItems = groupItems.filter(item => suggestions.includes(item));
            if (filteredGroupItems.length === 0) return null;
            return (
              <li key={group} className="p-2">
                <div className="font-bold text-sm text-gray-700">{group}</div>
                <ul>
                  {filteredGroupItems.map((item, index) => (
                    <li
                      key={item}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${
                        suggestions.indexOf(item) === focusedIndex ? 'bg-gray-200' : ''
                      }`}
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {highlightMatch(item, inputValue)}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      );
    } else {
      return (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                index === focusedIndex ? 'bg-gray-200' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {highlightMatch(suggestion, inputValue)}
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        aria-activedescendant={focusedIndex >= 0 ? `suggestion-${focusedIndex}` : undefined}
      />
      {renderSuggestions()}
    </div>
  );
}

