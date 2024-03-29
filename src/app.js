console.log("Book Lovers Unite!");
let modalPlacement = document.getElementById("modalHere");
let inputForm = document.getElementById("inputForm");
let titleInput = document.getElementById("title");
let authorInput = document.getElementById("author");
let pageCount = document.getElementById("pageCount");
let checkBox = document.getElementById("checkBox");
let startDate = document.getElementById("startDate");
let endDate = document.getElementById("endDate");
let addBook = document.getElementById("addBook");
let bookTableSection = document.getElementById("bookTableSection");
let bookTable = document.getElementById("bookTable");
let btCaption = document.getElementById("btCaption");
let tableRows = document.getElementsByTagName("tr");
let library = [];
let bookSVG = addBook.addEventListener("click", bindAndStore);
document.addEventListener("readystatechange", getLibrary);
class Book {
  constructor(title, author, pages, read, start, end) {
    this.title = title.value;
    this.author = author.value;
    this.pages = pages.value;
    this.read = read.checked;
    this.start = start.value;
    this.end = end.value;
    this.imgURL = "../assets/book.svg";
    this.imgH = "200";
    this.imgW = "150";
  }
}
function createBook(title, author, pages, read, start, end) {
  return new Book(title, author, pages, read, start, end);
}
function renderPersonalLibrary(book) {
  let tempR = document.createElement("tr");
  let tempD1 = document.createElement("td");
  let tempD2 = document.createElement("td");
  let tempD3 = document.createElement("td");
  let tempD4 = document.createElement("td");
  let tempD5 = document.createElement("td");
  let thumbnail = document.createElement("img");
  let tempStart = Date.parse(book.start);
  let tempEnd = Date.parse(book.end);
  console.log("tempEnd:", tempEnd);
  let daysToRead = calcDays(tempEnd, tempStart);
  let pagesPerDay = Math.round(book.pages / daysToRead);
  let currentDate = Date.now();
  let formattedStart = formatDate(tempStart, currentDate);
  console.log(currentDate);
  console.log(book.start, tempStart);
  thumbnail.src = `${book.imgURL}`;
  thumbnail.alt = `${book.title} cover art`;
  thumbnail.width = "45";
  thumbnail.id = `${book.title}_img_img`;
  thumbnail.className = "rounded";
  tempD5.id = `${book.title}_img_td`;
  tempD1.className = "text-center";
  tempD2.className = "text-center";
  tempD3.className = "text-center";
  tempD4.className = "text-center";
  tempD5.className = "text-center bg-transparent";
  tempR.setAttribute("imgURL", `${book.imgURL}`);
  tempR.setAttribute("imgALT", `${book.title} cover art`);
  tempR.setAttribute("imgH", `${book.imgH}`);
  tempR.setAttribute("imgW", `${book.imgW}`);
  console.log("pass the img?", tempR.getAttribute("imgURL"));
  tempR.id = `${book.title}`;
  console.log(tempR.id);

  tempR.addEventListener("click", updateModal);
tempR.addEventListener("touchstart", updateModal);
  tempD1.textContent = `${book.title}, ${book.author}`;
  tempD2.textContent = `${book.pages} Pages`;


  if (book.read) {
    tempD3.textContent = `\u2705`;
    tempD4.textContent = `It took you ${daysToRead} days to read ${book.title}. You averaged ${pagesPerDay} pages read a day.`;
  } else {
    tempD3.textContent = `\u274C`;
    tempD4.textContent = `You started reading this book on ${formattedStart}, keep at it!`;
  }
  bookTable.appendChild(tempR);
  tempR.appendChild(tempD5);
  tempR.appendChild(tempD1);
  tempR.appendChild(tempD2);
  tempR.appendChild(tempD3);
  tempR.appendChild(tempD4);
  tempD5.appendChild(thumbnail);
  startDate.value = currentDate;
  endDate.value = currentDate;
  titleInput.value = "";
  authorInput.value = "";
  pageCount.value = "";
}
//for storing the library array in local storage.
async function bindAndStore(event) {
  event.preventDefault();
  let newBook = createBook(
    titleInput,
    authorInput,
    pageCount,
    checkBox,
    startDate,
    endDate
  );
  fetchAndSetBookCover(newBook.title, newBook.imgURL);
  library.push(newBook);
  console.log(library);
  renderPersonalLibrary(newBook);
  storeLibrary();
}

function formatDate(dateString, adjustment) {
  let exactDate = calcAdjustment(dateString, adjustment);
  let date = new Date(exactDate);
  let options = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  let formatted = date.toLocaleString("en-US", options);
  return formatted;
}
function calcDays(utc1, utc2) {
  let oneDay = 86400000;
  let daysDiff = Math.floor((utc1 - utc2) / oneDay);
  return daysDiff;
}
function calcAdjustment(utc1, utc2) {
  let oneDay = 86400000;
  let diff = utc2 - utc1;
  let days = Math.floor(diff / oneDay);
  let left = diff - days * oneDay;
  return utc1 + left;
}

