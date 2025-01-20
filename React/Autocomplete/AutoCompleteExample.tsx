"use client"

import React from 'react';
import AutoComplete from './AutoComplete';

const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew'];
const groupedFruits = {
  'Citrus': ['Lemon', 'Lime', 'Orange', 'Grapefruit'],
  'Berries': ['Strawberry', 'Blueberry', 'Raspberry', 'Blackberry'],
  'Tropical': ['Mango', 'Pineapple', 'Papaya', 'Coconut']
};
const diacriticItems = ['café', 'resume', 'façade', 'naïve', 'piñata', 'jalapeño', 'über', 'déjà vu'];
const longList = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);

export default function AutoCompleteExample() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">AutoComplete Examples</h1>
      
      <h2 className="text-xl font-semibold mt-4 mb-2">Basic AutoComplete</h2>
      <AutoComplete items={fruits} />
      
      <h2 className="text-xl font-semibold mt-4 mb-2">Grouped AutoComplete</h2>
      <AutoComplete items={groupedFruits} grouped={true} />
      
      <h2 className="text-xl font-semibold mt-4 mb-2">AutoComplete with Autofill</h2>
      <AutoComplete items={fruits} autofill={true} />
      
      <h2 className="text-xl font-semibold mt-4 mb-2">Case-Insensitive AutoComplete</h2>
      <AutoComplete items={fruits} caseSensitive={false} />
      
      <h2 className="text-xl font-semibold mt-4 mb-2">Contains Filter AutoComplete</h2>
      <AutoComplete items={fruits} filterType="contains" />

      <h2 className="text-xl font-semibold mt-4 mb-2">Ends With Filter AutoComplete</h2>
      <AutoComplete items={fruits} filterType="endsWith" />

      <h2 className="text-xl font-semibold mt-4 mb-2">Diacritic-Sensitive AutoComplete</h2>
      <AutoComplete items={diacriticItems} diacriticSensitive={true} />

      <h2 className="text-xl font-semibold mt-4 mb-2">Diacritic-Insensitive AutoComplete</h2>
      <AutoComplete items={diacriticItems} diacriticSensitive={false} />

      <h2 className="text-xl font-semibold mt-4 mb-2">AutoComplete with Max Suggestions (5)</h2>
      <AutoComplete items={longList} maxSuggestions={5} />

      <h2 className="text-xl font-semibold mt-4 mb-2">AutoComplete with Min Filter Length (3)</h2>
      <AutoComplete items={fruits} minFilterLength={3} />

      <h2 className="text-xl font-semibold mt-4 mb-2">Custom Placeholder AutoComplete</h2>
      <AutoComplete items={fruits} placeholder="Search for a fruit..." />
    </div>
  );
}

