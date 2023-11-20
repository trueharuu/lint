import * as ts from 'byots';
import { collect_children, print_node } from './tools';

export enum Level {
  Allow = 'allow',
  Warn = 'warn',
  Deny = 'deny',
}

export enum Category {
  Style = 'style',
  Restriction = 'restriction',
  Complexity = 'complexity',
  Correctness = 'correctness',
  Pedantic = 'pedantic',
  Suspicious = 'suspicious',
  Formatting = 'fmt',
}

export interface Meta {
  category: Category;
  level: Level;
  name: string;
  description: string;
}

export abstract class Lint {
  public abstract meta: Meta;
  public constructor(
    public readonly program: ts.Program,
    public readonly ast: ts.SourceFile,
  ) {
    // dbg(ast);
  }

  public get ts() {
    return ts;
  }

  public skipped: Array<ts.Node> = [];
  public skip(node: ts.Node) {
    this.skipped.push(node);
    return;
  }
  public reports: Array<ts.Node> = [];
  public report(node: ts.Node) {
    this.reports.push(node);
    return;
  }

  public abstract check(): void;
  public color(): number {
    if (this.meta.level === Level.Allow) {
      return 32;
    }
    if (this.meta.level === Level.Warn) {
      return 33;
    }
    if (this.meta.level === Level.Deny) {
      return 31;
    }

    return 0;
  }

  public note(): string | null {
    return null;
  }

  public current_fixes: Array<[string | null, ts.Node | string]> = [];
  public fix(...v: [string | null, ts.Node | string]): this {
    // console.log(v);
    this.current_fixes.push(v);
    return this;
  }

  public fixes(t: ts.Node) {
    void t;
  }

  public children(ast?: ts.Node): Array<ts.Node> {
    return collect_children(ast || this.ast);
  }

  public typeck() {
    return this.program.getTypeChecker();
  }

  public ty_of(t: ts.Node) {
    return this.typeck().getTypeAtLocation(t);
  }

  public has_ty_flag(ty: ts.Type, flags: ts.TypeFlags, recv?: boolean) {
    const f = ty.getFlags();

    if (recv && f & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) {
      return true;
    }

    return (f & flags) !== 0;
  }

  public get type_to_string() {
    return this.typeck().typeToString;
  }

  public factory() {
    return this.ts.factory;
  }

  public print(node: ts.Node) {
    return print_node(node, this.ast);
  }
}
