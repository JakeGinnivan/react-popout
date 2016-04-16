import React from 'react';
import ReactDOM from 'react-dom';

let CONTAINER_ID = 'popout-content-container';

/**
 * @class PopoutWindow
 */
export default class PopoutWindow extends React.Component {

  /**
   * @type {{title: *, url: *, onClosing: *, options: *, window: *, containerId: *}}
   */
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    url: React.PropTypes.string,
    onClosing: React.PropTypes.func,
    options: React.PropTypes.object,
    window: React.PropTypes.object,
    containerId: React.PropTypes.string
  }

	/**
   * @constructs PoppoutWindow
   * @param props
   */
  constructor(props){
    super(props);

    this.defaultOptions = {
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

    this.state = {
      openedWindow: null
    };
  }

  /**
   * Override default id if we get given one
   * @param props
   */
  componentWillReceiveProps(props){
    props.containerId && (CONTAINER_ID = props.containerId);
  }

  componentWillUnmount(){
    this.closeWindow();
  }

  componentDidMount(){
    let win,
        container;

    const options      = Object.assign({}, this.defaultOptions, this.props.options),
          ownerWindow  = this.props.window || window,
          openedWindow = {
            update(newComponent){
              ReactDOM.render(newComponent, container);
            },
            close(){
              win.close();
            }
          };

    const createOptions = () => {
      const ret = [];
      for (let key in options){
        options.hasOwnProperty(key) && ret.push(key + '=' + (
            typeof options[key] === 'function' ?
              options[key].call(this, options, ownerWindow) :
              options[key]
          )
        );
      }
      return ret.join(',');
    };

    win = ownerWindow.open(this.props.url || 'about:blank', this.props.title, createOptions());

    win.onbeforeunload = () =>{
      container && ReactDOM.unmountComponentAtNode(container);
      this.windowClosing();
    };

    const onloadHandler = () =>{
      if (container){
        if (win.document.getElementById(CONTAINER_ID)) return;

        ReactDOM.unmountComponentAtNode(container);
        container = null;
      }

      win.document.title = this.props.title;
      container = win.document.createElement('div');
      container.id = CONTAINER_ID;
      win.document.body.appendChild(container);

      ReactDOM.render(this.props.children, container);
    };

    win.onload = onloadHandler;
    // Just in case that onload doesn't fire / has fired already, we call it manually if it's ready.
    win.document.readyState === 'complete' && onloadHandler();

    this.setState({openedWindow});
  }

  closeWindow(){
    this.state.openedWindow && this.state.openedWindow.close();
  }

  windowClosing(){
    this.props.onClosing && this.props.onClosing();
  }

  /**
   * Bubble changes
   */
  componentDidUpdate(){
    this.state.openedWindow.update(this.props.children);
  }

  render(){
    return <div />;
  }

}
