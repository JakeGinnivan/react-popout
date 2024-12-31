import React, { PropsWithChildren } from 'react';
import { createRoot, Root } from 'react-dom/client';

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
    top: (o: any, w: any) => (w.innerHeight - o.height) / 2 + w.screenY,
    left: (o: any, w: any) => (w.innerWidth - o.width) / 2 + w.screenX,
};

const ABOUT_BLANK = 'about:blank';

interface PopoutWindowProps extends PropsWithChildren<any> {
    options: object;
    url: string;
    containerId: string;
    containerClassName?: string;
    onError: () => void;
    window?: Window;
    title?: string;
}

interface PopoutWindowState {
    popoutWindow: Window | null;
    container: HTMLDivElement | null;
    openedWindowComponent: React.Component | null;
}

/**
 * @class PopoutWindow
 */
export default class PopoutWindow extends React.Component<PopoutWindowProps, PopoutWindowState> {
    private interval!: number;
    private root!: Root;

    static defaultProps = {
        url: ABOUT_BLANK,
        containerId: 'popout-content-container',
        containerClassName: '',
        onError: () => {},
    };

    /**
     * @constructs PopoutWindow
     * @param props
     */
    constructor(props: PopoutWindowProps) {
        super(props);

        this.mainWindowClosed = this.mainWindowClosed.bind(this);
        this.popoutWindowUnloading = this.popoutWindowUnloading.bind(this);
        this.popoutWindowLoaded = this.popoutWindowLoaded.bind(this);

        this.state = {
            openedWindowComponent: null,
            popoutWindow: null,
            container: null,
        };
    }

    createOptions(ownerWindow: Window) {
        const mergedOptions = Object.assign({}, DEFAULT_OPTIONS, this.props.options);

        return Object.keys(mergedOptions)
            .map(
                (key) =>
                    key +
                    '=' +
                    // @ts-ignore
                    (typeof mergedOptions[key] === 'function'
                        ? // @ts-ignore
                          mergedOptions[key].call(this, mergedOptions, ownerWindow)
                        : // @ts-ignore
                          mergedOptions[key]),
            )
            .join(',');
    }

    componentDidMount() {
        const ownerWindow = this.props.window || window;

        // May not exist if server-side rendering
        if (ownerWindow) {
            this.openPopoutWindow(ownerWindow);

            // Close any open popouts when page unloads/refreshes
            ownerWindow.addEventListener('unload', this.mainWindowClosed);
        }
    }

    componentWillReceiveProps(newProps: PopoutWindowProps) {
        if (newProps.title !== this.props.title && this.state.popoutWindow) {
            this.state.popoutWindow.document.title = newProps.title!;
        }
    }

    componentDidUpdate() {
        this.renderToContainer(this.state.container!, this.state.popoutWindow!, this.props.children);
    }

    componentWillUnmount() {
        this.mainWindowClosed();
    }

    popoutWindowLoaded(popoutWindow: Window) {
        if (!this.state.container) {
            // Popout window is passed from openPopoutWindow if no url is specified.
            // In this case this.state.popoutWindow will not yet be set, so use the argument.
            popoutWindow = this.state.popoutWindow || popoutWindow;
            popoutWindow.document.title = this.props.title!;
            let container = popoutWindow.document.createElement('div');
            container.id = this.props.containerId;
            container.className = this.props.containerClassName!;
            popoutWindow.document.body.appendChild(container);

            this.setState({ container });
            this.renderToContainer(container, popoutWindow, this.props.children);
        }
    }

    openPopoutWindow(ownerWindow: Window) {
        const popoutWindow = ownerWindow.open(this.props.url, this.props.name || this.props.title, this.createOptions(ownerWindow));
        if (!popoutWindow) {
            this.props.onError();
            return;
        }
        this.setState({ popoutWindow });

        // @ts-ignore
        popoutWindow.addEventListener('load', this.popoutWindowLoaded);
        popoutWindow.addEventListener('unload', this.popoutWindowUnloading);

        if (this.props.url === ABOUT_BLANK) {
            // If they have no specified a URL, then we need to forcefully call popoutWindowLoaded()
            popoutWindow.document.readyState === 'complete' && this.popoutWindowLoaded(popoutWindow);
        } else {
            // If they have a specified URL, then we need to check if the window closes without a listener
            this.checkForPopoutWindowClosure(popoutWindow);
        }
    }

    /**
     * API method to close the window.
     */
    closeWindow() {
        this.mainWindowClosed();
    }

    /**
     * Use if a URL was passed to the popout window. Checks every 500ms if the window has been closed.
     * Calls the onClosing() prop if the window is closed.
     *
     * @param popoutWindow
     */
    checkForPopoutWindowClosure(popoutWindow: Window) {
        this.interval = window.setInterval(() => {
            if (popoutWindow.closed) {
                clearInterval(this.interval);
                this.props.onClosing && this.props.onClosing(popoutWindow);
            }
        }, 500);
    }

    mainWindowClosed() {
        this.state.popoutWindow && this.state.popoutWindow.close();
        (this.props.window || window).removeEventListener('unload', this.mainWindowClosed);
    }

    popoutWindowUnloading() {
        if (this.state.container) {
            clearInterval(this.interval);
            this.root.unmount();
            this.props.onClosing && this.props.onClosing(this.state.popoutWindow);
        }
    }

    renderToContainer(container: HTMLDivElement, popoutWindow: Window, children: React.ReactNode | ((window: Window) => React.ReactNode)) {
        // For SSR we might get updated but there will be no container.
        if (container) {
            const renderedComponent = typeof children === 'function' ? children(popoutWindow) : children;

            if (!this.root) {
                this.root = createRoot(container);
            }
            this.root.render(renderedComponent);
        }
    }

    render() {
        return null;
    }
}
