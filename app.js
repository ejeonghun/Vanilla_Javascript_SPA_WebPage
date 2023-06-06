const introductionLink = document.querySelector('#introduction-link');
const departmentLink = document.querySelector('#department-link');
const postsLink = document.querySelector('#posts-link');
const content = document.querySelector('#content');

const loginForm = document.querySelector('#login-form');
const logoutForm = document.querySelector('#logout-form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const loginButton = document.querySelector('#login-button');
const logoutButton = document.querySelector('#logout-button');
const logininfo = document.querySelector('#logininfo');
logoutButton.style.display = 'none';


// 세션유지
function checkLoginStatus() {
  const loggedInUsername = sessionStorage.getItem('username');
  const loginForm = document.getElementById("login-form");
  const logoutForm = document.getElementById("logout-form");
  const logininfo = document.getElementById("login-info");

  if (loggedInUsername) {
    loginForm.style.display = 'none';
    logoutForm.style.display = 'block';
    logoutButton.style.display = 'block';
    logininfo.innerHTML = `아이디 : ${loggedInUsername}`;
    logininfo.style.display = 'block';
  } else {
    loginForm.style.display = 'block';
    logoutForm.style.display = 'none';
    logininfo.style.display = 'none';
  }
}
window.addEventListener('DOMContentLoaded', checkLoginStatus);

// 로그인 기능
loginButton.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    fetch(`http://localhost:3000/users?username=${username}&password=${password}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          sessionStorage.setItem('username', username);
          loginForm.style.display = 'none';
          logoutForm.style.display = 'block';
          logoutButton.style.display = 'block';
          alert(`로그인 성공 회원님의 ID는 ${username} 입니다.`);
          logininfo.innerHTML = `아이디 : ${username}`
          logininfo.style.display = 'block'
        } else {
          alert('로그인 실패');
        }
      });
  });
  
  //로그아웃 기능
  logoutButton.addEventListener('click', () => {
    sessionStorage.removeItem('username');
    loginForm.style.display = 'block';
    logoutForm.style.display = 'none';
    alert('로그아웃 되었습니다.');
    location.reload();
  });        

// 회원가입 기능
const signupForm = document.getElementById('signup-form');
const signupuser = document.getElementById('signup-user');
const signupbtn = document.getElementById('signup');

signupbtn.addEventListener('click', () => {
  signupForm.style.display = 'block';
  signupbtn.style.display = 'none';
});

signupForm.addEventListener('submit', (event) => {
  event.preventDefault(); // 기본 동작 중단
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;

  fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username, password})
  })
  .then(response => {
    if (response.ok) {
      alert('회원가입이 완료되었습니다.');
      signupForm.reset();
      signupForm.style.display = 'none';
    } else {
      alert('오류가 발생했습니다. 다시 시도하세요.');
    }
  });
});


// 자기소개 서비스
introductionLink.addEventListener('click', () => {
  fetch('http://localhost:3000/introduction')
    .then(response => response.json())
    .then(data => {
      content.innerHTML = `
        <h1>자기소개</h1>
        <div id="introduce_content" style="float:left;">
        <img src="${data.image}" style="max-height:50%; weight:auto; float:left;">
        <p></p>
        <p>이름: ${data.name}</p>
        <p>나이: ${data.age}</p>
        <p>학력: ${data.education}</p>
        <p>학번: ${data.hakbeon}</p>
        <p>취미: ${data.hobby}</p>
        <p>현재 서비스중: ${data.service_1}</p>
        <p>현재 서비스중: ${data.service_2}</p>
        <div class="dev_link_div">${data.link}</div>
        </div>
      `;
    });
});

// 학과소개 서비스
departmentLink.addEventListener('click', () => {
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
            <p>---------------------------------------------------------------------------------------------------------------------------</p>
          `;
        });
        content.innerHTML = departmentHTML;
      });
  });

// 게시판 이벤트리스너
postsLink.addEventListener('click', () => {
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
         fetch('http://localhost:3000/posts', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({
             title: createTitle.value,
             content: createContent.value,
             createdAt: new Date().toISOString(),
             updatedAt: new Date().toISOString(),
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
       updateButton.addEventListener('click', () => {
        const storedUsername = sessionStorage.getItem('username');
        if (!storedUsername) {
          alert('CRUD를 하시려면 로그인을 해주세요');
        } else {
         updateForm.style.display = 'block'; 
        }
       });

       // 게시판 CRUD(수정) Submit 이벤트리스너
       updateSubmitButton.addEventListener('click', () => {
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
               updatedAt: new Date().toISOString(),
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
         Promise.all(Array.from(postCheckboxes).map(postCheckbox => {
           const postId = postCheckbox.getAttribute('data-id');
           return fetch(`http://localhost:3000/posts/${postId}`, {
             method: 'DELETE'
           });
         })).then(() => showPosts()); }
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
