import * as ts from 'byots';
import { color, dbg, map_with_spans, print, print_node } from './tools';
// import { Lint } from './lint';
import { lints } from './lints';

export function fmt(program: ts.Program, ast: ts.SourceFile) {
  const file = ast.fileName;
  const text = ast.getFullText();
  dbg(color(`[${file}]`, 35));
  //   dbg(color(text, 30));

  dbg(print_node(ast, ast));

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
        '\n' +
          color(
            map_with_spans(
              text,
              // @ts-ignore
              [
                ...output.map((x) => [x.pos, x.end, false]),
                ...skips.map((x) => [x.pos, x.end, true]),
              ],
              // @ts-ignore
              (x, [_, __, s]) => color(x, s ? '0;33' : '0;31', 2),
            ),
            2,
          )
            .split('\n')
            .map((x) => '\t' + x)
            .join('\n')
            .trimEnd(),
      );

      const note = lint.note();
      if (note !== null) {
        dbg(`= ${color('note:', '1;34')} ${note}`);
      }

      for (const part of output) {
        // //   dbg(part.getText());
        // const fix = lint.fix(part);

        // if (fix !== null) {
        //   const suggestion = lint.suggestion(part);

        //   dbg(`= ${color('help:', '1;33')} ${suggestion || 'apply some fix'}`);
        //   dbg(
        //     (
        //       text.slice(0, part.pos) +
        //       ' ' +
        //       color(print(part, ast), '31;11', '2') +
        //       color(print(fix, ast), '32', '2') +
        //       text.slice(part.end)
        //     )
        //       .trimEnd()
        //       .split('\n')
        //       .map((x) => '|\t' + color(x, '2'))
        //       .join('') + '\n',
        //   );
        // }
        lint.current_fixes = [];
        lint.fixes(part);
        for (const [suggestion, fix] of lint.current_fixes) {
          const t = typeof fix === 'string' ? fix : print(fix, ast);
          dbg(`= ${color('help:', '1;33')} ${suggestion || 'apply some fix'}`);
          dbg(
            '\n' +
              (
                color(text.slice(0, part.pos), 2) +
                ' ' +
                (t.trim().length === 0
                  ? color(print(part, ast), '0;31;3', '2')
                  : '') +
                color(t, '0;32', 2) +
                color(text.slice(part.end), 2)
              )
                .split('\n')
                .map((x) => '\t' + x)
                .join('\n')
                .trimEnd(),
          );
        }
      }
    }
  }
}
