'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export function NewsletterComposer() {
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false
        }
      })
    ],
    content: '<p>Escreva sua newsletter aqui...</p>',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none'
      }
    }
  });

  const handleSend = async () => {
    if (!subject.trim() || !editor?.getText()?.trim()) {
      alert('Por favor, preencha o assunto e o conteúdo');
      return;
    }

    setSending(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          content: editor.getHTML(),
        }),
      });

      if (!response.ok) throw new Error('Erro ao enviar newsletter');

      setStatus('success');
      setSubject('');
      editor?.commands.setContent('<p>Escreva sua newsletter aqui...</p>');
    } catch (error) {
      console.error('Erro:', error);
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  const MenuBar = () => {
    if (!editor) return null;

    return (
      <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-2 rounded ${
              editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
            }`}
          >
            <strong>B</strong>
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${
              editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
            }`}
          >
            <em>I</em>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
            }`}
          >
            H2
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded ${
              editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''
            }`}
          >
            •
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded ${
              editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''
            }`}
          >
            1.
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Assunto
        </label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                   focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 
                   dark:border-gray-600 dark:text-white"
          placeholder="Digite o assunto da newsletter"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Conteúdo
        </label>
        
        <MenuBar />

        <div className="min-h-[300px] border rounded-lg p-4 bg-white dark:bg-gray-700">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {status === 'success' && (
            <span className="text-green-600 text-sm">Newsletter enviada com sucesso!</span>
          )}
          {status === 'error' && (
            <span className="text-red-600 text-sm">Erro ao enviar newsletter</span>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={sending}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 
                   disabled:opacity-50 transition-colors duration-200"
        >
          {sending ? 'Enviando...' : 'Enviar Newsletter'}
        </button>
      </div>
    </div>
  );
}
