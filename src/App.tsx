import './App.scss';

import { Calendar } from '@progress/kendo-react-dateinputs';

import { SvgIcon } from '@progress/kendo-react-common';
import { calendarIcon } from '@progress/kendo-svg-icons';

function App() {
  return (
    <div className="App">
      <h1>
        Hello Kendo Calendar <SvgIcon icon={calendarIcon} size="xxlarge" />
      </h1>
      <Calendar />
    </div>
  );
}

export default App;
