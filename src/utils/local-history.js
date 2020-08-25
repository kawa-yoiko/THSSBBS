const getSavedPosts = () => (localStorage.savedPosts ?
    localStorage.savedPosts.split(',').map(Number) : []);
const save = (arr) => localStorage.savedPosts = arr.map(String).join(',');

const savePost = (id) => {
  id = Number(id);
  let arr = getSavedPosts();
  const p = arr.indexOf(id);
  if (p === -1) arr.push(id);
  else arr = arr.concat(arr.splice(p).slice(1));
  save(arr);
};

const isPostSaved = (id) => getSavedPosts().indexOf(Number(id)) !== -1;

export {
  getSavedPosts,
  savePost,
  isPostSaved,
};
