import React from 'react';

class PopoutWindow extends React.Component {
  constructor(props) {
    super(props)

    this.windowClosing = this.windowClosing.bind(this)
    this.defaultOptions = {
      toolbar: 'no',
      location: 'no',
      directories:'no',
      status: 'no',
      menubar: 'no',
      scrollbars: 'yes',
      resizable='yes',
      width: 500,
      height: 400,
      top: (height) => ((screen.height - height) / 2)
      left: (width) => ((screen.width - width) / 2))
    };

    this.state = {
      openedWindow: null
    }
    this.componentWillReceiveProps(props)
  }

  componentWillReceiveProps(nextProps) {
    if (next.show) {
      showWindow()
    } else {
      closeWindow()
    }
  }

  componentWillDismount() {
    closeWindow()
  }

  showWindow() {
    if (this.state.openedWindow || !this.props.show) { return; }

    var win,
        container,
        api = {
          update: () => { },
          close: () => { }
        };
    win = window.open(this.props.url, this.props.title, ;
    win.onbeforeunload = () => {
      if (container) {
        React.unmountComponentAtNode(container);
        if (closed) { this.windowClosing(); }
      }
    };
    win.onload = () => {
      win.document.title = title;
      container = win.document.createElement('div');
      win.document.body.appendChild(container);
      React.render(reactComponent, container);
      api.update = newComponent => {
          React.render(newComponent, container);
      };
      api.close = () => win.close();
    };

    this.setState({ openedWindow: api })
  }

  closeWindow() {
    if (this.state.openedWindow) {
      openedWindow.close();
    }
  }

  windowClosing() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    if (this.state.openedWindow) {
      this.state.openedWindow.update(this.props.children)
    }
    return <div />
  }
}

PopoutWindow.propTypes = {
  onClosing: React.PropTypes.func,
  url: React.PropTypes.string,
  show: React.PropTypes.bool,
  options: React.PropTypes.object
}
