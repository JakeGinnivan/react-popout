import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const _CONTAINER_ID = Symbol('container_id');

/**
 * @class PopoutWindow
 */
export default class PopoutWindow extends React.Component {

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

  state = {
    openedWindowComponent: null,
    popoutWindow: null
  };

  defaultOptions = {
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
   * @constructs PoppoutWindow
   * @param props
   */
  constructor(props) {
    super(props);
    this[_CONTAINER_ID] = props.containerId || 'popout-content-container';
    this.closeWindow = this.closeWindow.bind(this);
  }

  /**
   * Override default id if we get given one
   * @param props
   */
  componentWillReceiveProps(props) {
    props.containerId && (this[_CONTAINER_ID] = props.containerId);
  }

  componentWillUnmount() {
    this.closeWindow();
  }

  componentDidMount() {
    let popoutWindow;
    let container;

    const options = Object.assign({}, this.defaultOptions, this.props.options);
    const ownerWindow = this.props.window || window;
    const openedWindowComponent = {
      update(newComponent) {
        if (container) {
          let renderedComponent = newComponent;
          if (typeof newComponent === 'function') {
            renderedComponent = newComponent(popoutWindow);
          }
          ReactDOM.render(renderedComponent, container);
        }
      },
      close() {
        popoutWindow && popoutWindow.close();
      }
    };

    if (!ownerWindow) {
      // If we have no owner windows, bail. Likely server side render
      return;
    }

    const createOptions = () => {
      const ret = [];
      for (let key in options) {
        options.hasOwnProperty(key) && ret.push(key + '=' + (
          typeof options[key] === 'function' ?
            options[key].call(this, options, ownerWindow) :
            options[key]
        )
        );
      }
      return ret.join(',');
    };

    popoutWindow = ownerWindow.open(this.props.url || 'about:blank', this.props.title, createOptions());

    popoutWindow.onbeforeunload = () => {
      container && ReactDOM.unmountComponentAtNode(container);
      this.windowClosing();
    };
    // Close any open popouts when page unloads/refreshes
    ownerWindow.addEventListener('unload', this.closeWindow);

    const onloadHandler = () => {
      if (!container) {
        popoutWindow.document.title = this.props.title;
        container = popoutWindow.document.createElement('div');
        container.id = this[_CONTAINER_ID];
        popoutWindow.document.body.appendChild(container);

        this.state.openedWindowComponent.update(this.props.children);
      }
    };

    this.setState({ openedWindowComponent, popoutWindow });

    popoutWindow.onload = onloadHandler;
    // If they have no specified a URL, then we need to forcefully call onloadHandler()
    if (!this.props.url) {
      popoutWindow.document.readyState === 'complete' && onloadHandler();
    }

  }

  closeWindow() {
    this.state.openedWindowComponent && this.state.openedWindowComponent.close();
    (this.props.window || window).removeEventListener('unload', this.closeWindow);
  }

  windowClosing() {
    React.unmountComponentAtNode(document.getElementById(this[_CONTAINER_ID]));
    this.props.onClosing && this.props.onClosing();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.title !== this.props.title && this.state.popoutWindow) {
      this.state.popoutWindow.document.title = newProps.title;
    }
  }

  /**
   * Bubble changes
   */
  componentDidUpdate() {
    // For SSR we might get updated but there will be no openedWindow. Make sure openedWIndow exists before calling
    this.state.openedWindowComponent && this.state.openedWindowComponent.update(this.props.children);
  }

  render() {
    // No need to render anything.
    return null;
  }

}
