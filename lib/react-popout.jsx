import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const DEFAULT_OPTIONS = {
  toolbar: 'no',
  location: 'no',
  directories: 'no',
  status: 'no',
  menubar: 'no',
  scrollbars: 'yes',
  resizable: 'yes',
  width: 500,
  height: 400,
  top: (o, w) => ((w.innerHeight - o.height) / 2) + w.screenY,
  left: (o, w) => ((w.innerWidth - o.width) / 2) + w.screenX
};

/**
 * @class PopoutWindow
 */
export default class PopoutWindow extends React.Component {

  static defaultProps = {
    url: 'about:blank',
    containerId: 'popout-content-container'
  };

  /**
   * @type {{title: *, url: *, onClosing: *, options: *, window: *, containerId: *}}
   */
  static propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string,
    onClosing: PropTypes.func,
    options: PropTypes.object,
    window: PropTypes.object,
    containerId: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
  };

  /**
   * @constructs PopoutWindow
   * @param props
   */
  constructor(props) {
    super(props);

    this.mainWindowClosed = this.mainWindowClosed.bind(this);
    this.popoutWindowUnloading = this.popoutWindowUnloading.bind(this);
    this.popoutWindowLoaded = this.popoutWindowLoaded.bind(this);

    this.state = {
      openedWindowComponent: null,
      popoutWindow: null,
      container: null
    };
  }

  createOptions(ownerWindow) {
    const mergedOptions = Object.assign({}, DEFAULT_OPTIONS, this.props.options);

    return Object.keys(mergedOptions).map(key => key + '=' + (
        typeof mergedOptions[key] === 'function' ?
          mergedOptions[key].call(this, mergedOptions, ownerWindow) :
          mergedOptions[key]
      )
    ).join(',');
  };

  componentDidMount() {
    const ownerWindow = this.props.window || window;

    // May not exist if server-side rendering
    if (ownerWindow) {
      this.openPopoutWindow(ownerWindow);

      // Close any open popouts when page unloads/refreshes
      ownerWindow.addEventListener('unload', this.mainWindowClosed);
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.title !== this.props.title && this.state.popoutWindow) {
      this.state.popoutWindow.document.title = newProps.title;
    }
  }

  componentDidUpdate() {
    this.renderToContainer(this.state.container, this.props.children);
  }

  componentWillUnmount() {
    this.mainWindowClosed();
  }

  popoutWindowLoaded() {
    if (!this.state.container) {
      this.state.popoutWindow.document.title = this.props.title;
      let container = this.state.popoutWindow.document.createElement('div');
      container.id = this.props.containerId;
      this.state.popoutWindow.document.body.appendChild(container);

      this.setState({ container });
      this.renderToContainer(container, this.props.children);
    }
  }

  openPopoutWindow(ownerWindow) {
    const popoutWindow = ownerWindow.open(this.props.url, this.props.name || this.props.title, this.createOptions(ownerWindow));
    this.setState({ popoutWindow });

    popoutWindow.addEventListener('load', this.popoutWindowLoaded);
    popoutWindow.addEventListener('beforeunload', this.popoutWindowUnloading);

    // If they have no specified a URL, then we need to forcefully call popoutWindowLoaded()
    if (!this.props.url) {
      popoutWindow.document.readyState === 'complete' && this.popoutWindowLoaded();
    }
  }

  mainWindowClosed() {
    this.state.popoutWindow && this.state.popoutWindow.close();
    (this.props.window || window).removeEventListener('unload', this.mainWindowClosed);
  }

  popoutWindowUnloading() {
    ReactDOM.unmountComponentAtNode(this.state.container);
    this.props.onClosing && this.props.onClosing();
  }

  renderToContainer(container, children) {
    // For SSR we might get updated but there will be no container.
    if (container) {
      let renderedComponent = children;
      if (typeof children === 'function') {
        renderedComponent = children(this.state.popoutWindow);
      }
      ReactDOM.render(renderedComponent, container);
    }
  }

  render() {
    return null;
  }

}
