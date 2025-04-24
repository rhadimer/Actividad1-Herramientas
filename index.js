// async function  getData() {
//     // se obtiene el dataset de un archivo csv
//     dataset_global = await d3.csv("mobile_sales_data.csv");
//     dataset_global= dataset_global.map((dataset) =>({
//     ...dataset,
//     Price: parseFloat(dataset['Price']),
//     "Quantity Sold": parseFloat(dataset['Quantity Sold']),
//     Total_sale:dataset['Quantity Sold']*dataset['Price']
//     }))

//     const groupSalesByDate = d3.group(dataset_global, (dataset) => dataset['Inward Date'], (dataset) => dataset.Product , (dataset) => dataset.Total_sale);
//     console.log(groupSalesByDate)
// }

// async function getData() {
//     // se obtiene el dataset de un archivo csv
//     dataset_global = await d3.csv("mobile_sales_data.csv");
//     dataset_global = dataset_global.map((dataset) => ({
//       ...dataset,
//       Price: parseFloat(dataset['Price']),
//       "Quantity Sold": parseFloat(dataset['Quantity Sold']),
//       Total_sale: parseFloat(dataset['Quantity Sold']) * parseFloat(dataset['Price']) // Asegúrate de parsear ambos valores a número
//     }));
  
//     const groupedSales = d3.rollup(
//       dataset_global,
//       v => d3.sum(v, d => d.Total_sale), // Sumariza Total_sale para cada grupo
//       d => d['Inward Date'], // Agrupa por fecha
//       d => d.Product      // Y luego por producto
//     );
  
//     // Para trabajar más fácilmente con los resultados, puedes convertir el Map a un array de objetos
//      // Transforma el Map anidado a la estructura deseada
//         const groupedSalesArray = Array.from(d3.group(dataset_global, d => d['Inward Date']), ([date, salesForDate]) => {
//         const salesByProduct = {};
//         salesForDate.forEach(sale => {
//         salesByProduct[sale.Product] = (salesByProduct[sale.Product] || 0) + sale.Total_sale;
//         });
//             return {
//             Date: date,
//             ...salesByProduct
//             };
//         });
    
//         // Ordena el array por fecha ascendente
//     groupedSalesArray.sort((a, b) => {
//         // Primero, intenta parsear las fechas. Si falla, considera las cadenas tal cual.
//         const dateA = new Date(a.Date);
//         const dateB = new Date(b.Date);

//         if (!isNaN(dateA) && !isNaN(dateB)) {
//         return dateA - dateB; // Ordena cronológicamente si ambas son fechas válidas
//         } else {
//         return a.Date.localeCompare(b.Date); // Si no son fechas válidas, compara como cadenas
//         }
//     });

//     groupedSalesArray.sort((a, b) => new Date(a.Date) - new Date(b.Date));

//     // Ahora, generar la gráfica con groupedSalesArray
//     const svg = d3.select("#lineChart");
//     const margin = { top: 20, right: 50, bottom: 50, left: 50 };
//     const width = +svg.attr("width") - margin.left - margin.right;
//     const height = +svg.attr("height") - margin.top - margin.bottom;
//     const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  
//     // Obtener todos los nombres de los productos (excluyendo "Date")
//     const products = Object.keys(groupedSalesArray[0]).filter(key => key !== "Date");
//     const colors = d3.scaleOrdinal(d3.schemeCategory10);
  
//     // Escala para el eje X (fechas)
//     const x = d3.scaleTime()
//       .domain(d3.extent(groupedSalesArray, d => new Date(d.Date)))
//       .range([0, width]);
  
//     // Escala para el eje Y (ventas totales)
//     const y = d3.scaleLinear()
//       .domain([0, d3.max(groupedSalesArray, d => d3.max(products, product => d[product]))])
//       .range([height, 0]);
  
//     // Crear las líneas para cada producto
//     const line = d3.line()
//       .x(d => x(new Date(d.Date)))
//       .y(d => y(d[this.product])); // 'this.product' se define al llamar a la función
  
//     products.forEach(function(product, index) {
//     const lineGenerator = d3.line()
//         .x(d => x(new Date(d.Date)))
//         .y(d => y(d[product])); // Accede directamente a d[product]

