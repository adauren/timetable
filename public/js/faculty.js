document.body.addEventListener("click", e => {
  if (e.target.classList.contains("faculty-delete-btn")) {
    return deleteGroup(`/faculties/${e.target.dataset.id}`);
    /* alert(1); */
  }
});

async function deleteGroup(url) {
  await fetch(url, {
    method: "DELETE"
  });
}
