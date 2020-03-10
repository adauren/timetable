const faculty = document.getElementById("faculty");
const specialty = document.getElementById("specialty");

faculty.addEventListener("change", async e => {
  const response = await fetch(`/specialties/${faculty.value}`);

  const myJson = await response.json();
  const specialties = Object.values(myJson);
  console.log(typeof specialties);
  console.log(specialties);

  specialties.map(item => {
    let option = document.createElement("option");
    option.value = item._id;
    option.text = item.name;
    specialty.add(option);
  });
});
