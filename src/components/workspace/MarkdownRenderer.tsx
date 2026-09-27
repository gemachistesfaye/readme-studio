import React, { useMemo } from 'react';

interface MarkdownRendererProps {
  content: string;
}

type Block =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: { number: string; text: string; code?: { language: string; code: string } }[] }
  | { type: 'p'; text: string };

function renderInline(text: string): React.ReactNode[] {
  // Regex to match markdown images: ![alt](url) or linked images: [![alt](url)](linkUrl), standard links: [label](url), **bold**, or `code`
  const regex = /(\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\)|!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // 1. Linked image: [![alt](imgUrl)](linkUrl)
    const linkedImgMatch = part.match(/^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)$/);
    if (linkedImgMatch) {
      const [, alt, imgUrl, linkUrl] = linkedImgMatch;
      return (
        <a
          key={index}
          href={linkUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block align-middle mr-1.5 mb-1.5 transition-opacity hover:opacity-85"
        >
          <img
            src={imgUrl}
            alt={alt}
            className="inline-block h-5 rounded"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </a>
      );
    }

    // 2. Direct image (badge): ![alt](imgUrl)
    const imgMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const [, alt, imgUrl] = imgMatch;
      return (
        <img
          key={index}
          src={imgUrl}
          alt={alt}
          className="inline-block h-5 mr-1.5 mb-1.5 rounded align-middle"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
      );
    }

    // 3. Regular Link: [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isExternal = url.startsWith('http') || url.startsWith('mailto:');
      return (
        <a
          key={index}
          href={url}
          target={isExternal && !url.startsWith('mailto:') ? '_blank' : undefined}
          rel={isExternal && !url.startsWith('mailto:') ? 'noreferrer' : undefined}
          className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
        >
          {label}
        </a>
      );
    }

    // 4. Bold: **text**
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={index} className="font-semibold text-zinc-100">
          {boldMatch[1]}
        </strong>
      );
    }

    // 5. Inline code: `code`
    const codeMatch = part.match(/^`([^`]+)`$/);
    if (codeMatch) {
      return (
        <code
          key={index}
          className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-xs text-indigo-300"
        >
          {codeMatch[1]}
        </code>
      );
    }

    // Normal text
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function parseMarkdownBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 1. Fenced Code Block
    const fenceMatch = line.match(/^(`{3,})(.*)$/);
    if (fenceMatch) {
      const fenceStr = fenceMatch[1];
      const language = fenceMatch[2].trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith(fenceStr)) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push({
        type: 'code',
        language,
        code: codeLines.join('\n'),
      });
      continue;
    }

    // 2. Headings
    if (line.startsWith('# ')) {
      blocks.push({ type: 'h1', text: line.slice(2).trim() });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3).trim() });
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4).trim() });
      i++;
      continue;
    }

    // 3. Unordered list (- or *)
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, '').trim());
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // 4. Ordered list (1. 2. etc.)
    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      const items: { number: string; text: string; code?: { language: string; code: string } }[] = [];
      while (i < lines.length) {
        const curMatch = lines[i].match(/^(\d+)\.\s+(.*)$/);
        if (curMatch) {
          const number = curMatch[1];
          const text = curMatch[2].trim();
          i++;
          // Check if immediately followed by a fenced code block
          let code: { language: string; code: string } | undefined;
          if (i < lines.length) {
            const stepFence = lines[i].match(/^(`{3,})(.*)$/);
            if (stepFence) {
              const fenceStr = stepFence[1];
              const language = stepFence[2].trim();
              const codeLines: string[] = [];
              i++;
              while (i < lines.length && !lines[i].startsWith(fenceStr)) {
                codeLines.push(lines[i]);
                i++;
              }
              i++; // skip closing fence
              code = { language, code: codeLines.join('\n') };
            }
          }
          items.push({ number, text, code });
        } else {
          break;
        }
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    // 5. Blank line
    if (!line.trim()) {
      i++;
      continue;
    }

    // 6. Regular paragraph (gather contiguous non-empty lines)
    const pLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i])
    ) {
      pLines.push(lines[i]);
      i++;
    }

    if (pLines.length > 0) {
      blocks.push({ type: 'p', text: pLines.join('\n') });
    }
  }

  return blocks;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const blocks = useMemo(() => parseMarkdownBlocks(content), [content]);

  return (
    <article className="space-y-4 text-zinc-300">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h1':
            return (
              <h1
                key={idx}
                className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl border-b border-zinc-800 pb-3 mb-4"
              >
                {renderInline(block.text)}
              </h1>
            );

          case 'h2':
            return (
              <h2
                key={idx}
                className="text-lg font-semibold text-zinc-100 sm:text-xl border-b border-zinc-800/80 pb-2 mt-6 mb-3"
              >
                {renderInline(block.text)}
              </h2>
            );

          case 'h3':
            return (
              <h3
                key={idx}
                className="text-sm font-semibold text-zinc-200 sm:text-base mt-4 mb-2"
              >
                {renderInline(block.text)}
              </h3>
            );

          case 'code':
            return (
              <div
                key={idx}
                className="my-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-200 overflow-x-auto"
              >
                {block.language && (
                  <div className="text-[10px] text-zinc-500 font-mono mb-1.5 select-none uppercase tracking-wider">
                    {block.language}
                  </div>
                )}
                <pre className="whitespace-pre overflow-x-auto leading-relaxed">
                  <code>{block.code}</code>
                </pre>
              </div>
            );

          case 'ul':
            return (
              <ul key={idx} className="my-3 space-y-1.5 list-disc list-inside text-sm text-zinc-300">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {renderInline(item)}
                  </li>
                ))}
              </ul>
            );

          case 'ol':
            return (
              <ol key={idx} className="my-3 space-y-3 list-decimal list-inside text-sm text-zinc-300">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    <span className="font-medium text-zinc-200">{renderInline(item.text)}</span>
                    {item.code && (
                      <div className="mt-1.5 ml-5 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-300 overflow-x-auto">
                        {item.code.language && (
                          <div className="text-[10px] text-zinc-500 font-mono mb-1 select-none uppercase tracking-wider">
                            {item.code.language}
                          </div>
                        )}
                        <pre className="whitespace-pre overflow-x-auto">
                          <code>{item.code.code}</code>
                        </pre>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            );

          case 'p':
            return (
              <p
                key={idx}
                className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap my-2.5"
              >
                {renderInline(block.text)}
              </p>
            );

          default:
            return null;
        }
      })}
    </article>
  );
};
