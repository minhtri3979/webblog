const token = localStorage.getItem("token");
if (!token) {
  alert("Vui lòng đăng nhập trước");
  window.location.href = "/login.html";
}

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const userData = parseJwt(token);
const currentUserId = userData?.id;

if (userData) {
  document.getElementById("username").innerText = userData.email || userData.username || "User";
  if (userData.role === "admin") {
    document.getElementById("adminBtn").classList.remove("d-none");
  }
}

async function loadPosts() {
    try {
      const res = await fetch("http://localhost:3000/api/posts", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      const posts = await res.json();
      const list = document.getElementById("postList");
      list.innerHTML = "";
  
      posts.reverse().forEach(post => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";
  
        const div = document.createElement("div");
        div.className = "card h-100 shadow-sm";
  
        // Nếu có ảnh, hiển thị ảnh
        if (post.image) {
          const img = document.createElement("img");
          img.src = `http://localhost:3000/uploads/${post.image}`;
          img.className = "card-img-top";
          img.alt = "Hình ảnh bài viết";
          div.appendChild(img);
        }
  
        const body = document.createElement("div");
        body.className = "card-body d-flex flex-column";
        body.innerHTML = `
          <h5 class="card-title">
            <a href="post.html?id=${post._id}">${post.title}</a>
          </h5>
          <h6 class="card-subtitle mb-2 text-muted">
            Tác giả: <a href="profile.html?userId=${post.author?._id}">${post.author?.username || "Không rõ"}</a>
          </h6>
          <p class="card-text">${post.content}</p>
        `;
  
        div.appendChild(body);
  
        if (post.author?._id === currentUserId) {
          const actions = document.createElement("div");
          actions.className = "d-flex justify-content-end p-3 pt-0";
  
          const editBtn = document.createElement("button");
          editBtn.className = "btn btn-sm btn-outline-primary me-2";
          editBtn.innerText = "✏️ Sửa";
          editBtn.onclick = () => window.location.href = `edit.html?id=${post._id}`;
  
          const deleteBtn = document.createElement("button");
          deleteBtn.className = "btn btn-sm btn-outline-danger";
          deleteBtn.innerText = "🗑️ Xóa";
          deleteBtn.onclick = () => deletePost(post._id);
  
          actions.appendChild(editBtn);
          actions.appendChild(deleteBtn);
          div.appendChild(actions);
        }
  
        col.appendChild(div);
        list.appendChild(col);
      });
    } catch (err) {
      document.getElementById("postList").innerText = "Không thể tải bài viết.";
      console.error(err);
    }
  }
  

async function deletePost(id) {
  if (confirm("Bạn có chắc muốn xóa bài viết này?")) {
    try {
      const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        alert("✅ Đã xóa bài viết!");
        loadPosts();
      } else {
        const data = await res.json();
        alert(data.message || "❌ Xóa thất bại");
      }
    } catch (err) {
      alert("❌ Có lỗi xảy ra khi xóa bài viết");
      console.error(err);
    }
  }
}

function createPost() {
  window.location.href = "/createPost.html";
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("isAdmin");
  window.location.href = "/login.html";
}

function viewMyPosts() {
  const userId = localStorage.getItem("userId");
  window.location.href = `/profile.html?user=${userId}`;
}

function toggleNotificationMenu() {
  const menu = document.getElementById("notificationMenu");
  menu.style.display = (menu.style.display === "none" || !menu.style.display) ? "block" : "none";
  if (menu.style.display === "block") loadNotifications();
}

async function loadNotifications() {
  try {
    const res = await fetch("http://localhost:3000/api/notifications", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();
    const list = document.getElementById("notificationList");
    list.innerHTML = "";

    if (data.length === 0) {
      list.innerHTML = "<p>Không có thông báo.</p>";
    } else {
      data.forEach(notif => {
        const p = document.createElement("p");
        let content = "";
        const username = notif.fromUser?.username || "Ai đó";
        const time = new Date(notif.createdAt).toLocaleString("vi-VN");

        if (notif.type === "like") {
          content = `<b>${username}</b> đã thích bài viết của bạn.`;
        } else if (notif.type === "comment") {
          content = `<b>${username}</b> đã bình luận bài viết của bạn.`;
        } else if (notif.type === "follow") {
          content = `<b>${username}</b> đã theo dõi bạn.`;
        }

        p.innerHTML = `${content}<br><small class="text-muted">${time}</small>`;
        list.appendChild(p);
      });
    }
  } catch (err) {
    console.error("Lỗi khi tải thông báo:", err);
    document.getElementById("notificationList").innerText = "Không thể tải thông báo.";
  }
}

// Load bài viết sau khi trang sẵn sàng
loadPosts();
