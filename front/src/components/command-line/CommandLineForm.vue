<template>
  <q-form
    class="q-gutter-md text-blue-grey-14"
    @submit="$emit('save', { medicineId: medicine.value, quantity })"
  >
    <MedicineSelect
      :model-value="medicine"
      @update="medicine = $event"
      label="Nom du médicament*"
      lazy-rules
      :rules="[ val => val.value > 0 || 'Médicament à commander*']"
    />
    <PackagingInput
      :units="medicine.packaging.units"
      @set-model="quantity = $event"
      outlined
      label="Quantité"
      :value="quantity"
    />
    <div class="row justify-end">
      <q-btn
        type="submit"
        color="primary"
        outline
        label="Enregistrer"
        icon="save"
        no-caps
        v-close-popup
      />
    </div>
  </q-form>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive, ref} from 'vue';
import PackagingInput from '../packaging/PackagingInput.vue';
import { CommandLine, Medicine } from 'src/graphql/types';
import {cloneDeep} from 'src/graphql/utils/utils';
import MedicineSelect from 'components/medicine/MedicineSelect.vue';
import {MedOption} from 'src/graphql/medicine/paginate.medicines';

export default defineComponent({
  name: 'CommandLineForm',
  components: { PackagingInput, MedicineSelect },
  props: {
    commandLine: Object as PropType<CommandLine>
  },
  emits: ['save'],
  setup(props) {
    const medicine = reactive<MedOption>(new MedOption());
    const quantity = ref<number>(1);
    if(props?.commandLine) {
      const med: Medicine = cloneDeep(props.commandLine.medicine);
      Object.assign(medicine, {
        value: med.id,
        label: `${med.label}`,
        packaging: med.packaging
      })
      quantity.value = Number(props.commandLine.quantity);
    }
    return {
      medicine,
      quantity
    }
  }
});
</script>

<style scoped>

</style>
