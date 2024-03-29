// Escucha el clic en el botón "Eliminar Usuarios Inactivos"
const deleteInactiveUsersButton = document.querySelector('.delete-inactive-users');

deleteInactiveUsersButton.addEventListener('click', async () => {
  // Realizar una solicitud POST al endpoint /api/users para eliminar a los usuarios inactivos
  try {
    const response = await fetch('/api/users', {
      method: 'DELETE',
    });
    
    if (response.ok) {
      // Si la eliminación fue exitosa recarga la página y actualizar la lista de usuarios
      location.reload();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ops!',
        text: 'No tiene privilegios para eliminar usuarios 😢',
    });    }
  } catch (error) {
    console.error('Error al enviar la solicitud de eliminación', error);
  }
});