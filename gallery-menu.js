document.addEventListener("DOMContentLoaded", function () {
  const menu = ['Sapato', 'Closet', 'Camisa', 'Vestidos', 'Calça'];
  const container = document.getElementById("post-grid");
  const menuContainer = document.getElementById("post-menu");

  function createMenu() {
    menu.forEach(tag => {
      const btn = document.createElement("button");
      btn.innerText = tag;
      btn.className = "menu-btn";
      btn.onclick = () => loadPosts(tag.toLowerCase());
      menuContainer.appendChild(btn);
    });
  }

  function loadPosts(tag) {
    container.innerHTML = "Carregando...";
    fetch(`/feeds/posts/default/-/${tag}?alt=json&max-results=8`)
      .then(res => res.json())
      .then(data => {
        const posts = data.feed.entry || [];
        container.innerHTML = "";

        posts.forEach(entry => {
          const title = entry.title.$t;
          const link = entry.link.find(l => l.rel === "alternate").href;
          const content = entry.content?.$t || entry.summary?.$t || "";
          const snippet = content.replace(/<[^>]+>/g, "").substring(0, 100) + "...";
          const media = entry.media$thumbnail ? entry.media$thumbnail.url : "https://via.placeholder.com/300";

          const postDiv = document.createElement("div");
          postDiv.className = "post-card";
          postDiv.innerHTML = `
            <a href="${link}">
              <img src="${media}" alt="${title}">
              <h3>${title}</h3>
              <p>${snippet}</p>
            </a>
          `;
          container.appendChild(postDiv);
        });
      })
      .catch(err => {
        container.innerHTML = "Erro ao carregar os posts.";
        console.error(err);
      });
  }

  createMenu();
  loadPosts("sapato");
});
