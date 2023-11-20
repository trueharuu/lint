import { Node } from 'byots';
import { Category, Level, Lint, Meta } from '../lint';
import { color } from '../tools';

export class EmptyEnum extends Lint {
  public meta: Meta = {
    category: Category.Pedantic,
    level: Level.Allow,
    name: 'empty_enum',
    description: 'Checks for `enum`s with no variants.',
  };

  public check() {
    for (const t of this.children()) {
      if (this.ts.isEnumDeclaration(t)) {
        if (t.members.length === 0) {
          this.report(t);
        } else {
          this.skip(t);
        }
      }
    }
  }

  public fixes(_: Node) {
    if (this.ts.isEnumDeclaration(_)) {
      const modifiers = this.ts.getModifiers(_) || [];

      this.fix(
        `use the ${color('`never`', 34)} type instead`,
        this.factory().createTypeAliasDeclaration(
          modifiers,
          _.name,
          [],
          this.factory().createTypeReferenceNode('never'),
        ),
      );
    }
  }
}
