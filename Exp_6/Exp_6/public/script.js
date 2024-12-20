document.addEventListener('DOMContentLoaded', function() {
    const studentTableBody = document.getElementById('studentTableBody');
    const studentNameInput = document.getElementById('studentNameInput');
    const studentAgeInput = document.getElementById('studentAgeInput');
    const studentDepartmentInput = document.getElementById('studentDepartmentInput');
    const studentYearInput = document.getElementById('studentYearInput');
    const addStudentForm = document.getElementById('addStudentForm');
  
    function createStudentRow(student) {
      const row = document.createElement('tr');
      row.id = student._id; // Set the row ID to the student ID
      const nameCell = document.createElement('td');
      const ageCell = document.createElement('td');
      const departmentCell = document.createElement('td');
      const yearCell = document.createElement('td');
      const actionsCell = document.createElement('td');
  
      nameCell.textContent = student.name;
      ageCell.textContent = student.age;
      departmentCell.textContent = student.department;
      yearCell.textContent = student.year;
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteStudent(student._id, row));
  
      const updateButton = document.createElement('button');
      updateButton.textContent = 'Update';
      updateButton.addEventListener('click', () => updateStudent(student));
  
      actionsCell.appendChild(deleteButton);
      actionsCell.appendChild(updateButton);
  
      row.appendChild(nameCell);
      row.appendChild(ageCell);
      row.appendChild(departmentCell);
      row.appendChild(yearCell);
      row.appendChild(actionsCell);
  
      return row;
    }
  
    function deleteStudent(id, row) {
      fetch(`/api/students/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        studentTableBody.removeChild(row);
      })
      .catch(error => console.error('Error deleting student:', error));
    }
  
    function updateStudent(student) {
      studentNameInput.value = student.name;
      studentAgeInput.value = student.age;
      studentDepartmentInput.value = student.department;
      studentYearInput.value = student.year;
  
      addStudentForm.removeEventListener('submit', addStudentHandler);
      addStudentForm.addEventListener('submit', function updateHandler(event) {
        event.preventDefault();
  
        const updatedStudent = {
          name: studentNameInput.value,
          age: studentAgeInput.value,
          department: studentDepartmentInput.value,
          year: studentYearInput.value
        };
  
        fetch(`/api/students/${student._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedStudent)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(updatedStudent => {
          const updatedRow = createStudentRow(updatedStudent);
          const oldRow = document.getElementById(student._id);
          studentTableBody.replaceChild(updatedRow, oldRow);
          addStudentForm.reset();
          addStudentForm.removeEventListener('submit', updateHandler);
          addStudentForm.addEventListener('submit', addStudentHandler);
        })
        .catch(error => console.error('Error updating student:', error));
      });
    }
  
    function addStudentHandler(event) {
      event.preventDefault();
  
      const newStudent = {
        name: studentNameInput.value,
        age: studentAgeInput.value,
        department: studentDepartmentInput.value,
        year: studentYearInput.value
      };
  
      fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStudent)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(student => {
        const row = createStudentRow(student);
        studentTableBody.appendChild(row);
        addStudentForm.reset();
      })
      .catch(error => console.error('Error adding student:', error));
    }
  
    addStudentForm.addEventListener('submit', addStudentHandler);
  
    fetch('/api/students')
      .then(response => response.json())
      .then(students => {
        if (Array.isArray(students)) {
          students.forEach(student => {
            const row = createStudentRow(student);
            studentTableBody.appendChild(row);
          });
        } else {
          console.error('Expected an array of students');
        }
      })
      .catch(error => console.error('Error fetching students:', error));
  });