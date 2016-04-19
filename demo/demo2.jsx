import React from 'react';
import Popout from '../lib/react-popout.jsx';

export default class Example2 extends React.Component {
  constructor(props) {
    super(props);
    this.popout = this.popout.bind(this);
    this.incrementTimer = this.incrementTimer.bind(this);
    this.popoutClosed = this.popoutClosed.bind(this);
    this.popoutContentClicked = this.popoutContentClicked.bind(this);
    this.state = { isPoppedOut: false, timer: 0 };
  }

  incrementTimer() {
    var newTimer = this.state.timer + 1;
    this.setState({ timer: newTimer});
  }

  popout() {
    this.setState({isPoppedOut: true, timerId: setInterval(this.incrementTimer, 1000)});
  }

  popoutClosed() {
    if (this.state.timerId) {
      clearInterval(this.state.timerId);
      this.setState({isPoppedOut: false, timerId: null, timer: 0});
    }
  }

  popoutContentClicked() {
    this.popoutClosed();
  }

  render() {

      return (
        <div>
          { this.state.isPoppedOut ?

          <Popout title='Test' onClosing={this.popoutClosed}>
            <div>
              <div>Popped out content! Timer: {this.state.timer}</div>
              <div onClick={this.popoutContentClicked}>Close</div>
            </div>
          </Popout> : false }
          <div>

            <strong>Example: Render popup and component <a style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }} onClick={this.popout}>(pop window out)</a></strong>
            <div>Inline content</div>
          </div>
        </div>
      );

    }
  }

