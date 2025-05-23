// async function checkUserCGU() {
//     try {
//         const response = await fetch('/api/check-cgu-status', {
//             headers: { 'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}` }
//         });
        
//         const data = await response.json();
        
//         if (data.error === "CGU_UPDATE_REQUIRED") {
//             showCGUModal(data.currentVersion);
//         }
//     } catch (error) {
//         console.error("Erreur lors de la vérification des CGU", error);
//     }
// }

// function showCGUModal(version) {
//     // Code pour afficher un modal qui montre les nouvelles CGU
//     // et un bouton pour les accepter
//     document.getElementById('cgu-modal').classList.add('active');
//     document.getElementById('cgu-version').textContent = version;
    
//     document.getElementById('accept-cgu-btn').addEventListener('click', async () => {
//         try {
//             await fetch('/api/accept-cgu', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
//                 },
//                 body: JSON.stringify({ version })
//             });
            
//             document.getElementById('cgu-modal').classList.remove('active');
//         } catch (error) {
//             console.error("Erreur lors de l'acceptation des CGU", error);
//         }
//     });
// }