const API_URL = 'https://mindicador.cl/api';
const amountInput = document.getElementById('amount');
const currencySelect = document.getElementById('currency');
const resultElement = document.getElementById('result');
const chartElement = document.getElementById('chart');
let chart;

document.getElementById('convert').addEventListener('click', async () => {
  const amount = parseFloat(amountInput.value);
  const currency = currencySelect.value;

  if (isNaN(amount) || amount <= 0) {
    resultElement.textContent = 'Por favor, ingrese un monto válido.';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${currency}`);
    if (!response.ok) throw new Error('Error al obtener los datos');

    const data = await response.json();
    const conversionRate = data.serie[0].valor;
    const convertedAmount = (amount / conversionRate).toFixed(2);

    resultElement.textContent = `Resultado: $${convertedAmount}`;

   
    const last10Days = data.serie.slice(0, 10).reverse();
    const labels = last10Days.map(item => new Date(item.fecha).toLocaleDateString());
    const values = last10Days.map(item => item.valor);

    renderChart(labels, values);
  } catch (error) {
    resultElement.textContent = `Error: ${error.message}`;
  }
});


function renderChart(labels, data) {
  if (chart) {
    chart.destroy(); 
  }
  
  chart = new Chart(chartElement, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Historial de los últimos 10 días',
        data: data,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#fff'
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#fff' }
        },
        y: {
          ticks: { color: '#fff' }
        }
      }
    }
  });
}
