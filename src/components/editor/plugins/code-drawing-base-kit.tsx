import { BaseCodeDrawingPlugin } from '@platejs/code-drawing';

import { CodeDrawingElement } from '~/components/ui/plate/code-drawing-node';

export const BaseCodeDrawingKit = [
  BaseCodeDrawingPlugin.configure({
    node: { component: CodeDrawingElement },
  }),
];
