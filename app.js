const introductionLink = document.querySelector('#introduction-link');
const departmentLink = document.querySelector('#department-link');
const postsLink = document.querySelector('#posts-link');
const content = document.querySelector('#content');
const logoutForm = document.querySelector('#logout-form');
const logoutButton = document.querySelector('#logout-button');
const logininfo = document.querySelector('#logininfo');
const loginbtn = document.querySelector('#login-button');
const signupbtn = document.querySelector('#signup');
const write_introduction = document.getElementById('write-introduction');
logoutButton.style.display = 'none';


// 게시판 날짜 형식변경
function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
 const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  
  return `${yyyy}/${mm}/${dd}, ${hh}:${min}:${ss}`;
}

// 모달 호출
document.getElementById("login-button").addEventListener("click", function () {
  openModal("loginModal");
});

document.getElementById("signup").addEventListener("click", function () {
  openModal("signupModal");
});

document.querySelectorAll(".close").forEach((closeBtn) => {
  closeBtn.addEventListener("click", function () {
    this.parentElement.parentElement.style.display = "none";
  });
});

// 로그인 및 회원가입 팝업 열기
function openModal(modalId) {
  var modal = document.getElementById(modalId);
  modal.style.display = "block";
}

// 로그인 및 회원가입 팝업기
function closeModal(modalId) {
  var modal = document.getElementById(modalId);
  modal.style.display = "none";
}

const loginForm = document.querySelector('#login-form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const loginButton = document.querySelector('#login-btn');

// 로그인 기능
loginButton.addEventListener('click', () => {
  const username = usernameInput.value;
  const password = passwordInput.value;
  fetch(`http://localhost:3000/users?username=${username}&password=${password}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        sessionStorage.setItem('username', username);
        closeModal("loginModal");
        alert(`로그인 성공 회원님의 ID는 ${username} 입니다.`);
        checkLoginStatus()
        logoutForm.style.display = 'block';
        logoutButton.style.display = 'block';
      } else {
        alert('로그인 실패');
      }
    });
});

// 회원가입 기능
const signupForm = document.getElementById("signup-form");

function checkUserIdDuplicate(username) {
  return fetch(`http://localhost:3000/users?username=${username}`)
    .then((response) => response.json());
}

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  // 아이디 중복 확인
  checkUserIdDuplicate(username).then((data) => {
    if (data.length > 0) {
      alert("중복된 아이디입니다. 다른 아이디를 사용해주세요.");
    } else {
      // 중복되지 않은 경우에만 회원가입 요청을 보냄
      fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => {
          if (response.ok) {
            alert("회원가입이 완료되었습니다.");
            closeModal("signupModal");
            signupForm.reset();
          } else {
            alert("오류가 발생했습니다. 다시 시도하세요.");
          }
        });
    }
  });
});


window.onclick = function (event) {
  if (event.target.className === "modal") {
    event.target.style.display = "none";
  }
};

// 세션유지 || 로그인 되어있을때 버튼들 노출
function checkLoginStatus() {
  const loggedInUsername = sessionStorage.getItem('username');
  if (loggedInUsername) {
    logoutForm.style.display = 'block';
    logoutButton.style.display = 'block';
    logininfo.innerHTML = `아이디 : ${loggedInUsername}`;
    logininfo.style.display = 'block';
    document.getElementById("profileUpdateBtn").style.display = "block";
    document.getElementById("profileUpdate-username").value = loggedInUsername;
    loginbtn.style.display = 'none';
    signupbtn.style.display = 'none';
    write_introduction.style.display = "none";
  } else {
    logoutForm.style.display = 'none';
    logininfo.style.display = 'none';
    document.getElementById("profileUpdateBtn").style.display = "none";
    write_introduction.style.display = "none";
  }
}
window.addEventListener('DOMContentLoaded', checkLoginStatus);
  
  //로그아웃 기능
  logoutButton.addEventListener('click', () => {
    sessionStorage.removeItem('username');
    loginForm.style.display = 'block';
    logoutForm.style.display = 'none';
    alert('로그아웃 되었습니다.');
    location.reload();
  });        

