let recipes = [];
const $ = id => document.getElementById(id);
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const getRecipes = () => recipes;
const getRecipe = i => recipes[i];
const addRecipe = r => recipes.push(r);
const updateRecipe = (i, r) => { recipes[i] = r; };
const deleteRecipe = i => { recipes.splice(i, 1); };

function render() {
  $("recipeList").innerHTML = getRecipes().length ? "" : "<p>No recipes yet.</p>";
  getRecipes().forEach((r, i) => $("recipeList").insertAdjacentHTML("beforeend", `
    <div class="card">
      ${r.image ? `<img src="${r.image}" alt="">` : ""}
      <h3>${esc(r.title)}</h3>
      <button onclick="showRecipe(${i})">View</button>
      <button onclick="editRecipe(${i})">Edit</button>
      <button class="danger" onclick="removeRecipe(${i})">Delete</button>
    </div>`));
}

function reset() {
  $("recipeForm").reset();
  $("editIndex").value = "";
  $("formTitle").textContent = "Add New Recipe";
  $("saveBtn").textContent = "Add Recipe";
  $("cancelBtn").hidden = true;
  document.querySelectorAll(".error").forEach(s => s.textContent = "");
}

function showRecipe(i) {
  const r = getRecipe(i);
  $("viewPanel").querySelector(".view-box").innerHTML = `
    <button class="close" onclick="$('viewPanel').hidden = true">✕</button>
    <h2>${esc(r.title)}</h2>
    ${r.image ? `<img class="big" src="${r.image}" alt="">` : ""}
    <h3>Ingredients</h3>
    <ul>${r.ingredients.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
    <h3>Instructions</h3>
    <p>${esc(r.instructions)}</p>`;
  $("viewPanel").hidden = false;
}

function editRecipe(i) {
  const r = getRecipe(i);
  $("editIndex").value = i;
  $("title").value = r.title;
  $("ingredients").value = r.ingredients.join("\n");
  $("instructions").value = r.instructions;
  $("formTitle").textContent = "Edit Recipe";
  $("saveBtn").textContent = "Update Recipe";
  $("cancelBtn").hidden = false;
  scrollTo({ top: 0, behavior: "smooth" });
}

function removeRecipe(i) {
  if (!confirm("Delete this recipe?")) return;
  deleteRecipe(i);
  reset();
  render();
}

$("recipeForm").onsubmit = e => {
  e.preventDefault();
  const idx = $("editIndex").value, file = $("image").files[0];
  const r = {
    title: $("title").value.trim(),
    ingredients: $("ingredients").value.split("\n").map(s => s.trim()).filter(Boolean),
    instructions: $("instructions").value.trim(),
    image: file ? URL.createObjectURL(file) : idx === "" ? null : getRecipe(idx).image
  };
  const errors = {
    title: r.title.length < 3 && "Title must be at least 3 characters.",
    ingredients: !r.ingredients.length && "Add at least one ingredient.",
    instructions: r.instructions.length < 10 && "Instructions must be at least 10 characters.",
    image: file && !file.type.startsWith("image/") && "Please upload an image file."
  };
  for (const k in errors) $(k + "Error").textContent = errors[k] || "";
  if (Object.values(errors).some(Boolean)) return;
  idx === "" ? addRecipe(r) : updateRecipe(idx, r);
  reset();
  render();
};

$("cancelBtn").onclick = reset;
render();