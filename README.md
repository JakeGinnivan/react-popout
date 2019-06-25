# react-popout
React popout is a React component wrapping `window.open` allowing you to host content in a browser popup window.

 > npm install react-popout --save

## Demo
To see it in action just go to [http://jake.ginnivan.net/react-popout](http://jake.ginnivan.net/react-popout)

## Usage
Import with `es6`
```
import Popout from 'react-popout'
```
The usage is really simple. When the component is mounted the popup is open, and when it is unmounted the popup is closed.

``` js
<Popout url='popout.html' title='Window title' onClosing={this.popupClosed}>
  <div>Popped out content!</div>
</Popout>
```

To close the window programatically give the window a ref and use the `closeWindow` function.

## props
### title [required]
Title for popup window.

### url [optional]
URL of the page to load intially. Often needed for css. `about:blank` will be used if not specified.

### onClosing [optional]
Called when popout window is closed, either by user or by calling close.

### options [optional]
Object representing window options. See [the docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Position_and_size_features) for reference.

Example:
`<Popout options={{left: '100px', top: '200px'}} />`

By default 500px wide, 400px high and centered over the window hosting the react component.

You can also specify a function with signature `(options, window) => { }` to perform calculations.
For example top is calculated with `(o, w) => ((w.innerHeight - o.height) / 2) + w.screenY`

### window [optional]
Instead of using the `window` global, a window object can be passed in. It needs the following functions on it:

`window.open(<url>, <title>, <strWindowFeatures>);` and return an object which looks like this:

```
{
  onbeforeunload: () => { },
  onload: () => { },
  close: () => { },
  document: {
    title: string,
    body: {
      appendChild: (ele) => { }
    }
  }
}
```
This can be used if you need to intercept the calls and do something else.

### containerId [optional]

Assigns an Id to the container that will be injected in the popup window `document.body`, defaults to `popout-content-container`, useful for cascading styles.

Example:
```
// input
<Popout containerId='tearoff'>
  <SomeComponent />
</Popout>

// output in new window:
<div id="tearoff">
  <SomeComponent />
</div>
```

### onError [optional]

Provides a callback incase the window wasn't opened, usually due to a popout blocker within the browser.

Example:
```
// input
<Popout onError={() => {}}>
    ...
</Popout>
```

## Example hosting component

``` js
class HostingComponent {
  constructor(props) {
    super(props);
    this.popout = this.popout.bind(this);
    this.popoutClosed = this.popoutClosed.bind(this);
    this.state = { isPoppedOut: false };
  }

  popout() {
    this.setState({isPoppedOut: true});
  }

  popoutClosed() {
    this.setState({isPoppedOut: false});
  }

  render() {
    if (this.state.isPoppedOut) {
      return (
        <Popout url='popout.html' title='Window title' onClosing={this.popoutClosed}>
          <div>Popped out content!</div>
        </Popout>
      );
    } else {
      var popout = <span onClick={this.popout} className="buttonGlyphicon glyphicon glyphicon-export"></span>
      return (
        <div>
          <strong>Section {popout}</strong>
          <div>Inline content</div>
        </div>
      );
    }
  }
}
```

The popped out content can have props set and will render just as you would expect a normal React component to render.
