import { useState, useEffect } from 'react';
import { Influencer } from './interfaces';
import './App.css';

function App() {
  const [influencerData, setInfluencerData] = useState<Influencer[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  //====== Fetch and set influencerData
  useEffect(() => {
    const fetchAndSetData = async () => {
      const response = await fetch('http://localhost:3000/influencers');
      const data = await response.json();
      setInfluencerData(data);
    };
    fetchAndSetData();
  }, []);

  //====== CATEGORIES - Runs once influencerData has been set
  useEffect(() => {
    // Get categories from "category_1" and "category_2" fields
    const allCategoriesSet = new Set(
      influencerData.map((item) => [item.category_1, item.category_2]).flat()
    );
    // Make array from set and filter out empty strings
    const allCategoriesArray = Array.from(allCategoriesSet).filter(
      (category) => category
    );
    // Set categories state
    setAllCategories(allCategoriesArray);
  }, [influencerData]);

  //====== COUNTRIES - Runs once influencerData has been set
  useEffect(() => {
    // Get countries from "Audience country(mostly)" field
    const countriesSet = new Set(
      influencerData.map((item) => item['Audience country(mostly)'])
    );
    // Make array from set
    const countriesArray = Array.from(countriesSet);
    // Set countries state
    setCountries(countriesArray);
  }, [influencerData]);

  //====== Functions to set state of category and country on selection
  function selectCategory(e: React.ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value;
    setSelectedCategory(category);
  }
  function selectCountry(e: React.ChangeEvent<HTMLSelectElement>) {
    const country = e.target.value;
    setSelectedCountry(country);
  }

  return (
    <div className="App">
      <h1>Influencer data</h1>
      <div className="card">
        <div>
          <span>The #1 top influencer in the </span>
          <select
            data-testid="categories"
            name="categories"
            id="categories"
            onChange={selectCategory}
            // className="select select-primary w-full"
          >
            {allCategories.map((category) => {
              return (
                <option value={category} key={category}>
                  {category}
                </option>
              );
            })}
          </select>
          <span> category is...</span>
        </div>
        <div>
          <span>The #1 top influencer in </span>
          <select
            data-testid="countries"
            name="countries"
            id="countries"
            onChange={selectCountry}
            // className="select select-primary w-full"
          >
            {countries.map((country) => {
              return (
                <option value={country} key={country}>
                  {country}
                </option>
              );
            })}
          </select>
          <span> is...</span>
        </div>
      </div>
    </div>
  );
}

export default App;
