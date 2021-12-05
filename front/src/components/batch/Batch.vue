<template>
  <div class="flex q-gutter-sm">
    <q-card
      v-for="(batch, index) in medicine.batches"
      :key="index"
      flat
      bordered
    >
      <q-card-section class="text-center text-subtitle1">
        {{formatDate(batch.expirationDate, 'DATE_ONLY')}}
      </q-card-section>
      <q-separator />
      <q-card-section horizontal>
        <q-list class="col">
          <q-item>
            <q-item-section>
              <q-item-label>Date d'ajout</q-item-label>
              <q-item-label caption>{{formatDate(batch.createdAt, 'DATE_TIME')}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Jours restants</q-item-label>
              <q-item-label caption>{{leftDays(batch.expirationDate)}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Quantité</q-item-label>
              <UnitConverter
                class="text-grey text-caption"
                align="left"
                :value="batch.currentStock"
                :units="medicine.packaging.units"
              />
            </q-item-section>
          </q-item>
        </q-list>
        <q-separator vertical />
        <q-card-actions vertical class="justify-around q-px-md">
          <q-btn
            align="left"
            color="primary"
            flat
            dense
            no-caps
            outline
            icon="inventory_2"
            label="Fiche de stock"
            @click="movementStock(index)"
          />
          <q-btn
            align="left"
            color="positive"
            flat
            dense
            no-caps
            outline
            icon="edit"
            label="Editer"
          >
            <BatchForm
              :units="medicine.packaging.units"
              :medicine-id="medicine.id"
              :batch="batch"
            />
          </q-btn>
          <RemoveBatch @stock="movementStock(index)" :id="batch.id" />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import BatchForm from './BatchForm.vue';
import { defineComponent, PropType } from 'vue';
import { Medicine } from 'src/graphql/types';
import { formatDate } from 'src/shared/date';
import UnitConverter from '../packaging/UnitConverter.vue';
import { cloneDeep, leftDays } from 'src/graphql/utils/utils';
import RemoveBatch from './RemoveBatch.vue';
import { useQuasar } from 'quasar';
import CardStock from '../medicine/CardStock.vue';

export default defineComponent({
  name: 'Batch',
  components: { BatchForm, UnitConverter, RemoveBatch },
  props: {
    medicine: {
      type: Object as PropType<Medicine>,
      required: true
    }
  },
  emits: ['stock'],
  setup(props) {
    const { dialog } = useQuasar();
    return {
      formatDate,
      leftDays,
      movementStock: (iB: number) => {
        const { batches, ...medicine } = cloneDeep(props.medicine);
        dialog({
          component: CardStock,
          componentProps: { medicine: {
              ...medicine,
            }, batch: batches[iB] }
        });
      },
    }
  }
});
</script>

<style scoped>

</style>
