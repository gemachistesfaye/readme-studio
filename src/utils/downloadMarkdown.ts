/**
 * Downloads a string as a Markdown file using browser-native Blob and <a> download.
 *
 * @param markdown - The exact canonical Markdown string
 * @param filename - Optional filename, defaults to 'README.md'
 * @returns boolean - True if the download was initiated, false on error
 */
export function downloadMarkdown(markdown: string, filename = 'README.md'): boolean {
  if (!markdown || !markdown.trim()) {
    return false;
  }

  try {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Clean up DOM element and revoke object URL
    document.body.removeChild(link);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 150);

    return true;
  } catch {
    return false;
  }
}
