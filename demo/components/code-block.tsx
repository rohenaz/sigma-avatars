'use client';

import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export function CodeBlock({ code, language, className = '' }: CodeBlockProps) {
  const [html, setHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const highlightCode = async () => {
      try {
        setIsLoading(true);
        const highlighted = await codeToHtml(code, {
          lang: language,
          theme: 'github-dark-default',
          transformers: [
            {
              pre(node) {
                // Remove default styles and add our custom classes
                this.addClassToHast(node, 'shiki-pre');
              },
              code(node) {
                this.addClassToHast(node, 'shiki-code');
              },
            },
          ],
        });
        setHtml(highlighted);
      } catch (error) {
        console.error('Syntax highlighting failed:', error);
        // Fallback to plain code
        setHtml(`<pre><code>${code}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [code, language]);

  if (isLoading) {
    return (
      <div className={`p-3 bg-muted rounded-md text-xs animate-pulse ${className}`}>
        <div className="h-4 bg-muted-foreground/20 rounded mb-2"></div>
        <div className="h-4 bg-muted-foreground/20 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-md overflow-x-auto text-xs ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        '--shiki-color-text': 'hsl(var(--foreground))',
        '--shiki-color-background': 'hsl(var(--muted))',
        '--shiki-token-constant': 'hsl(var(--primary))',
        '--shiki-token-string': 'hsl(220 14.3% 65.9%)',
        '--shiki-token-comment': 'hsl(var(--muted-foreground))',
        '--shiki-token-keyword': 'hsl(262.1 83.3% 57.8%)',
        '--shiki-token-parameter': 'hsl(var(--foreground))',
        '--shiki-token-function': 'hsl(221.2 83.2% 53.3%)',
        '--shiki-token-string-expression': 'hsl(142.1 76.2% 36.3%)',
      } as React.CSSProperties}
    />
  );
}