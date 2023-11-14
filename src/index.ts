import { readdirSync } from 'fs';
import * as ts from 'byots';
import { fmt } from './format';

const dir = readdirSync('src/tests');

const program = ts.createProgram({
  rootNames: dir.map((x) => 'src/tests/' + x),
  options: {
    lib: ['ESNext'],
  },
});

// dbg(program);

for (const ast of program.getSourceFiles()) {
  //   dbg(ast);
  //   dbg(ast.fileName);
  if (ast.isDeclarationFile) {
    continue;
  }

  //   dbg(ast.text);
  fmt(program, ast);
}
