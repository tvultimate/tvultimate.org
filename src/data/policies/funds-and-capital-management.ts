/**
 * Organizational Funds & Capital Management Policy.
 *
 * Published with the title in title case, as the board asked for; the article
 * headings inside are the document's own.
 */

import type { PolicyDocument } from './types';

export const fundsAndCapitalManagement: PolicyDocument = {
  slug: 'funds-and-capital-management',
  title: 'Organizational Funds & Capital Management Policy',
  shortTitle: 'Funds & Capital Management',
  subtitle: 'Treasure Valley Ultimate, Inc., an Idaho nonprofit corporation',
  summary:
    'The financial governance of the organisation: the accounts it holds, who may spend from each of them, what has to be approved and logged, how cards and rewards are handled, and the no-debt rule that keeps every balance positive.',
  clauses: [
    {
      heading: 'ARTICLE I: PURPOSE & PRINCIPLES',
      blocks: [
        {
          kind: 'term',
          term: 'Section 1. Purpose.',
          body: 'This policy establishes the financial governance, accounting structure, disbursement protocols, card issuance rules, credit and points management, and fiduciary controls for all funds managed by Treasure Valley Ultimate, Inc. (the “Corporation”). The purpose is to provide full transparency, maintain solvency, prevent commingling of team and program funds, and preserve compliance under Section 501(c)(3) of the Internal Revenue Code.',
        },
        {
          kind: 'term',
          term: 'Section 2. Centralized Corporate Banking.',
          body: 'All accounts and financial instruments are legally held and owned under the Corporation’s 501(c)(3) tax identification number. The Board of Directors retains ultimate legal and fiduciary oversight over corporate finances, while day-to-day administrative execution, logging, and account maintenance are managed by the Treasurer.',
        },
      ],
    },
    {
      heading: 'ARTICLE II: BANKING ARCHITECTURE & SEPARATE ACCOUNTS (RELAY BANKING)',
      blocks: [
        {
          kind: 'term',
          term: 'Section 1. Segregated Banking Structure via Relay.',
          body: 'All corporate banking is established and operated through Relay Financial (Relay). To provide clean accounting and protect the financial autonomy of partner clubs and dedicated programs, the Corporation maintains physically separate checking and savings accounts. Funds may be transferred between accounts internally via authorized Relay banking channels to fulfill allocations, disbursements, and seed reserves.',
        },
        {
          kind: 'term',
          term: 'Section 2. Active Account Roster & Categorization.',
          body: 'The Corporation maintains the following primary accounts:',
          items: [
            'General Fund (Checking): central operating account for non-restricted community donations, sponsorships, tournament merchandise profits, vendor fees, administrative fees, insurance premiums, software subscriptions, and general partner club support grants.',
            'Sawtooth Fund (Checking): dedicated, restricted team account for the partner Open club team, Sawtooth.',
            'Youth Fund (Checking): dedicated restricted account supporting youth Ultimate athletes across the Treasure Valley — need-based scholarships, clinic subsidies, school equipment, and junior travel support.',
            'Battle of Idaho Spending (Checking): active operational tournament checking account used to collect tournament registrations and bid fees and to pay direct event expenses (fields, insurance, food, trainer, discs and swag).',
            'Battle of Idaho Seed Savings (Savings): dedicated interest-bearing reserve account holding seed funds retained across tournament cycles to cover upfront deposits and down payments for future Battle of Idaho events.',
            'Business Savings (Savings): general corporate interest-bearing reserve account for emergency buffers, long-term capital projects, and organizational reserves.',
          ],
        },
        {
          kind: 'term',
          term: 'Section 3. Future Partner Club Accounts.',
          body: 'As new competitive or developmental club teams (for example Mixed, Women’s, or Masters) affiliate with the Corporation under a signed Club Partnership Agreement, a separate, dedicated checking account shall be established under the corporate Relay umbrella prior to receiving or disbursing team funds.',
        },
      ],
    },
    {
      heading: 'ARTICLE III: DISCRETION, SPENDING AUTHORITIES & TRANSFERS',
      blocks: [
        {
          kind: 'term',
          term: 'Section 1. Partner Club Team Funds & Captain Discretion.',
          items: [
            '100% Captain Discretion: funds deposited into a dedicated partner club account (such as the Sawtooth Fund or any future partner club checking account) are held for the exclusive use of that specific team. All decisions regarding the allocation and expenditure of these funds are made 100% at the discretion of the club team’s captains and leadership.',
            'Permitted Uses: clubs can spend their money however they want to advance their athletic and seasonal goals — tournament bids, travel lodging, transit, practice fields, jerseys, team gear, coaching stipends, team social events — as long as the account maintains a positive balance and does not incur debt.',
            'Autonomous Logging: clubs do not need prior board approval for their purchases. Clubs must maintain their own internal financial tracking sheet and provide it to the Treasurer for yearly corporate accounting.',
          ],
        },
        {
          kind: 'term',
          term: 'Section 2. Youth Fund Discretion.',
          body: 'Disbursements from the Youth Fund checking account may be authorized by any ONE of the following:',
          items: [
            'Discretion of the Youth & Development Director; or',
            'Discretion of the President; or',
            'A simple majority vote of the sitting Board of Directors.',
          ],
        },
        {
          kind: 'term',
          term: 'Section 3. General Discretionary Fund & Savings Discretion.',
          items: [
            'Disbursements from the General Fund, or transfers from Business Savings, may be authorized by the President (for standard operations, administrative expenses, or support allocations to recognized partner clubs), or by a simple majority vote of the sitting Board of Directors.',
            'Flexible Routing: discretionary funds can either be spent directly on operational needs or transferred into other program or club accounts, at which point those funds adopt and follow the destination account’s rules.',
            'Tournament Transfers: transfers from Battle of Idaho Spending into Battle of Idaho Seed Savings or divisional accounts (Sawtooth Fund, Youth Fund, General Fund) shall follow the waterfall rules defined in the standing Tournament Financial Policy.',
          ],
        },
        {
          kind: 'term',
          term: 'Section 4. Director Banking Access.',
          body: 'Any Director may manage, disburse, or transfer funds within the specific Relay accounts that they have been granted authorized administrative access to.',
        },
      ],
    },
    {
      heading: 'ARTICLE IV: SPENDING APPROVAL THRESHOLDS & LOGGING WORKFLOW',
      blocks: [
        {
          kind: 'term',
          term: 'Section 1. Corporate Yearly Finances Sheet.',
          body: 'All corporate and discretionary spending must be logged in the official Yearly Finances Sheet, recording:',
          items: [
            'Date of transaction',
            'Reason, description, or category',
            'Authorizing approval, if required',
          ],
        },
        {
          kind: 'term',
          term: 'Section 2. Discretionary Spending Approval Thresholds.',
          items: [
            'Under $50.00: no prior approval from other directors is required, but the transaction must be logged on the Yearly Finances Sheet and backed by a receipt.',
            'Over $50.00: requires explicit response and approval from at least one (1) other Director.',
            '48-Hour Response Rule: when an approval request for an expenditure over $50 is sent to the Board, Directors have 48 hours to review. If not all Directors respond within 48 hours, the request is approved and may be executed once one (1) Director has signed off.',
          ],
        },
      ],
    },
    {
      heading: 'ARTICLE V: CARDS (PHYSICAL & DIGITAL), CREDIT POINTS & NO-DEBT POLICY',
      blocks: [
        {
          kind: 'term',
          term: 'Section 1. Issuance of Physical & Digital Cards.',
          items: [
            'Authorized physical and digital corporate debit or credit cards may be generated through Relay for specific accounts and purposes.',
            'Partner Club Cards: authorized team captains and designated team managers may be issued physical or digital cards linked strictly to their team’s dedicated account (for example, the Sawtooth Fund). Cards shall never be cross-linked to other corporate or divisional accounts.',
            'Tournament & Admin Cards: dedicated cards may be issued for tournament directors linked strictly to the Battle of Idaho Spending account, or for executive officers linked to the General Fund.',
          ],
        },
        {
          kind: 'term',
          term: 'Section 2. Credit Card Usage & Zero-Debt Policy.',
          items: [
            'Rewards & Protection Only: corporate credit cards may be utilized strictly to earn reward points, cash back, and travel protections. Credit cards shall NEVER be used to carry a balance, incur long-term debt, or finance purchases over time.',
            '100% Pre-Funded Mandate: any expenditure charged to a credit card on behalf of a partner club, tournament, or general operation must be backed by cleared, available funds already present in the corresponding designated bank account PRIOR to the card being swiped or charged.',
            'Full Balance Payoff: card balances must be paid off in full on or before the monthly due date directly from the pre-funded account, to prevent interest charges or liabilities.',
          ],
        },
        {
          kind: 'term',
          term: 'Section 3. Reward Points and Cashback Governance.',
          items: [
            'Discretionary Pool Property: all reward points, travel miles, statement credits, and cash-back bonuses accrued through corporate card spending are the property of the Corporation and belong to the General Discretionary Fund.',
            'Redemption: accrued points and rewards may be redeemed for organizational travel, event emergency buffers, volunteer appreciation, community clinics, equipment, or granted to support partner clubs, at the discretion of the President or by a majority vote of the Board.',
          ],
        },
        {
          kind: 'term',
          term: 'Section 4. Upfront Player Dues & Seasonal Budgeting.',
          body: 'Partner clubs are required to budget seasonal costs in advance and collect player dues, player deposits, or team fundraising revenues at the beginning of the season (or well in advance of payment deadlines). TV Ultimate will not front money or carry debt for tournament bids, travel, lodging, or uniforms under the expectation of collecting dues from players after an event has occurred.',
        },
        {
          kind: 'term',
          term: 'Section 5. Deficit & Overdraft Prevention.',
          body: 'Debit cards, credit cards, checks, and transfers are strictly restricted to the cleared balance in that specific account. No cardholder or officer may execute transactions that would cause an account to overdraft or incur a negative balance.',
        },
      ],
    },
    {
      heading: 'ARTICLE VI: FIDUCIARY CONTROLS, RECEIPTS & YEARLY RECONCILIATION',
      blocks: [
        {
          kind: 'term',
          term: 'Section 1. Mandatory Receipt Uploads to Relay.',
          body: 'All receipts, invoices, and payment confirmations for any transaction — physical card, digital card, check, or electronic transfer — must be uploaded directly under the “Expenses” tab in Relay Banking.',
        },
        {
          kind: 'term',
          term: 'Section 2. Prohibition of Private Inurement.',
          body: 'In strict accordance with IRS 501(c)(3) standards, all expenditures from any corporate or team account must exclusively advance amateur athletic competition, sports education, player development, or non-profit administration. Corporate funds and points may never be converted to personal private gain or distributed as profits to any individual.',
        },
        {
          kind: 'term',
          term: 'Section 3. Yearly Reconciliation & Reporting.',
          items: [
            'Yearly Reconciliation: the Treasurer shall complete a comprehensive financial reconciliation of all checking accounts, savings accounts, and credit card balances once per year.',
            'Annual Financial Report: the Treasurer shall present the completed yearly financial report and balance sheets to the Board of Directors.',
            'Club Access: authorized club captains have full access to view their team’s dedicated account statements, transactions, and balances at all times.',
          ],
        },
      ],
    },
    {
      heading: 'ARTICLE VII: POLICY ADOPTION & AMENDMENTS',
      blocks: [
        {
          kind: 'term',
          term: 'Section 1. Adoption.',
          body: 'This Organizational Funds & Capital Management Policy becomes effective upon approval by a majority vote of the Board of Directors.',
        },
        {
          kind: 'term',
          term: 'Section 2. Amendments.',
          body: 'This policy may be amended, altered, or replaced by a simple majority vote of the sitting Board of Directors at any regular, special, or asynchronous meeting.',
        },
      ],
    },
  ],
};
