/**
 * Club Team Affiliation Policy & Partnership Agreement.
 *
 * This is the document published at
 * `/documents/club-partnership-agreement.pdf`, so the page carries the same
 * wording and offers the file as a download.
 */

import { documents } from '../org';
import type { PolicyDocument } from './types';

export const clubAffiliationAgreement: PolicyDocument = {
  slug: 'club-affiliation-agreement',
  title: 'Club Team Affiliation Policy & Partnership Agreement',
  shortTitle: 'Club Affiliation Agreement',
  subtitle: 'Between Treasure Valley Ultimate, Inc. and the affiliated partner club',
  summary:
    'The agreement every partner club signs. It covers what the affiliation is, what each side is responsible for, the financial rules that protect the club’s money, and how either party ends the arrangement.',
  download: {
    label: documents.clubPartnershipAgreement.label,
    file: documents.clubPartnershipAgreement.file,
    detail: documents.clubPartnershipAgreement.detail,
  },
  clauses: [
    {
      heading: '1. PURPOSE & SCOPE',
      blocks: [
        {
          kind: 'text',
          body: 'This Agreement establishes the operational terms, mutual benefits, and binding financial obligations between Treasure Valley Ultimate, Inc. (“Organization”), an Idaho 501(c)(3) public charity, and [Club Team Name] (“Partner Club”). The purpose of this affiliation is to foster the long-term competitive growth, athletic development, and sustainability of Ultimate Frisbee teams in the Treasure Valley and surrounding region.',
        },
      ],
    },
    {
      heading: '2. INDEPENDENT ENTITY & LEGAL RESPONSIBILITY DISCLAIMER',
      blocks: [
        {
          kind: 'term',
          term: 'Sponsored Status.',
          body: 'The Partner Club is an independent entity operating under a partnership and sponsored affiliation with the Organization. The Partner Club is not a branch, division, subsidiary, or legal agent of Treasure Valley Ultimate, Inc.',
        },
        {
          kind: 'term',
          term: 'Liability Exemption.',
          body: 'The Organization assumes no legal responsibility, vicarious liability, or financial liability for the actions, omissions, contracts, injuries, debts, or operational conduct of the Partner Club, its leaders, coaches, players, or participants.',
        },
      ],
    },
    {
      heading: '3. ORGANIZATIONAL GOVERNANCE & BOARD REPRESENTATION',
      blocks: [
        {
          kind: 'term',
          term: 'Continuous Board Representation.',
          body: 'To ensure open communication and representation, the Partner Club must have at least one (1) active team leader (for example, an active player, captain, or coach) serve on the Organization’s Board of Directors.',
        },
        {
          kind: 'term',
          term: 'Fiduciary Responsibilities.',
          body: 'The designated club representative agrees to participate in regular bi-annual board meetings (or asynchronous reviews), uphold corporate bylaws, and act in the legal and financial best interests of the 501(c)(3).',
        },
        {
          kind: 'term',
          term: 'Succession.',
          body: 'If the club’s board representative steps down from team leadership or leaves the team, the Partner Club must designate an active successor in writing for board confirmation to maintain good standing.',
        },
      ],
    },
    {
      heading: '4. BENEFITS PROVIDED BY THE ORGANIZATION',
      blocks: [
        {
          kind: 'text',
          body: 'Subject to compliance with this Agreement and organizational policies, the Organization grants the Partner Club continuous access to:',
        },
        {
          kind: 'term',
          term: 'Dedicated Banking & Tax-Deductible Contributions.',
          items: [
            'A dedicated, physically separate bank account held under the Organization’s 501(c)(3) umbrella solely for the Partner Club’s funds.',
            'The ability to accept tax-deductible donations, community sponsorships, and grants under the Organization’s 501(c)(3) status.',
            'Qualified tax-exempt purchasing for team gear, equipment, field rentals, and tournament fees.',
          ],
        },
        {
          kind: 'term',
          term: 'Logistical & Travel Support.',
          body: 'Access to Organization-negotiated hotel group rates, booking partnerships, and corporate discounts.',
        },
        {
          kind: 'term',
          term: 'Digital Infrastructure & Software.',
          body: 'Access to organizational administrative tools (for example custom domain emails, Slack workspaces, Canva Pro licenses, and cloud storage), subject to organizational Terms of Service.',
        },
        {
          kind: 'term',
          term: 'Discretionary Event Insurance Extension.',
          body: 'At the Organization’s sole discretion, liability insurance coverage may be extended to cover specific, pre-approved fundraising events hosted by the Partner Club. Any such extension requires prior written request and formal approval from the Organization’s Board of Directors or officers on a case-by-case basis.',
        },
      ],
    },
    {
      heading: '5. FINANCIAL PROTOCOLS, PRE-FUNDING MANDATE & NO-DEBT POLICY',
      blocks: [
        {
          kind: 'text',
          body: 'Because all funds deposited into corporate accounts are legally non-profit assets subject to IRS oversight, the Partner Club explicitly agrees to the following financial rules:',
        },
        {
          kind: 'term',
          term: 'Strict No-Debt Policy.',
          body: 'The Organization will not assume debt, extend lines of credit, or front organizational funds to cover any team expenses.',
        },
        {
          kind: 'term',
          term: 'Mandatory Upfront Funding (Pre-Funding Requirement).',
          body: 'To utilize organizational purchasing, tax exemptions, or booking services (such as paying for tournament bids, reserving hotel blocks, ordering uniforms, or booking travel), the Partner Club must have the full required balance pre-funded and cleared in its dedicated bank account prior to transaction execution.',
        },
        {
          kind: 'term',
          term: 'Upfront Player Dues & Seasonal Budgeting.',
          body: 'The Partner Club is responsible for setting its budget and collecting player dues, player deposits, or fundraising revenue at the start of the season (or well in advance of payment deadlines). The Organization will not pay for tournament bids, lodging, or travel on the expectation of collecting reimbursement from players after an event has taken place.',
        },
        {
          kind: 'term',
          term: 'Disbursement Authorization & Receipts.',
          body: 'All payments and reimbursements must be submitted with valid itemized receipts, invoices, or official registration confirmations and approved by the Organization’s Treasurer. Disbursements that would cause a negative balance in the club’s account are strictly prohibited.',
        },
        {
          kind: 'term',
          term: 'No Private Inurement.',
          body: 'Funds may only be utilized for legitimate team athletic, travel, and operational expenses. Funds cannot be converted to personal private use or distributed for personal profit.',
        },
      ],
    },
    {
      heading: '6. ONGOING PARTNER CLUB RESPONSIBILITIES & INSURANCE DISCLAIMER',
      blocks: [
        {
          kind: 'text',
          body: 'The Partner Club agrees to:',
        },
        {
          kind: 'term',
          term: 'Conduct Standards.',
          body: 'Uphold Spirit of the Game (SOTG), SafeSport guidelines, and organizational codes of conduct.',
        },
        {
          kind: 'term',
          term: 'Digital Platform Compliance.',
          body: 'Comply with acceptable use policies for all software licenses and shared digital platforms.',
        },
        {
          kind: 'term',
          term: 'No General Insurance Coverage Provided.',
          body: 'The Partner Club explicitly acknowledges that the Organization does NOT provide general liability, property, accident, or medical insurance for the Partner Club’s day-to-day operations, practices, league games, tournaments, travel, or participants. The Partner Club is solely responsible for procuring any general liability or participant accident insurance it deems necessary for its general team activities.',
        },
      ],
    },
    {
      heading: '7. TERM, INACTIVE STATUS & DISSOLUTION',
      blocks: [
        {
          kind: 'term',
          term: 'Continuous Term.',
          body: 'This Agreement remains in full force indefinitely without requiring annual renewal, continuing automatically from season to season until a specific terminating event occurs.',
        },
        {
          kind: 'term',
          term: 'Voluntary Departure.',
          body: 'The Partner Club may voluntarily terminate this affiliation at any time upon thirty (30) days written notice to the Board of Directors.',
        },
        {
          kind: 'term',
          term: 'Loss of Good Standing & Revocation.',
          body: 'The affiliation may be suspended or revoked by a two-thirds (2/3) vote of the Board of Directors if the club:',
          items: [
            'Fails to maintain a qualifying representative on the Board of Directors for more than sixty (60) days after a vacancy arises;',
            'Materially breaches organizational bylaws, 501(c)(3) financial compliance rules, or the pre-funding policy; or',
            'Ceases active operations or disbands.',
          ],
        },
        {
          kind: 'term',
          term: 'Disposition of Remaining Funds.',
          body: 'Upon termination or departure, any remaining funds in the club’s dedicated account will be disbursed in accordance with 501(c)(3) regulations exclusively to support ongoing amateur athletic programs, or transferred to another qualifying 501(c)(3) athletic entity designated by the team.',
        },
      ],
    },
  ],
};
