const viewPasswords = document.getElementById("view-passwords");

// Open the IndexedDB database
let db;
const request = indexedDB.open("passwords", 1);

request.onerror = (event) => {
  console.error("Error opening database", event);
};

request.onupgradeneeded = (event) => {
  db = event.target.result;
  db.createObjectStore("passwords", { keyPath: "title" });
};

request.onsuccess = (event) => {
  db = event.target.result;

  // Display stored passwords
  const transaction = db.transaction("passwords", "readonly");
  const store = transaction.objectStore("passwords");
  const request = store.getAll();

  request.onerror = (event) => {
    console.error("Error retrieving passwords", event);
  };

  request.onsuccess = (event) => {
    const passwords = event.target.result;
    const html = passwords
      .map((password) => {
        return `<div><h2>${password.title}</h2><p>${password.password}</p></div>`;
      })
      .join("");
    viewPasswords.innerHTML = html;
  };
};
