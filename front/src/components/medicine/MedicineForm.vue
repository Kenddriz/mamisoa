<template>
  <q-form
    class="q-gutter-y-sm q-pa-sm"
    style="min-width: 250px"
    @submit.prevent="input.packagingId = selectedPk.id; $emit('submit', input)"
  >
    <q-input
      outlined
      stack-label
      dense
      label="Désignation"
      :model-value="input.label"
      v-model="input.label"
    />
    <PackagingList
      :packaging="packagingList"
      :selected="selectedPk"
      @selected="Object.assign(selectedPk, $event)"
    />
    <PackagingInput
      label="Prix unitaire de vente"
      outlined
      :units="selectedPk.units"
      :value="input.currentSalePrice"
      @set-model="input.currentSalePrice = $event"
      :is-q="false"
    />

    <q-input
      type="number"
      :min="0"
      :model-value="input.currentVat"
      v-model.number="input.currentVat"
      dense
      outlined
      stack-label
      label="TVA"
      suffix="%"
      input-class="text-blue-grey-14"
    />
    <q-btn
      :disable="!selectedPk"
      v-close-popup
      class="full-width"
      color="primary"
      no-caps
      rounded
      outline
      dense
      label="Enregistrer"
      type="submit"
    />
  </q-form>

</template>

<script lang="ts">
import {defineComponent, PropType, reactive} from 'vue';
import PackagingList from '../packaging/PackagingList.vue';
import {CreateMedicineInput, Medicine} from 'src/graphql/types';
import PackagingInput from '../packaging/PackagingInput.vue';
import {useListPackaging} from 'src/graphql/packaging/packaging.service';

export default defineComponent({
  name: 'MedicineForm',
  components: { PackagingList, PackagingInput },
  props: {
    item: Object as PropType<Medicine>
  },
  emits: ['submit'],
  setup(props) {
    const { selectedPk, packagingList } = useListPackaging();
    const input = reactive<CreateMedicineInput>({
      label: props?.item?.label||'',
      packagingId: selectedPk.id||0,
      currentSalePrice: props?.item?.currentSalePrice||0,
      currentVat: props?.item?.currentVat||0
    });
    return {
      selectedPk,
      packagingList,
      input
    }
  },
  mounted() {
    if(this.item?.packaging) {
      setTimeout(() => {
        Object.assign(this.selectedPk, this.item?.packaging);
      }, 0);
    }
  }
});
</script>

<style scoped>

</style>
