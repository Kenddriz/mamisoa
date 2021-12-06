import {MonthlyMovementsInput, MonthlyMovementsOutput, QueryMonthlyMovementsArgs} from 'src/graphql/types';
import {gql} from '@apollo/client/core';
import {reactive} from 'vue';
import {useLazyQuery, useResult} from '@vue/apollo-composable';

type MonthlyMovementsData = {
  monthlyMovements: MonthlyMovementsOutput[];
};

const MONTHLY_MOVEMENTS = gql`
    query MonthlyMovements($input: MonthlyMovementsInput!) {
      monthlyMovements(input: $input) {
        medicineId
        in
        out
        stock
      }
    }
`;

export const useMonthlyMovements = () => {
  const date = new Date;
  let month = date.getMonth() + '-';
  if(month.length < 3) month = '0' + month;
  month += date.getFullYear();
  const monthlyMvtInput = reactive<MonthlyMovementsInput>({
    medicineIds: [],
    month
  });
  const { loading: monthlyMvtLoading, result, load  } = useLazyQuery<
    MonthlyMovementsData,
    QueryMonthlyMovementsArgs
    >(MONTHLY_MOVEMENTS, { input: { ... monthlyMvtInput } });
  const movements = useResult<
    MonthlyMovementsData|undefined,
    MonthlyMovementsOutput[],
    MonthlyMovementsOutput[]
    >(result, [], res => res?.monthlyMovements || [])
  function submitMonthlyMvt(medicineIds: number[]) {
    monthlyMvtInput.medicineIds = medicineIds;
    if(medicineIds.length > 0)
      void load(MONTHLY_MOVEMENTS, { input: monthlyMvtInput });
  }
  function findMovement(medicineId: number): MonthlyMovementsOutput {
    const mvt = movements.value.find(m => m.medicineId === medicineId);
    if(mvt) return mvt;
    return { medicineId, in: 0, out: 0, stock: 0 }
  }
  return { movements, monthlyMvtLoading, findMovement, submitMonthlyMvt, monthlyMvtInput }
}