//     g.append("path")
//         .datum(groupedSalesArray)
//         .attr("fill", "none")
//         .attr("stroke", colors(index))
//         .attr("stroke-width", 1.5)
//         .attr("d", lineGenerator) // Usa la función generadora aquí
//         .attr("class", "line");
//     });
  
//     // Añadir eje X
//     g.append("g")
//       .attr("class", "axis axis--x")
//       .attr("transform", `translate(0,${height})`)
//       .call(d3.axisBottom(x));
  
//     // Añadir etiqueta al eje X
//     g.append("text")
//       .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 5})`)
//       .style("text-anchor", "middle")
//       .text("Fecha");
  
//     // Añadir eje Y
//     g.append("g")
//       .attr("class", "axis axis--y")
//       .call(d3.axisLeft(y).tickFormat(d3.format(".2s"))); // Formato de los ticks del eje Y
  
//     // Añadir etiqueta al eje Y
//     g.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 0 - margin.left)
//       .attr("x", 0 - (height / 2))
//       .attr("dy", "1em")
//       .style("text-anchor", "middle")
//       .text("Ventas Totales");
  
//     // Crear la leyenda
//     const legendContainer = d3.select("#legend");
//     products.forEach((product, index) => {
//       const legendItem = legendContainer.append("div")
//         .attr("class", "legend-item");
  
//       legendItem.append("span")
//         .attr("class", "legend-color")
//         .style("background-color", colors(index));
  
//       legendItem.append("span")
//         .text(product);
//     });
//   }
  
//   getData();    

// async function getData() {
//     // ... (tu código para obtener y transformar los datos) ...
//     dataset_global = await d3.csv("mobile_sales_data.csv");
//     dataset_global = dataset_global.map((dataset) => ({
//       ...dataset,
//       Price: parseFloat(dataset['Price']),
//       "Quantity Sold": parseFloat(dataset['Quantity Sold']),
//       Total_sale: parseFloat(dataset['Quantity Sold']) * parseFloat(dataset['Price']),
//       'Inward Date': new Date(dataset['Inward Date']) // Convertir a objeto Date para facilitar el manejo de fechas
//     }));
  
//     // Sumarizar ventas por mes y producto
//     const monthlySales = d3.rollup(
//       dataset_global,
//       v => ({
//         Laptop: d3.sum(v, d => d.Product === 'Laptop' ? d.Total_sale : 0),
//         'Mobile Phone': d3.sum(v, d => d.Product === 'Mobile Phone' ? d.Total_sale : 0)
//       }),
//       d => d['Inward Date'].getFullYear(),
//       d => d['Inward Date'].getMonth()
//     );
  
//     // Formatear los datos para la gráfica de líneas
//     const monthlySalesArray = Array.from(monthlySales, ([year, months]) => {
//       return Array.from(months, ([month, sales]) => ({
//         Date: new Date(year, month, 1), // Crear un objeto Date para el primer día del mes
//         ...sales
//       }));
//     }).flat().sort((a, b) => a.Date - b.Date);
  
//     console.log("monthlySalesArray:", monthlySalesArray);
  
//     // Generar la gráfica con monthlySalesArray
//     const svg = d3.select("#lineChart");
//     svg.selectAll("*").remove(); // Limpiar la gráfica anterior
//     const legendContainer = d3.select("#legend");
//     legendContainer.selectAll("*").remove(); // Limpiar la leyenda anterior
  
//     const margin = { top: 20, right: 70, bottom: 50, left: 70 }; // Ajustar márgenes para etiquetas del eje Y
//     const width = +svg.attr("width") - margin.left - margin.right;
//     const height = +svg.attr("height") - margin.top - margin.bottom;
//     const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  
//     const products = Object.keys(monthlySalesArray[0]).filter(key => key !== "Date");
//     const colors = d3.scaleOrdinal(d3.schemeCategory10);
  
//     const x = d3.scaleTime()
//       .domain(d3.extent(monthlySalesArray, d => d.Date))
//       .range([0, width]);
  
