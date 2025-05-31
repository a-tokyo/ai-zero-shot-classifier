'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeBlock.css';

interface CodeBlockProps {
  language: string;
  children: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, children, title }) => {
  const [copied, setCopied] = useState(false);
  
  // Simple check for short code blocks
  const isShortCode = children.split('\n').length <= 2;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="code-block">
      {title && <h4>{title}</h4>}
      <div className={`code-container ${isShortCode ? 'short-code' : ''}`}>
        <button
          className={`copy-button ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language={language} style={atomDark}>
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock; 