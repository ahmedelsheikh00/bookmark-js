var modal = document.getElementById("modal");
var modalShow = document.getElementById("show-modal");
var modalClose = document.getElementById("close-model");
var bookmarkForm = document.getElementById("bookmark-form");
var websiteNameEl = document.getElementById("website-name");
var websiteUrlEl = document.getElementById("website-url");
var bookmarksContainer = document.getElementById("bookmarks-container");

var bookmarks = [];

// Show Modal , focus in Input
var showModal = () => {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
};
// Close Modal
var closeModal = () => modal.classList.remove("show-modal");

// Modal Events Listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", closeModal);
// close when click outside the modal
window.addEventListener("click", (e) => (e.target === modal ? closeModal() : false));

// Validate Form
var Validate = (nameValue, urlValue) => {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("please submit values for both fields.");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("please provide a valid web address");
    return false;
  }
  // Valid
  return true;
};

// Build Bookmarks DOM
var buildBookmarks = () => {
  // Remove all bookmark elements
  bookmarksContainer.textContent = "";
  // Build Items
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    // Item
    var item = document.createElement("div");
    item.classList.add("item");
    // close Icon
    var closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);
    // Favicon / Link Container
    var linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    // Favicon
    var favicon = document.createElement("img");
   favicon.setAttribute("src", `https://www.google.com/s2/favicons?domain=${url}`);
    favicon.setAttribute("alt", "favicon");
    // link
    var link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;

    // Apend bookmark container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
};

//  Fetch Bookmarks
let fetchBookmarks = () => {
  // Get Bookmarks from localStorage if available
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    // Create bookmarks array in localStorage
    bookmarks = [
      {
        name: "My GitHub account",
        url: "https://github.com/ahmedelsheikh00/capatche-js",
      },
      {
        name: " Youtube Channel",
        url: "https://www.youtube.com/?gl=EG&hl=ar",
      },
    ];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
};

// Delete Bookmark
var deleteBookmark = (url) => {
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }
  });
  //   Update bookmarks array in localStorage, re-populate DOM
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
};
// Handle Data from form
var storeBookmark = (e) => {
  e.preventDefault();
  var nameValue = websiteNameEl.value;
  var urlValue = websiteUrlEl.value;
  if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
    urlValue = `https://${urlValue}`;
  }

  if (!Validate(nameValue, urlValue)) {
    return false;
  }
  var bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
};

// Event Listener
bookmarkForm.addEventListener("submit", storeBookmark);

// on Load , Fetch Bookmarks
fetchBookmarks();