//     const y = d3.scaleLinear()
//       .domain([0, d3.max(monthlySalesArray, d => d3.max(products, product => d[product])) * 1.1]) // Añadir un pequeño buffer
//       .range([height, 0]);
  
//     const line = d3.line()
//       .x(d => x(d.Date))
//       .y(d => y(d[this.product]));
  
//     products.forEach(function(product, index) {
//       g.append("path")
//         .datum(monthlySalesArray)
//         .attr("fill", "none")
//         .attr("stroke", colors(product)) // Usar el nombre del producto como clave para el color
//         .attr("stroke-width", 1.5)
//         .attr("d", line.bind({ product: product }))
//         .attr("class", "line");
//     });
  
//     g.append("g")
//       .attr("class", "axis axis--x")
//       .attr("transform", `translate(0,${height})`)
//       .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m"))); // Formato de fecha mensual
  
//     g.append("text")
//       .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 5})`)
//       .style("text-anchor", "middle")
//       .text("Fecha (Año-Mes)");
  
//     g.append("g")
//       .attr("class", "axis axis--y")
//       .call(d3.axisLeft(y).tickFormat(d3.format(".2s")));
  
//     g.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 0 - margin.left)
//       .attr("x", 0 - (height / 2))
//       .attr("dy", "1em")
//       .style("text-anchor", "middle")
//       .text("Ventas Totales Mensuales");
  
//     // Leyenda
//     products.forEach(product => {
//       const legendItem = legendContainer.append("div")
//         .attr("class", "legend-item");
  
//       legendItem.append("span")
//         .attr("class", "legend-color")
//         .style("background-color", colors(product));
  
//       legendItem.append("span")
//         .text(product);
//     });
//   }
  
//   getData();

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

  // Ordenar y quedarnos con los 15 más fieles
  const topClientes = comprasPorCliente.sort((a, b) => d3.descending(a.total, b.total)).slice(0, 15);

  const margin = { top: 40, right: 20, bottom: 90, left: 100 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#grafico-retencion")
      .html("") // limpiar anterior
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
      .domain(topClientes.map(d => d.cliente))
      .range([0, width])
      .padding(0.2);

  const y = d3.scaleLinear()
      .domain([0, d3.max(topClientes, d => d.total)]).nice()
      .range([height, 0]);

  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

  svg.append("g")
      .call(d3.axisLeft(y));

  svg.selectAll("rect")
      .data(topClientes)
      .enter()
      .append("rect")
      .attr("x", d => x(d.cliente))
      .attr("y", d => y(d.total))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.total))
      .attr("fill", "#1f77b4");

  svg.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Clientes Más Frecuentes (Fidelización)");
}





