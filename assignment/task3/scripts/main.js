/**
 * 学生类
 * @property checked 该学生是否被选中
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
    checked = false

    no = students.length

    _studentNo = 0
    set studentNo(studentNo) {
        this._studentNo = parseInt(studentNo)
    }
    get studentNo() {
        return this._studentNo
    }

    name = unset

    college = unset

    major = unset

    _grade = 0
    set grade(grade) {
        this._grade = parseInt(grade)
    }
    get grade() {
        return this._grade
    }

    _classNo = 0
    set classNo(classNo) {
        this._classNo = parseInt(classNo)
    }
    get classNo() {
        return this._classNo
    }

    _age = 0
    set age(age) {
        this._age = parseInt(age)
    }
    get age() {
        return this._age
    }
}

// 表示未设置的值
const unset = 'unset'

// 存放学生信息，有效索引从 1 开始，索引 i 对应第 i 个学生
const students = [undefined]
// 记录每页的全选状态，有效索引从 1 开始，索引 i 对应第 i 页的全选状态
const fullPageSelectedStatus = [undefined]

const tbody = document.getElementById('table').children[0]
const fullPageSelectedBox = document.getElementById('full_page_selected_box')
const studentCountViewer = document.getElementById('student_count_viewer')
const currentPageViewer = document.getElementById('current_page_viewer')

// 当前所在/展示的页码，有效索引从 1 开始
let currentPage = 1

/**
 * 更新表中显示的数据
 */
