import { EditorProps, EditorView } from 'prosemirror-view';
import { createCtx } from '..';
import { createTiming } from '../timing';
import { MilkdownPlugin } from '../utility';
import { editorStateCtx, StateReady } from './editor-state';
import { nodeViewCtx, NodeViewReady } from './node-view';

type EditorOptions = Omit<ConstructorParameters<typeof EditorView>[1], 'state'>;

export const editorViewCtx = createCtx<EditorView>({} as EditorView);
export const editorViewOptionsCtx = createCtx<EditorOptions>({});
export const rootCtx = createCtx<Node>(document.body);
export const Complete = createTiming('complete');

const createViewContainer = (root: Node) => {
    const container = document.createElement('div');
    container.className = 'milkdown';
    root.appendChild(container);

    return container;
};

const prepareViewDom = (dom: Element) => {
    dom.classList.add('editor');
    dom.setAttribute('role', 'textbox');
};

export const editorView: MilkdownPlugin = (pre) => {
    pre.inject(rootCtx, document.body).inject(editorViewCtx).inject(editorViewOptionsCtx);

    return async (ctx) => {
        await Promise.all([StateReady(), NodeViewReady()]);

        const state = ctx.get(editorStateCtx);
        const options = ctx.get(editorViewOptionsCtx);
        const nodeView = ctx.get(nodeViewCtx);
        const root = ctx.get(rootCtx);

        const container = createViewContainer(root);
        const view = new EditorView(container, {
            state,
            nodeViews: nodeView as EditorProps['nodeViews'],
            ...options,
        });
        prepareViewDom(view.dom);
        ctx.set(editorViewCtx, view);
        Complete.done();
    };
};