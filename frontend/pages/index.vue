<template>
  <div class="flex flex-col">
    <div class="flex flex-auto max-w-full">
      <div
        class="relative flex-none flex flex-col min-w-[17rem] hidden lg:flex"
      >
        <div class="border-b-[1px] p-2 font-bold opacity-75 dark:border-gray-600">Data Explorer</div>
        <div class="relative h-full overflow-auto border-r-[1px] dark:border-gray-600">
          <div class="absolute">
            <div class="p-2 mt-3 flex flex-col gap-3 text-sm">
              <div class="flex gap-x-2 items-center cursor-pointer">
                <div
                  class="p-[2px] w-fit rounded-full hover:bg-gray-300/50 transition-all"
                >
                  <ion-icon
                    class="flex items-center justify-center text-black dark:text-white"
                    :name="`caret-down-outline`"
                  ></ion-icon>
                </div>
                <div class="flex items-center gap-x-1">
                  <ion-icon name="layers"></ion-icon>
                  <div>zkSync_era_mainnet</div>
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
      <div id="workspace" class="relative flex-1 flex min-w-[0px] flex-col">
        <div class="flex-none border-b-[1px] border-l-[1px] dark:border-gray-600">
          <div class="flex min-w-[0px]">
            <div
              class="flex flex-1 max-w-full items-center min-w-[0px] overflow-auto cursor-pointer"
            >
              <div
                @click="active_tab = item.index"
                v-for="(item, index) in tabs"
                :key="index"
                :class="{ 'bg-gray-300 dark:bg-[#292d30]': active_tab === item.index }"
                class="transition-all hover:bg-gray-300 dark:hover:bg-[#292d30] flex-none flex items-center gap-x-2 py-2 px-4 whitespace-nowrap"
              >
                {{ `${item.name} ${item.index}` }}
                <ion-icon
                  v-if="tabs.length > 1"
                  @click="closeTab(item, index)"
                  name="close-outline"
                ></ion-icon>
              </div>
              <div
                class="flex flex-none items-center"
                style="margin-left: 8px"
                @click="
                  tabs.push({
                    name: `Query`,
                    index: tabs[tabs.length - 1].index + 1,
                  }),
                    result.push({ data: [], error: '' }),
                    (active_tab = tabs[tabs.length - 1].index),
                    query.push(defaultCode)
                "
              >
                <ion-icon
                  class="hover:bg-gray-300 rounded-full dark:hover:bg-slate-700"
                  name="add-outline"
                ></ion-icon>
              </div>
            </div>
            <div class="p-2 flex-none">
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
        </div>
        <div class="flex-1 relative min-h-[1rem] min-w-[0px]">
          <div id="editor" class="absolute h-full w-full" />
        </div>
        <div
          class="flex-none flex flex-col min-h-[0px] min-w-[0px]"
          id="result"
          style="height: 300px"
        >
          <div
            id="resizable-result"
            class="border-t-4 dark:border-gray-600 hover:border-blue-600 cursor-row-resize"
          ></div>
          <div
            class="border-y-[1px] dark:border-gray-600 flex-none flex items-center justify-between p-2"
          >
            <div>Query Result</div>
            <div class="flex justify-end p-2">
              <div
                v-if="result[getIndexTab].data.length > 0 && !loading"
                class="text-sm cursor-pointer gap-x-2 flex items-center text-blue-600 dark:text-white rounded-lg hover:bg-gray-300/50 dark:hover:bg-[#292d30] px-2 py-1"
                @click="downloadData"
              >
                <ion-icon
                  class="text-base"
                  name="cloud-download-outline"
                ></ion-icon>
                <div>DOWNLOAD AS CSV</div>
              </div>
            </div>
          </div>
          <div v-if="loading" class="flex items-center justify-center h-[100%]">
            <LoaderSpin />
          </div>
          <div
            v-if="!loading && result[getIndexTab].error !== ''"
            class="flex items-center justify-center h-[100%]"
          >
            <div class="text-sm text-red-600">
              {{ result[getIndexTab].error }}
            </div>
          </div>
          <div
            v-if="
              !loading &&
              result[getIndexTab].error === '' &&
              result[getIndexTab].data.length === 0
            "
            class="flex items-center justify-center h-[100%]"
          >
            <div class="text-sm">no data</div>
          </div>
          <div class="relative flex-1 border-b-[1px] dark:border-gray-600 overflow-auto">
            <div class="absolute w-full h-full ">
              <table
                v-if="result[getIndexTab].data.length > 0"
                class="text-sm text-left text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th
                      v-for="(item, index) in Object.keys(
                        result[getIndexTab].data[0]
                      )"
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
                    v-for="(item, index) in result[getIndexTab].data.slice((currentPage - 1)*10, currentPage * 10)"
                    :key="index"
                    class="bg-white border-b dark:bg-[#292d30] dark:border-gray-700"
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
        <div id="pagination" class="flex-none flex items-center justify-end gap-x-4 p-2 lg:text-sm text-xs">
          <template v-if="result[getIndexTab].data.length > 0 && !loading">
            <div>Total Data : <span class="font-bold">{{ result[getIndexTab].data.length }}</span></div>
            <div class="hidden lg:block" >Result Per Page :  <span class="font-bold">10</span></div>
            <div>Page  <span class="font-bold">{{ currentPage }}</span> of  <span class="font-bold">{{ Math.ceil(result[getIndexTab].data.length/10) }}</span></div>
            <div class="flex items-center gap-x-2 cursor-pointer">
              <skipBackVue @click.native="currentPage = 1" class="w-[1.25rem]" :class="{'opacity-50' : currentPage === 1}" />
              <div class="flex items-center" :class="{'opacity-50' : currentPage === 1}"><ion-icon @click="currentPage === 1 ? null : currentPage -= 1" name="chevron-back"></ion-icon></div>
              <div class="flex items-center" :class="{'opacity-50' : currentPage === Math.ceil(result[getIndexTab].data.length/10)}"><ion-icon @click="currentPage === Math.ceil(result[getIndexTab].data.length/10) ? null : currentPage += 1" name="chevron-forward"></ion-icon></div>
              <skipForwardVue @click.native="currentPage = Math.ceil(result[getIndexTab].data.length/10) " class="w-[1.25rem]" :class="{'opacity-50' : currentPage === Math.ceil(result[getIndexTab].data.length/10)}" />
            </div>
          </template>
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
import skipForwardVue from '../assets/icons/skip-forward.vue';
import skipBackVue from '../assets/icons/skip-back.vue';
import {basicDark} from 'cm6-theme-basic-dark';
import {basicLight} from 'cm6-theme-basic-light'
import { Compartment } from '@codemirror/state'

