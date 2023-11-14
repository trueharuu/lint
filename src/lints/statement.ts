import { Category, Level, Lint, Meta } from '../lint';

export class Statement extends Lint {
  public meta: Meta = {
    category: Category.Restriction,
    level: Level.Allow,
    name: 'statement',
    description: 'Checks for statements.',
  };

  public check() {
    for (const statement of this.ast.statements) {
      //   this.report(statement);
    }
  }
}