// 회원수정
function updateMemberPW() {
  const username = sessionStorage.getItem("username");
  const newPassword = document.getElementById("profileUpdate-password").value;

  // 사용자를 찾기 위해 먼저 GET 요청을 보냄
  fetch(`http://localhost:3000/users?username=${username}`)
    .then((response) => response.json())
    .then((users) => {
      // 검색 결과에서 첫 번째 유저를 선택함
      const user = users[0];

      if (user) {
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username, password: newPassword }),
        };

        // 사용자의 실제 id를 이용해 fetch 요청을 수정합니다.
        fetch(`http://localhost:3000/users/${user.id}`, requestOptions)
          .then((response) => response.json())
          .then((updatedUser) => {
            if (updatedUser) {
              alert("비밀번호가 수정되었습니다.");
              closeModal("profileUpdateModal");
            } else {
              alert("비밀번호 수정 실패. 다시 시도해주세요.");
            }
          })
          .catch((error) => console.error("Error:", error));
      } else {
        alert("사용자를 찾을 수 없습니다.");
      }
    })
    .catch((error) => console.error("Error:", error));
}


const profileUpdateBtn = document.getElementById("profileUpdateBtn");
profileUpdateBtn.addEventListener("click", openProfileUpdateModal);


const profileUpdateButton = document.getElementById("profileUpdateButton");
profileUpdateButton.addEventListener("click", updateMemberPW);
// 회원수정 모달
function openProfileUpdateModal() {
  document.getElementById("profileUpdateModal").style.display = "block";
  const deleteUserButton = document.getElementById('deleteuserButton');
  deleteUserButton.addEventListener('click', deleteUserConfirmation);
  // deleteUserConfirmation 함수를 클릭 이벤트 리스너에 연결합니다.
  function deleteUserConfirmation() {
    if (confirm("정말로 삭제하시겠습니까?")) {
      deleteUser();
    }
  }
  // 사용자의 username으로 id를 찾아서 delete를 실행함
  async function deleteUser() {
    try {
      const username = sessionStorage.getItem("username");
      const response = await fetch(`http://localhost:3000/users?username=${username}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.length > 0) {
        const userId = data[0].id; // 고유 식별자 얻기
  
        const deleteResponse = await fetch(`http://localhost:3000/users/${userId}`, {
          method: "DELETE",
        });
  
        if (!deleteResponse.ok) {
          throw new Error(`HTTP error! status: ${deleteResponse.status}`);
        }
  
        const deletedData = await deleteResponse.json();
        alert("회원 정보가 삭제되었습니다.");
        sessionStorage.clear("username"); // 회원 정보 삭제후 세션값의 username의 데이터를 클리어함
      } else {
        alert("회원 정보 삭제 실패: 사용자를 찾을 수 없습니다.");
      }
    } catch (error) {
      console(error);
      alert("오류가 발생했습니다.");
    }
  }
  
  
  }

  
checkLoginStatus();

const createintro = document.getElementById('introduction_btn') ;
// 자기소개 서비스
introductionLink.addEventListener("click", () => {
  departCRUDBtn.style.display = "none";
  fetch("http://localhost:3000/introduction")
    .then((response) => response.json())
    .then((data) => {
      
      let output = `<h1>자기소개 목록</h1><ul>`;
      data.forEach((intro) => {
        output += `
        <!-- 형식을 유지하면서 수정 및 삭제 버튼 추가 -->
        <li data-name="${intro.name}">
          ${intro.id}. ${intro.name}
          <button class="update-introduction" data-name="${intro.name}">수정</button>
          <button class="delete-introduction" data-name="${intro.name}">삭제</button>
        </li>
        `;
      });
      output += `</ul>
      `;
      content.innerHTML = output;
      write_introduction.style.display = "block";
      createintro.style.display = "block";
});

  content.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
      createintro.style.display = "none";  // 만약에 게시글을 클릭했을때 글작성 버튼 사라지게
      const name = event.target.getAttribute("data-name");
      fetch(`http://localhost:3000/introduction/?name=${name}`)
      .then((response) => response.json())
      .then((data) => {
        // 데이터 배열 처리
        const intro = data[0];
        
        content.innerHTML = `
          <h1>자기소개: ${intro.name}</h1>
          <div id="introduce_content" style="float:left;">
            <img src="${intro.image}" style="max-height:50%; weight:auto; float:left;">
            <p></p>
            <p>이름: ${intro.name}</p>
            <p>나이:${intro.age}</p>
            <p>학력: ${intro.education}</p>
            <p>학번: ${intro.hakbeon}</p>
            <p>취미 ${intro.hobby}</p>
            <p>현재 서비스중: ${intro.service_1}</p>
            <p>현재 서비스중: ${intro.service_2}</p>
            <div class="dev_link_div">${intro.link}</div>
          </div>
        `;
      });
    }
  });
});

