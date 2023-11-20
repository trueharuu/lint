import { Category, Level, Lint, Meta } from '../lint';

export class NonBoolCondition extends Lint {
  public meta: Meta = {
    category: Category.Suspicious,
    level: Level.Warn,
    name: 'non_bool_condition',
    description: 'Checks conditions that are not explicitly a boolean.',
  };

  public check() {
    for (const t of this.children()) {
      if (this.ts.isIfStatement(t)) {
        const ty = this.typeck().getTypeAtLocation(t.expression);

        if (!this.has_ty_flag(ty, this.ts.TypeFlags.BooleanLike)) {
          this.report(t.expression);
        } else {
          this.skip(t.expression);
        }
      }
    }
  }
}
