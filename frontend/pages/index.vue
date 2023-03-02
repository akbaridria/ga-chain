<template>
  <div class="bg-slate-700 h-[90%] w-full p-3 rounded-xl">
    <div class="h-[40%] bg-slate-800 rounded-lg shadow-md p-5 text-sm flex">
      <client-only>
        <codemirror
          class="codemirror flex-1"
          v-model="code"
          :options="cmOption"
          ref="basic"
        />
      </client-only>
      <div class="flex-none ml-2">
        <div
          class="p-2 cursor-pointer shadow-md bg-blue-800 rounded-full hover:brightness-[0.8] transition-all"
          @click="run()"
        >
          <ion-icon
            class="flex items-center justify-center"
            name="play"
          ></ion-icon>
        </div>
      </div>
    </div>
    <div class="h-[60%] bg-slate-800 rounded-lg shadow-md mt-1 p-5">
      <ul
        class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
      >
        <li class="mr-2">
          <div
            aria-current="page"
            class="inline-block p-2 bg-gray-700 rounded-t-lg active"
          >
            Query Result
          </div>
        </li>
      </ul>
      <div v-if="loading" class="flex items-center justify-center h-[100%]" >
        <LoaderSpin/>
      </div>
      <div v-if="!loading && error !== ''" class="flex items-center justify-center h-[100%]">
        <div class="text-sm text-red-600">{{ error }}</div>
      </div>
      <div v-if="!loading && error === '' && result.length === 0" class="flex items-center justify-center h-[100%]">
        <div class="text-sm">no data</div>
      </div>
      <div v-if="result.length > 0 && !loading" class="flex justify-end mt-2">
        <div @click="download" class="text-sm cursor-pointer hover:underline">Download as CSV</div>
      </div>
      <div v-if="result.length > 0 && !loading" class="overflow-auto h-[75%] mt-4">
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th v-for="(item, index) in Object.keys(result[0])" :key="index" scope="col" class="p-2">{{ item }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in result"
              :key="index"
              class="bg-white border-b dark:bg-slate-800 dark:border-gray-700"
            >
              <td v-for="(item2, index2) in Object.keys(item)" :key="index2" class="p-2">{{ item[item2] }}</td>
              <!-- <td class="px-6 py-4">Laptop</td>
              <td class="px-6 py-4">$2999</td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import "codemirror/mode/sql/sql.js";
import { runQuery } from "../utils/bq";
import { defaultCode, downloadCsv } from "../utils/helper"

export default {
  name: "IndexPage",
  data() {
    return {
      cmOption: {
        tabSize: 2,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: "text/x-mysql",
        theme: "base16-dark",
        keyMap: "default",
      },
      code: defaultCode,
      result: [],
      loading: false,
      error: ''
    };
  },
  mounted() {},
  methods: {
    async run() {
       this.loading = true
      try {
        const d = await runQuery(this.code);
        this.result = d 
        this.error = ''
      } catch (error) {
        this.error = error.message
      }
      this.loading = false
    },
    download(){
      downloadCsv(this.result)
    }
  },
};
</script>
<style>
.CodeMirror {
  height: 100%;
  background: none !important;
}
.CodeMirror-gutters {
  background: none !important;
}
.CodeMirror-activeline-background {
  background: none !important;
}
.vue-codemirror {
  height: 100%;
}
</style>
