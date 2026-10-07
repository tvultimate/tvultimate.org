/**
 * Treasure Valley Ultimate, Inc. — Bylaws.
 *
 * Adopted by the board. Article headings are level 2, the numbered sections
 * beneath them level 3, and the `(a)`/`(b)` enumerations are run-in labels.
 */

import type { PolicyDocument } from './types';

export const bylaws: PolicyDocument = {
  slug: 'bylaws',
  title: 'Bylaws',
  shortTitle: 'Bylaws',
  subtitle: 'Treasure Valley Ultimate, Inc., an Idaho nonprofit corporation',
  summary:
    'The governing document of the corporation: what it exists for, who serves on the board, how officers are assigned, how money is governed, and how the organisation may be amended or dissolved.',
  clauses: [
    {
      heading: 'ARTICLE I: NAME AND OFFICES',
      blocks: [
        {
          kind: 'term',
          term: 'Section 1. Name.',
          body: 'The name of this corporation is Treasure Valley Ultimate, Inc. (referred to herein as “Treasure Valley Ultimate” or the “Corporation”).',
        },
        {
          kind: 'term',
          term: 'Section 2. Principal Office.',
          body: 'Treasure Valley Ultimate does not have a physical location, but all board members must be located in the Treasure Valley. The location for mailing is currently 3209 E Kettle Creek Ave, Nampa, ID 83686.',
        },
        {
          kind: 'term',
          term: 'Section 3. Registered Office and Agent.',
          body: 'The Corporation shall continuously maintain a registered office and a registered agent in the State of Idaho as required by the Idaho Nonprofit Corporation Act.',
        },
      ],
    },
    {
      heading: 'ARTICLE II: PURPOSE AND AFFILIATED PROGRAMS',
      blocks: [
        {
          kind: 'term',
          term: 'Section 1. Exempt Purpose.',
          body: 'Treasure Valley Ultimate is organized exclusively for charitable, educational, and amateur sports competition purposes under Section 501(c)(3) of the Internal Revenue Code (or the corresponding section of any future federal tax code).',
        },
        {
          kind: 'term',
          term: 'Section 2. Specific Objectives.',
          body: 'The specific objectives of the Corporation are to foster local, regional, national, and international ultimate frisbee competition, support competitive club teams and youth programs, provide athletic education and clinics, and grow the sport of ultimate frisbee across the Treasure Valley.',
        },
        {
          kind: 'term',
          term: 'Section 3. Partner Club Affiliations.',
          body: 'Competitive club teams (including the first partner club, Sawtooth Ultimate) and developmental programs may operate under the financial umbrella of the Corporation pursuant to a formal, board-approved Club Partnership Agreement. The terms, benefits, responsibilities, and termination procedures governing partner clubs shall be defined in the Corporation’s standing Club Partnership Agreement and related policies.',
        },
      ],
    },
    {
      heading: 'ARTICLE III: BOARD OF DIRECTORS',
      blocks: [
        {
          kind: 'term',
          term: 'Section 1. General Powers.',
          body: 'The business, property, and affairs of Treasure Valley Ultimate shall be managed by and under the direction of its Board of Directors.',
        },
        {
          kind: 'term',
          term: 'Section 2. Board Size and Range.',
          body: 'The Board of Directors shall consist of a minimum of three (3) and a maximum of six (6) voting members. The Board is not required to maintain all six seats filled, provided the minimum of three (3) sitting directors is maintained.',
        },
        {
          kind: 'term',
          term: 'Section 3. Initial Directors.',
          body: 'The initial Board of Directors shall consist of Jason Burner (President), Julian Collins (Secretary), Emmett Poole (Treasurer), and David Nichols (Director of Youth Development).',
        },
        {
          kind: 'term',
          term: 'Section 4. Governance, Appointments, and Removal Policy.',
          body: 'The specific allocation of board seats, division representation, partner club director qualifications, continuous tenure rules, vacancy appointments, and director removal procedures shall be governed by the Corporation’s Board Governance, Composition, Appointments, and Removal Policy as adopted and amended by the Board from time to time.',
        },
        {
          kind: 'term',
          term: 'Section 5. Meetings, Asynchronous Action, and Quorum.',
          items: [
            'Regular Meetings & Deferral: the Board shall hold regular meetings approximately once every six (6) months. Meetings may be deferred or conducted asynchronously via electronic communication as established in the Board Governance Policy.',
            'Special Meetings: special meetings may be called by the President or any two (2) Directors upon at least two (2) days’ notice.',
            'Quorum: a simple majority of currently sitting Directors in office shall constitute a quorum for the transaction of business.',
            'Voting & Tie-Breakers: except as otherwise provided by law, these Bylaws, or Article VIII, actions are decided by a majority vote of Directors present where a quorum exists. In the event of a tied vote on standard matters, the President shall cast the deciding tie-breaker vote.',
            'Action Without a Meeting: any action required or permitted to be taken by the Board may be taken without a meeting if all sitting Directors consent in writing or by electronic record.',
          ],
        },
      ],
    },
    {
      heading: 'ARTICLE IV: OFFICERS',
      blocks: [
        {
          kind: 'term',
          term: 'Section 1. Officers.',
          body: 'The Officers of the Corporation shall consist of a President, a Secretary, a Treasurer, and any other administrative officers designated by the Board. All officers must be sitting members of the Board of Directors. No individual may hold the offices of President and Secretary simultaneously.',
        },
        {
          kind: 'term',
          term: 'Section 2. Officer Roles and Dual Assignment.',
          body: 'The President seat is dedicated. The offices of Treasurer and Secretary shall be held concurrently by sitting Directors as detailed in the Board Governance Policy.',
        },
        {
          kind: 'term',
          term: 'Section 3. Duties of Officers.',
          items: [
            'President: chief executive officer; presides over meetings, facilitates tie-breaker votes where permitted, executes authorized instruments, and oversees operations.',
            'Secretary: responsible for keeping meeting minutes, issuing notices, maintaining corporate records, and tracking policy compliance.',
            'Treasurer: custodian of corporate funds and banking; responsible for financial recordkeeping, sub-ledger tracking, tax and IRS filings, and board financial reporting.',
          ],
        },
      ],
    },
    {
      heading: 'ARTICLE V: FINANCIAL GOVERNANCE AND CAPITAL MANAGEMENT',
      blocks: [
        {
          kind: 'term',
          term: 'Section 1. Fiscal Management & Sub-Ledgers.',
          body: 'All funds, sponsorships, tournament proceeds, and donations received by the Corporation shall be deposited in central corporate accounts and tracked through restricted accounting sub-ledgers (including partner club accounts, youth funds, and general pools) in accordance with the Corporation’s Organizational Funds & Capital Management Policy.',
        },
        {
          kind: 'term',
          term: 'Section 2. Disbursements and Authority.',
          body: 'Disbursements, reimbursements, and spending authorities shall adhere strictly to the rules, documentation requirements, and approval thresholds set forth in the Organizational Funds & Capital Management Policy.',
        },
        {
          kind: 'term',
          term: 'Section 3. Prohibition of Private Inurement.',
          body: 'No part of the net earnings of the Corporation shall inure to the benefit of, or be distributable to, its directors, officers, or other private persons, except for reasonable compensation for authorized services rendered in furtherance of Article II purposes.',
        },
      ],
    },
    {
      heading: 'ARTICLE VI: DISSOLUTION',
      blocks: [
        {
          kind: 'term',
          term: 'Section 1. Dissolution Distribution.',
          body: 'Upon the dissolution of the Corporation, the Board of Directors shall, after paying or making provision for the payment of all liabilities, distribute all remaining assets exclusively to Boise Ultimate Scene, a 501(c)(3) nonprofit organization based in Boise, Idaho.',
        },
        {
          kind: 'term',
          term: 'Section 2. Contingency.',
          body: 'If Boise Ultimate Scene is no longer in existence or fails to qualify as a tax-exempt organization under Section 501(c)(3) of the Internal Revenue Code at the time of dissolution, the remaining assets shall be distributed exclusively for one or more exempt amateur athletic or educational purposes within the meaning of Section 501(c)(3), or to a state or local government for a public purpose.',
        },
      ],
    },
    {
      heading: 'ARTICLE VII: INDEMNIFICATION AND CONFLICTS OF INTEREST',
      blocks: [
        {
          kind: 'term',
          term: 'Section 1. Indemnification.',
          body: 'The Corporation shall indemnify any Director or Officer against expenses and liabilities reasonably incurred in connection with any legal proceeding arising from their corporate service, provided they acted in good faith and reasonably believed their actions were in the best interests of the Corporation.',
        },
        {
          kind: 'term',
          term: 'Section 2. Conflicts of Interest.',
          body: 'Any Director or Officer with a direct or indirect financial or personal interest in a matter before the Board shall disclose the interest and recuse themselves from deliberations and voting on that matter.',
        },
      ],
    },
    {
      heading: 'ARTICLE VIII: AMENDMENTS',
      blocks: [
        {
          kind: 'term',
          term: 'Section 1. Amendments.',
          body: 'These Bylaws may be altered, amended, repealed, or replaced by a majority vote of the currently seated Board of Directors at any regular, special, or asynchronous meeting, provided that at least seven (7) days’ written notice of the proposed amendment is delivered to all Directors.',
        },
        {
          kind: 'term',
          term: 'Section 2. No Presidential Tie-Breaker on Bylaws.',
          body: 'Amendments to these Bylaws require a true affirmative majority vote of the seated Board of Directors. No presidential tie-breaker vote shall be permitted on any vote to alter, amend, repeal, or adopt Bylaws.',
        },
      ],
    },
  ],
};
