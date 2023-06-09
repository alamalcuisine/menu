const mainDOM = document.getElementById("main");
const tableBodyDom = document.getElementById("table-body");
const tableFooterDom = document.getElementById("table-footer");
const nameInput = document.getElementById("name-input");
const phoneInput = document.getElementById("phone-input");
const dateInput = document.getElementById("date-input");
const discountInput = document.getElementById("discount-input");
const nameInvoice = document.getElementById("name-invoice");
const phoneInvoice = document.getElementById("phone-invoice");
const dateInvoice = document.getElementById("date-invoice");
const categories = [];
const cart = [];

data.forEach((item) => {
  if (!categories.includes(item.category)) {
    categories.push(item.category);
  }
  cart.push({ ...item, count: 0 });
});

categories.forEach((category) => {
  const section = document.createElement("section");
  section.innerHTML += `
      <div class="title">  
        <div class="title-name">${category}</div>
      </div>
  `;
  const newItems = data.filter((item) => item.category === category);
  newItems.forEach((item) => {
    section.innerHTML += `
      <div class="item">
        <div class="item-name">${item.name.split(" /")[0]}</div>
        <div class="item-price">${item.price}$ ${checkUnit(item.unit)}</div>
        <div class="item-options">
          <span class="item-count">0</span> 
          <input type='number' class='input-nb'/>
          <button class="add">add</button>
        </div>
      </div>
  `;
  });
  mainDOM.appendChild(section);
});

const buttons = mainDOM.querySelectorAll("button");
buttons.forEach((btn) => btn.addEventListener("click", target));

function target(e) {
  const btn = e.target;
  const count = btn.parentElement.querySelector(".item-count");
  const input = Number(btn.parentElement.querySelector(".input-nb").value);
  if (input < 0) return;
  const parent = btn.parentElement.parentElement;
  const title = parent.parentElement.querySelector(".title-name").textContent;
  const itemName = parent.querySelector(".item-name").textContent;
  if (btn.classList.contains("add")) add(itemName, input, title, count);
}

function add(itemName, input, title, count) {
  count.textContent = input;
  cart.find((item) => {
    return item.name == itemName && item.category == title;
  }).count = input;
  count.innerHTML = input;
}

const invoiceBtn = document.getElementById("invoice-btn");
invoiceBtn.addEventListener("click", printInvoice);

function printInvoice() {
  tableBodyDom.innerHTML = "";
  tableFooterDom.innerHTML = "";
  let TOTAL = 0;
  if (nameInput.value !== "") {
    nameInvoice.innerHTML = `Name: ${nameInput.value}`;
  } else {
    nameInvoice.innerHTML = ``;
  }
  if (phoneInput.value !== "") {
    phoneInvoice.innerHTML = `Phone: ${phoneInput.value}`;
  } else {
    phoneInvoice.innerHTML = ``;
  }
  if (dateInput.value !== "") {
    dateInvoice.innerHTML = `Date: ${formatDate(dateInput.value)}`;
  } else {
    dateInvoice.innerHTML = ``;
  }

  Object.keys(cart).forEach((item) => {
    if (cart[item].count !== 0) {
      TOTAL += cart[item].price * cart[item].count;
      tableBodyDom.innerHTML += `
        <tr>  
          <td>${cart[item].name}</td>
          <td>${cart[item].count}</td>
          <td>${cart[item].price}$</td>
          <td>${toDecimalNumber(cart[item].price * cart[item].count)}$</td>
        </tr>`;
    }
  });
  if (
    discountInput.value !== "" &&
    discountInput.value >= 0 &&
    discountInput.value <= 100
  ) {
    tableFooterDom.innerHTML = `
      <tr>
        <td colspan="3">Total</td>
        <td>${toDecimalNumber(TOTAL)}$</td>
      </tr>
      <tr>
        <td colspan="2">Discount</td>
        <td>${discountInput.value}%</td>
        <td>${toDecimalNumber(
          (TOTAL * Number(discountInput.value)) / 100
        )}$</td>
      </tr>
      <tr>
        <td colspan="3">Net Total</td>
        <td>${toDecimalNumber(
          TOTAL - (TOTAL * Number(discountInput.value)) / 100
        )}$</td>
      </tr> `;
  } else {
    tableFooterDom.innerHTML = `
      <tr>
        <td colspan="3">Total</td>
        <td>${toDecimalNumber(TOTAL)}$</td>
      </tr>`;
  }
}

function toDecimalNumber(num) {
  return num.toFixed(2).padEnd(num.toFixed(2).indexOf(".") + 3, "0");
}

function formatDate(dateInput) {
  const date = new Date(dateInput);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
}

function checkUnit(unit) {
  return unit ? `/${unit}` : ``;
}