function updateTable() {
    // 删除所有原本展示的学生信息：移除除表头外的所有行
    for (let i = 1; i < tbody.children.length; ) {
        tbody.removeChild(tbody.children[i])
    }

    // 确定展示的页码：如果学生信息更新后，当前页码超出最大页码，自动移到最大页码处
    let largestPage = parseInt((students.length - 2) / 10) + 1
    if (currentPage > largestPage) {
        currentPage = largestPage
    }

    // 根据当前页的全选状态恢复选择
    fullPageSelectedBox.checked =
        fullPageSelectedStatus[currentPage] === undefined
            ? false
            : fullPageSelectedStatus[currentPage]

    // 展示当前页的学生信息
    for (
        let i = (currentPage - 1) * 10 + 1;
        i <= currentPage * 10 && i < students.length;
        i++
    ) {
        let tr = document.createElement('tr')
        tr.id = 'student_' + i
        tr.className = 'info'
        tr.innerHTML = `<td>
            <input
                type="checkbox" ${students[i].checked ? 'checked' : ''} />
        </td>
        <td>${i}</td>
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

    // 同步当前页码、总学生信息条数等状态
    currentPageViewer.textContent = currentPage
    studentCountViewer.textContent = students.length - 1
}

const dialogContainer = document.getElementById('dialog_container')

let dialogType = unset // -> [ 'unset', 'add', 'review', 'modify' ]

// 新增学生
document.getElementById('add_btn').onclick = function () {
    dialogType = 'add'
    dialogContainer.style.display = 'flex'
}

// 删除选中的学生
document.getElementById('remove_btn').onclick = function () {
    let hasChecked
    for (let i = 1; i < students.length; i++) {
        if (students[i].checked) {
            hasChecked = true
        }
    }
    if (!hasChecked) {
        alert('无选中的学生信息')
        return
    }

    if (!confirm('确认删除？')) {
        return
    }

    // 删除所有被选中的学生，并且调整序号
    for (let i = 1, j = 0; i < students.length; ) {
        if (students[i].checked) {
            students.splice(i, 1)
            j++
        } else {
            students[i].no = i++
        }
    }

    // 将所有页的全选状态置为 false
    for (let i = 1; i < fullPageSelectedStatus.length; i++) {
        fullPageSelectedStatus[i] = false
    }

    updateTable()
}

// 当前展示页的全选事件
fullPageSelectedBox.onclick = function () {
    // 将当前页的全选状态取反
    fullPageSelectedStatus[currentPage] =
        fullPageSelectedStatus[currentPage] === undefined
            ? true
            : !fullPageSelectedStatus[currentPage]

    // 对当前页的学生信息进行相应的操作（选中或取消选中）
    for (
        let i = (currentPage - 1) * 10 + 1;
        i <= currentPage * 10 && i < students.length;
        i++
    ) {
        students[i].checked = fullPageSelectedStatus[currentPage]
    }

    updateTable()
}

const dialogContent = document.getElementById('dialog_content')

// 当前操作（查看/修改）的学生（数组元素）
let currentOperatedStudent = students[0]

// 事件委托，包括单条学生信息的选中、查看和修改
tbody.addEventListener('click', function (e) {
    if (
        (e.target.tagName !== 'INPUT' ||
            e.target.id === 'full_page_selected_box') &&
        e.target.tagName !== 'A'
    ) {
        return
    }

    // 选中的学生（数组元素）
    currentOperatedStudent =
        students[e.target.parentNode.parentNode.children[1].textContent]

    if (e.target.tagName === 'INPUT') {
        // 选中
        let checked = !currentOperatedStudent.checked
        e.target.checked = checked
        currentOperatedStudent.checked = checked
    } else if (e.target.tagName === 'A') {
        // 查看、修改
        dialogContainer.style.display = 'flex'
        dialogContent.children[0].children[1].value =
            currentOperatedStudent.studentNo
        dialogContent.children[1].children[1].value =
            currentOperatedStudent.name
        dialogContent.children[2].children[1].value =
            currentOperatedStudent.college
        dialogContent.children[3].children[1].value =
            currentOperatedStudent.major
        dialogContent.children[4].children[1].value =
            currentOperatedStudent.grade
        dialogContent.children[5].children[1].value =
            currentOperatedStudent.classNo
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
document.getElementById('last_page_btn').onclick = function () {
    if (currentPage === 1) {
        alert('已经是第一页！')
    } else {
        currentPage--
        updateTable()
    }
}

// 展示下一页信息
document.getElementById('next_page_btn').onclick = function () {
    if (currentPage === parseInt((students.length - 2) / 10) + 1) {
        alert('已经是最后一页！')
    } else {
        currentPage++
        updateTable()
    }
}

// 对话框确认
document.getElementById('confirm_btn').onclick = function () {
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
        if (grade < 1900 || grade > new Date().getFullYear()) {
            alert('年级不合法（1900 ~ 今年）')
            return
        }
        newStudent.grade = grade

        let classNo = dialogContent.children[5].children[1].value
        if (classNo < 1) {
            alert('班级不合法')
            return
        }
        newStudent.classNo = classNo

        let age = dialogContent.children[6].children[1].value
        if (age < 18 || age > 50) {
            alert('年龄不合法（18 ~ 50）')
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
        if (grade < 1900 || grade > new Date().getFullYear()) {
            alert('年级不合法（1900 ~ 今年）')
            return
        }
        currentOperatedStudent.grade = grade

        let classNo = dialogContent.children[5].children[1].value
        if (classNo < 1) {
            alert('班级不合法')
            return
        }
        currentOperatedStudent.classNo = classNo

        let age = dialogContent.children[6].children[1].value
        if (age < 18 || age > 50) {
            alert('年龄不合法（18 ~ 50）')
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
document.getElementById('cancel_btn').onclick = function () {
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
 * 测试方法
 * ! 仅供测试使用
 */
function test() {
    students[1] = new Student()
    students[1].studentNo = 12123020400
    students[1].name = 'Waoap'
    students[1].college = '人工智能学院'
    students[1].major = '软件工程'
    students[1].grade = 2021
    students[1].classNo = 4
    students[1].age = 20
    for (let i = 1; i <= 25; i++) {
        let newStudent = new Student()
        newStudent.studentNo = students[1].studentNo + i
        newStudent.name = Math.random().toString(36).slice(-8)
        newStudent.college = students[1].college
        newStudent.major = students[1].major
        newStudent.grade = students[1].grade
        newStudent.classNo = students[1].classNo - parseInt(Math.random() * 4)
        newStudent.age = students[1].age + parseInt(Math.random() * 4)
        students.push(newStudent)
    }
    updateTable()
}
test()
