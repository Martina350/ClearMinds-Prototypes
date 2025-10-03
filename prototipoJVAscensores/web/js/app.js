// app.js - bootstrap y lógica del dashboard

document.addEventListener('DOMContentLoaded', async () => {
    const data = await window.loadMock();

    // Calcular KPIs
    const totalOts = data.ots.length;
    const completedOts = data.ots.filter(ot => ot.estado === 'completada').length;
    const completedPercent = totalOts > 0 ? Math.round((completedOts / totalOts) * 100) : 0;

    const cancellations = data.ots.filter(ot => ot.estado === 'cancelada').length; // en mock 0
    const emergencies = data.ots.filter(ot => ot.tipo === 'emergencia').length;

    // Tiempo promedio en sitio
    let totalTime = 0;
    let countTime = 0;
    data.ots.forEach(ot => {
        if (ot.estado === 'completada' && ot.eventos.length >= 2) {
            const llegada = ot.eventos.find(e => e.tipo === 'llegada');
            const salida = ot.eventos.find(e => e.tipo === 'salida');
            if (llegada && salida) {
                const timeDiff = (new Date(salida.timestamp) - new Date(llegada.timestamp)) / (1000 * 60); // min
                totalTime += timeDiff;
                countTime++;
            }
        }
    });
    const avgTime = countTime > 0 ? Math.round(totalTime / countTime) : 0;

    // Actualizar KPIs
    document.getElementById('kpi-completed').textContent = `${completedPercent}%`;
    document.getElementById('kpi-cancellations').textContent = cancellations;
    document.getElementById('kpi-emergencies').textContent = emergencies;
    document.getElementById('kpi-avg-time').textContent = `${avgTime} min`;

    // Gráfico: OTs pendientes por técnico
    const pendingByTecnico = {};
    data.tecnicos.forEach(tec => {
        pendingByTecnico[tec.nombre] = data.ots.filter(ot => ot.tecnicoId === tec.id && ot.estado !== 'completada').length;
    });

    renderChart(pendingByTecnico);
});

function renderChart(data) {
    const canvas = document.getElementById('chart-canvas');
    const ctx = canvas.getContext('2d');
    const labels = Object.keys(data);
    const values = Object.values(data);
    const maxVal = Math.max(...values);

    const barWidth = 40;
    const gap = 20;
    const startX = 50;
    let x = startX;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ejes
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, canvas.height - 30);
    ctx.lineTo(canvas.width - 10, canvas.height - 30);
    ctx.stroke();

    // Barras
    values.forEach((val, i) => {
        const height = (val / maxVal) * (canvas.height - 60);
        ctx.fillStyle = 'blue';
        ctx.fillRect(x, canvas.height - 30 - height, barWidth, height);
        ctx.fillStyle = 'black';
        ctx.fillText(labels[i], x, canvas.height - 10);
        ctx.fillText(val, x + 10, canvas.height - 35 - height);
        x += barWidth + gap;
    });
}