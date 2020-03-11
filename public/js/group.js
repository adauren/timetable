document.body.addEventListener("click", e => {
  if (e.target.classList.contains("group-delete-btn")) {
    return deleteGroup(`/groups/${e.target.dataset.id}`);
  }
});

async function deleteGroup(url) {
  await fetch(url, {
    method: "DELETE"
  });
}
