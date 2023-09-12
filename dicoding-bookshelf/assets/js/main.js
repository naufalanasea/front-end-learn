const STORAGE_KEY = "BOOKSHELF_APP";

let books = [];

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your Browser is Not Supported");
    return false;
  }
  return true;
}

function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
  document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  const data = JSON.parse(serializedData);

  if (data !== null) books = data;

  document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
  if (isStorageExist()) saveData();
}

function composeBookObject(title, author, year, isComplete) {
  return {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(bukuId) {
  for (book of books) {
    if (book.id === bukuId) return book;
  }
  return null;
}

function findBookIndex(bukuId) {
  let index = 0;
  for (book of books) {
    if (book.id === bukuId) return index;

    index++;
  }

  return -1;
}

function refreshDataFromBookshelf() {
  const listUncompleted = document.getElementById(LIST_BOOK_UNCOMPLETED);
  const listCompleted = document.getElementById(LIST_BOOK_COMPLETED);

  for (book of books) {
    const newBook = makeLogBook(
      book.title,
      book.author,
      book.year,
      book.isComplete
    );
    newBook[ID_BUKU] = book.id;

    if (book.isComplete) {
      listCompleted.append(newBook);
    } else {
      listUncompleted.append(newBook);
    }
  }
}
const LIST_BOOK_UNCOMPLETED = "incompleteBookshelfList";
const LIST_BOOK_COMPLETED = "completeBookshelfList";
const ID_BUKU = "bukuId";
const seearchTitle = document.querySelector("#seearchTitle");
seearchTitle.addEventListener("keyup", searchListBookTitle);

function makeLogBook(
  inputTitle,
  inputAuthor,
  inputYear,
  isComplete
) {
  const textTitle = document.createElement("h3");
  textTitle.innerHTML = inputTitle;

  const textAuthor = document.createElement("p");
  textAuthor.innerHTML = "Penulis : " + inputAuthor;

  const textYear = document.createElement("p");
  textYear.innerHTML = "Tahun : " + inputYear;

  const textContainer = document.createElement("article");
  textContainer.classList.add("book_item");
  textContainer.append(textTitle, textAuthor, textYear);

  if (isComplete) {
    textContainer.append(createUndoButton(), createTrashButton());
  } else {
    textContainer.append(createCheckButton(), createTrashButton());
  }
  return textContainer;
}

function addLogBook() {
  const completeBookList = document.getElementById(LIST_BOOK_COMPLETED);
  const uncompleteBookList = document.getElementById(LIST_BOOK_UNCOMPLETED);

  const titleBook = document.getElementById("inputTitle").value;
  const authorBook = document.getElementById("inputAuthor").value;
  const yearBook = document.getElementById("inputYear").value;
  const checkBox = document.getElementById("inputComplete");

  if (checkBox.checked == true) {
    const book = makeLogBook(titleBook, authorBook, yearBook, true);

    const objek_buku = composeBookObject(titleBook, authorBook, yearBook, true);

    book[ID_BUKU] = objek_buku.id;
    books.push(objek_buku);

    completeBookList.append(book);
    updateDataToStorage();
  } else {
    const book = makeLogBook(titleBook, authorBook, yearBook, false);

    const objek_buku = composeBookObject(
      titleBook,
      authorBook,
      yearBook,
      false
    );

    book[ID_BUKU] = objek_buku.id;
    books.push(objek_buku);

    uncompleteBookList.append(book);
    updateDataToStorage();
  }
}

function createButton(buttonTypeClass, text, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.innerText = text;
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
}

function addBookToCompleted(bookElement) {
  const listCompleted = document.getElementById(LIST_BOOK_COMPLETED);

  const elTitleBook = bookElement.querySelector(".book_item > h3").innerText;
  const elAuthorBook = bookElement.querySelector(".book_item > p").innerText;
  const elYearBook = bookElement.querySelector(".book_item > p").innerText;

  const buku_baru = makeLogBook(elTitleBook, elAuthorBook, elYearBook, true);

  const buku = findBook(bookElement[ID_BUKU]);
  buku.isComplete = true;

  buku_baru[ID_BUKU] = buku.id;
  listCompleted.append(buku_baru);

  bookElement.remove();
  updateDataToStorage();
  window.location.reload();
}

function undoBookToStillRead(bookElement) {
  const listUncompleted = document.getElementById(LIST_BOOK_UNCOMPLETED);

  const elTitleBook = bookElement.querySelector(".book_item > h3").innerText;
  const elAuthorBook = bookElement.querySelector(".book_item > p").innerText;
  const elYearBook = bookElement.querySelector(".book_item > p").innerText;

  const buku_baru = makeLogBook(elTitleBook, elAuthorBook, elYearBook, false);

  const buku = findBook(bookElement[ID_BUKU]);
  buku.isComplete = false;

  buku_baru[ID_BUKU] = buku.id;
  listUncompleted.append(buku_baru);

  bookElement.remove();
  updateDataToStorage();
  window.location.reload();
}

function removeBookFromCompleted(bookElement) {
  {
    const book_position = findBookIndex(bookElement[ID_BUKU]);
    books.splice(book_position, 1);
    bookElement.remove();
    updateDataToStorage();
    alert("Deleted");
  } 
}

function createButtonContainer() {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");
  return buttonContainer;
}

function createCheckButton() {
  return createButton("green", "Finished", function (event) {
    addBookToCompleted(event.target.parentElement);
  });
}

function createTrashButton() {
  return createButton("red", "Delete", function (event) {
    removeBookFromCompleted(event.target.parentElement);
  });
}

function createUndoButton() {
  return createButton("green", "Unfinished", function (event) {
    undoBookToStillRead(event.target.parentElement);
  });
}

function searchListBookTitle(event) {
  const searchBookList = event.target.value.toLowerCase();
  const itemBookList = document.querySelectorAll(".book_item");

  itemBookList.forEach((item) => {
    const isiItem = item.firstChild.innerText.toLowerCase();

    if (isiItem.indexOf(searchBookList) != -1) {
      item.setAttribute("style", "display: block;");
    } else {
      item.setAttribute("style", "display: none !important;");
    }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addLogBook();
    window.location.reload();
    alert("Book Added");
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener("ondatasaved", () => {
  console.log("Saved");
});
document.addEventListener("ondataloaded", () => {
  refreshDataFromBookshelf();
});
