<template>
  <q-card class="fit" style="height: 300px" flat bordered>
    <q-card-section class="q-py-none">
      <q-input
        :model-value="input.keyword"
        dense
        placeholder="Entrer un nom d'article et taper la touche entrée"
        @update:model-value="input.keyword = $event"
        @keyup.enter="submitSearch"
        :loading="pcLoading"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-card-section>
    <ScrollArea style="height: 240px" class="q-pa-md">
      <q-list dense class="text-blue-grey-14">
        <template v-if="medicines.items.length">
          <q-item
            v-for="(med, iMed) in medicines.items"
            :key="iMed"
          >
            <q-item-section side>
              {{ iMed + 1}}
            </q-item-section>
            <q-item-section side>
              {{med.label}}
            </q-item-section>
            <q-item-section class="text-center">
              <SubdivideList
                class="flex-center"
                :units="med.packaging.units"
                :current-stock="med.stockTotal"
              />
            </q-item-section>
          </q-item>
        </template>
        <q-item v-else>
          Aucun médicamant
        </q-item>
      </q-list>
    </ScrollArea>
    <template v-if="medicines.meta.totalPages < 1">
      <q-separator inset />
      <q-card-actions align="center">
        <q-pagination
          :model-value="input.page"
          v-model="input.page"
          outline
          color="grey"
          :max="medicines.meta.totalPages"
          :max-pages="10"
          boundary-numbers
        />
      </q-card-actions>
    </template>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SubdivideList from '../../packaging/SubdivideList.vue';
import ScrollArea from '../../shared/ScrollArea.vue';
import {usePaginateMedicines} from 'src/graphql/medicine/paginate.medicines';

export default defineComponent({
  name: 'MedicinesStocks',
  components: { SubdivideList, ScrollArea },
  setup() {
    return {
      ...usePaginateMedicines(10)
    }
  }
});
</script>

<style scoped>

</style>
