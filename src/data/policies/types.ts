/**
 * The shape every published policy and agreement is written in.
 *
 * These documents are long, numbered, and structurally repetitive, so they are
 * stored as data rather than as markup: one renderer draws all of them, and a
 * clause cannot drift out of step with its neighbours because there is only one
 * definition of what a clause looks like.
 *
 * Wording is reproduced from the adopted documents. Heading text inside a
 * document is kept verbatim, capitals and all, because it is part of the legal
 * text. The page's own title and its label in the footer are the presentational
 * layer, and those are written in title case.
 */

export type PolicyBlock =
  /** A plain paragraph. */
  | { kind: 'text'; body: string }
  /** Unordered bullets. */
  | { kind: 'list'; items: string[] }
  /**
   * A run-in label followed by its explanation, optionally with sub-bullets.
   * Covers the `(a)`, `(b)` enumerations and the `Term: explanation` lines the
   * documents use interchangeably.
   */
  | { kind: 'term'; term: string; body?: string; items?: string[] };

export interface PolicyClause {
  /**
   * The clause heading: an article, or the document's top-level heading where it
   * has no article level. Always an `h2`.
   *
   * Everything one level down — a numbered section, an `(a)` enumeration — is a
   * run-in `term` inside the clause's blocks rather than a heading of its own.
   * That keeps one definition of a heading level across four very differently
   * shaped documents, and it is how the source documents read.
   */
  heading: string;
  blocks: PolicyBlock[];
}

export interface PolicyDocument {
  /** URL segment under `/policies/`. */
  slug: string;
  /** Page title, in title case. Becomes the `h1`. */
  title: string;
  /** Short label for the footer index and for links between documents. */
  shortTitle: string;
  /** The line the document carries under its own title, e.g. the entity. */
  subtitle?: string;
  /** Plain-English summary for the page hero. */
  summary: string;
  /** The original file, where one is published. */
  download?: { label: string; file: string; detail: string };
  clauses: PolicyClause[];
}

/** Canonical, trailing-slash path for a document. */
export const policyPath = (slug: string): string => `/policies/${slug}/`;
