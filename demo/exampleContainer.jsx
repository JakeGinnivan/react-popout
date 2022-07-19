import React from 'react';
import Example from './demo.jsx';
import Example2 from './demo2.jsx';
import Example3 from './demo3.jsx';
import { createRoot } from 'react-dom/client';

class ExampleContainer extends React.Component {
  render() {
    return (
      <div>
        <Example />
        <hr/>
        <Example2 />
        <hr/>
        <Example3 />
      </div>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<ExampleContainer />);
