<template>
  <div class="flex flex-col">
    <div class="flex flex-auto">
      <div class="relative flex-none flex flex-col min-w-[17rem]">
        <div class="border-b-[1px] p-2 font-bold opacity-75">Data Explorer</div>
        <div class="relative h-full overflow-auto border-r-[1px]">
          <div class="absolute">
            <div class="p-2 mt-3 flex flex-col gap-3 text-sm font-bold">
              <div class="flex gap-x-2 items-center cursor-pointer">
                <div
                  class="p-[2px] w-fit rounded-full hover:bg-gray-300/50 transition-all"
                >
                  <ion-icon
                    :key="open"
                    class="flex items-center justify-center text-black"
                    :name="`caret-down-outline`"
                  ></ion-icon>
                </div>
                <div class="flex items-center gap-x-1">
                  <ion-icon name="layers"></ion-icon>zkSync_era_mainnet
                </div>
              </div>
              <Node
                class="px-[calc(2px_+_0.5rem)]"
                v-for="(item, index) in Object.keys(table_schema)"
                :key="index"
                :title="item"
                :data="table_schema[item].fields"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="relative flex-1 flex flex-col">
        <div class="flex-none border-b-[1px] border-l-[1px] p-2">
          <div class="flex justify-end">
            <div
              class="p-1 cursor-pointer w-fit shadow-md bg-blue-800 rounded-full hover:brightness-[0.8] transition-all"
              @click="run()"
            >
              <ion-icon
                class="flex items-center justify-center text-white"
                name="play"
              ></ion-icon>
            </div>
          </div>
        </div>
        <div class="flex-1 relative">
          <div id="editor" class="absolute h-full w-full" />
        </div>
        <div class="flex-1 flex flex-col" id="resut">
          <div class="border-y-[1px] flex-none flex items-center justify-between p-2">
            <div>Query Result</div>
            <div class="flex justify-end p-2">
              <div
                v-if="result.length > 0 && !loading"
                class="text-sm cursor-pointer gap-x-2 flex items-center text-blue-600 rounded-lg hover:bg-gray-300/50 px-2 py-1"
                @click="downloadData"
              >
                <ion-icon
                  class="text-base"
                  name="cloud-download-outline"
                ></ion-icon>
                <div>
                  DOWNLOAD AS CSV
                </div>
              </div>
            </div>
          </div>
          <div v-if="loading" class="flex items-center justify-center h-[100%]">
            <LoaderSpin />
          </div>
          <div
            v-if="!loading && error !== ''"
            class="flex items-center justify-center h-[100%]"
          >
            <div class="text-sm text-red-600">{{ error }}</div>
          </div>
          <div
            v-if="!loading && error === '' && result.length === 0"
            class="flex items-center justify-center h-[100%]"
          >
            <div class="text-sm">no data</div>
          </div>
          <div class="relative p-2 flex-1 overflow-auto">
            <div class="absolute w-full h-full">
              <table
                v-if="result && result.length > 0"
                class="text-sm text-left text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th
                      v-for="(item, index) in Object.keys(result[0])"
                      :key="index"
                      scope="col"
                      class="p-2"
                    >
                      {{ item }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in result"
                    :key="index"
                    class="bg-white border-b dark:bg-slate-800 dark:border-gray-700"
                  >
                    <td
                      v-for="(item2, index2) in Object.keys(item)"
                      :key="index2"
                      class="p-2"
                    >
                      {{ item[item2] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { sql } from "@codemirror/lang-sql";
import { defaultCode, table_schema, downloadCsv } from "../utils/helper";
import { runQuery } from "../utils/bq";

export default {
  name: "IndexPage",
  data() {
    return {
      host: window.location.origin,
      table_schema,
      defaultCode,
      view: null,
      loading: false,
      result: [],
      error: "",
    };
  },
  mounted() {
    this.view = new EditorView({
      doc: defaultCode,
      extensions: [basicSetup, keymap.of([indentWithTab]), sql()],
      parent: document.getElementById("editor"),
    });
  },
  methods: {
    async run() {
      console.log("oke gan disini");
      this.loading = true;
      try {
        const d = await runQuery(this.view.state.doc.toString());
        this.result = d;
        this.error = "";
      } catch (error) {
        this.error = error.message;
      }
      this.loading = false;
    },
    async downloadData() {
      console.log(this.result);
      await downloadCsv(this.result);
    },
  },
};
</script>
<style>
.cm-editor {
  height: 100%;
}
</style>
