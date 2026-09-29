fetch('https://bancoapp-1.onrender.com')
    .then(respuesta => respuesta.json()) 
    .then(clientes => {
        const contenedor = document.getElementById('contenedor-clientes');

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

