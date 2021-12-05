<template>
  <q-dialog ref="dialogRef">
    <MovableCard>
      <template v-slot:title>
        Mise à jour
      </template>
        <MedicineForm
          :item="medicine"
          @submit="updateMedicine(medicine.id, $event)"
        />
    </MovableCard>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import MedicineForm from './MedicineForm.vue';
import { useUpdateMedicine } from 'src/graphql/medicine/medicine.service';
import { Medicine } from 'src/graphql/types';
import { useDialogPluginComponent } from 'quasar';
import MovableCard from 'components/shared/MovableCard.vue';

export default defineComponent({
  name: 'UpdateMedicine',
  props: {
    medicine: {
      type: Object as PropType<Medicine>,
      required: true
    }
  },
  components: { MedicineForm, MovableCard },
  setup() {
    const { dialogRef } = useDialogPluginComponent();
    return {
      dialogRef,
      ...useUpdateMedicine(),
    }
  },
});
</script>

<style scoped>

</style>
