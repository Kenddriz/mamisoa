<template>
  <q-page>
    <q-card flat bordered>
      <q-card-section class="q-pa-xs">
        <q-item>
          <q-item-section side>
            <q-icon color="amber-12" size="md" name="door_sliding" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6 text-weight-bold">
              Conditionnements et unités de vente
              <q-spinner-ios color="deep-orange" v-if="loadList" />
            </q-item-label>
            <q-item-label caption>
              Glisser les éléments pour exécuter une opération
              <q-icon size="xs" name="arrow_forward" />
              <q-icon size="xs" name="arrow_back" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator />
      <ScrollArea style="height: calc(100vh - 160px);">
        <q-card-section class="q-pb-none">
          <ScrollArea
            v-for="(pk, index) in packagingList"
            :key="index" style="height: 70px; max-width: 100%;"
          >
            <UpdatePackaging :packaging="pk">
              <q-fab-action
                padding="5px"
                color="red"
                icon="delete"
                @click="medicinesUser([pk.id, 'packagingId'])"
              />
            </UpdatePackaging>
            <q-separator class="q-mt-sm" inset/>
          </ScrollArea>
        </q-card-section>
        <!---add line --->
        <AddPackagingLine />
      </ScrollArea>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import ScrollArea from 'components/shared/ScrollArea.vue';
import AddPackagingLine from 'components/packaging/AddPackagingLine.vue';
import UpdatePackaging from 'components/packaging/UpdatePackaging.vue';
import {useListPackaging} from 'src/graphql/packaging/packaging.service';


export default defineComponent({
  name: 'Units',
  components: { ScrollArea, AddPackagingLine, UpdatePackaging },
  setup() {
    const { dialog } = useQuasar();
    return {
      tab: ref<string>('forms'),
      ...useListPackaging(),
      medicinesUser: (event: unknown[]) => {
        dialog({
          componentProps: {measureId: event[0], foreignKey: event[1]}
        })
      }
    }
  }
})
</script>

<style scoped>

</style>
