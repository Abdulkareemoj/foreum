import { Plate, usePlateEditor } from 'platejs/react';
import type { Value } from 'platejs';
import { EditorKit } from '~/components/editor/editor-kit';
import { Editor, EditorContainer } from '~/components/ui/editor';

interface PlateEditorProps {
  value?: Value;
  onChange?: (val: Value) => void;
  disabled?: boolean;
}

const emptyValue: Value = [{ children: [{ text: '' }], type: 'p' }];

export function PlateEditor({ value, onChange, disabled }: PlateEditorProps) {
  const editor = usePlateEditor({
    plugins: EditorKit,
    value: value || emptyValue,
  });

  return (
    <Plate editor={editor} onChange={(val) => onChange?.(val.value)}>
      <EditorContainer>
        <Editor disabled={disabled} variant="demo" />
      </EditorContainer>
    </Plate>
  );
}
