// document.addEventListener("DOMContentLoaded",
// 	async () => {
// 		const response = await fetch("/admin");
// 		const users = await response.json();

// 		const userList = document.getElementById("user-list");
// 		userList.innerHTML = users.map(user => `<li>${user.name} - ${user.email}</li>`).join("");
// });


async function fetchUsers() {
	try {
	  const response = await fetch('/users');
	  const users = await response.json();
	  const tbody = document.getElementById('users-table');
	  tbody.innerHTML = '';
	  users.forEach(user => {
		const tr = document.createElement('tr');
		tr.innerHTML = `
		  <td class="border px-4 py-2">${user.id}</td>
		  <td class="border px-4 py-2">${user.name}</td>
		  <td class="border px-4 py-2">${user.email}</td>
		  <td class="border px-4 py-2">
			<button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteUser(${user.id})">Supprimer</button>
		  </td>
		`;
		tbody.appendChild(tr);
	  });
	} catch (err) {
	  console.error('Erreur lors de la récupération des utilisateurs :', err);
	}
  }

  async function deleteUser(id) {
	if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
	  try {
		const response = await fetch(`/users/${id}`, { method: 'DELETE' });
		if (response.ok) {
		  alert('Utilisateur supprimé avec succès.');
		  fetchUsers();
		} else {
		  const error = await response.json();
		  alert('Erreur : ' + error.error);
		}
	  } catch (err) {
		console.error('Erreur lors de la suppression :', err);
	  }
	}
  }

  // Charger la liste des utilisateurs lors du chargement de la page
  window.addEventListener('DOMContentLoaded', fetchUsers);