'use client';

import { useMemo } from 'react';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import ReactMarkdown, { type Components } from 'react-markdown';
import 'katex/dist/katex.min.css';
import { cn } from './ui/utils';
import rehypeRaw from 'rehype-raw';


interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const remarkPlugins = useMemo(() => [remarkMath], []);
  const rehypePlugins = useMemo(() => [rehypeKatex, rehypeRaw], []);

  const components: Components = {
    code({ className, children, ...props }) {
      return (
        <code className={cn(className)} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      className={cn("prose prose-slate max-w-none", className)}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