// Función para generar el gráfico de barras de ventas por región
function generateBarChartSalesByRegion(data) {
  // Agrupar por región y sumar las ventas
  const ventasPorRegion = d3.rollups(
      data,
      v => d3.sum(v, d => +d['Quantity Sold']),
      d => d['Region']
  ).map(([region, total]) => ({ region, total }));

  const margin = { top: 40, right: 40, bottom: 40, left: 120 },
        width = 700 - margin.left - margin.right,
        height = ventasPorRegion.length * 40;

  const svg = d3.select("#grafico-region")
      .html("") // limpiar anterior
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  const y = d3.scaleBand()
      .domain(ventasPorRegion.map(d => d.region))
      .range([0, height])
      .padding(0.2);

  const x = d3.scaleLinear()
      .domain([0, d3.max(ventasPorRegion, d => d.total)]).nice()
      .range([0, width]);

  // Ejes
  svg.append("g").call(d3.axisLeft(y));
  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

  // Barras
  svg.selectAll("rect")
      .data(ventasPorRegion)
      .enter()
      .append("rect")
      .attr("y", d => y(d.region))
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", d => x(d.total))
      .attr("fill", "#69b3a2");

  // Etiquetas
  svg.selectAll(".label")
      .data(ventasPorRegion)
      .enter()
      .append("text")
      .attr("x", d => x(d.total) + 5)
      .attr("y", d => y(d.region) + y.bandwidth() / 2 + 5)
      .text(d => d.total);

  // Título
  svg.append("text")
      .attr("x", width / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Ventas por Región");
}


// // Función para obtener coordenadas de una ubicación usando Nominatim
// async function obtenerCoordenadas(location) {
//   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
//   const response = await fetch(url, {
//       headers: {
//           'User-Agent': 'mi-dashboard-d3 (contacto@example.com)' // importante para no ser bloqueado
//       }
//   });
//   const data = await response.json();
//   if (data.length > 0) {
//       return {
//           lat: +data[0].lat,
//           lon: +data[0].lon
//       };
//   } else {
//       return null;
//   }
// }




// // Función para geolocalizar clientes y obtener coordenadas
// async function geolocalizarClientes(data) {
//   const ubicacionesUnicas = Array.from(new Set(data.map(d => d["Customer Location"])));
//   const coordenadas = {};

//   for (const ubicacion of ubicacionesUnicas) {
//       console.log(`Buscando ${ubicacion}...`);
//       const coord = await obtenerCoordenadas(ubicacion);
//       if (coord) {
//           coordenadas[ubicacion] = coord;
//       }
//       // Pausar entre peticiones para evitar bloqueo (máximo 1 por segundo)
//       await new Promise(r => setTimeout(r, 1100));
//   }

//   console.log("Coordenadas generadas:", coordenadas);
//   return coordenadas;
// }


// // Función para generar el gráfico de mapa
// function generateMapChartClientGeo(data, coordenadas) {
//   const width = 900, height = 500;

//   const svg = d3.select("#grafico-mapa")
//       .html("")
//       .append("svg")
//       .attr("width", width)
//       .attr("height", height);

//   const projection = d3.geoMercator()
//       .scale(140)
//       .translate([width / 2, height / 1.5]);

//   const path = d3.geoPath().projection(projection);

//   // Fondo del mundo con países 
//   d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(world) {
//       svg.append("g")
//           .selectAll("path")
//           .data(world.features)
//           .enter()
//           .append("path")
//           .attr("fill", "#e0e0e0")
//           .attr("d", path)
//           .style("stroke", "#999");

//       // Filtrar clientes con coordenadas
//       const clientesConCoords = data.filter(d => coordenadas[d["Customer Location"]]);

//       // Dibujar puntos de clientes
//       svg.selectAll("circle")
//           .data(clientesConCoords)
//           .enter()
//           .append("circle")
//           .attr("cx", d => projection([coordenadas[d["Customer Location"]].lon, coordenadas[d["Customer Location"]].lat])[0])
//           .attr("cy", d => projection([coordenadas[d["Customer Location"]].lon, coordenadas[d["Customer Location"]].lat])[1])
//           .attr("r", 3)
//           .style("fill", "tomato")
//           .style("opacity", 0.8);
//   });
// }






// async function obtenerCoordenadas(location) {
//   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
//   try {
//       const response = await fetch(url, {
//           headers: {
//               'User-Agent': 'mi-dashboard-d3 (contacto@ejemplo.com)' // Importante para evitar bloqueo
//           }
//       });
//       const data = await response.json();
//       if (data.length > 0) {
//           return {
//               lat: +data[0].lat,
//               lon: +data[0].lon
//           };
//       }
//   } catch (error) {
//       console.error("Error obteniendo coordenadas para:", location, error);
//   }
//   return null;
// }

// async function exportarCoordenadas(data) {
//   const ubicacionesUnicas = Array.from(new Set(data.map(d => d["Customer Location"])));
//   const coordenadas = {};

//   for (const ubicacion of ubicacionesUnicas) {
//       console.log("Buscando:", ubicacion);
//       const coord = await obtenerCoordenadas(ubicacion);
//       if (coord) {
//           coordenadas[ubicacion] = coord;
//       } else {
//           console.warn("No se encontró ubicación para:", ubicacion);
//       }
//       await new Promise(r => setTimeout(r, 1100)); // Muy importante
//   }

//   // Descargar archivo JSON
//   const blob = new Blob([JSON.stringify(coordenadas, null, 2)], { type: "application/json" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "coordenadas_clientes.json";
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
// }







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


getData();