export default {
  name: "IndexPage",
  components: {
    skipForwardVue,
    skipBackVue
  },
  data() {
    const query = localStorage.gaChain
      ? JSON.parse(localStorage.gaChain).query
      : [defaultCode];
    const active_tab = localStorage.gaChain
      ? JSON.parse(localStorage.gaChain).active_tab
      : 1;
    const tabs = localStorage.gaChain
      ? JSON.parse(localStorage.gaChain).tabs
      : [{ name: "Query", index: 1 }];
    const result = localStorage.gaChain
      ? JSON.parse(localStorage.gaChain).result
      : [{ data: [], error: "" }];
    const themeConfig = new Compartment()
    return {
      host: window.location.origin,
      table_schema,
      defaultCode,
      view: null,
      loading: false,
      result,
      query,
      tabs,
      active_tab,
      currentPage: 1,
      themeConfig,
      clientG: null
    };
  },
  watch: {
    active_tab(newV) {
      this.view.dispatch({
        changes: {
          from: 0,
          to: this.view.state.doc.length,
          insert: this.query[this.getIndexTab],
        },
      });
    },
    "view.state.doc": function (newValue) {
      this.query[this.getIndexTab] = newValue.toString();
    },
    "$parent.$attrs.theme": function(newV){
       this.view.dispatch({
        effects: this.themeConfig.reconfigure([newV === 'dark' ? basicDark : basicLight])
      })
    }
  },
  computed: {
    getIndexTab() {
      return this.tabs.indexOf(
        this.tabs.filter((elem) => elem.index === this.active_tab)[0]
      );
    },
  },
  created() {
    const self = this
     window.onbeforeunload = function (e) {
      localStorage.setItem('gaChain', JSON.stringify({
        result: self.result,
        query: self.query,
        active_tab: self.active_tab,
        tabs: self.tabs
      }))
    };
  },
  mounted() {
    this.view = new EditorView({
      doc: this.query[this.getIndexTab],
      extensions: [basicSetup, keymap.of([indentWithTab]), sql(), this.themeConfig.of([this.$parent.$attrs.theme === 'dark' ? basicDark : basicLight])],
      parent: document.getElementById("editor"),
    });
    this.draggableResult();
     
  },
  methods: {
    closeTab(item, index) {
      this.active_tab =
        this.tabs.indexOf(item) === index
          ? this.tabs.indexOf(item) === 0
            ? this.tabs[1].index
            : this.tabs[this.tabs.indexOf(item) - 1].index
          : this.active_tab;
      this.tabs.splice(this.tabs.indexOf(item), 1);
      this.result.splice(this.tabs.indexOf(item), 1);
      this.query.splice(this.tabs.indexOf(item), 1);
    },
    draggableResult() {
      let isDrag = false;
      const brHandler = document.getElementById("resizable-result");
      const resultId = document.getElementById("result");
      const workspace = document.getElementById("workspace");
      const pagination = document.getElementById('pagination');
      resultId.style.minHeight = `${resultId.clientHeight}px`;
      resultId.style.maxHeight = `${
        workspace.offsetHeight - workspace.offsetTop - pagination.offsetHeight
      }px`;

      document.addEventListener("mousedown", (event) => {
        if (event.target === brHandler) {
          isDrag = true;
        }
      });
      document.addEventListener("mousemove", (e) => {
        if (isDrag) {
          resultId.style.height = `${
            workspace.offsetHeight + workspace.offsetTop - e.clientY - pagination.offsetHeight
          }px`;
        }
      });
      document.addEventListener("mouseup", () => {
        isDrag = false;
      });
    },
    async run() {
      this.loading = true;
      try {
        const d = await runQuery(this.view.state.doc.toString());
        this.result[this.getIndexTab].data = d;
        this.result[this.getIndexTab].error = "";
      } catch (error) {
        this.result[this.getIndexTab].error = error.message;
      }
      this.loading = false;
    },
    async downloadData() {
      await downloadCsv(this.result[this.getIndexTab].data);
    },
  },
};
</script>
<style>
.cm-editor {
  height: 100%;
}
</style>
