<template>
  <q-table
    flat
    bordered
    title="Treats"
    :rows="[]"
    :columns="columns"
    row-key="name"
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
      <div class="text-h6">Mouvement de stock mensuel</div>
      <q-space />
      <q-select
        :model-value="month"
        v-model="month"
        :options="months"
        label="Mois"
        use-input
        style="width: 160px"
        dense
        emit-value
        map-options
      />
      <q-input
        label="Année"
        dense
        type="number"
        color="primary"
        class="q-mx-md"
      />

      <q-input
        label="Chercher"
        dense
        debounce="300"
        color="primary"
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
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
          {{ col.value }}
        </q-td>
      </q-tr>
      <q-tr no-hover v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
        </q-td>
      </q-tr>
    </template>

  </q-table>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {useI18n} from 'vue-i18n';
const columns = [
  { name: 'label', label: 'Désignation', align: 'left', field: 'label', sortable: true},
  { name: 'in', align: 'center', label: 'Entrée', sortable: true },
  { name: 'out', align: 'center', label: 'Sortie', sortable: true },
  { name: 'stock', align: 'center', label: 'Stock', sortable: true },
]
export default defineComponent({
  name: 'StockMovement',
  setup() {
    const { tm } = useI18n();
    const month = ref(0);
    return {
      columns,
      months: (tm('local.monthsLong') as string[]).map((label, value) => ({ label, value })),
      month
    }
  }
})
</script>

<style scoped>

</style>
