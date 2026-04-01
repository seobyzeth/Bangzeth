document.querySelectorAll(".faq-question").forEach(function (button) {
  button.addEventListener("click", function () {
    button.parentElement.classList.toggle("is-open");
  });
});

var commentStorageKey = "bang-zeth-local-comments";
var commentForm = document.getElementById("comment-form");
var commentList = document.getElementById("comment-list");
var commentTotal = document.getElementById("comment-total");
var commentClear = document.getElementById("comment-clear");

function getStoredComments() {
  try {
    var saved = localStorage.getItem(commentStorageKey);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

function saveComments(comments) {
  localStorage.setItem(commentStorageKey, JSON.stringify(comments));
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderComments() {
  if (!commentList || !commentTotal) {
    return;
  }

  var comments = getStoredComments();
  commentTotal.textContent = String(comments.length);

  if (!comments.length) {
    commentList.innerHTML = '<div class="comment-empty">Belum ada komentar lokal. Jadilah yang pertama menulis komentar.</div>';
    return;
  }

  commentList.innerHTML = comments
    .slice()
    .reverse()
    .map(function (item) {
      return (
        '<article class="comment-entry">' +
        '<div class="comment-entry-head">' +
        '<div>' +
        '<h3 class="comment-entry-title">' + escapeHtml(item.title) + "</h3>" +
        '<div class="comment-entry-meta">' + escapeHtml(item.name) + " - " + escapeHtml(item.date) + "</div>" +
        "</div>" +
        "</div>" +
        '<div class="comment-entry-body">' + escapeHtml(item.message) + "</div>" +
        "</article>"
      );
    })
    .join("");
}

if (commentForm) {
  commentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = document.getElementById("comment-name").value.trim();
    var title = document.getElementById("comment-title").value.trim();
    var message = document.getElementById("comment-message").value.trim();

    if (!name || !title || !message) {
      return;
    }

    var comments = getStoredComments();
    comments.push({
      name: name,
      title: title,
      message: message,
      date: new Date().toLocaleString("id-ID")
    });

    saveComments(comments);
    commentForm.reset();
    renderComments();
  });
}

if (commentClear) {
  commentClear.addEventListener("click", function () {
    localStorage.removeItem(commentStorageKey);
    renderComments();
  });
}

renderComments();
