import React from 'react';
import { Editor, editorOptionsCtx } from '@milkdown/core';
import { ReactEditor, useEditor } from '@milkdown/react';
import { gfm } from '@milkdown/preset-gfm';
import { history } from '@milkdown/plugin-history';
import { prism } from '@milkdown/plugin-prism';
import { tooltip } from '@milkdown/plugin-tooltip';
import { math } from '@milkdown/plugin-math';
import { slash } from '@milkdown/plugin-slash';
import className from './style.module.css';

import '@milkdown/theme-nord/lib/theme.css';
import '@milkdown/preset-gfm/lib/style.css';
import '@milkdown/plugin-math/lib/style.css';
import '@milkdown/plugin-table/lib/style.css';
import '@milkdown/plugin-tooltip/lib/style.css';
import '@milkdown/plugin-slash/lib/style.css';

type Props = {
    content: string;
    readOnly?: boolean;
    onChange?: (getMarkdown: () => string) => void;
};

export const MilkdownEditor: React.FC<Props> = ({ content, readOnly, onChange }) => {
    const editor = useEditor(
        (root) => {
            const editor = new Editor()
                .config((ctx) => {
                    ctx.update(editorOptionsCtx, (prev) => ({
                        ...prev,
                        root,
                        defaultValue: content,
                        editable: () => !readOnly,
                        listener: {
                            markdown: onChange ? [onChange] : [],
                        },
                    }));
                })
                .use(gfm)
                .use(history)
                .use(prism)
                .use(tooltip)
                .use(math);

            if (!readOnly) {
                editor.use(slash);
            }
            return editor;
        },
        [readOnly, content],
    );

    return (
        <div className={className.editor}>
            <ReactEditor editor={editor} />
        </div>
    );
};
