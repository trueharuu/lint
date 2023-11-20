import { Node } from 'byots';
import { Category, Level, Lint, Meta } from '../lint';

export class EmptyBlock extends Lint {
  public meta: Meta = {
    category: Category.Pedantic,
    level: Level.Allow,
    name: 'empty_blocks',
    description: 'Checks for empty blocks.',
  };

  public check() {
    for (const t of this.children()) {
      if (this.ts.isBlock(t)) {
        if (t.statements.length === 0) {
          this.report(t);
        } else {
          this.skip(t);
        }
      }
    }
  }

  public fixes(_: Node) {
    if (this.ts.isBlock(_)) {
      this.fix('remove the block', this.factory().createEmptyStatement());
    }
  }
}
