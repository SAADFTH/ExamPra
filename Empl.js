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
    let editButton = $('<button>');

    editButton.text('Modifier');
    editButton.addClass('editButton btn btn-primary');
    editButton.attr('onclick', 'openEditModal(event)');
    actionTD.append(editButton);

    let deleteButton = $('<button>');
    deleteButton.text('Supprimer');
    deleteButton.addClass('deleteButton btn btn-danger');
    deleteButton.attr('onclick', 'openModal(event)');
    actionTD.append(deleteButton);

    let ligne = $('<tr>');
    ligne.append(id, nom, prenom, telephone, departement, actionTD);
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
        url: `http://localhost:8080/SupTechBackEnd/employes/${formData.id}`,
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            e.target.parentElement.parentElement.remove();
            $("#confirmModal").modal("hide");
        },
        error: function(xhr, status, error) {
            console.error('DELETE request failed:', error);
        }
    });
}

function openEditModal(e) {
    const row = $(e.target).closest('tr');
    const id = row.find('td').eq(0).text();
    const nom = row.find('td').eq(1).text();
    const prenom = row.find('td').eq(2).text();
    const telephone = row.find('td').eq(3).text();
    const departement = row.find('td').eq(4).text();

    $("#editId").val(id);
    $("#editNom").val(nom);
    $("#editPrenom").val(prenom);
    $("#editTelephone").val(telephone);
    $("#editDepartement").val(departement);

    $("#editModal").modal("show");
    $("#saveEdit").off("click").on("click", () => {
        saveEdit(row);
    });
}

function saveEdit(row) {
    let formData = {
        id: $("#editId").val(),
        nom: $("#editNom").val(),
        prenom: $("#editPrenom").val(),
        telephone: $("#editTelephone").val(),
        departement: $("#editDepartement").val()
    };

    $.ajax({
        url: `http://localhost:8080/SupTechBackEnd/employes/${formData.id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            row.find('td').eq(1).text(formData.nom);
            row.find('td').eq(2).text(formData.prenom);
            row.find('td').eq(3).text(formData.telephone);
            row.find('td').eq(4).text(formData.departement);
            $("#editModal").modal("hide");
        },
        error: function(xhr, status, error) {
            console.error('PUT request failed:', error);
        }
    });
}

