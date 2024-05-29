window.addEventListener('load', () => {
    $.get('http://localhost:8080/SupTechBackEnd/employes', (data) => {
        let employes = JSON.parse(data);
        employes.forEach(employe => {
            addEmployeeToTable(employe);
        });
    });
});

function addEmployeeToTable(employe) {
    let id = $('<td>').text(employe.id);
    let nom = $('<td>').text(employe.nom);
    let prenom = $('<td>').text(employe.prenom);
    let telephone = $('<td>').text(employe.telephone);
    let departement = $('<td>').text(employe.departement);
    let actionTD = $('<td>');
    let deleteButton = $('<button>');
    let editButton = $('<button>');

    deleteButton.text('Supprimer');
    deleteButton.addClass('deleteButton');
    deleteButton.attr('onclick', 'openModal(event)');
    actionTD.append(deleteButton);

    let editActionTD = $('<td>');
    editButton.text('Modifier');
    editButton.addClass('editButton');
    editButton.attr('onclick', 'editEmployee(event)');
    editActionTD.append(editButton);

    let ligne = $('<tr>');
    ligne.append(id, nom, prenom, telephone, departement, editActionTD, actionTD);
    $('#employeeTable tbody').append(ligne);
}

function ajouterEmploye() {
    let formData = {
        id: $("#id").val(),
        nom: $("#nom").val(),
        prenom: $("#prenom").val(),
        telephone: $("#telephone").val(),
        departement: $("#departement").val()
    };
    let jsonData = JSON.stringify(formData);

    $.post("http://localhost:8080/SupTechBackEnd/employes", jsonData,
        function (data, textStatus, jqXHR) {
            if (data != null) {
                addEmployeeToTable(formData);
            }
        },
        "json"
    );
}

function openModal(e) {
    $("#confirmModal").modal("show");
    $("#oui").on("click", () => {
        deleteEmploye(e);
    });
}

function deleteEmploye(e) {
    const id = e.target.parentElement.parentElement.children[0].innerText;
    const nom = e.target.parentElement.parentElement.children[1].innerText;
    const prenom = e.target.parentElement.parentElement.children[2].innerText;
    const telephone = e.target.parentElement.parentElement.children[3].innerText;
    const departement = e.target.parentElement.parentElement.children[4].innerText;

    const formData = {
        id: parseInt(id),
        nom: nom,
        prenom: prenom,
        telephone: telephone,
        departement: departement
    };

    $.ajax({
        url: 'http://localhost:8080/SupTechBackEnd/employes',
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            e.target.parentElement.parentElement.remove();
            $("#confirmModal").modal("hide"); // Cacher le modal après avoir supprimé l'employé
        },
        error: function(xhr, status, error) {
            console.error('DELETE request failed:', error);
        }
    });
}
