import { MetricsChart } from './components/MetricsChart';
import { generateSampleData } from './data';
import './index.css';

function App() {
  return (
    <main className="app">
      <div className="chart-wrapper">
        <MetricsChart series={generateSampleData()} height={420} />
      </div>
    </main>
  );
}

export default App;
