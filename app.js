let myLibrary = [
  //   {
  //     title: "Atomic Habits",
  //     author: "James Clear",
  //     pages: 234,
  //     read: false,
  //   },
  //   {
  //     title: "The subtle art of not giving a f*ck",
  //     author: "Mark Manson",
  //     pages: 200,
  //     read: true,
  //   },
];

window.addEventListener("DOMContentLoaded", restoreLocal);

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;

  this.info = function () {
    return `${title} by ${author}, ${pages} pages, ${read}`;
  };
}

function isInLibrary(bookTitle) {
  return myLibrary.some((item) => item.title === bookTitle);
}

function getBook(title) {
  return myLibrary.find((item) => item.title === title);
}

const modalBtn = document.querySelector(".modal-btn");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".modal-overlay");
const addBookForm = document.querySelector("#addBookForm");
const bookGrid = document.querySelector(".book-grid");

modalBtn.addEventListener("click", function () {
  addBookForm.reset();
  modal.classList.add("active");
  overlay.classList.add("active");
});

function closeModal() {
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

const handleKeyboardInput = (e) => {
  if (e.key === "Escape") closeModal();
};

overlay.onclick = closeModal;
window.onkeydown = handleKeyboardInput;

const updateBookGrid = () => {
  resetBookGrid();
  myLibrary.map((book) => {
    createBookCard(book);
  });
};

const resetBookGrid = () => {
  bookGrid.innerHTML = "";
};

const createBookCard = (book) => {
  const bookCard = document.createElement("div");
  const title = document.createElement("p");
  const author = document.createElement("p");
  const pages = document.createElement("p");
  const buttonGroup = document.createElement("div");
  const readBtn = document.createElement("button");
  const removeBtn = document.createElement("button");

  bookCard.classList.add("card");
  buttonGroup.classList.add("btn-grp");
  readBtn.classList.add("btn");
  removeBtn.classList.add("btn");
  readBtn.onclick = toggleRead;
  removeBtn.onclick = removeBook;

  title.textContent = `"${book.title}"`;
  author.textContent = book.author;
  pages.textContent = `${book.pages} pages`;
  removeBtn.textContent = "Remove";

  if (book.read) {
    readBtn.textContent = "Read";
    readBtn.classList.add("read");
  } else {
    readBtn.textContent = "Not read";
    readBtn.classList.add("not-read");
  }

  bookCard.appendChild(title);
  bookCard.appendChild(author);
  bookCard.appendChild(pages);
  buttonGroup.appendChild(readBtn);
  buttonGroup.appendChild(removeBtn);
  bookCard.appendChild(buttonGroup);
  bookGrid.appendChild(bookCard);
};

const getBookFromInput = () => {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const isRead = document.getElementById("isRead").checked;
  return new Book(title, author, pages, isRead);
};

const addBook = (e) => {
  e.preventDefault();
  const newBook = getBookFromInput();
  if (isInLibrary(newBook.title)) {
    alert("This book already exists in your library");
    //put an error message here in the future, gulz ;)
    return;
  } else {
    myLibrary.push(newBook);
    saveLocal();
    updateBookGrid();
  }

  closeModal();
};

const removeBook = (e) => {
  const title = e.target.parentNode.parentNode.firstChild.innerHTML.replaceAll(
    '"',
    ""
  );

  myLibrary = myLibrary.filter((book) => book.title !== title);
  saveLocal();
  updateBookGrid();
};

const toggleRead = (e) => {
  const title = e.target.parentNode.parentNode.firstChild.innerHTML.replaceAll(
    '"',
    ""
  );
  const book = getBook(title);

  book.read = !book.read;
  saveLocal();
  updateBookGrid();
};

addBookForm.onsubmit = addBook;

window.addEventListener("DOMContentLoaded", updateBookGrid);

// ---LOCAL STORAGE---

function saveLocal() {
  localStorage.setItem("library", JSON.stringify(myLibrary));
}

function restoreLocal() {
  const books = JSON.parse(localStorage.getItem("library"));
  if (books) {
    myLibrary = books.map((book) => {
      return new Book(book.title, book.author, book.pages, book.read);
    });
  } else {
    myLibrary = [];
  }
}
