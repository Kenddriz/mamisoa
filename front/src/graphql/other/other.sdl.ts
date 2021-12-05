import { gql } from '@apollo/client/core';

export class CounterData {
  countMedicines = 0;
  countProviders = 0;
  countUndeliveredCommands = 0;
  countUnpaidInvoices = 0;
}

export const COUNTER = gql`
    query Count {
      countMedicines,
      countProviders,
      countUndeliveredCommands,
      countUnpaidInvoices
    }
`;

export type RemoveAllArchivedData = {
  removeAllArchived: number
}
export const REMOVE_ALL_ARCHIVED = gql`
    mutation RemoveAllArchived($repo: String!) {
      removeAllArchived(repo: $repo)
    }
`;
