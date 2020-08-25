const get = () => (localStorage.savedPosts ?
    localStorage.savedPosts.split(',').map(Number) : []);
const save = (arr) => localStorage.savedPosts = arr.map(String).join(',');

const savePost = (id) => {
  id = Number(id);
  let arr = get();
  const p = arr.indexOf(id);
  if (p === -1) arr.push(id);
  else arr = arr.concat(arr.splice(p).slice(1));
  save(arr);
};

const isPostSaved = (id) => get().indexOf(Number(id)) !== -1;

export {
  savePost,
  isPostSaved,
};
