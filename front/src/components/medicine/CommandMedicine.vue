<template>
  <q-table
    flat
    bordered
    title="Treats"
    :rows="medicines.items"
    :columns="columns"
    row-key="id"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:top>
      <q-btn
        rounded
        outline
        no-caps
        icon="add"
        color="primary"
        label="Nouveau médicament"
        @click="addMedicine()"
      />
      <q-space />
      <q-input
        :model-value="input.keyword"
        v-model="input.keyword"
        label="Chercher"
        dense
        color="primary"
        @keyup.enter="submitSearch()"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template v-slot:body="props">
      <q-tr no-hover :props="props">
        <q-td auto-width>
          <q-btn
            unelevated
            size="sm"
            color="primary"
            round
            dense
            @click="props.expand = !props.expand"
            :icon="props.expand ? 'remove' : 'add'"
          />
        </q-td>
        <q-td key="label">
          {{props.row.label}}
        </q-td>
        <q-td key="stockTotal">
          <SubdivideList
            :units="props.row.packaging.units"
            :current-stock="props.row.stockTotal"
          />
        </q-td>
        <q-td class="q-gutter-x-xs" auto-width key="actions">
          <q-btn
            dense
            no-caps
            flat
            color="primary"
            icon="edit"
            class="q-pl-sm"
            @click="updateMedicine(props.row)"
          />
          <q-btn
            dense
            no-caps
            flat
            color="primary"
            icon="touch_app"
          />
          <q-btn
            dense
            no-caps
            flat
            color="deep-orange"
            icon="delete"
            class="q-pr-sm"
            @click="softRemoveMedicine(props.row)"
          />
        </q-td>
      </q-tr>
      <q-tr no-hover v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <Batch v-if="props.row.batches.length" :medicine="props.row" />
          <div v-else class="text-center text-subtitle1">Aucun lot</div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
import {defineComponent, defineAsyncComponent } from 'vue';
import {useQuasar} from 'quasar';
import {usePaginateMedicines} from 'src/graphql/medicine/paginate.medicines';
import Batch from 'components/batch/Batch.vue';
import {Medicine} from 'src/graphql/types';
import SubdivideList from 'components/packaging/SubdivideList.vue';

const columns = [
  {
    name: 'label',
    label: 'Désignation',
    align: 'left',
    field: 'label',
    sortable: true
  },
  { name: 'stockTotal', align: 'left', label: 'Stock Total', field: 'stockTotal', sortable: true },
  { name: 'actions', label: 'Actions' },
]
export default defineComponent({
  name: 'CommandMedicine',
  components: { Batch, SubdivideList },
  setup() {
    const { dialog } = useQuasar();
    return {
      columns,
      addMedicine: () => dialog({
        component: defineAsyncComponent(() => import('components/medicine/AddMedicine.vue')),
      }),
      updateMedicine: (medicine: Medicine) => dialog({
        component: defineAsyncComponent(() => import('components/medicine/UpdateMedicine.vue')),
        componentProps: { medicine }
      }),
      softRemoveMedicine: (medicine: Medicine) => dialog({
        component: defineAsyncComponent(() => import('components/medicine/SoftRemoveMedicine.vue')),
        componentProps: { medicine }
      }),
      ...usePaginateMedicines()
    }
  }
})
</script>

<style scoped>

</style>
