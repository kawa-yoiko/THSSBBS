const qwq = (key) => [
  () => (localStorage[key] ?  localStorage[key].split(',').map(Number) : []),
  (arr) => localStorage[key] = arr.map(String).join(',')
];

const remove = (arr, p) => arr.concat(arr.splice(p).slice(1));

// Saved posts
const [getSavedPosts, saveSavedPosts] = qwq('savedPosts');

const savePost = (id) => {
  id = Number(id);
  let arr = getSavedPosts();
  const p = arr.indexOf(id);
  if (p === -1) arr.push(id);
  else arr = remove(arr, p);
  saveSavedPosts(arr);
};

// History
const [getHistoryPosts, saveHistoryPosts] = qwq('historyPosts');

const addHistory = (id) => {
  id = Number(id);
  let arr = getHistoryPosts();
  const p = arr.indexOf(id);
  if (p === -1) {
    arr.unshift(id);
    arr.splice(5);
  } else {
    arr = [id].concat(remove(arr, p));
  }
  saveHistoryPosts(arr);
};

const clearHistory = () => saveHistoryPosts([]);

export {
  getSavedPosts,
  savePost,

  addHistory,
  getHistoryPosts,
  clearHistory,
};
