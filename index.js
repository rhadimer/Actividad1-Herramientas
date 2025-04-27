function formatValue(value) {
  if (value >= 1e12) return (value / 1e12).toFixed(1) + "T"; // Trillón
  if (value >= 1e9)  return (value / 1e9).toFixed(1) + "B";  // Billón
  if (value >= 1e6)  return (value / 1e6).toFixed(1) + "M";  // Millón
  if (value >= 1e3)  return (value / 1e3).toFixed(1) + "K";  // Mil
  return value.toFixed(0);
}


async function getData() {
    // se obtiene el dataset de un archivo csv
    dataset_global = await d3.csv("mobile_sales_data.csv");
    dataset_global = dataset_global.map((dataset) => ({
      ...dataset,
      Price: parseFloat(dataset['Price']),
      "Quantity Sold": parseFloat(dataset['Quantity Sold']),
      Total_sale: parseFloat(dataset['Quantity Sold']) * parseFloat(dataset['Price']),
      'Inward Date': new Date(dataset['Inward Date']) // Convertir a objeto Date
    }));
  
    // Sumarizar ventas por mes y producto
    const monthlySales = d3.rollup(
      dataset_global,
      v => ({
        Laptop: d3.sum(v, d => d.Product === 'Laptop' ? d.Total_sale : 0),
        'Mobile Phone': d3.sum(v, d => d.Product === 'Mobile Phone' ? d.Total_sale : 0)
      }),
      d => d['Inward Date'].getFullYear(),
      d => d['Inward Date'].getMonth()
    );
  
    // Formatear los datos para la gráfica de líneas
    const monthlySalesArray = Array.from(monthlySales, ([year, months]) => {
      return Array.from(months, ([month, sales]) => ({
        Date: new Date(year, month, 1), // Primer día del mes
        ...sales
      }));
    }).flat().sort((a, b) => a.Date - b.Date);
  
    console.log("monthlySalesArray antes de la gráfica:", monthlySalesArray);
  
    // Generar la gráfica con monthlySalesArray
    const svg = d3.select("#lineChart");
    svg.selectAll("*").remove(); // Limpiar la gráfica anterior
    const legendContainer = d3.select("#legend");
    legendContainer.selectAll("*").remove(); // Limpiar la leyenda anterior
  
    const margin = { top: 20, right: 70, bottom: 50, left: 70 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  
    const products = Object.keys(monthlySalesArray[0]).filter(key => key !== "Date");
    const colors = d3.scaleOrdinal(d3.schemeCategory10);
  
    const x = d3.scaleTime()
      .domain(d3.extent(monthlySalesArray, d => d.Date))
      .range([0, width]);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(monthlySalesArray, d => d3.max(products, product => d[product])) * 1.1])
      .range([height, 0]);
  
    const line = d3.line()
      .x(d => x(d.Date))
      .y(d => {
        const value = d[this.product];
        return typeof value === 'number' && !isNaN(value) ? y(value) : y(0); // Manejo robusto de valores no numéricos
      });
  
    products.forEach(function(product, index) {
      const lineGenerator = d3.line()
        .x(d => x(d.Date))
        .y(d => {
          const value = d[product];
          return typeof value === 'number' && !isNaN(value) ? y(value) : y(0); // Manejo robusto de valores no numéricos
        });
  
      g.append("path")
        .datum(monthlySalesArray)
        .attr("fill", "none")
        .attr("stroke", colors(product))
        .attr("stroke-width", 1.5)
        .attr("d", lineGenerator)
        .attr("class", "line");
    });
  
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m")));
  
    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 5})`)
      .style("text-anchor", "middle")
      .text("Fecha (Año-Mes)");
  
    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).tickFormat(d3.format(".2s")));
  
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Ventas Totales Mensuales");
  
    // Leyenda
    products.forEach(product => {
      const legendItem = legendContainer.append("div")
        .attr("class", "legend-item");
  
      legendItem.append("span")
        .attr("class", "legend-color")
        .style("background-color", colors(product));
  
      legendItem.append("span")
        .text(product);
    });
  }



// Función para generar el gráfico de dona
// de distribución por tipo de producto
// Se espera que el dataset tenga una columna 'Product' con los tipos de productos  
// y una columna 'Quantity Sold' con la cantidad vendida de cada tipo
function generateDonutChartProductTypes(data) {
  const totalPorTipo = d3.rollups(
      data,
      v => d3.sum(v, d => +d['Quantity Sold']),
      d => d['Product']
  ).map(([tipo, total]) => ({ tipo, total }));

  const width = 600, height = 400, margin = 40;
  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3.select("#grafico-servicios")
      .html("")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  const chartCenterX = radius + 20;
  const chartCenterY = height / 2;

  // Título centrado respecto al gráfico de dona
  svg.append("text")
      .attr("x", chartCenterX)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Distribución por Tipo de Producto");

  const chartGroup = svg.append("g")
      .attr("transform", `translate(${chartCenterX},${chartCenterY})`);

  const color = d3.scaleOrdinal()
      .domain(totalPorTipo.map(d => d.tipo))
      .range(d3.schemeSet2);

  const pie = d3.pie().value(d => d.total);
  const arc = d3.arc().innerRadius(100).outerRadius(radius);

  chartGroup.selectAll("path")
      .data(pie(totalPorTipo))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.tipo))
      .attr("stroke", "white")
      .style("stroke-width", "2px");

  const legend = svg.append("g")
      .attr("transform", `translate(${chartCenterX + radius + 40},${chartCenterY - totalPorTipo.length * 10})`);

  legend.selectAll("rect")
      .data(totalPorTipo)
      .enter()
      .append("rect")
      .attr("y", (d, i) => i * 25)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", d => color(d.tipo));

  legend.selectAll("text")
      .data(totalPorTipo)
      .enter()
      .append("text")
      .attr("x", 20)
      .attr("y", (d, i) => i * 25 + 12)
      .text(d => d.tipo)
      .style("font-size", "14px");
}




// Función para generar el gráfico de líneas de tendencia de ventas
// Se espera que el dataset tenga una columna 'Dispatch Date' con la fecha de despacho
// y una columna 'Quantity Sold' con la cantidad vendida
// Se agrupará por mes y se sumará la cantidad vendida para cada mes
function generateLineChartSalesTrend(data) {
  // Parsear la fecha
  const parseDate = d3.timeParse("%Y-%m-%d");
  data.forEach(d => d.DispatchDate = parseDate(d['Dispatch Date']));

  // Agrupar por mes y sumar cantidad vendida
  const ventasPorMes = d3.rollup(
      data,
      v => d3.sum(v, d => +d['Quantity Sold']),
      d => d3.timeMonth(d.DispatchDate)
  );

  // Convertir a array para graficar
  const ventas = Array.from(ventasPorMes, ([fecha, total]) => ({ fecha, total }));

  // Dimensiones
  const margin = { top: 40, right: 30, bottom: 50, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Crear SVG
  const svg = d3.select("#ventas-tendencia")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Escalas
  const x = d3.scaleTime()
      .domain(d3.extent(ventas, d => d.fecha))
      .range([0, width]);

  const y = d3.scaleLinear()
      .domain([0, d3.max(ventas, d => d.total)]).nice()
      .range([height, 0]);

  // Ejes
  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

  svg.append("g").call(d3.axisLeft(y));

  // Línea
  svg.append("path")
      .datum(ventas)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
          .x(d => x(d.fecha))
          .y(d => y(d.total))
      );

  // Título
  svg.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Tendencia de Ventas por Mes");
}

// Función para generar el gráfico de barras de retención de clientes
function generateBarChartCustomerRetention(data) {
  // Agrupar por cliente y contar compras
  const comprasPorCliente = d3.rollups(
      data,
      v => v.length,
      d => d['Customer Name']
  ).map(([cliente, total]) => ({ cliente, total }));

  // Ordenar y seleccionar los 15 con más compras
  const topClientes = comprasPorCliente
      .sort((a, b) => d3.descending(a.total, b.total))
      .slice(0, 15);

  const margin = { top: 40, right: 40, bottom: 40, left: 200 },
        width = 800 - margin.left - margin.right,
        height = topClientes.length * 30;

  const svg = d3.select("#grafico-retencion")
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Escalas
  const y = d3.scaleBand()
      .domain(topClientes.map(d => d.cliente))
      .range([0, height])
      .padding(0.2);

  const x = d3.scaleLinear()
      .domain([0, d3.max(topClientes, d => d.total)]).nice()
      .range([0, width]);

  // Ejes
  svg.append("g").call(d3.axisLeft(y));

  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));

  // Barras horizontales
  svg.selectAll("rect")
      .data(topClientes)
      .enter()
      .append("rect")
      .attr("y", d => y(d.cliente))
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", d => x(d.total))
      .attr("fill", "#1f77b4");

  // Etiquetas al final de cada barra
  svg.selectAll(".label")
      .data(topClientes)
      .enter()
      .append("text")
      .attr("x", d => x(d.total) + 5)
      .attr("y", d => y(d.cliente) + y.bandwidth() / 2 + 5)
      .text(d => d.total)
      .style("font-size", "12px");

  // Título centrado
  svg.append("text")
      .attr("x", width / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Clientes Más Frecuentes (Fidelización)");
}

// Función para generar el gráfico de barras de top de lugares de compradores
function generateBarChartCustomerLocationTop(data) {
  // Agrupar por lugar y contar compras
  const comprasPorLocation = d3.rollups(
      data,
      v => v.length,
      d => d['Customer Location']
  ).map(([location, total]) => ({ location, total }));

  // Ordenar y seleccionar los 15 lugares con más compras
  const topLocation = comprasPorLocation
      .sort((a, b) => d3.descending(a.total, b.total))
      .slice(0, 15);
  
  //Dimensiones del gráfico
  const margin = { top: 40, right: 40, bottom: 40, left: 200 },
        width = 700 - margin.left - margin.right,
        height = topLocation.length * 30;

  // Crear el SVG
  const svg = d3.select("#grafico-location")
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Escalas
  const y = d3.scaleBand()
      .domain(topLocation.map(d => d.location))
      .range([0, height])
      .padding(0.1);

  const x = d3.scaleLinear()
      .domain([0, d3.max(topLocation, d => d.total)]).nice()
      .range([0, width]);

  // Ejes
  svg.append("g").call(d3.axisLeft(y));

  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));

  // Barras horizontales
  svg.selectAll("rect")
      .data(topLocation)
      .enter()
      .append("rect")
      .attr("y", d => y(d.location))
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", d => x(d.total))
      .attr("fill", "#D3D3D3");

  // Etiquetas al final de cada barra
  svg.selectAll(".label")
      .data(topLocation)
      .enter()
      .append("text")
      .attr("x", d => x(d.total) + 5)
      .attr("y", d => y(d.location) + y.bandwidth() / 2 + 5)
      .text(d => d.total)
      .style("font-size", "12px");

  // Título centrado
  svg.append("text")
      .attr("x", width / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Top 15 Lugares de compra");
}


// // Función para generar el gráfico de barras de ventas por región
// function generateBarChartSalesByRegion(data) {
//   // Agrupar por región y sumar ventas
//   const ventasPorRegion = d3.rollups(
//       data,
//       v => d3.sum(v, d => +d['Quantity Sold']),
//       d => d['Region']
//   ).map(([region, total]) => ({ region, total }));

//   // Dimensiones
//   const margin = { top: 40, right: 30, bottom: 100, left: 60 },
//         width = 800 - margin.left - margin.right,
//         height = 400 - margin.top - margin.bottom;

//   const svg = d3.select("#grafico-region")
//       .html("") // limpiar gráfico anterior
//       .append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`);

