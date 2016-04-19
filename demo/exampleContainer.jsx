import React from 'react';
import ReactDOM from 'react-dom';
import Example from './demo.jsx';
import Example2 from './demo2.jsx';
import Example3 from './demo3.jsx';

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
ReactDOM.render(<ExampleContainer />, container);
