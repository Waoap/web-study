// 存放学生信息
const students = []

/**
 * 学生类
 * @property selected 该学生是否被选中
 * @property no 序号
 * @property studentNo 学号
 * @property name 姓名
 * @property college 学院
 * @property major 课程
 * @property grade 年级
 * @property classNo 班级
 * @property age 年龄
 */
class Student {
  selected = false

  no = students.length + 1

  #studentNo = 0
  set studentNo(studentNo) {
    this.#studentNo = parseInt(studentNo)
  }
  get studentNo() {
    return this.#studentNo
  }

  name

  college

  major

  #grade = 0
  set grade(grade) {
    this.#grade = parseInt(grade)
  }
  get grade() {
    return this.#grade
  }

  #classNo = 0
  set classNo(classNo) {
    this.#classNo = parseInt(classNo)
  }
  get classNo() {
    return this.#classNo
  }

  #age = 0
  set age(age) {
    this.#age = parseInt(age)
  }
  get age() {
    return this.#age
  }
}

// 记录全选状态
const fullPageSelectedStatus = []

// 统计选中数量
let checkedCount = 0

const tbody = document.getElementById('table').children[0]

// 当前所在/展示的页码
let currentPage = 1

/**
 * 更新表中显示的数据
 */
function updateTable() {
  // 学生数量
  document.getElementById('student-count-viewer').textContent = students.length

  //清空表格
  for (let i = 1; i < tbody.children.length; ) {
    tbody.removeChild(tbody.children[i])
  }

  // 如果删除学生后，当前页码超出最大页码，自动移到最大页码处
  let largestPage = parseInt((students.length - 1) / 10) + 1
  if (currentPage > largestPage) {
    currentPage = largestPage
  }
  document.getElementById('current-page-viewer').textContent = currentPage

  // 读取全选状态
  document.getElementById('full-page-selected-box').checked =
    fullPageSelectedStatus[currentPage - 1]

  // 展示当前页的学生信息
  for (
    let i = (currentPage - 1) * 10;
    i < currentPage * 10 && i < students.length;
    i++
  ) {
    let tr = document.createElement('tr')
    tr.id = 'student-' + i + 1
    tr.className = 'info'
    tr.setAttribute('data-no', i + 1)
    tr.innerHTML = `<td>
            <input
                type="checkbox" ${students[i].selected ? 'checked' : ''} />
        </td>
        <td>${students[i].no}</td>
        <td>${students[i].studentNo}</td>
        <td>${students[i].name}</td>
        <td>${students[i].college}</td>
        <td>${students[i].major}</td>
        <td>${students[i].grade}</td>
        <td>${students[i].classNo}</td>
        <td>${students[i].age}</td>
        <td>
            <a class="review" href="javascript:void(0);">查看</a>
            <a class="modify" href="javascript:void(0);">修改</a>
        </td>`
    tbody.append(tr)
  }
}

const dialogContainer = document.getElementById('dialog-container')

let dialogType // -> [ 'add', 'review', 'modify' ]

// 新增学生
document.getElementById('add-btn').onclick = function () {
  dialogType = 'add'
  dialogContainer.style.display = 'flex'
}

// 删除选中的学生
document.getElementById('remove-btn').onclick = function () {
  if (checkedCount === 0) {
    alert('无选中的学生信息')
    return
  }

  if (!confirm('确认删除？')) {
    return
  }

  // 删除所有被选中的学生，并且调整序号
  for (let i = 0; i < students.length; ) {
    if (students[i].selected) {
      students.splice(i, 1)
    } else {
      students[i].no = ++i
    }
  }

  // 全部页面取消全选
  for (let i = 0; i < fullPageSelectedStatus.length; i++) {
    fullPageSelectedStatus[i] = false
  }
  checkedCount = 0

  updateTable()
}

// 全选
document.getElementById('full-page-selected-box').onclick = function () {
  // 全选状态取反
  fullPageSelectedStatus[currentPage - 1] =
    !fullPageSelectedStatus[currentPage - 1]

  // 对当前页的学生进行选中或取消选中
  for (
    let i = (currentPage - 1) * 10;
    i < currentPage * 10 && i < students.length;
    i++
  ) {
    if (students[i].selected !== fullPageSelectedStatus[currentPage - 1]) {
      students[i].selected = fullPageSelectedStatus[currentPage - 1]

      if (fullPageSelectedStatus[currentPage - 1]) {
        checkedCount++
      } else {
        checkedCount--
      }
    }
  }

  updateTable()
}

const dialogContent = document.getElementById('dialog-content')

// 当前操作（查看/修改）的学生（数组元素）
let currentOperatedStudent

// 事件委托，包括单条学生信息的选中、查看和修改
tbody.addEventListener('click', function (e) {
  if (
    (e.target.tagName !== 'INPUT' ||
      e.target.id === 'full-page-selected-box') &&
    e.target.tagName !== 'A'
  ) {
    return
  }

  // 选中的学生（数组元素）
  currentOperatedStudent =
    students[e.target.parentNode.parentNode.getAttribute('data-no') - 1]

  if (e.target.tagName === 'INPUT') {
    // 选中
    let selected = !currentOperatedStudent.selected

    if (selected) {
      checkedCount++
    } else {
      checkedCount--
    }

    e.target.checked = selected
    currentOperatedStudent.selected = selected
  } else if (e.target.tagName === 'A') {
    // 查看、修改
    dialogContainer.style.display = 'flex'
    dialogContent.children[0].children[1].value =
      currentOperatedStudent.studentNo
    dialogContent.children[1].children[1].value = currentOperatedStudent.name
    dialogContent.children[2].children[1].value = currentOperatedStudent.college
    dialogContent.children[3].children[1].value = currentOperatedStudent.major
    dialogContent.children[4].children[1].value = currentOperatedStudent.grade
    dialogContent.children[5].children[1].value = currentOperatedStudent.classNo
    dialogContent.children[6].children[1].value = currentOperatedStudent.age
    if (e.target.className === 'review') {
      // 查看
      dialogType = 'review'
      Array.from(dialogContent.children).forEach((element) => {
        element.children[1].disabled = true
      })
    } else if (e.target.className === 'modify') {
      // 修改
      dialogType = 'modify'
    }
  }
})

