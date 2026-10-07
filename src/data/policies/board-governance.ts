/**
 * Board Governance, Composition, Appointments, and Removal Policy.
 *
 * Heading text is reproduced as the adopted document has it, capitals included.
 * The board seats named in the allocation are listed in the order the policy
 * gives them.
 */

import type { PolicyDocument } from './types';

export const boardGovernance: PolicyDocument = {
  slug: 'board-governance',
  title: 'Board Governance, Composition, Appointments, and Removal Policy',
  shortTitle: 'Board Governance',
  subtitle: 'Treasure Valley Ultimate, Inc.',
  summary:
    'How the board is sized, who fills each seat, how seats are appointed and vacated, how directors are removed, and how meetings and votes are run.',
  clauses: [
    {
      heading: 'BOARD SIZE, MINIMUMS, AND MAXIMUM LIMITS',
      blocks: [
        {
          kind: 'list',
          items: [
            'Board Size Range: the Board of Directors shall consist of a minimum of three (3) and a maximum of six (6) voting members.',
            'Variable Board Size & Vacancies: the Board is not required to maintain all six (6) seats filled at all times. If any division lacks an active partner club, program, or candidate, that seat may remain vacant without impacting the Board’s legal authority to operate, provided at least three (3) seats are filled and a quorum (a simple majority of currently sitting directors) is met.',
            'Mandatory Minimum: the Board shall maintain a minimum of three (3) sitting directors at all times to ensure operational stability, legal compliance, and officer coverage.',
          ],
        },
      ],
    },
    {
      heading: 'SEAT ALLOCATION, DIVISION ROLES, AND AT-LARGE FLEXIBILITY',
      blocks: [
        {
          kind: 'text',
          body: 'The up to six (6) available board seats are allocated based on community representation and organizational leadership:',
        },
        {
          kind: 'list',
          items: [
            'President (one dedicated executive seat)',
            'Open Division Director (open and men’s club teams, captains, and players)',
            'Mixed Division Director (mixed club teams, captains, and players)',
            'Women’s Division Director (women’s club teams, captains, and players)',
            'Youth & Development Director (youth leagues, school programs, clinics, and U-20 competition)',
            'Masters Division Director (masters and grandmasters players and teams)',
          ],
        },
        {
          kind: 'term',
          term: 'Rules for Partner Club & Functional Role Flexibility.',
          items: [
            'Partner Club Representation Mandate: every active partner club affiliated with the Organization is entitled to have one (1) designated leadership representative (active player, coach, or captain) serve on the Board of Directors, up to the overall six-member maximum.',
            'At-Large & Officer Flexibility (no partner club requirement): if a division currently lacks an active partner club or program, the Board may still seat directors up to the six-member cap by appointing individuals to serve as “At-Large Directors” or functional Officers (for example, serving as Treasurer or Secretary) without requiring them to hold a specific divisional title.',
            'Multiple Seats for One Division: if a single division maintains multiple active partner clubs while another division is inactive, multiple board seats may be allocated to the active division to ensure every partner club is represented, up to the maximum cap of six (6).',
            'Seat Prioritization: if the number of interested partner clubs and divisions exceeds the six-seat maximum, seats will be allocated to ensure at least one representative per active division first, with remaining seats filled by majority vote of the sitting Board.',
          ],
        },
      ],
    },
    {
      heading: 'REQUIRED CORPORATE OFFICERS (DUAL-ROLE ASSIGNMENT)',
      blocks: [
        {
          kind: 'text',
          body: 'Regardless of the total number of sitting directors (from three to six), the essential non-profit officer roles must always be covered:',
        },
        {
          kind: 'list',
          items: [
            'President: held by the dedicated President Director seat.',
            'Treasurer: concurrently held by one (1) sitting Division or At-Large Director. Responsible for financial recordkeeping, budget oversight, reimbursement approvals, sub-ledger tracking for partner clubs, and tax and IRS compliance.',
            'Secretary: concurrently held by one (1) sitting Division or At-Large Director, different from the Treasurer. Responsible for meeting minutes, official notices, corporate records, and policy compliance.',
          ],
        },
        {
          kind: 'term',
          term: 'Officer Assignment Continuity.',
          body: 'Once assigned, the Treasurer and Secretary retain their officer designations continuously until they resign the officer role, are reassigned by a majority vote of the Board, or vacate their board seat.',
        },
      ],
    },
    {
      heading: 'DIRECTOR TENURE & CONTINUOUS SERVICE',
      blocks: [
        {
          kind: 'term',
          term: 'Continuous / Indefinite Tenure.',
          body: 'Board Director seats do not have fixed expiration dates and do not require annual re-election or reappointment votes.',
        },
        {
          kind: 'term',
          term: 'Conditions of Service.',
          body: 'A Director shall remain in their seat continuously until one of the following occurs:',
          items: [
            'Voluntary Resignation: the Director chooses to step down.',
            'Loss of Role Criteria: a Division Director ceases to meet the mandatory qualification criteria — for example, no longer an active player, coach, or leader for the represented division or partner club, or the affiliated club disbands or terminates its partnership.',
            'Formal Removal: the Director is voted off the Board according to the removal procedures set out under Cessation of Service & Removal.',
          ],
        },
      ],
    },
    {
      heading: 'MEETINGS, ASYNCHRONOUS BUSINESS, AND VOTING PROCEDURES',
      blocks: [
        {
          kind: 'list',
          items: [
            'Bi-Annual Meeting Schedule: the Board of Directors shall hold regular meetings approximately once every six (6) months.',
            'Deferral & Asynchronous Business: if no formal in-person or virtual discussion is necessary, any bi-annual meeting may be deferred by agreement of the Board, and regular board business, reporting, updates, and reviews may be conducted asynchronously via electronic communication (email, messaging platforms, or written records).',
            'Quorum: a simple majority of the currently seated Directors in office constitutes a quorum for the transaction of business.',
            'Standard Majority & Presidential Tie-Breaker: for general motions, approvals, and operational resolutions, decisions pass by a simple majority of votes cast. In the event of a tie vote, the President shall cast the deciding tie-breaker vote.',
            'Bylaw Amendments (strict majority, no tie-breaker): any proposed amendment, alteration, repeal, or adoption of the corporate Bylaws requires a true affirmative majority vote of the seated Directors. No presidential tie-breaker vote is permitted on any bylaw change.',
            'Absentee votes: if a board member is not present they can cast their vote in absence. If they do not, their vote is not counted, which lowers the number required for the majority.',
          ],
        },
      ],
    },
    {
      heading: 'PROCEDURE FOR APPOINTING NEW DIRECTORS',
      blocks: [
        {
          kind: 'text',
          body: 'Because terms do not expire annually, the appointment process occurs only when a seat is vacant, when the board chooses to add an at-large or divisional seat, or when a new partner club enters into an affiliation agreement.',
        },
        {
          kind: 'list',
          items: [
            'Identifying a Vacancy / New Seat: a seat becomes available when the board size is under the six-member maximum cap, a director steps down, or a new qualifying partner club affiliates with the Organization.',
            'Eligibility Verification: candidates representing a division or partner club must be active players, coaches, captains, or direct organizers within that division or club. Candidates for At-Large seats must demonstrate active commitment to the Organization’s exempt mission.',
            'Partner Club Designation: affiliated partner clubs submit their designated representative in writing to the Board.',
            'Board Confirmation: the sitting Board reviews eligibility and confirms the appointment by a simple majority vote of currently seated directors. Once confirmed, the Director serves on an ongoing basis.',
          ],
        },
      ],
    },
    {
      heading: 'CESSATION OF SERVICE & REMOVAL',
      blocks: [
        {
          kind: 'text',
          body: 'A Director’s seat shall become vacant under any of the following circumstances.',
        },
        {
          kind: 'term',
          term: 'A. Automatic Vacancy (Loss of Eligibility).',
          items: [
            'If a Division Director steps down from team leadership, stops actively participating or coaching in their division, or if their partner club terminates its affiliation, their board seat is automatically vacated.',
            'The affected club or division may then nominate a qualified successor for board confirmation.',
          ],
        },
        {
          kind: 'term',
          term: 'B. Discretionary Grounds for Removal.',
          body: 'A Director may be removed by vote for cause, including:',
          items: [
            'Unexcused absence from three (3) consecutive board meetings, or failure to participate in official asynchronous actions.',
            'Failure to uphold non-profit fiduciary duties (Duty of Care, Duty of Loyalty, Duty of Obedience).',
            'Material violation of the Organization’s Code of Conduct, Spirit of the Game (SOTG) principles, or SafeSport guidelines.',
            'Financial misconduct, unauthorized commingling of funds, or actions that jeopardize the organization’s 501(c)(3) tax-exempt status.',
          ],
        },
        {
          kind: 'term',
          term: 'C. Removal Process.',
          items: [
            'Written Motion: any Director may submit a formal motion for removal in writing to the Secretary, or to the President if the Secretary is the subject.',
            'Notice & Right to Respond: the Director facing removal must receive written notice detailing the specific reasons at least fourteen (14) days prior to the meeting where the motion will be heard. The Director has the right to present a response in writing or in person.',
            'Supermajority Vote Requirement: removal requires an affirmative vote of at least two-thirds (2/3) of all other sitting Directors, excluding the Director facing removal.',
            'Officer Transition: if the removed member held the role of Treasurer or Secretary, the remaining Board must immediately appoint another sitting Director to fill that officer role.',
          ],
        },
      ],
    },
    {
      heading: 'VOLUNTARY RESIGNATION',
      blocks: [
        {
          kind: 'list',
          items: [
            'A Director may resign at any time by delivering written notice to the President or Secretary.',
            'Officer Handover: if the resigning member is the Treasurer or Secretary, they must complete a formal handover of banking access, financial records, passwords, and corporate documentation within fourteen (14) days of submitting notice.',
          ],
        },
      ],
    },
  ],
};
