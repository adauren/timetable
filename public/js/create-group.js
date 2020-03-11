const faculty = document.getElementById("faculty");
const specialty = document.getElementById("specialty");

getSpecialties(faculty.value);

faculty.addEventListener("change", async e => {
  getSpecialties(faculty.value);
});

async function getSpecialties(facultyValue) {
  let prevOptions = [...specialty.options];
  prevOptions.map(item => {
    specialty.remove(item);
  });

  const response = await fetch(`/specialties/${facultyValue}`);

  const result = await response.json();
  const specialties = Object.values(result);

  specialties.map(item => {
    let option = document.createElement("option");
    option.value = item._id;
    option.text = item.name;
    specialty.add(option);
  });
}