//   // Escalas
//   const x = d3.scaleBand()
//       .domain(ventasPorRegion.map(d => d.region))
//       .range([0, width])
//       .padding(0.2);

//   const y = d3.scaleLinear()
//       .domain([0, d3.max(ventasPorRegion, d => d.total)]).nice()
//       .range([height, 0]);

//   // Ejes
//   svg.append("g")
//       .attr("transform", `translate(0,${height})`)
//       .call(d3.axisBottom(x))
//       .selectAll("text")
//       .attr("transform", "rotate(-40)")
//       .style("text-anchor", "end");

//   svg.append("g")
//       .call(d3.axisLeft(y));

//   // Barras verticales
//   svg.selectAll("rect")
//       .data(ventasPorRegion)
//       .enter()
//       .append("rect")
//       .attr("x", d => x(d.region))
//       .attr("y", d => y(d.total))
//       .attr("width", x.bandwidth())
//       .attr("height", d => height - y(d.total))
//       .attr("fill", "#69b3a2");

//   // Etiquetas encima de cada barra
//   svg.selectAll(".label")
//       .data(ventasPorRegion)
//       .enter()
//       .append("text")
//       .attr("x", d => x(d.region) + x.bandwidth() / 2)
//       .attr("y", d => y(d.total) - 5)
//       .attr("text-anchor", "middle")
//       .style("font-size", "12px")
//       .text(d => d.total);

