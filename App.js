"use strict";

//Book Class

class Book {
  constructor(t, author, isbn) {
    this.title = t;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI Class
class UI {
  static displayBook() {
    const books = Store.getBooks();
    books.forEach(function (book) {
      UI.addBookToList(book);
    });
  }
  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const html = `
    <tr>
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger delete">X</a></td>
    </tr>`;
    list.insertAdjacentHTML("afterbegin", html);
  }
  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }
  static showAlert(mssg, className) {
    const form = document.querySelector("#book-form");
    const html = `
        <div class="alert alert-${className}">${mssg}</div>
               `;
    form.insertAdjacentHTML("beforebegin", html);

    //     const div = document.createElement("div");
    //     div.className = `alert alert-${className}`;
    //     div.appendChild(document.createTextNode(mssg));
    //     const container = document.querySelector(".container");
    //     const form = document.querySelector("#book-form");
    //     container.insertBefore(div, form);

    //vanish from ui after 1 s
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }
}
//Handles storage--->Local storage
//store class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBooks(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBooks(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

//Display books
document.addEventListener("DOMContentLoaded", UI.displayBook());
//Add a Book from form submit
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;
  //validations for the form
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill out all fields", "danger");
  } else {
    UI.showAlert("Book Added", "success");
    const book = new Book(title, author, isbn);
    UI.addBookToList(book);
    UI.clearFields();
    Store.addBooks(book);
  }
});
//Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
  UI.deleteBook(e.target);
  UI.showAlert("Book removed", "warning");

  Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);
});
