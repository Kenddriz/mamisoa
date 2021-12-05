<template>
  <q-page class="q-pa-xs">
    <q-splitter
      :model-value="splitterModel"
      v-model="splitterModel"
      style="height: 85vh"
    >

      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          class="text-teal"
          no-caps
        >
          <q-tab name="command" icon="mail" label="Commander" />
          <q-tab name="movement" icon="alarm" label="Mouvement" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          transition-prev="slide-down"
          transition-next="slide-up"
        >
          <q-tab-panel name="command" class="q-pa-xs">
            <CommandMedicine />
          </q-tab-panel>

          <q-tab-panel name="movement">
            <StockMovement />
          </q-tab-panel>
        </q-tab-panels>
      </template>

    </q-splitter>
  </q-page>
</template>

<script lang="ts">
import {ref} from 'vue';
import CommandMedicine from 'components/medicine/CommandMedicine.vue';
import StockMovement from 'components/stock-movement/StockMovement.vue';

export default {
  name: 'Medicine',
  components: { CommandMedicine, StockMovement },
  setup () {
    return {
      tab: ref('command'),
      splitterModel: ref(10)
    }
  }
};
</script>

<style scoped)>

</style>
