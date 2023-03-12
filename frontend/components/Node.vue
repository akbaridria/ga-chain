<template>
  <div class="flex flex-col gap-y-2">
    <div class="flex gap-x-2 items-center cursor-pointer" @click="open = !open">
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
        <ion-icon name="albums"></ion-icon>{{ title }}
      </div>
    </div>
    <div class="flex flex-col gap-y-2" :class="{'hidden': !open}">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="flex gap-x-2 items-center cursor-pointer"
      >
        <div class="px-[calc(2px_+_0.5rem)]"></div>
        <div
          class="p-[2px] w-fit rounded-full hover:bg-gray-300/50 transition-all"
        >
          <ion-icon
            class="flex items-center justify-center text-black dark:text-white"
            :name="`menu`"
          ></ion-icon>
        </div>
        <div class="flex gap-x-1 items-center">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Node",
  props: {
    title: {
      type: String,
      required: false,
      default: "ga-chain",
    },
    data: {
      type: Array,
      required: false,
      default: [],
    },
  },
  data() {
    const open = false;
    return {
      open,
    };
  },
};
</script>

<style></style>
