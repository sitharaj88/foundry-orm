'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  code?: string;
  children?: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, children, language = 'typescript', filename }: CodeBlockProps) {
  // Support both code prop and children for flexibility
  const codeContent = code || children || '';
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 w-full">
      {filename && (
        <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono border-b border-gray-700 rounded-t-lg">
          {filename}
        </div>
      )}
      <div className="relative w-full overflow-x-auto">
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: filename ? '0 0 0.5rem 0.5rem' : '0.5rem',
              fontSize: '0.75rem',
              background: '#1e1e1e !important',
              minWidth: '100%',
            }}
            showLineNumbers
            className="code-block-selection"
            wrapLongLines={false}
          >
            {codeContent}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
