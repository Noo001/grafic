import { MetricsChart } from './components/MetricsChart';
import { generateSampleData } from './data';
import './index.css';

function App() {
  const data = generateSampleData();

  return (
    <main className="app">
      <div className="chart-wrapper">
        <MetricsChart series={data} height={420} />
      </div>
    </main>
  );
}

export default App;
