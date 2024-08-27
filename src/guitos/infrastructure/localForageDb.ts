import localforage from "localforage";

export const budgetsDB = localforage.createInstance({
  name: "guitos",
  storeName: "budgets",
});

export const optionsDB = localforage.createInstance({
  name: "guitos",
  storeName: "options",
});

export const calcHistDB = localforage.createInstance({
  name: "guitos",
  storeName: "calcHistDB",
});
