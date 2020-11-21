const root = document.getElementById('root');
const MILISEK = 300;
const REGNUM = 20;

let books = JSON.parse(localStorage.getItem('data'));

function update() {
  books = JSON.parse(localStorage.getItem('books'));
  localStorage.setItem('books', JSON.stringify(books));
  createTree(root, books);
}

const findId = (file) => file.match(/=([\d]*)/)[1];
const isValidUrl = (url) => (/(^https?:)/).test(url);
const homeHref = (hr) => hr.match(/.*html/)[0];
const isValidValue = (text) => (/\S.{1,}/).test(text);
const nBook = {
  id: '',
  bookName: '',
  author: '',
  img: '',
  plot: ''
};

function createForm(nameClass, bookName = '', author = '', img = '', plot = '') {
  let option = '';
  if (nameClass === 'edit') {
    option = 'Edit ';
  } else {
    option = 'Add new ';
  }
  return `<form onsubmit={submitForm(event)} class="${nameClass}">
            <label>${option}book name:</label>
            <input class='name' type="text" required value="${bookName}">
            <label>${option}author:</label>
            <input class='author' type="text" required value="${author}">
            <label>${option}image:</label>
            <input class='img' type="text" required value="${img}">
            <label>${option}plot:</label>
            <textarea class='plot' name="text" value="${plot}" required>${plot}
            </textarea>
            <input class="sub" type="submit" value="Save">
          </form>`;
}

function clickLink(event, id, link) {
  event.preventDefault();
  history.pushState('', '', `?id=${id}#${link}`);
  createTree(root, books);
}

function clickAdd(event) {
  event.preventDefault();
  history.pushState('', '', '#add');
  createTree(root, books);
}

function clickCansel() {
  const answer = confirm('Discard changes?');
  if (answer === true) {
    history.back();
  }
}

function createTreeBooks(elements) {
  let listOfLinks = '';
  let dynamiSide = '';
  let edit = '';
  let add = '';
  const btnAdd = '<a class="btn" onclick={clickAdd(event)} href="#">Add book</a>';
  elements.forEach((element) => {
    listOfLinks += `<a class='link' onclick={clickLink(event,${element.id},'preview')} href="#">${element.bookName}</a>
    <a class='edit' onclick={clickLink(event,${element.id},'edit')} href="#">Edit</a>`;
  });
  const btnCansel = '<button class="cancel" onclick={clickCansel()}>Cancel</button>';
  if (location.hash === '#preview') {
    const index = findId(location.href);
    dynamiSide = `<section class='preview'>
    <h2><span>Book Name:</span>${elements[index].bookName}</h2>
    <h3><span>Author:</span>${elements[index].author}</h3> 
    <img src="${elements[index].img}" alt="book">
    <p>${elements[index].plot}</p>
    </section>`;
  } else if (location.hash === '#edit') {
    const index = findId(location.href);
    edit = `<section>
              ${createForm('edit',
      elements[index].bookName,
      elements[index].author,
      elements[index].img,
      elements[index].plot) + btnCansel}
            </section>`;
  } else if (location.hash === '#add') {
    add = `<section>
              ${createForm('add', '') + btnCansel}
            </section>`;
  }
  let h1 = '<h1>List of books</h1>';
  return '<nav>' + h1 + listOfLinks + btnAdd + '</nav>' + dynamiSide + edit + add;
}

function createTree(container, arr) {
  container.innerHTML = createTreeBooks(arr);
}

function submitForm(event) {
  event.preventDefault();
  const input = event.target.parentNode;
  if (event.target.className === 'add') {
    nBook.id = books.length + '';
  } else {
    nBook.id = findId(location.href);
  }
  nBook.bookName = input.querySelector('.name').value;
  nBook.author = input.querySelector('.author').value;
  nBook.img = input.querySelector('.img').value;
  nBook.plot = input.querySelector('.plot').value;
  const imgValid = isValidUrl(nBook.img);
  const plotValid = isValidValue(nBook.plot);
  const authorValid = isValidValue(nBook.author);
  const bookValid = isValidValue(nBook.bookName);
  const addClassCss = (elem, className) => {
    if (!elem) {
      input.querySelector(className).classList.add('valid');
    } else {
      input.querySelector(className).classList.remove('valid');
    }
  }
  addClassCss(bookValid, '.name');
  addClassCss(authorValid, '.author');
  addClassCss(plotValid, '.plot');
  addClassCss(imgValid, '.img');
  if (bookValid && authorValid && imgValid && plotValid) {
    setTimeout(() => alert('Book successfully updated'), MILISEK);
    if (event.target.className === 'edit') {
      books.splice(nBook.id, 1, nBook);
    } else {
      books.push(nBook);
    }
    localStorage.setItem('books', JSON.stringify(books));
    history.pushState('', '', `?id=${nBook.id}#preview`);
    update();
  }
}

if (location.hash) {
  if (findId(location.href) > books.length) {
    location.href = homeHref(location.href);
  }
}

if (localStorage.length === 1) {
  localStorage.setItem('books', JSON.stringify(books));
  createTree(root, books);
}

window.addEventListener('hashchange', update());
window.addEventListener('popstate', update);