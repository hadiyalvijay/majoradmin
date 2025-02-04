import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import SellerDashboard from './Dashboard/SellerDashboard';

function App() {
  const [dataUpdated, setDataUpdated] = useState(false);

  // Function to trigger re-render without refreshing
  const refreshDashboard = () => {
    setDataUpdated(prev => !prev); // Toggle state to force re-render
  };

  return (
    <>
      <SellerDashboard refreshDashboard={refreshDashboard} dataUpdated={dataUpdated} />
    </>
  );
}

export default App;