function storeLibrary() {
  window.localStorage.removeItem("library");
  let jsonObj = JSON.stringify(library);
  localStorage.setItem("library", jsonObj);
}

function getLibrary() {
  try {
    let jsonObj = window.localStorage.getItem("library");
    let parsed = JSON.parse(jsonObj);
    parsed.forEach((a) => {
      library.push(a);
      renderPersonalLibrary(a);
    });
  } catch (error) {
    console.log("Please add your first book!");
  }
}

function updateModal(event) {
  let updateModalBack = document.createElement("div");
  let updateModalCard = document.createElement("div");
  let modalForm = document.createElement("form");
  let modalInputLabel = document.createElement("label");
  let modalInput = document.createElement("input");
  let updateBtn = document.createElement("button");
  let close = document.createElement("button");
  let img = document.createElement("img");
  let tempID = event.target.parentElement.id;
  console.log("TEMPID HERE: ", tempID);
  img.src = event.target.parentElement.getAttribute("imgURL");
  img.alt = event.target.parentElement.getAttribute("imgALT");
  img.height = event.target.parentElement.getAttribute("imgH");
  img.width = event.target.parentElement.getAttribute("imgW");
  img.id = "modalImg";
  img.className = "";
  modalInput.type = "date";
  modalInput.name = "modalInput";
  modalInput.id = "modalInput";
  modalInputLabel.for = "modalInput";
  modalInputLabel.textContent = "Date Finished:";
  updateBtn.textContent = "Finished Reading";
  updateBtn.id = "updateBtn";
  modalForm.id = "modalForm";
  close.id = "modalClose";
  close.textContent = "X";
  close.addEventListener("click", () => {
    updateModalBack.remove();
  });
  updateBtn.addEventListener("click", () => {
    library.forEach((a) => {
      console.log(a.title);
      if (a.title == tempID) {
        a.end = modalInput.valueAsDate;
        a.read = true;
        console.log("endDateOfA:", a.endDate);
      }
    });
    bookTable.remove();
    storeLibrary();
    getLibrary();
    updateModal.remove();
  });
  updateModalBack.id = "updateModalBack";
  updateModalCard.id = "updateModalCard";
  modalPlacement.appendChild(updateModalBack);
  updateModalBack.appendChild(updateModalCard);
  updateModalCard.appendChild(modalForm);
  modalForm.appendChild(modalInputLabel);
  modalForm.appendChild(modalInput);
  modalForm.appendChild(updateBtn);
  updateModalCard.appendChild(close);
  updateModalCard.appendChild(img);
}
async function fetchImage(url) {
  const img = new Image();
  return new Promise((res, rej) => {
    img.onload = () => res(img);
    img.onerror = (e) => rej(e);
    img.src = url;
  });
}
async function fetchAndSetBookCover(title) {
  let control = false;
  try {
    let response = await fetch(
      `https://openlibrary.org/search.json?q=title:${title}&limit=1`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${img.status}`);
    }
    let data = await response.json();
    console.log(data);
    console.log(" WILL BE THIS:", data.docs[0].cover_i);
    let tempID = await data.docs[0].cover_i;
    if (!tempID) {
      throw new Error(
        `${title} cover art id not found, no cover art available`
      );
    }
    console.log("FETCH ONE RAN");
    img = await fetchImage(
      `https://covers.openlibrary.org/b/id/${tempID}-M.jpg`
    );
    library.forEach((a) => {
      if (title == a.title) {
        a.imgURL = img.src;
        a.imgH = img.height;
        a.imgW = img.width;
      }
    });
    control = true;
    console.log("FETCH TWO RAN");
  } catch (error) {
    console.error(error);
    storeLibrary();
    console.log("STORED ERROR BOOK");
  }
  if (control) {
    console.log("CONTROL RAN");
    updateThumbnailAndParent(title, img);
    storeLibrary();
  }
}
function updateThumbnailAndParent(title, img) {
  let tempTD5 = document.getElementById(`${title}_img_td`);
  let tempChild = document.getElementById(`${title}_img_img`);
  let tempImg = document.createElement("img");
  tempTD5.removeChild(tempChild);
  tempImg.src = img.src;
  tempImg.alt = `${title} cover art`;
  tempImg.width = "45";
  tempImg.className = "rounded hidden";
  tempTD5.className = "hidden";

  tempTD5.parentElement.setAttribute("imgURL", `${img.src}`);
  tempTD5.parentElement.setAttribute("imgALT", `${title} cover art`);
  tempTD5.parentElement.setAttribute("imgH", `${img.height}`);
  tempTD5.parentElement.setAttribute("imgW", `${img.width}`);
  tempTD5.parentElement.id = `${title}`;
  tempTD5.appendChild(tempImg);
}
