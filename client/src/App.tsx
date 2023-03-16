import { useState, useEffect } from 'react';
import { Influencer } from './interfaces';
import './App.css';

function App() {
  const [influencerData, setInfluencerData] = useState<Influencer[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [numberOneInCategory, setNumberOneInCategory] = useState<Influencer>();
  const [countries, setCountries] = useState<string[]>([]);
  const [numberOneInCountry, setNumberOneInCountry] = useState<Influencer>();

  //====== Fetch and set influencerData
  useEffect(() => {
    const fetchAndSetData = async () => {
      const response = await fetch('http://localhost:3000/influencers');
      const data = await response.json();
      setInfluencerData(data);
    };
    fetchAndSetData();
  }, []);
  //====== Set state of all categories
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
  //====== Set state of all countries
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
  //====== Parse numbers from influencer data
  function parseNumbers(str: string) {
    if (str.slice(-1) === 'K') {
      return parseFloat(str) * 1000;
    } else str.slice(-1) === 'M';
    return parseFloat(str) * 1000000;
  }
  //====== Set state of #1 in category by followers
  function getNumberOneInCategoryByFollowers(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const category = e.target.value;
    const influencersByCategory = influencerData.filter(
      (influencer) =>
        influencer.category_1 === category || influencer.category_2 === category
    );
    const numberOneByFollowers = influencersByCategory.reduce((prev, curr) =>
      parseNumbers(prev.Followers) > parseNumbers(curr.Followers) ? prev : curr
    );
    setNumberOneInCategory(numberOneByFollowers);
  }
  //====== Set state of #1 in country by engagement average
  function getNumberOneInCountryByEngagementAverage(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const country = e.target.value;
    const influencersByCountry = influencerData.filter(
      (influencer) => influencer['Audience country(mostly)'] === country
    );
    const numberOneByEngagementAverage = influencersByCountry.reduce(
      (prev, curr) =>
        parseNumbers(prev['Engagement avg\r\n']) >
        parseNumbers(curr['Engagement avg\r\n'])
          ? prev
          : curr
    );
    setNumberOneInCountry(numberOneByEngagementAverage);
  }

  return (
    <div className="App">
      <h1>Instagram Influencer data</h1>
      <div className="card">
        {/* categories */}
        <div className="info">
          <span>
            The #1 top influencer in the{' '}
            <select
              name="categories"
              id="categories"
              onChange={getNumberOneInCategoryByFollowers}
            >
              {allCategories.map((category) => {
                return (
                  <option value={category} key={category}>
                    {category}
                  </option>
                );
              })}
            </select>{' '}
            category, ranked by number of followers, is
            <span className="influencer">
              {' '}
              {numberOneInCategory?.['Influencer insta name']}
            </span>
            , with
            <span className="influencer">
              {' '}
              {numberOneInCategory?.['Followers']}{' '}
            </span>
            followers.
          </span>
        </div>
        {/* countries */}
        <div className="info">
          <span>
            The #1 top influencer in{' '}
            <select
              name="countries"
              id="countries"
              onChange={getNumberOneInCountryByEngagementAverage}
            >
              {countries.map((country) => {
                return (
                  <option value={country} key={country}>
                    {country}
                  </option>
                );
              })}
            </select>
            , ranked by average engagement, is
            <span className="influencer">
              {' '}
              {numberOneInCountry?.['Influencer insta name']}{' '}
            </span>
            with an average engagement of
            <span className="influencer">
              {' '}
              {numberOneInCountry?.['Engagement avg\r\n']}
            </span>
            .
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
