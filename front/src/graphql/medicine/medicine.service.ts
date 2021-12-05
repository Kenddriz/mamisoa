import {
  MutationSoftRemoveMedicineArgs,
  MutationUpdateMedicineArgs,

  QueryMostConsumedMedicinesArgs,
  MutationRemoveMedicineArgs,
  MutationRestoreMedicineArgs,
  PaginationInput,
  QueryPaginateDeletedMedicinesArgs, CreateMedicineInput
} from '../types';
import { useMutation, useQuery, useResult } from '@vue/apollo-composable';
import {
  SOFT_REMOVE_MEDICINE,
  SoftRemoveMedicineData,
  UPDATE_MEDICINE,
  UpdateMedicineData,
  MOST_CONSUMED_MEDICINES,
  MostConsumedMedicinesData,
  RemoveMedicineData,
  REMOVE_MEDICINE,
  RestoreMedicineData,
  RESTORE_MEDICINE,
  PAGINATE_DELETED_MEDICINES,
  PaginateDeletedMedicinesData,
} from './medicine.sdl';
import { removeDialog } from '../utils/utils';
import { reactive, ref } from 'vue';
import { addPaginationCache, deletePaginationCache, InitialPagination } from '../utils/pagination';
import { Loading } from 'quasar';
import { notify } from 'src/shared/notification';

export const useUpdateMedicine = () => {
  const { mutate, onDone } = useMutation<
    UpdateMedicineData,
    MutationUpdateMedicineArgs
    >(UPDATE_MEDICINE);
  onDone(() => {
    Loading.hide();
    notify('Mise à jour avec succès !');
  })
  function updateMedicine(id: number, form: CreateMedicineInput) {
    Loading.show({ message: 'Mise à jour ...'});
    void mutate({ input: {id, form} });
  }
  return { updateMedicine }
}
export const useMostConsumedMedicines = () => {
  const year = ref<number>(new Date().getFullYear());
  const { loading, result } = useQuery<
    MostConsumedMedicinesData,
    QueryMostConsumedMedicinesArgs
    >(MOST_CONSUMED_MEDICINES, { year: year.value }, { fetchPolicy: 'no-cache' });
  const consumed = useResult(result, [], pick => pick?.mostConsumedMedicines);
  return {
    loading,
    consumed,
    year
  }
}
export const usePaginateDeletedMedicines = () => {
  const input = reactive<PaginationInput>({
    page: 1,
    limit : 5
  });
  const { loading: pmLoading, result } = useQuery<
    PaginateDeletedMedicinesData,
    QueryPaginateDeletedMedicinesArgs
    >(PAGINATE_DELETED_MEDICINES, { input });
  const medicines = useResult(result, InitialPagination, pick => pick?.paginateDeletedMedicines||InitialPagination)
  return {
    input,
    pmLoading,
    medicines
  }
}
export const useSoftRemoveMedicine = () => {
  const { mutate, onDone } = useMutation<
    SoftRemoveMedicineData,
    MutationSoftRemoveMedicineArgs
    >(SOFT_REMOVE_MEDICINE);
  onDone(() => {
    Loading.hide();
    notify('Suppression avec succès !');
  })
  return {
    softRemoveMedicine: (id: number) => {
      removeDialog(() => {
        Loading.show({ message: 'Suppression ...'});
        void mutate({ id }, {
          update(cache, { data }){
            if(data?.softRemoveMedicine) {
              cache.modify({
                fields: {
                  paginateDeletedMedicines(existing: any, {toReference}) {
                    return addPaginationCache(data.softRemoveMedicine, existing, toReference);
                  },
                  paginateMedicines(existingRef: any, { readField, toReference }) {
                    return deletePaginationCache(id, existingRef, readField, toReference);
                  }
                }
              })
            }
          }
        });
      })
    }
  }
}
export const useRemoveMedicine = () => {
  const { mutate, onDone } = useMutation<
    RemoveMedicineData,
    MutationRemoveMedicineArgs
    >(REMOVE_MEDICINE);
  onDone(() => {
    Loading.hide();
    notify('Suppression avec succès !');
  })
  function remove(id: number) {
    removeDialog(() => {
      Loading.show({ message: 'Suppression ...'});
      void mutate({ id  }, {
        update(cache, { data }){
          if(data?.removeMedicine) {
            cache.modify({
              fields: {
                paginateDeletedMedicines(existing: any, {readField, toReference}) {
                  return deletePaginationCache(id, existing, readField, toReference);
                }
              }
            })
          }
        }
      })
    }, 'removeForever')
  }
  return { remove }
}
export const useRestoreMedicine = () => {
  const { mutate, onDone } = useMutation<
    RestoreMedicineData,
    MutationRestoreMedicineArgs
    >(RESTORE_MEDICINE);
  onDone(() => {
    Loading.hide();
    notify('Restauration avec succès !');
  });
  function restore (id: number) {
    Loading.show({ message: 'Restauration ...'});
    void mutate({ id }, {
      update(cache, { data }){
        if(data?.restoreMedicine) {
          cache.modify({
            fields: {
              paginateDeletedMedicines(existing: any, {readField,toReference}) {
                return deletePaginationCache(id, existing, readField, toReference);
              },
              paginateMedicines(existing: any, {toReference}) {
                return addPaginationCache(data.restoreMedicine, existing, toReference);
              },
            }
          })
        }
      }
    })
  }
  return { restore }
}

