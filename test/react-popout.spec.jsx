import assert from 'assert';
import ReactPopout from '../dist/react-popout.js';

const PopoutWindow = ReactPopout.default;

describe('PopoutWindow', () => {
    let originalWindow;

    beforeEach(() => {
        originalWindow = global.window;
    });

    afterEach(() => {
        global.window = originalWindow;
    });

    const createPopout = (onClosing, ownerWindow, additionalProps = {}) =>
        new PopoutWindow(
            Object.assign(
                {
                    containerId: 'popout-content-container',
                    onClosing,
                    onError: () => {},
                    options: {},
                    url: '/popout',
                    window: ownerWindow,
                },
                additionalProps,
            ),
        );

    it('uses pagehide instead of unload for owner and popout lifecycle events', () => {
        const ownerEvents = [];
        const popoutEvents = [];
        const popoutWindow = {
            addEventListener: (event) => popoutEvents.push(event),
        };
        const ownerWindow = {
            addEventListener: (event) => ownerEvents.push(event),
            open: () => popoutWindow,
        };
        global.window = { setInterval: () => 1 };

        const popout = createPopout(() => {}, ownerWindow);
        popout.setState = (state) => Object.assign(popout.state, state);
        popout.componentDidMount();

        assert.deepStrictEqual(ownerEvents, ['pagehide']);
        assert.deepStrictEqual(popoutEvents, ['load', 'pagehide']);
    });

    it('unmounts the React root before notifying when polling detects a closed window', () => {
        const calls = [];
        let poll;
        global.window = {
            setInterval: (callback) => {
                poll = callback;
                return 1;
            },
        };

        const popout = createPopout(() => calls.push('onClosing'));
        const popoutWindow = { closed: true, removeEventListener: () => {} };
        popout.root = { unmount: () => calls.push('unmount') };

        popout.checkForPopoutWindowClosure(popoutWindow);
        poll();

        assert.deepStrictEqual(calls, ['unmount', 'onClosing']);
    });

    it('keeps the popout open when the owner page enters the back-forward cache', () => {
        let closed = false;
        const ownerWindow = { removeEventListener: () => {} };
        const popout = createPopout(() => {}, ownerWindow);
        popout.state.popoutWindow = { close: () => (closed = true) };

        popout.mainWindowPageHiding({ persisted: true });

        assert.strictEqual(closed, false);
    });

    it('updates the popout title after the title prop changes', () => {
        const popoutWindow = { document: { title: 'Original title' } };
        const popout = createPopout(() => {}, undefined, { title: 'Updated title' });
        popout.state.popoutWindow = popoutWindow;

        popout.componentDidUpdate(Object.assign({}, popout.props, { title: 'Original title' }));

        assert.strictEqual(popoutWindow.document.title, 'Updated title');
    });

    it('only cleans up and notifies once when multiple closing signals are received', () => {
        const calls = [];
        const popout = createPopout(() => calls.push('onClosing'));
        const popoutWindow = { removeEventListener: () => {} };
        popout.root = { unmount: () => calls.push('unmount') };

        popout.finishClosing(popoutWindow);
        popout.finishClosing(popoutWindow);

        assert.deepStrictEqual(calls, ['unmount', 'onClosing']);
    });
});
