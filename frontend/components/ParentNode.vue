<template>
  <div class="p-2 flex flex-col gap-3 text-sm">
    <div @click="open = !open" class="flex gap-x-2 items-center cursor-pointer">
      <div
        class="p-[2px] w-fit rounded-full hover:bg-gray-300/50 transition-all"
      >
        <ion-icon
          :key="open"
          class="flex items-center justify-center text-black dark:text-white"
          :name="`caret-${open ? 'down' : 'forward'}-outline`"
        ></ion-icon>
      </div>
      <div class="flex items-center gap-x-1">
        <ion-icon name="layers"></ion-icon>
        <div class="font-bold">{{ datasetName }}</div>
      </div>
    </div>
    <template v-if="open">
      <Node
        class="px-[calc(2px_+_0.5rem)]"
        v-for="(item, index) in Object.keys(tableSchema)"
        :key="index"
        :title="item"
        :data="tableSchema[item].fields"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: "parentNode",
  props: {
    tableSchema: {
      type: Object,
      required: true,
    },
    datasetName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      open: true,
    };
  },
};
</script>

<style></style>
