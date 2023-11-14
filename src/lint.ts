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

  public suggestion(_: ts.Node): string | null {
    return null;
  }

  public fix(_: ts.Node): ts.Node | null {
    return null;
  }

  public children(ast?: ts.Node): Array<ts.Node> {
    return collect_children(ast || this.ast);
  }

  public typeck() {
    return this.program.getTypeChecker();
  }

  public print(node: ts.Node) {
    return print_node(node, this.ast);
  }
}
