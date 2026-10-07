/**
 * The published policies and agreements, in the order the footer index lists
 * them.
 *
 * These pages are deliberately absent from `navSections`. They are reached by
 * direct URL or from the footer index, not from the primary navigation, so
 * adding a document here does not add it to the masthead or the mobile drawer.
 */

import type { PolicyDocument } from './types';

import { bylaws } from './bylaws';
import { boardGovernance } from './board-governance';
import { clubAffiliationAgreement } from './club-affiliation-agreement';
import { fundsAndCapitalManagement } from './funds-and-capital-management';

export type { PolicyBlock, PolicyClause, PolicyDocument } from './types';
export { policyPath } from './types';

export { bylaws, boardGovernance, clubAffiliationAgreement, fundsAndCapitalManagement };

export const policies: PolicyDocument[] = [
  bylaws,
  boardGovernance,
  clubAffiliationAgreement,
  fundsAndCapitalManagement,
];

/** Look a document up by its slug, for the dynamic route. */
export const policyBySlug = (slug: string): PolicyDocument | undefined =>
  policies.find((policy) => policy.slug === slug);
