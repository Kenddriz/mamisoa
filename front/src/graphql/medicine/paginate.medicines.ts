import {
  MedicinePaginationOutput,
  PaginationInput,
  QueryPaginateMedicinesArgs, Unit
} from 'src/graphql/types';
import {gql} from '@apollo/client/core';
import {MEDICINE_FIELDS} from 'src/graphql/medicine/medicine.sdl';
import {reactive} from 'vue';
import {useQuery, useResult} from '@vue/apollo-composable';
import {InitialPagination, PAGINATION_META} from 'src/graphql/utils/pagination';
import {BATCH_FIELDS} from 'src/graphql/batch/batch.sdl';

export class MedOption {
  value = 0;
  label = '';
  packaging: {id: number, units: Unit[] } = {
    id: 0,
    units: []
  }
}
type PaginateMedicinesData = {
  paginateMedicines: MedicinePaginationOutput;
}
const PAGINATE_MEDICINES = (withBatches: boolean) => gql`
    query PaginateMedicines($input: PaginationInput!) {
      paginateMedicines(input: $input) {
        items{
          ${MEDICINE_FIELDS}
          ${withBatches ? `batches{${BATCH_FIELDS}}` : ''}
        }
        ${PAGINATION_META}
      }
    }
`;
export const usePaginateMedicines = (limit = Math.ceil((screen.height - 150)/50), withBatches = true) => {
  const input = reactive<PaginationInput>({
    page: 1,
    limit,
    keyword: ''
  });
  const { result, loading: pcLoading, refetch } = useQuery<
    PaginateMedicinesData,
    QueryPaginateMedicinesArgs
    >(PAGINATE_MEDICINES(withBatches), { input: { ...input } });

  function submitSearch() {
    void refetch({ input });
  }

  const medicines = useResult<
    PaginateMedicinesData|undefined,
    MedicinePaginationOutput,
    MedicinePaginationOutput
    >(result, InitialPagination, pick => {
      if(pick?.paginateMedicines) return pick.paginateMedicines;
      return InitialPagination
  });
  return {
    medicines,
    pcLoading,
    input,
    submitSearch
  }
}
