// ---------- LOGIN ----------
function login() {
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;

    if (u === "admin" && p === "admin") {
        localStorage.setItem("role", "admin");
        window.location.href = "index.html";
    } else {
        document.getElementById("error").innerText = "Invalid login";
    }
}

function loginUser() {
    localStorage.setItem("role", "user");
    window.location.href = "index.html";
}

// ---------- AUTH ----------
function checkLogin() {
    if (!localStorage.getItem("role")) {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("role");
    window.location.href = "login.html";
}

function isAdmin() {
    return localStorage.getItem("role") === "admin";
}

function showRole() {
    let el = document.getElementById("roleText");
    if (el) {
        el.innerText = isAdmin() ? "👑 Admin Mode" : "👀 Viewer Mode";
    }
}

// ---------- DATA ----------
let students = JSON.parse(localStorage.getItem("students")) || ["Kabilan", "Dhanush"];
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

function save() {
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("attendance", JSON.stringify(attendance));
}

// ---------- ATTENDANCE ----------
function renderAttendance() {
    let html = "<tr><th>Name</th><th>Status</th><th>Action</th></tr>";

    students.forEach(s => {
        if (!attendance[s]) attendance[s] = "Not Marked";

        html += `<tr>
            <td>${s}</td>
            <td>${attendance[s]}</td>
            <td>
                ${
                    isAdmin()
                    ? `<button onclick="mark('${s}','Present')">P</button>
                       <button onclick="mark('${s}','Absent')">A</button>`
                    : "View"
                }
            </td>
        </tr>`;
    });

    document.getElementById("attendanceTable").innerHTML = html;
}

function mark(name, status) {
    if (!isAdmin()) return alert("Only admin");

    attendance[name] = status;
    save();
    renderAttendance();
}

// ---------- REPORT ----------
function renderReports() {
    let html = "<tr><th>Name</th><th>Status</th></tr>";

    students.forEach(s => {
        html += `<tr>
            <td>${s}</td>
            <td>${attendance[s] || "Not Marked"}</td>
        </tr>`;
    });

    document.getElementById("reportTable").innerHTML = html;
}

// ---------------- STUDENTS ----------------
function renderStudents() {
    let html = "";

    students.forEach((s, i) => {
        html += `<tr>
            <td>${i + 1}</td>
            <td>${s}</td>
            <td>
                ${
                    isAdmin()
                    ? `<button onclick="removeStudent(${i})" class="danger">Delete</button>`
                    : "-"
                }
            </td>
        </tr>`;
    });

    document.getElementById("studentTable").innerHTML = html;
}

function addStudent() {
    if (!isAdmin()) {
        alert("Only admin can add");
        return;
    }

    let input = document.getElementById("newStudent");
    let name = input.value.trim();

    if (!name) return;

    students.push(name);
    save();
    renderStudents();

    input.value = "";
}

function removeStudent(i) {
    students.splice(i, 1);
    save();
    renderStudents();
}