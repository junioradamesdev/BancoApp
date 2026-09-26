// Cuando la página cargue, pedimos los clientes a la API
fetch('http://localhost:3000/api/clientes')
    .then(respuesta => respuesta.json()) // convertimos la respuesta a JSON
    .then(clientes => {
        // Buscamos el div donde vamos a poner las tarjetas
        const contenedor = document.getElementById('contenedor-clientes');

        // Por cada cliente, creamos una tarjeta HTML y la agregamos al contenedor
        clientes.forEach(cliente => {
            contenedor.innerHTML += `
                <div class="tarjeta-cliente">
                    <h3>${cliente.NombreCompleto}</h3>
                    <p>Cédula: ${cliente.Cedula}</p>
                    <p>Cuenta: ${cliente.TipoCuenta}</p>
                    <p class="saldo">RD$ ${cliente.Saldo}</p>
                </div>
            `;
        });
    })
    .catch(error => console.error('Error al cargar clientes:', error));

