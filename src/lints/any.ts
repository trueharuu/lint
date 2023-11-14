import { Category, Level, Lint, Meta } from '../lint';

export class Any extends Lint {
  public meta: Meta = {
    category: Category.Restriction,
    level: Level.Deny,
    name: 'any',
    description: 'Checks for the use of the type `any`.',
  };

  public check() {
    for (const t of this.children()) {
      if (t.kind === this.ts.SyntaxKind.AnyKeyword) {
        this.report(t);
      }
    }
  }
}
