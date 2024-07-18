let inputName = document.getElementById("inputName");
let inputAmountAndDate = document.getElementById("inputAmountAndDate");
let tfoot = document.getElementById("tfoot");
let result = [];
const ctx = document.getElementById("myChart");

async function getData() {
  let data = await fetch(
    "https://my-json-server.typicode.com/Mostafa015Gamal/jop-fair/customers?_embed=transactions"
  );
  result = await data.json();

  displayData(result);
  localStorage.setItem("data", JSON.stringify(result));
}
getData();
function displayData(data) {
  document.getElementById("tableData").innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
          <td>${data[i].id}</td>
          <td>${data[i].name}</td>
          <td>${data[i].transactions.at(-1).amount}</td>
          <td>${data[i].transactions.at(-1).date}</td>
          `;
    tr.addEventListener("click", function () {
      displayChart(data[i]);
    });
    document.getElementById("tableData").appendChild(tr);
  }
  tfoot.classList.add("d-none");
  if (!data.length) tfoot.classList.remove("d-none");
}

inputName.addEventListener("input", function (e) {
  searchByName(e.target.value);
});

function searchByName(searchKey) {
  let data = structuredClone(result);
  let searchResult = [];
  for (i = 0; i < data.length; i++) {
    if (data[i].name.toLowerCase().includes(searchKey.toLowerCase())) {
      searchResult.push(data[i]);
    }
  }
  displayData(searchResult);
}

inputName.addEventListener("input", function (e) {
  searchByName(e.target.value);
});

function searchByAmountAndDate(searchKey) {
  let data = structuredClone(result);
  let searchResult = [];
  for (i = 0; i < data.length; i++) {
    if (
      data[i].transactions
        .at(-1)
        .date.toLowerCase()
        .includes(searchKey.toLowerCase()) ||
      data[i].transactions.at(-1).amount.toString().includes(searchKey)
    ) {
      searchResult.push(data[i]);
    }
  }
  displayData(searchResult);
}

inputAmountAndDate.addEventListener("input", function (e) {
  searchByAmountAndDate(e.target.value);
});

let chart;
function displayChart(dataChart) {
  chart?.destroy?.();
  let labels = dataChart.transactions.map((el) => el.date);
  let amount = dataChart.transactions.map((el) => el.amount);
  const data = {
    labels: labels,
    datasets: [
      {
        label: `${dataChart.name}'s Transactions Amount`,
        data: amount,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  chart = new Chart(ctx, {
    type: "line",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// https://my-json-server.typicode.com/your-username/your-repo/customers
