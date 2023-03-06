<template>
  <div class="h-screen">
    <div class="w-full h-full  bg-white text-black dark:bg-slate-800 dark:text-white">
      <div class="flex flex-col h-full">
        <Header class="flex-none" />
        <Nuxt style="flex: 1 1 auto;" />
        <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
        <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
        <script type="module" :src="`${host}/editor.bundle.js`"></script>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>