document.body.addEventListener("click", e => {
  if (e.target.classList.contains("lesson-delete-btn")) {
    return deleteLesson(`/lessons/${e.target.dataset.id}`);
  }
});

async function deleteLesson(url) {
  await fetch(url, {
    method: "DELETE"
  });
}
