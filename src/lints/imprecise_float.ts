import { Node } from 'byots';
import { Category, Level, Lint, Meta } from '../lint';

export class ImpreciseFloat extends Lint {
  public meta: Meta = {
    category: Category.Correctness,
    level: Level.Deny,
    name: 'imprecise_float',
    description: 'Checks floating-point literals that would lose precision',
  };

  public check() {
    for (const t of this.children()) {
      if (this.ts.isNumericLiteral(t)) {
        const u = Number(t.getText(this.ast));

        if (u > Number.MAX_SAFE_INTEGER) {
          this.report(t);
        } else {
          // this.skip(t);
        }
      }
    }
  }

  public fixes(t: Node): void {
    if (this.ts.isNumericLiteral(t)) {
      this.fix(
        `if the value is an integer, consider using a bigint`,
        t.text + 'n',
      );
    }
  }
}
