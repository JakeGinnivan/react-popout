# react-popout
React popout is a React component wrapping `window.open` allowing you to host content in a browser popup window.

 > npm install react-popout --save

## Usage
The usage is really simple, when the component is mounted the popup is open, when it is unmounted the popup is closed.

``` js
<Popout url='popout.html' title='Window title' onClosing={this.popupClosed}>
  <div>Popped out content!</div>
</Popout>
```

To close the window programatically give the window a ref and use the `closeWindow` function.

## props
### title [required]
Title for popup window

### url [optional]
Url of the page to load intially. Often needed for css. `about:blank` will be used if not specified

### onClosing [optional]
Called when popout window is closed, either by user or by calling close

### options [optional]
Object representing window options. See https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Position_and_size_features for reference.

Example:
`<Popout options={{left: '100px', top: '200px'}} />`

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
        <Popout url='popout.html' title='Window title' onClosing={this.popupClosed}>
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
