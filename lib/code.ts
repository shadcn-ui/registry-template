import { codeToHtml } from 'shiki';

const SHIKI_THEME = 'github-dark';

export type Code = {
  name: string;
  content: string;
  language: string;
}

export async function getHighlightedCode(code: string = '', language: string) {
  const html = await codeToHtml(code, { 
    lang: language,
    theme: SHIKI_THEME,
    mergeWhitespaces: true,
    transformers: [
      {
        code(node) {
          node.properties["data-line-numbers"] = ""
        },
      },
    ],

  });

  return html;
}