//   // Título
//   svg.append("text")
//       .attr("x", width / 2)
//       .attr("y", -15)
//       .attr("text-anchor", "middle")
//       .style("font-size", "16px")
//       .text("Ventas por Región");
// }



function generateBarChartSalesByRegion(data) {
  // Agrupar por región y sumar el total vendido en dinero (Total_sale)
  const ventasPorRegion = d3.rollups(
      data,
      v => d3.sum(v, d => +d.Total_sale), // ← usamos la columna 'Total_sale'
      d => d.Region
  ).map(([region, total]) => ({ region, total }));

  // Dimensiones del gráfico
  const margin = { top: 40, right: 30, bottom: 100, left: 60 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  // Crear el SVG
  const svg = d3.select("#grafico-region")
      .html("") // Limpiar cualquier gráfico anterior
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Escala X (categorías - regiones)
  const x = d3.scaleBand()
      .domain(ventasPorRegion.map(d => d.region))
      .range([0, width])
      .padding(0.2);

  // Escala Y (valores en dinero)
  const y = d3.scaleLinear()
      .domain([0, d3.max(ventasPorRegion, d => d.total)]).nice()
      .range([height, 0]);

  // Eje X
  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

  // Eje Y
  svg.append("g")
      .call(d3.axisLeft(y).ticks(6));

  // Dibujar las barras
  svg.selectAll("rect")
      .data(ventasPorRegion)
      .enter()
      .append("rect")
      .attr("x", d => x(d.region))
      .attr("y", d => y(d.total))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.total))
      .attr("fill", "#69b3a2");

  // Agregar etiquetas con el valor monetario formateado
  svg.selectAll(".label")
      .data(ventasPorRegion)
      .enter()
      .append("text")
      .attr("x", d => x(d.region) + x.bandwidth() / 2)
      .attr("y", d => y(d.total) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text(d => `$${formatValue(d.total)}`);

  // Título del gráfico
  svg.append("text")
      .attr("x", width / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Total Vendido por Región ($)");
}





//función para generar el gráfico de barras de las 5 marcas más vendidas de móviles
function generateBarChartTopMobilePhones(data) {
  // Filtrar solo productos tipo "Mobile Phone"
  const filtrados = data.filter(d => d.Product === "Mobile Phone");

  // Agrupar por marca y sumar Total_sale (valor total vendido en dinero)
  const ventasPorMarca = d3.rollups(
      filtrados,
      v => d3.sum(v, d => +d.Total_sale), // ← usamos Total_sale aquí
      d => d.Brand
  ).map(([brand, total]) => ({ brand, total }));

  // Ordenar descendente y tomar el top 5
  const top = ventasPorMarca.sort((a, b) => d3.descending(a.total, b.total)).slice(0, 5);

  // Definir dimensiones del SVG
  const margin = { top: 50, right: 40, bottom: 40, left: 150 },
        width = 600 - margin.left - margin.right,
        height = top.length * 35;

  const svg = d3.select("#grafico-top-mobiles")
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Escalas
  const y = d3.scaleBand()
      .domain(top.map(d => d.brand))
      .range([0, height])
      .padding(0.2);

  const x = d3.scaleLinear()
      .domain([0, d3.max(top, d => d.total)]).nice()
      .range([0, width]);

  // Ejes
  svg.append("g").call(d3.axisLeft(y));
  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));

  // Dibujar barras
  svg.selectAll("rect")
      .data(top)
      .enter()
      .append("rect")
      .attr("y", d => y(d.brand))
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", d => x(d.total))
      .attr("fill", "#1f77b4");

  // Etiquetas de valores monetarios
  svg.selectAll("text.label")
      .data(top)
      .enter()
      .append("text")
      .attr("x", d => x(d.total) + 5)
      .attr("y", d => y(d.brand) + y.bandwidth() / 2 + 5)
      .text(d => `$${formatValue(d.total)}`) // Muestra el total como dinero
      .style("font-size", "12px");

  // Título del gráfico
  svg.append("text")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Top 5 Marcas Mobile - Total Vendido ($)");
}



