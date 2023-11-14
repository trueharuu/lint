import * as ts from 'byots';
import { color, dbg, map_with_spans, print, print_node } from './tools';
// import { Lint } from './lint';
import { lints } from './lints';

export function fmt(program: ts.Program, ast: ts.SourceFile) {
  const file = ast.fileName;
  const text = ast.getFullText();
  dbg(color(`[${file}]`, 35));
  //   dbg(color(text, 30));

  print_node(ast, ast);

  let diagnostic_ctr = 0;
  for (const ctr of lints) {
    const lint = new ctr(program, ast);
    // dbg(lint);

    lint.check();
    const output: Array<ts.Node> = lint.reports;
    const skips: Array<ts.Node> = lint.skipped;
    if (output.length > 0) {
      diagnostic_ctr++;
      dbg(
        `${color(
          `[${file}::${diagnostic_ctr.toString().padStart(3, '0')}]`,
          '35;2',
        )} Lint ${color(
          `#[${lint.meta.level}(${lint.meta.category}::${lint.meta.name})]`,
          lint.color(),
        )} triggered at ${output
          .map((part) => color(`[${part.pos}..${part.end}]`, 34))
          .join(', ')}:\n${color(lint.meta.description, '30;3')}`,
      );

      dbg(
        map_with_spans(
          text,
          // @ts-ignore
          [
            ...output.map((x) => [x.pos, x.end, false]),
            ...skips.map((x) => [x.pos, x.end, true]),
          ],
          // @ts-ignore
          (x, [_, __, s]) => color(x, s ? '38;5;120' : '38;5;199'),
        ),
      );

      const note = lint.note();
      if (note !== null) {
        dbg(`= ${color('note:', '1;34')} ${note}`);
      }

      for (const part of output) {
        const suggestion = lint.suggestion(part);
        if (suggestion !== null) {
          dbg(`= ${color('help:', '1;33')} ${suggestion}`);
        }

        //   dbg(part.getText());
        const fix = lint.fix(part);

        if (fix !== null) {
          dbg(
            `= ${color('fix:', '1;36')}\n` +
              text.slice(0, part.pos) +
              color(print(fix, ast), '32') +
              text.slice(part.end),
          );
        }
      }
      dbg('');
    }
  }
}
