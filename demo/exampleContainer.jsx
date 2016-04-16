import React from 'react';
import ReactDOM from 'react-dom';
import domready from 'domready';
import Popout from '../lib/react-popout.jsx';
import Example2 from './demo2.jsx';
import Example from './demo.jsx';

class ExampleContainer extends React.Component {
  render() {

    return (
      <div>
        <Example />
        <hr/>
        <Example2 />
      </div>
    );
  }
}

domready(() => {
  var container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(<ExampleContainer />, container);
});
