<template>
  <q-select
    :loading="pcLoading"
    dense
    hide-dropdown-icon
    hide-bottom-space
    :model-value="model"
    v-model="model"
    use-input
    :options-dense="true"
    :options="options"
    @filter="filterFn"
    @update:model-value="$emit('update', $event)"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          Aucun résultat
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import {MedOption, usePaginateMedicines} from 'src/graphql/medicine/paginate.medicines';

export default defineComponent({
  name: 'MedicineSelect',
  props: ['modelValue'],
  emits: ['update'],
  setup(props) {
    const { medicines, submitSearch, input, pcLoading } = usePaginateMedicines();
    const defaultOptions = computed(() => medicines.value.items.map(m => ({
      label: m.label,
      value: m.id,
      packaging: {
        id: m.packaging.id,
        units: m.packaging.units
      }
    })));
    const options = ref<MedOption[]>(defaultOptions.value);
    return {
      options,
      pcLoading,
      model: ref<MedOption>(props?.modelValue||new MedOption()),
      filterFn (val: string, update: any) {
        if (val === '') {
          update(() => {
            options.value = defaultOptions.value
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase();
          options.value = defaultOptions.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
          if(!options.value.length) {
            input.keyword = needle;
            submitSearch();
          }
        })
      }
    }
  }
})
</script>

<style scoped>

</style>
