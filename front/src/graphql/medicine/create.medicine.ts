import {useMutation} from '@vue/apollo-composable';
import {MEDICINE_FIELDS} from 'src/graphql/medicine/medicine.sdl';
import {CreateMedicineInput, Medicine, MutationCreateMedicineArgs} from 'src/graphql/types';
import {Loading} from 'quasar';
import {notify} from 'src/shared/notification';
import {gql} from '@apollo/client/core';
import {addPaginationCache} from 'src/graphql/utils/pagination';


type CreateMedicineData = {
  createMedicine: Medicine
}
const CREATE_MEDICINE = gql`
  mutation CreateMedicine($input: CreateMedicineInput!) {
    createMedicine(input: $input) {
      ${MEDICINE_FIELDS}
    }
  }
`;

export const useCreateMedicine = () => {
  const { mutate, onDone } = useMutation<
    CreateMedicineData,
    MutationCreateMedicineArgs
    >(CREATE_MEDICINE, {
    update(cache, { data }){
      if(data?.createMedicine) {
        cache.modify({
          fields: {
            paginateMedicines(existing: any, {toReference}) {
              return addPaginationCache(data.createMedicine, existing, toReference);
            }
          }
        })
      }
    }
  });
  onDone(({ data }) => {
    Loading.hide();
    notify(data?.createMedicine ? 'Création avec succès !' : 'Création echouée !');
  })
  function createMedicine(input: CreateMedicineInput) {
    Loading.show({
      message: 'Création ...'
    });
    void mutate({ input });
  }
  return { createMedicine }
}
