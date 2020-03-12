const faculty = document.getElementById("facultyName");
const specialty = document.getElementById("specialtyName");
const group = document.getElementById("groupName");

getSpecialties(faculty.value);
/* getGroups(specialty.value); */

faculty.addEventListener("change", async e => {
  getSpecialties(faculty.value);
});

specialty.addEventListener("change", async e => {
  getGroups(specialty.value);
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

  specialty.dispatchEvent(new Event("change"));
}

async function getGroups(specialtyValue) {
  let prevOptions = [...group.options];
  prevOptions.map(item => {
    group.remove(item);
  });

  const response = await fetch(`/groups/${specialtyValue}`);

  const result = await response.json();
  const groups = Object.values(result);

  groups.map(item => {
    let option = document.createElement("option");
    option.value = item.name;
    option.text = item.name;
    group.add(option);
  });
}
