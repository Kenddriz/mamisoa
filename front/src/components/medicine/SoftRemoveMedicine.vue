<template>
  <q-dialog ref="dialogRef">
    <MovableCard style="width: 600px; max-width: 600px">
      <template v-slot:title>
        {{medicine.label}}
      </template>
      <ScrollArea
        :style="`height:${$q.screen.height - 100}px`"
        v-if="medicine.batches.length > 0"
        class="q-pa-sm"
      >
        <q-item class="col-12 text-body1">
          <q-item-section>
            <q-item-label>Vous ne pouvez pas supprimer ce médicament</q-item-label>
            <q-item-label caption>
              Il comporte {{batchCount}} lot{{batchCount > 1 ? 's' : ''}}.
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator :spaced="true" />
        <Batch :medicine="medicine" />
      </ScrollArea>
      <q-card-section
        v-else
        style="height: 90%"
        class="column justify-center items-center"
      >
        <p class="text-subtitle1 text-center">
          Le médicament n'est pas utilisé actuellement.
        </p>
        <q-btn
          no-caps
          rounded
          v-close-popup
          icon="delete"
          color="warning"
          outline
          label="Supprimer"
          @click="softRemoveMedicine(medicine.id)"
        />
      </q-card-section>
    </MovableCard>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import Batch from '../batch/Batch.vue';
import { useSoftRemoveMedicine } from 'src/graphql/medicine/medicine.service';
import ScrollArea from '../shared/ScrollArea.vue';
import {Medicine} from 'src/graphql/types';
import MovableCard from 'components/shared/MovableCard.vue';

export default defineComponent({
  name: 'SoftRemoveMedicine',
  components: { Batch, ScrollArea, MovableCard },
  props: {
    medicine: {
      type: Object as PropType<Medicine>,
      required: true
    }
  },
  setup(props) {
    const { dialogRef } = useDialogPluginComponent();
    return {
      dialogRef,
      ...useSoftRemoveMedicine(),
      batchCount: props.medicine.batches.length
    }
  }
});
</script>
<style scoped>
</style>
