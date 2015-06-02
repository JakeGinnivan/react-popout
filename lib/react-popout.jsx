import React from 'react';
import assign from 'lodash.assign';
import isFunction from 'lodash.isfunction';
import reduce from 'lodash.reduce';

export default class PopoutWindow extends React.Component {
  constructor(props) {
    super(props);

    this.windowClosing = this.windowClosing.bind(this);
    this.defaultOptions = {
      toolbar: 'no',
      location: 'no',
      directories:'no',
      status: 'no',
      menubar: 'no',
      scrollbars: 'yes',
      resizable: 'yes',
      width: 500,
      height: 400,
      top: (o, w) => ((w.innerHeight - o.height) / 2) + w.screenY,
      left: (o, w) => ((w.innerWidth - o.width) / 2) + w.screenX
    };

    this.state = {
      openedWindow: null
    };
  }

  componentWillDismount() {
    this.closeWindow();
  }

  componentDidMount() {
    var win,
        container,
        api = {
          update: () => { },
          close: () => { }
        };

    var effectiveOptions = assign({ }, this.defaultOptions, this.props.options);

    var ownerWindow = this.props.window || window;
    var optionsString = reduce(effectiveOptions, (acc, opt, key) => {
      let val;
      if (isFunction(opt)) {
        val = opt(effectiveOptions, ownerWindow);
      } else {
        val = opt;
      }
      var part = key + '=' + val;
      return !acc ? part : acc + ',' + part;
    }, '');

    win = ownerWindow.open(this.props.url, this.props.title, optionsString);
    win.onbeforeunload = () => {
      if (container) {
        React.unmountComponentAtNode(container);
        this.windowClosing();
      }
    };
    var onloadHandler = () => {
      win.document.title = this.props.title;
      container = win.document.createElement('div');
      win.document.body.appendChild(container);
      React.render(this.props.children, container);
      api.update = newComponent => {
          React.render(newComponent, container);
      };
      api.close = () => win.close();
    };
    if (this.props.url) {
      win.onload = onloadHandler;
    } else {
      onloadHandler();
    }

    this.setState({ openedWindow: api });
  }

  closeWindow() {
    if (this.state.openedWindow) {
      this.state.openedWindow.close();
    }
  }

  windowClosing() {
    if (this.props.onClosing) {
      this.props.onClosing();
    }
  }

  componentDidUpdate() {
    this.state.openedWindow.update(this.props.children);
  }

  render() {
    return <div />;
  }
}

PopoutWindow.propTypes = {
  title: React.PropTypes.string.isRequired,
  url: React.PropTypes.string,
  onClosing: React.PropTypes.func,
  options: React.PropTypes.object,
  window: React.PropTypes.object
};