// funcion para generar el gráfico de barras de las 5 marcas más vendidas de laptops
function generateBarChartTopLaptops(data) {
  const filtrados = data.filter(d => d.Product === "Laptop");

  const ventasPorMarca = d3.rollups(
      filtrados,
      v => d3.sum(v, d => +d.Total_sale),
      d => d.Brand
  ).map(([brand, total]) => ({ brand, total }));

  const top = ventasPorMarca.sort((a, b) => d3.descending(a.total, b.total)).slice(0, 5);

  const margin = { top: 50, right: 40, bottom: 40, left: 150 },
        width = 600 - margin.left - margin.right,
        height = top.length * 35;

  const svg = d3.select("#grafico-top-laptops")
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  const y = d3.scaleBand()
      .domain(top.map(d => d.brand))
      .range([0, height])
      .padding(0.2);

  const x = d3.scaleLinear()
      .domain([0, d3.max(top, d => d.total)]).nice()
      .range([0, width]);

  svg.append("g").call(d3.axisLeft(y));
  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));

  svg.selectAll("rect")
      .data(top)
      .enter()
      .append("rect")
      .attr("y", d => y(d.brand))
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", d => x(d.total))
      .attr("fill", "#2ca02c");

  svg.selectAll("text.label")
      .data(top)
      .enter()
      .append("text")
      .attr("x", d => x(d.total) + 5)
      .attr("y", d => y(d.brand) + y.bandwidth() / 2 + 5)
      .text(d => `$${formatValue(d.total)}`)// Muestra el total como dinero
      .style("font-size", "12px");

  svg.append("text")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Top 5 Marcas Laptop - Total Vendido ($)");
}




// Llamar a la función después de cargar los datos

getData().then(() => {
  generateLineChartSalesTrend(dataset_global);
});


getData().then(() => {
  generateBarChartCustomerRetention(dataset_global);
});

getData().then(() => {
  generateDonutChartProductTypes(dataset_global);
});


getData().then(() => {
  generateBarChartSalesByRegion(dataset_global);
});


getData().then(() => {
  generateBarChartTopMobilePhones(dataset_global);
});


getData().then(() => {
  generateBarChartTopLaptops(dataset_global);
});

getData().then(() => {
  generateBarChartCustomerLocationTop(dataset_global);
});


getData();