// 자기소개 글작성
write_introduction.addEventListener("click", (event) => {
  content.innerHTML = `
    <div id="writeFormContainer">
      <form id="writeForm">
        <label for="name">이름:</label>
        <input type="text" id="name" name="name"><br>

        <label for="age">나이:</label>
        <input type="number" id="age" name="age"><br>

        <label for="education">학력:</label>
        <input type="text" id="education" name="education"><br>

        <label for="hakbeon">학번:</label>
        <input type="text" id="hakbeon" name="hakbeon"><br>

        <label for="hobby">취미:</label>
        <input type="text" id="hobby" name="hobby"><br>

        <label for="service_1">서비스 중:</label>
        <input type="text" id="service_1" name="service_1"><br>

        <label for="service_2">서비스 중:</label>
        <input type="text" id="service_2" name="service_2"><br>

        <label for="etc">기타:</label>
        <input type="text" id="etc" name="etc"><br>
        
        <button type="submit">저장하기</button>
      </form>
    </div>
  `;
  
  document.getElementById("writeForm").addEventListener('submit', (event) => {
    event.preventDefault(); // 폼 전송에 의한 페이지 새로고침을 방지

    // 입력된 값을 얻습니다.
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const hakbeon = document.getElementById("hakbeon").value;
    const hobby = document.getElementById("hobby").value;
    const etc = document.getElementById("etc").value;
    const education = document.getElementById("education").value;
    const service_1 = document.getElementById("service_1").value;
    const service_2 = document.getElementById("service_2").value;
    
    // 각 필드 값을 전송할 객체를 생성합니다.
    const data = {
      name: name,
      age: age,
      hakbeon: hakbeon,
      hobby: hobby,
      etc: etc,
      education: education,
      service_1: service_1,
      service_2: service_2,
      image: "", // null값
      link: ""  // null값을줌
    };

    // 데이터를 서버에 전송합니다.
    fetch("http://localhost:3000/introduction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((response) => {
      alert("저장 완료: ", response);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  });
});


// 자기소개 CRUD(삭제) 이벤트리스너
content.addEventListener("click", (event) => {
  const target = event.target;

  if (target.tagName === "BUTTON") {
    const name = target.getAttribute("data-name");
    if (target.classList.contains("update-introduction")) {
      // 수정 기능 수행
      updateIntroduction(name);
    } else if (target.classList.contains("delete-introduction")) {
      // 삭제 기능 수행
      deleteIntroduction(name);
    }
  }
});

// 자기소개 업데이트
function updateIntroduction(name) {
  fetch(`http://localhost:3000/introduction/?name=${name}`)
    .then((response) => response.json())
    .then((data) => {
      const intro = data[0];
      const introId = intro.id;
      content.innerHTML = `
      <div id="updateFormContainer">
        <form id="updateForm">
          <!-- 기존 입력 필드 유지하고 값을 출력할 때 intro 객체의 값을 설정합니다. -->
          <label for="name">이름:</label>
          <input type="text" id="name" name="name" value="${intro.name}"><br>
  
          <label for="age">나이:</label>
          <input type="number" id="age" name="age" value="${intro.age}"><br>
  
          <label for="education">학력:</label>
          <input type="text" id="education" name="education" value="${intro.education}"><br>
  
          <label for="hakbeon">학번:</label>
          <input type="text" id="hakbeon" name="hakbeon" value="${intro.hakbeon}"><br>
  
          <label for="hobby">취미:</label>
          <input type="text" id="hobby" name="hobby" value="${intro.hobby}"><br>
  
          <label for="service_1">서비스 중:</label>
          <input type="text" id="service_1" name="service_1" value="${intro.service_1}"><br>
  
          <label for="service_2">서비스 중:</label>
          <input type="text" id="service_2" name="service_2" value="${intro.service_2}"><br>
  
          <label for="etc">기타:</label>
          <input type="text" id="etc" name="etc" value="${intro.etc}"><br>
          
          <button type="submit">저장하기</button>
        </form>
      </div>
    `;

    document.getElementById("updateForm").addEventListener('submit', (event) => {
      event.preventDefault(); // 폼 전송에 의한 페이지 새로고침을 방지합니다.
  
      // 입력된 값을 얻습니다.
      const name = document.getElementById("name")?.value ?? "";
      const age = document.getElementById("age")?.value ?? "";
      const hakbeon = document.getElementById("hakbeon")?.value ?? "";
      const hobby = document.getElementById("hobby")?.value ?? "";
      const etc = document.getElementById("etc")?.value ?? "";
      const education = document.getElementById("education")?.value ?? "";
      const service_1 = document.getElementById("service_1")?.value ?? "";
      const service_2 = document.getElementById("service_2")?.value ?? "";

      const data = {
        name: name,
        age: age,
        hakbeon: hakbeon,
        hobby: hobby,
        etc: etc,
        education: education,
        service_1: service_1,
        service_2: service_2,
        image: "",
        link: ""  // null값을줌
      };
  
      fetch(`http://localhost:3000/introduction/${introId}`, {
        method: "PUT", // "PUT" 메서드를 사용하여 수정 요청을 보냅니다.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then((response) => response.json())
      .then((response) => {
        alert("수정 완료: ", response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    });
  });
}

// 자기소개 삭제
async function deleteIntroduction(name) {
  if (confirm("정말 삭제하시겠습니까?")) {
    // 원본 코드와 함께 개선
    try {
      const response = await fetch(`http://localhost:3000/introduction/?name=${name}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.length > 0) {
        const introId = data[0].id; // 고유 식별자 얻기

        const deleteResponse = await fetch(`http://localhost:3000/introduction/${introId}`, {
          method: "DELETE",
        });

        if (!deleteResponse.ok) {
          throw new Error(`HTTP error! status: ${deleteResponse.status}`);
        }

        const deletedData = await deleteResponse.json();

        alert("삭제가 완료되었습니다.");
      } else {
        alert("해당하는 이름의 항목이 없습니다.");
      }

    } catch (e) {
      console.error("Error:", e);
    }
  }
}

// 학과소개 서비스
departmentLink.addEventListener('click', () => {
  write_introduction.style.display = "none";
  departCRUDBtn.style.display = "block";
    fetch('http://localhost:3000/department')
      .then(response => response.json())
      .then(data => {
        let departmentHTML = '<h1>학과소개</h1>';
        data.forEach(department => {
          departmentHTML += `
            <img src="${department.image}" class="department-image">
            <h3>${department.name}</h3>
            <p>위치: ${department.location}</p>
            <p>교수진: ${department.professors.join(', ')}</p>
            <p>교육내용: ${department.eduinfo}</p>
            <p>직업 : ${department.jobs}</p>
            <p>기타 (작성가능): ${department.etc}</p>
            <p>---------------------------------------------------------------------------------------------------------------------------</p>
          `;
        });
        content.innerHTML = departmentHTML;
      });
  });


const departCRUDBtn = document.getElementById("departCRUD");
departCRUDBtn.addEventListener("click", opendepartCRUDModal);

function opendepartCRUDModal() {
  document.getElementById("departModal").style.display = "block";
}
// select 태그에 name(학과) 값들을 표시
fetch('http://localhost:3000/department')
.then(response => response.json())
.then(data => {
let select = document.querySelector('#select-department');
data.forEach(department => {
let option = document.createElement('option');
option.value = department.id;
option.textContent = department.name;
select.appendChild(option);
});
});

// 생성, 수정, 삭제 버튼 클릭 이벤트
document.querySelector('#create-btn').addEventListener('click', () => {
let select = document.querySelector('#select-department');
let selectedId = select.value;
let etcValue = document.querySelector('#etc-input').value;

fetch(`http://localhost:3000/department/${selectedId}`, { // 학과소개 etc 생성
method: 'PATCH',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({ etc: etcValue })
})
.then(response => response.json())
.then(data => alert(`"${etcValue}" 가 입력되었습니다.`));
});

document.querySelector('#update-btn').addEventListener('click', () => { // 학과소개 etc 업데이터
let select = document.querySelector('#select-department');
let selectedId = select.value;
let etcValue = document.querySelector('#etc-input').value;

fetch(`http://localhost:3000/department/${selectedId}`, {
method: 'PUT',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({ etc: etcValue })
})
.then(response => response.json())
.then(data => alert(`"${etcValue}" 로 수정되었습니다.`));
});

document.querySelector('#delete-btn').addEventListener('click', () => { // 학과소개 etc 삭제
let select = document.querySelector('#select-department');       // DELETE 사용시 학과의 전체내용이 삭제되어
let selectedId = select.value;                   // PATCH로 진행함
let etcValue = document.querySelector('#etc-input').value;

fetch(`http://localhost:3000/department/${selectedId}`, {
method: 'DELETE',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({ etc })
})
.then(response => response.json())
.then(data => alert('데이터가 삭제 되었습니다.'));
});



// 게시판 이벤트리스너
postsLink.addEventListener('click', () => {
  write_introduction.style.display = "none";
  departCRUDBtn.style.display = "none";
  showPosts();
});

// 게시판 목록 출력
function showPosts() {
  fetch('http://localhost:3000/posts')
    .then(response => response.json())
    .then(data => {
      let postsHTML = '<h2>게시판</h2>';
      postsHTML += `
        <table>
          <tr>
            <th>제목</th><th>내용</th><th>작성 시간</th><th>업데이트 시간</th><th>선택</th>
          </tr>`;
      data.forEach(post => {
        postsHTML += `
          <tr>
            <td><a href="#" class="post-link" data-id="${post.id}">${post.title}</a></td><td>${post.content}</td><td>${post.createdAt}</td><td>${post.updatedAt}</td><td><input type="checkbox" class="post-checkbox" data-id="${post.id}"></td>`;
      });
      postsHTML += `
        </table><br><br>`;
      postsHTML += `
        <button id="create-button">생성</button><br><br>`;
      postsHTML += `
        <div id="create-form">
          제목:<br><input type="text" id="create-title"><br><br>`;
       postsHTML += `
         내용:<br><textarea id="create-content"></textarea><br><br>`;
       postsHTML += `
         댓글:<br><input type="text" id="create-comment"><br><br>`;
       postsHTML += `
         <button id="create-submit-button">생성하기</button><br><br>`;
       postsHTML += `
         </div>`;
       postsHTML += `
         <button id="update-button">수정</button><br><br>`;
       postsHTML += `
         <div id="update-form">
           제목:<br><input type="text" id="update-title"><br><br>`;
       postsHTML += `
         내용:<br><textarea id="update-content"></textarea><br><br>`;
       postsHTML += `
         댓글:<br><input type="text" id="update-comment"><br><br>`;
       postsHTML += `
         <button id="update-submit-button">수정하기</button><br><br>`;
       postsHTML += `
         </div>`;
       postsHTML += `
         <button id="delete-button">삭제</button>`;
       content.innerHTML = postsHTML;

       const postLinks = document.querySelectorAll('.post-link');
       const createButton = document.querySelector('#create-button');
       const createForm = document.querySelector('#create-form');
       const createTitle = document.querySelector('#create-title');
       const createContent = document.querySelector('#create-content');
       const createComment = document.querySelector('#create-comment');
       const createSubmitButton = document.querySelector('#create-submit-button');
       const updateButton = document.querySelector('#update-button');
       const updateForm = document.querySelector('#update-form');
       const updateTitle = document.querySelector('#update-title');
       const updateContent = document.querySelector('#update-content');
       const updateComment = document.querySelector('#update-comment');
       const updateSubmitButton = document.querySelector('#update-submit-button');
       const deleteButton = document.querySelector('#delete-button');

       // 게시판의 글 목록만큼 showpost반복
       postLinks.forEach(postLink => {
         postLink.addEventListener('click', event => {
           event.preventDefault();
           const postId = event.target.getAttribute('data-id');
           showPost(postId);
         });
       });

       // 게시판 CRUD(생성) 이벤트리스너
       createButton.addEventListener('click', () => {
        const storedUsername = sessionStorage.getItem('username');
        if (!storedUsername) {
          alert('CRUD를 하시려면 로그인을 해주세요');
        } else { 
        createForm.style.display = 'block';
          }
        });

        // 게시판 CRUD(생성) Submit 이벤트 리스너
       createSubmitButton.addEventListener('click', () => {
        const currentDate = formatDate(new Date());
         fetch('http://localhost:3000/posts', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({
             title: createTitle.value,
             content: createContent.value,
             createdAt: currentDate,
             updatedAt: currentDate,
             comments: [
               { content: createComment.value }
             ]
           })
         }).then(() => {
           createForm.style.display = 'none';
           showPosts();
         });
       });

       // 게시판 CRUD(수정) 이벤트리스너
      updateButton.addEventListener("click", () => {
        const storedUsername = sessionStorage.getItem("username");
        if (!storedUsername) {
          alert("CRUD를 하시려면 로그인을 해주세요");
        } else {
          updateForm.style.display = 'block';
          const postCheckboxes = document.querySelectorAll(".post-checkbox:checked");
          if (postCheckboxes.length === 1) {
            const postId = postCheckboxes[0].getAttribute("data-id");
            fetch(`http://localhost:3000/posts/${postId}`)
              .then((response) => response.json())
              .then((post) => {
                updateTitle.value = post.title;
                updateContent.value = post.content;
                updateComment.value = post.comments[0]?.content || ""; // 배열의 첫 번째 댓글 내용을 가져옵니다. 댓글이 없으면 빈 문자열을 사용합니다          updateForm.style.display = "block";
              });
          } else {
            alert("하나의 게시글만 선택하여 수정해주세요");
          }
        }
      });

       // 게시판 CRUD(수정) Submit 이벤트리스너
       updateSubmitButton.addEventListener('click', () => {
        const currentDate = formatDate(new Date());
         const postCheckboxes = document.querySelectorAll('.post-checkbox:checked');
         postCheckboxes.forEach(postCheckbox => {
           const postId = postCheckbox.getAttribute('data-id');
           fetch(`http://localhost:3000/posts/${postId}`, {
             method: 'PATCH',
             headers: {
               'Content-Type': 'application/json'
             },
             body: JSON.stringify({
               title: updateTitle.value,
               content: updateContent.value,
               updatedAt: currentDate,
               comments: [
                 { content: updateComment.value }
               ]
             })
           }).then(() => {
             updateForm.style.display = 'none';
             showPosts();
           });
         });
       });

      // 게시판 CRUD(삭제) 이벤트리스너
      deleteButton.addEventListener('click', () => {
        const storedUsername = sessionStorage.getItem('username');
        if (!storedUsername) {
          alert('CRUD를 하시려면 로그인을 해주세요');
        } else {
          const postCheckboxes = document.querySelectorAll('.post-checkbox:checked');
          const confirmDelete = confirm('정말 삭제하시겠습니까?');

          if (confirmDelete) {
            Promise.all(
              Array.from(postCheckboxes).map((postCheckbox) => {
                const postId = postCheckbox.getAttribute('data-id');
                return fetch(`http://localhost:3000/posts/${postId}`, {
                  method: 'DELETE',
                });
              })
            ).then(() => showPosts());
          }
        }
      });
   });
}


// 게시판에서 글을 클릭했을때 내용이 HTML상에 표시되게 JSON파일을 HTML에 표시할수있도록 변경해서 출력해줌
function showPost(postId) {
   fetch(`http://localhost:3000/posts/${postId}`)
     .then(response => response.json())
     .then(data => {
     let postHTML = '<h2>게시글 보기</h2>';
     postHTML += `제목:<br>${data.title}<br<br>`;
     postHTML += `<hr>`;
     postHTML += `내용:<br>${data.content}<br<br>`;
     postHTML += `<hr>`;
     if (data.comments) {
     data.comments.forEach((comment, index) => {
     postHTML += `${index + 1}. ${comment.content}<hr>`;
     });
     }
     postHTML += `<input type="text" id="new-comment"><button id="comment-button">댓글 작성하기</button>`;
     postHTML += `<hr>`;
     postHTML += `<button id="back-button">뒤로가기</button>`;
     content.innerHTML=postHTML;

     const commentButton=document.querySelector("#comment-button");
     const newCommentInput=document.querySelector("#new-comment");
     commentButton.addEventListener("click",()=>{
     let newComments;
     if(Array.isArray(data.comments)){
     newComments=[...data.comments,{content:newCommentInput.value}];
     }else{
     newComments=[{content:newCommentInput.value}];
     }
     fetch(`http://localhost:3000/posts/${postId}`,{
     method:'PATCH',
     headers:{
     'Content-Type':'application/json'
     },
     body : JSON.stringify({
     comments:newComments
   })
   }).then(()=>showPost(postId));
   });

   const backButton=document.querySelector("#back-button");
   backButton.addEventListener("click",()=>showPosts());
   });
}
