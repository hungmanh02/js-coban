function handleClick() {
  alert("click me");
}

var fullName = "Đỗ Hùng Mạnh";
var schoolName = "STU";
// object ->đối tượng
// car ->color,weight,price,height
var car = {
  color: "black",
  weight: "2000kg",
  price: "2000$",
};
// array ->mảng -> chứa các dữ liệu liên tiếp và đồng nhất với nhau
// tảo một biến để lưu trữ tất cả tên lớp 6A
// các giá trị trong mảng được gọi là phần tử
// array có thể chứa 7 kiểu dữ liệu của JS
var listNamClass6A = ["Đức", "Nam", "Hoàng", "Trinh"];

// gán kiểu undefined
var c;
// gán kiểu null
var c = null;

// giá trị kiểu dữ liệu boolean
var c = true;
var c = false;

// hàm build-in (hàm có sẵn trong JS)
var fname = "Mạnh";
console.log(typeof fname);
// tab console trong tình duyệt
// hiển thị ra lỗi của trình duyệt và của code js
// hiển thị ra các dữ liệu từ hàn console trong code
// viết code js trong console

// Hàm alert, confirm, prompt để tương tác người dừng qua cửa sổ
function deleteItem() {
  alert("bạn xóa sản phẩm thành công");
  //  bị dừng lại, khi bấm ok mới thực thi console
  console.log(1);
}
function deleteItem1() {
  confirm("Bạn có chắc muốn xoa item này không");
  //   bấm ok thì trả về true, cancel thì false
}
function InsertName() {
  var a = prompt("Vui lòng nhập tên bạn vào", "Đỗ Hùng Mạnh");
  console.log(a);
}
// tham số đầu tiên trong console thể hiện được giá trị của console nào
//  CRUD
courseApi = "http://localhost:3000/courses";
function start() {
  getCourses(renderCourses);
  handleCreateform();
  handleUpdateForm();
}
start();

function getCourses(callback) {
  fetch(courseApi)
    .then(function (response) {
      return response.json();
    })
    .then(callback);
}
function createCourse(data, callback) {
  var options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  fetch(courseApi, options)
    .then(function (response) {
      response.json();
    })
    .then(callback);
}
function updateCourse(data, callback) {
  var id = document.querySelector('input[name="id"]').value;
  // console.log(id);
  var options = {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  fetch(courseApi + "/" + id, options)
    .then(function (response) {
      response.json();
    })
    .then(callback);
}
function handleEditCourse(id) {
  var courseItem = document.querySelector(".course-item-" + id);
  var nameItem = courseItem.querySelector("h4").textContent;
  var descriptionItem = courseItem.querySelector("p").textContent;
  var id = (document.querySelector('input[name="id"]').value = id);
  var name = document.querySelector('input[name="name"]');
  var description = document.querySelector('input[name="description"]');
  name.value = nameItem;
  description.value = descriptionItem;

  var createBtn = document.querySelector("#create");
  createBtn.style.display = "none";
  var saveBtn = document.querySelector("#save");
  saveBtn.style.display = "block";
}

function handleDeleteCourse(id) {
  var options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  fetch(courseApi + "/" + id, options)
    .then(function (response) {
      response.json();
    })
    .then(function () {
      var courseItem = document.querySelector(".course-item-" + id);
      if (courseItem) {
        courseItem.remove();
      }
    });
}
function renderCourses(courses) {
  var listCoursesBlock = document.querySelector("#list-courses");
  var htmls = courses.map(function (course) {
    return `
    <li class="course-item-${course.id}">
      <h4>${course.name}</h4>
      <p>${course.description}</p>
      <button onclick="handleEditCourse(${course.id})">sửa</button>
      <button onclick="handleDeleteCourse(${course.id})">xóa</button>
    </li>
    `;
  });
  listCoursesBlock.innerHTML = htmls.join("");
}

function handleCreateform() {
  var createBtn = document.querySelector("#create");
  createBtn.style.display = "block";
  var saveBtn = document.querySelector("#save");
  saveBtn.style.display = "none";
  createBtn.onclick = function () {
    var name = document.querySelector('input[name="name"]');
    var description = document.querySelector('input[name="description"]');
    var formData = {
      name: name.value,
      description: description.value,
    };
    createCourse(formData, function () {
      getCourses(renderCourses);
    });
    name.value = "";
    description.value = "";
  };
}
function handleUpdateForm(id) {
  var createBtn = document.querySelector("#create");
  createBtn.style.display = "none";
  var saveBtn = document.querySelector("#save");
  saveBtn.style.display = "block";
  saveBtn.onclick = function () {
    var name = document.querySelector('input[name="name"]');
    var description = document.querySelector('input[name="description"]');
    var formData = {
      name: name.value,
      description: description.value,
    };
    updateCourse(formData, function () {
      getCourses(renderCourses);
    });
    name.value = "";
    description.value = "";
    createBtn.style.display = "block";
    saveBtn.style.display = "none";
  };
}
