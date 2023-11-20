import { Node } from 'byots';
import { Category, Level, Lint, Meta } from '../lint';

export class ElseThenIf extends Lint {
  public meta: Meta = {
    category: Category.Style,
    level: Level.Warn,
    name: 'else_then_if',
    description: 'Checks lone `if` statements inside of `else` statements.',
  };

  public check() {
    for (const t of this.children()) {
      if (this.ts.isIfStatement(t)) {
        if (t.elseStatement !== undefined) {
          if (this.ts.isBlock(t.elseStatement)) {
            const first = t.elseStatement.statements[0];

            if (first !== undefined && this.ts.isIfStatement(first)) {
              this.report(t.elseStatement);
            }
          }
        }
      }
    }
  }

  public fixes(t: Node) {
    if (this.ts.isBlock(t)) {
      const first = t.statements[0];

      if (first !== undefined && this.ts.isIfStatement(first)) {
        this.fix('remove the block', first);
      }
    }
  }
}
