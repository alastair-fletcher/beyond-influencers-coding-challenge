import { useState, useEffect } from 'react';
import { Influencer } from './interfaces';
import './App.css';

function App() {
  const [influencerData, setInfluencerData] = useState<Influencer[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch and set influencerData
  useEffect(() => {
    const fetchAndSetData = async () => {
      const response = await fetch('http://localhost:3000/influencers');
      const data = await response.json();
      setInfluencerData(data);
    };
    fetchAndSetData();
  }, []);

  // Only runs once influencerData has been set
  useEffect(() => {
    // Get categories from category_1 and category_2 fields
    const categoriesSet = new Set(
      influencerData.map((item) => [item.category_1, item.category_2]).flat()
    );
    // Filter out empty strings
    const categoriesArray = Array.from(categoriesSet).filter(
      (category) => category
    );
    // Set categoriesArray
    setCategories(categoriesArray);
  }, [influencerData]);

  console.log(categories);

  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}

export default App;
