import { PACKAGING_PARAMS } from '../packaging/packaging.sdl';
import { Medicine, MedicinePaginationOutput, MostConsumedMedicineOutput } from '../types';
import { gql } from '@apollo/client/core';
import { PAGINATION_META } from '../utils/pagination';

export const MEDICINE_FIELDS = `
  id
  label
  currentSalePrice
  currentVat
  stockTotal
  packaging{${PACKAGING_PARAMS}}
  createdAt
  updatedAt
`;
export type UpdateMedicineData = {
  updateMedicine: Medicine
}
export const UPDATE_MEDICINE = gql`
  mutation UpdateMedicine($input:UpdateMedicineInput!) {
    updateMedicine(input: $input) {
      ${MEDICINE_FIELDS}
    }
  }
`;

export type MostConsumedMedicinesData = {
  mostConsumedMedicines: MostConsumedMedicineOutput;
}
export const MOST_CONSUMED_MEDICINES = gql`
    query MostConsumedMedicines($year: Int!) {
      mostConsumedMedicines(year: $year) {
        medicine {
          ${MEDICINE_FIELDS}
        }
        count
      }
    }
`;
export type PaginateDeletedMedicinesData = {
  paginateDeletedMedicines: MedicinePaginationOutput;
}
export const PAGINATE_DELETED_MEDICINES = gql`
  query PaginateDeletedMedicines($input: PaginationInput!){
    paginateDeletedMedicines(input: $input) {
      items{${MEDICINE_FIELDS} archivedAt}
      ${PAGINATION_META}
    }
  }
`;
export type SoftRemoveMedicineData = {
  softRemoveMedicine: Medicine;
}
export const SOFT_REMOVE_MEDICINE = gql`
  mutation SoftRemoveMedicine($id: Int!) {
    softRemoveMedicine(id: $id) {
      ${MEDICINE_FIELDS}
      archivedAt
    }
  }
`;
export type RemoveMedicineData = {
  removeMedicine: boolean;
}
export const REMOVE_MEDICINE = gql`
  mutation RemoveMedicine($id: Int!) {
    removeMedicine(id: $id)
  }
`;
export type RestoreMedicineData = {
  restoreMedicine: Medicine;
}
export const RESTORE_MEDICINE = gql`
  mutation RestoreMedicine($id: Int!) {
    restoreMedicine(id: $id) {
      ${MEDICINE_FIELDS}
    }
  }
`;
