const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearButton = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));

  checkUI();
}

function addItem(e) {
  e.preventDefault();

  const newItem = itemInput.value;
  //   validate input
  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemFromStorage(itemToEdit.textContent);

    itemToEdit.classList.remove();
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExist(newItem)) {
      alert("That Item already exists ");
      return;
    }
  }
  addItemToDOM(newItem);

  addItemToStorage(newItem);

  checkUI();
  itemInput.value = "";
}

function checkIfItemExist(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function addItemToDOM(item) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement("btn");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  let itemsFromStroage = getItemsFromStorage();

  itemsFromStroage.push(item);

  localStorage.setItem("items", JSON.stringify(itemsFromStroage));
}

function getItemsFromStorage() {
  let itemsFromStroage;

  if (localStorage.getItem("items") === null) {
    itemsFromStroage = [];
  } else {
    itemsFromStroage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStroage;
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll("li")
    .forEach((item) => item.classList.remove("edit-mode"));
  item.classList.add("edit-mode");
  formBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Update Item`;
  formBtn.style.backgroundColor = "#228822";
  itemInput.value = item.textContent;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function removeItem(item) {
  if (confirm("Are you sure?")) {
    item.remove();

    removeItemFromStorage(item.textContent);
  }

  checkUI();
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  // filter
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function clearItems(e) {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  localStorage.removeItem("items");
  checkUI();
}

function checkUI() {
  itemInput.value = "";
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearButton.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearButton.style.display = "block";
    itemFilter.style.display = "block";
  }

  formBtn.innerHTML = `
    <i class="fa-solid fa-plus"></i>
    Add Item;
  `;

  formBtn.style.backgroundColor = "#333";

  isEditMode = false;
}

function filterItems(e) {
  const items = document.querySelectorAll("li");
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.includes(text)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
  console.log(text);
}

// Initialize APp
function init() {
  itemForm.addEventListener("submit", addItem);
  itemList.addEventListener("click", onClickItem);
  clearButton.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);

  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();
