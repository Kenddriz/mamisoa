<template>
  <q-dialog ref="dialogRef">
    <MovableCard>
      <template v-slot:title>
        Nouveau médicament
      </template>
      <MedicineForm
        @submit="createMedicine"
      />
    </MovableCard>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MedicineForm from './MedicineForm.vue';
import MovableCard from 'components/shared/MovableCard.vue';
import {useDialogPluginComponent} from 'quasar';
import {useCreateMedicine} from 'src/graphql/medicine/create.medicine';

export default defineComponent({
  name: 'AddMedicine',
  components: {
    MedicineForm,
    MovableCard
  },
  setup() {
    const { dialogRef } = useDialogPluginComponent()
    return {
      dialogRef,
      ...useCreateMedicine(),
    }
  }
});
</script>

<style scoped>

</style>
