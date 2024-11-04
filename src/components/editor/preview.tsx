import React, { FC, useEffect, useRef } from 'react';

import { editorConfig } from '@/config/editor/editorjs_readonly.config';
import { Block } from '@/services/Blogs/BlogTyptes';
import EditorJS from '@editorjs/editorjs';

export type EditorProps = {
  data?: { time: number; blocks: Block[] };
};

const Editor: FC<EditorProps> = ({ data }) => {
  const editorInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        ...editorConfig,
        data: data,
      });
    }

    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      className='mx-auto w-full sm:w-4/5 px-5 sm:px-4 font-jost space-y-6'
      id='editorjs_editor-container'
    ></div>
  );
};

export default Editor;