// 展示上一页信息
document.getElementById('last-page-btn').onclick = function () {
  if (currentPage === 1) {
    alert('已经是第一页！')
  } else {
    currentPage--
    updateTable()
  }
}

// 展示下一页信息
document.getElementById('next-page-btn').onclick = function () {
  if (currentPage === parseInt((students.length - 1) / 10) + 1) {
    alert('已经是最后一页！')
  } else {
    currentPage++
    updateTable()
  }
}

// 对话框确认
document.getElementById('confirm-btn').onclick = function () {
  if (dialogType === 'add') {
    // 添加类型的对话框，即对话框用于获取添加的学生信息
    let newStudent = new Student()

    let studentNo = dialogContent.children[0].children[1].value
    if (studentNo.length !== 11) {
      alert('学号必须为 11 位')
      return
    }
    newStudent.studentNo = studentNo

    let name = dialogContent.children[1].children[1].value
    if (name.length === 0) {
      alert('姓名不可为空')
      return
    }
    newStudent.name = name

    let college = dialogContent.children[2].children[1].value
    if (college.length === 0) {
      alert('学院不可为空')
      return
    }
    newStudent.college = college

    let major = dialogContent.children[3].children[1].value
    if (major.length === 0) {
      alert('专业不可为空')
      return
    }
    newStudent.major = major

    let grade = dialogContent.children[4].children[1].value
    if (grade < 1950 || grade > new Date().getFullYear()) {
      alert('年级范围应为 1950 ~ 今年')
      return
    }
    newStudent.grade = grade

    let classNo = dialogContent.children[5].children[1].value
    if (classNo < 1) {
      alert('班级不应小于 1')
      return
    }
    newStudent.classNo = classNo

    let age = dialogContent.children[6].children[1].value
    if (age < 18 || age > 50) {
      alert('年龄范围应为 18 ~ 50')
      return
    }
    newStudent.age = age

    students.push(newStudent)
    updateTable()
  } else if (dialogType === 'review') {
    // 查看类型的对话框，不可修改值
    Array.from(dialogContent.children).forEach((element) => {
      element.children[1].disabled = false
    })
  } else if (dialogType === 'modify') {
    // 修改类型的对话框
    let studentNo = dialogContent.children[0].children[1].value
    if (studentNo.length !== 11) {
      alert('学号必须为 11 位')
      return
    }
    currentOperatedStudent.studentNo = studentNo

    let name = dialogContent.children[1].children[1].value
    if (name.length === 0) {
      alert('姓名不可为空')
      return
    }
    currentOperatedStudent.name = name

    let college = dialogContent.children[2].children[1].value
    if (college.length === 0) {
      alert('学院不可为空')
      return
    }
    currentOperatedStudent.college = college

    let major = dialogContent.children[3].children[1].value
    if (major.length === 0) {
      alert('专业不可为空')
      return
    }
    currentOperatedStudent.major = major

    let grade = dialogContent.children[4].children[1].value
    if (grade < 1950 || grade > new Date().getFullYear()) {
      alert('年级范围应为 1950 ~ 今年')
      return
    }
    currentOperatedStudent.grade = grade

    let classNo = dialogContent.children[5].children[1].value
    if (classNo < 1) {
      alert('班级不应小于 1')
      return
    }
    currentOperatedStudent.classNo = classNo

    let age = dialogContent.children[6].children[1].value
    if (age < 18 || age > 50) {
      alert('年龄范围应为 18 ~ 50')
      return
    }
    currentOperatedStudent.age = age

    updateTable()
  }

  // 操作完成后重置对话框，清空值
  for (const content of dialogContent.children) {
    content.children[1].value = ''
  }
  dialogContainer.style.display = 'none'
}

// 取消对话框
document.getElementById('cancel-btn').onclick = function () {
  // 操作完成后重置对话框
  // 查看类型的对话框，重置禁用状态
  if (dialogType === 'review') {
    Array.from(dialogContent.children).forEach((element) => {
      element.children[1].disabled = false
    })
  }
  // 清空值
  for (const content of dialogContent.children) {
    content.children[1].value = ''
  }
  dialogContainer.style.display = 'none'
}

/**
 * * 测试方法
 */
function test() {
  students[0] = new Student()
  students[0].studentNo = 12123020400
  students[0].name = 'Waoap'
  students[0].college = '人工智能学院'
  students[0].major = '软件工程'
  students[0].grade = 2021
  students[0].classNo = 4
  students[0].age = 20
  for (let i = 1; i <= 25; i++) {
    let newStudent = new Student()
    newStudent.studentNo = students[0].studentNo + i
    newStudent.name = Math.random().toString(36).slice(-8)
    newStudent.college = students[0].college
    newStudent.major = students[0].major
    newStudent.grade = students[0].grade
    newStudent.classNo = students[0].classNo - parseInt(Math.random() * 4)
    newStudent.age = students[0].age + parseInt(Math.random() * 4)
    students.push(newStudent)
  }
  updateTable()
}
test()
